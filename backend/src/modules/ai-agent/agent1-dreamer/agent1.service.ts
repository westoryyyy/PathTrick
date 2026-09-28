import { AgentName } from "@prisma/client";
import { groq, AGENT_MODEL, AGENT_TEMPERATURE, AGENT_MAX_TOKENS } from "../../../lib/groq";
import { runAgentWithGuardrail } from "../../../lib/guardrail";
import { buildAgent1SystemPrompt } from "./agent1.prompt";
import {
  agent1InputSchema,
  agent1OutputSchema,
  buildAgent1Fallback,
  checkAgent1ReferencedIds,
  Agent1Input,
} from "./agent1.schema";

// Fungsi ini TIDAK boleh menangkap error-nya sendiri (tidak ada try/catch di
// sini) -- biarkan error (timeout dari guardrail, rate limit dari Groq, dll)
// naik ke runAgentWithGuardrail, yang memang bertanggung jawab menangkapnya
// dan jatuh ke fallback. Kalau di-catch di sini, guardrail tidak akan pernah
// tahu ada kegagalan.
async function callAgent1LLM(input: Agent1Input): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: AGENT_MODEL,
    temperature: AGENT_TEMPERATURE,
    max_completion_tokens: AGENT_MAX_TOKENS,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: buildAgent1SystemPrompt() },
      { role: "user", content: JSON.stringify(input) },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    // Bisa kejadian kalau model di-refuse/filter internal Groq. Lempar error
    // biasa -- guardrail yang akan mencatat & jatuh ke fallback, bukan di sini.
    throw new Error("Groq mengembalikan response tanpa content (choices[0].message.content kosong)");
  }
  return content;
}

/**
 * Entry point publik buat endpoint /api/assessment (AI-01) memanggil Agent 1.
 * rawInput di sini TIDAK dipercaya mentah dari mana pun (baik dari body
 * request maupun hasil query kandidat) -- divalidasi ulang lewat
 * agent1InputSchema sebelum dikirim ke LLM. Kalau backend salah menyusun
 * kandidat (bug di query DB), lebih baik gagal cepat & jelas di sini
 * daripada terkirim ke LLM dan gagal di titik yang lebih membingungkan.
 */
export async function runAgent1(userId: string, rawInput: unknown) {
  const input = agent1InputSchema.parse(rawInput);

  return runAgentWithGuardrail({
    agent: AgentName.AGENT_1_DREAMER,
    userId,
    input,
    outputSchema: agent1OutputSchema,
    callLLM: callAgent1LLM,
    checkReferencedIds: checkAgent1ReferencedIds,
    buildFallback: buildAgent1Fallback,
  });
}
