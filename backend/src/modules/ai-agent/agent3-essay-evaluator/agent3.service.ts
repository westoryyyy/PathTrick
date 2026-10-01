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
      max_tokens: 10,
    });
    
    const aiResponse = completion.choices[0]?.message?.content?.trim().toUpperCase() || "";
    return aiResponse.includes("LULUS");
  } catch (error) {
    console.error("AI Evaluator error:", error);
    throw new Error("AiEvaluatorError");
  }
}
