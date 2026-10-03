import { getGroqClient, AGENT_MODEL } from "../../../lib/groq";

export async function evaluateEssay(promptQuestion: string, expectedAnswer: string, userAnswer: string): Promise<boolean> {
  try {
    const groq = getGroqClient();
    const prompt = `Sebagai dosen, nilai jawaban mahasiswa berikut (LULUS/GAGAL).
Pertanyaan: ${promptQuestion}
Kunci Jawaban: ${expectedAnswer}
Jawaban Mahasiswa: ${userAnswer}

Apakah jawaban mahasiswa menangkap inti dari kunci jawaban secara medis? (Abaikan typo).
Jawab HANYA dengan 1 kata: "LULUS" jika benar/cukup tepat, atau "GAGAL" jika sangat melenceng.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: AGENT_MODEL,
      temperature: 0.1,
      max_tokens: 32,
    });

    const raw = completion.choices[0]?.message?.content?.trim() || "";
    const aiResponse = raw.toUpperCase();

    // Tolerant parsing: accept various affirmative tokens or presence of LULUS
    const passed = aiResponse.includes("LULUS") || aiResponse.startsWith("YA") || aiResponse.startsWith("BENAR") || aiResponse.startsWith("YES") || aiResponse.startsWith("TRUE") || aiResponse.startsWith("OK");

    console.debug('[agent3] evaluateEssay', {
      promptQuestion: promptQuestion?.slice?.(0,120),
      expectedAnswer: expectedAnswer?.slice?.(0,120),
      userAnswer: userAnswer?.slice?.(0,120),
      rawResponse: raw,
      passed,
    });

    return passed;
  } catch (error) {
    console.error("AI Evaluator error:", error);
    return false;
  }
}
