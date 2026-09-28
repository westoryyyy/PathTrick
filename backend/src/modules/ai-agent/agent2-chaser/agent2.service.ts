import { AgentName } from "@prisma/client";
import { groq, AGENT_MODEL, AGENT_TEMPERATURE, AGENT_MAX_TOKENS } from "../../../lib/groq";
import { runAgentWithGuardrail } from "../../../lib/guardrail";
import { buildAgent2SystemPrompt } from "./agent2.prompt";
import {
  agent2InputSchema,
  agent2OutputSchema,
  buildAgent2Fallback,
  checkAgent2ReferencedIds,
  Agent2Input,
} from "./agent2.schema";

async function callAgent2LLM(input: Agent2Input): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: AGENT_MODEL,
    temperature: AGENT_TEMPERATURE,
    max_completion_tokens: AGENT_MAX_TOKENS,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: buildAgent2SystemPrompt() },
      { role: "user", content: JSON.stringify(input) },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Groq mengembalikan response tanpa content (choices[0].message.content kosong)");
  }
  return content;
}

/**
 * Entry point publik buat endpoint /api/assessment (AI-01) memanggil Agent 2.
 * Sama seperti runAgent1: rawInput divalidasi ulang lewat agent2InputSchema
 * di sini, bukan dipercaya mentah dari pemanggil.
 */
export async function runAgent2(userId: string, rawInput: unknown) {
  const input = agent2InputSchema.parse(rawInput);

  return runAgentWithGuardrail({
    agent: AgentName.AGENT_2_CHASER,
    userId,
    input,
    outputSchema: agent2OutputSchema,
    callLLM: callAgent2LLM,
    checkReferencedIds: checkAgent2ReferencedIds,
    buildFallback: buildAgent2Fallback,
  });
}
