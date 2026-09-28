import { AgentName } from "@prisma/client";
import { groq, AGENT_MODEL, AGENT_TEMPERATURE, AGENT_MAX_TOKENS } from "../../../lib/groq";
import { runAgentWithGuardrail } from "../../../lib/guardrail";
import { searchKnowledge } from "../../../lib/embedding";
import { buildAgent3SystemPrompt } from "./agent3.prompt";
import {
  agent3InputSchema,
  agent3OutputSchema,
  buildAgent3Fallback,
  checkAgent3ReferencedIds,
  Agent3Input,
  Agent3Output,
} from "./agent3.schema";

// Agent 3 generate konten yang lebih panjang dari Agent 1/2 — naikkan token limit.
const AGENT3_MAX_TOKENS = 6000;

async function callAgent3LLM(input: Agent3Input): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: AGENT_MODEL,
    temperature: AGENT_TEMPERATURE,
    max_completion_tokens: AGENT3_MAX_TOKENS,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: buildAgent3SystemPrompt() },
      { role: "user", content: JSON.stringify(input) },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("LLM mengembalikan response tanpa content untuk Agent 3");
  }
  return content;
}

/**
 * Entry point publik — dipanggil dari admin.route.ts.
 *
 * Perbedaan penting dari Agent 1/2:
 * - Agent 3 BERHENTI sebelum panggil LLM kalau knowledge kosong.
 *   Ini intentional: generate course tanpa RAG context = Agent 3 mengarang
 *   sendiri tanpa grounding = persis risiko halusinasi yang ingin dihindari.
 *   Error dilempar sebelum guardrail karena ini kegagalan PRE-CONDITION,
 *   bukan kegagalan LLM.
 *
 * @param adminId   - ID user admin yang trigger generate (untuk AIInteractionLog)
 * @param jurusan   - Nama jurusan yang diminta (mis. "Software Engineering")
 * @param facultyTag - Tag fakultas untuk filter knowledge base (mis. "teknologi")
 */
export async function runAgent3(
  adminId: string,
  jurusan: string,
  facultyTag: string
) {
  // Step 1: RAG retrieval via Cohere embedding + cosine similarity in-memory.
  // searchKnowledge sudah handle case di mana COHERE_API_KEY tidak ada
  // (throw error yang jelas) dan case di mana embedding belum di-generate.
  const knowledgeChunks = await searchKnowledge(
    `${jurusan} ${facultyTag}`,
    facultyTag,
    5
  );

  // Step 2: Hard stop kalau knowledge kosong — jangan lanjut panggil LLM.
  if (knowledgeChunks.length === 0) {
    throw new Error(
      `Tidak ada knowledge base untuk facultyTag "${facultyTag}" / jurusan "${jurusan}". ` +
        `Pastikan sudah menjalankan: npm run knowledge:seed && npm run knowledge:embed`
    );
  }

  // Step 3: Susun input untuk LLM.
  const input = agent3InputSchema.parse({
    jurusan,
    facultyTag,
    knowledgeContext: knowledgeChunks.map((k) => ({
      title: k.title,
      content: k.content,
    })),
  });

  // Step 4: Jalankan lewat guardrail (timeout, Zod validation, fallback).
  return runAgentWithGuardrail<Agent3Input, Agent3Output>({
    agent: AgentName.AGENT_3_COURSE_GENERATOR,
    userId: adminId,
    input,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    outputSchema: agent3OutputSchema as any, // Zod input/output variance — runtime tetap benar
    callLLM: callAgent3LLM,
    checkReferencedIds: checkAgent3ReferencedIds,
    buildFallback: buildAgent3Fallback,
  });
}
