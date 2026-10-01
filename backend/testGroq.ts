import { getGroqClient, AGENT_MODEL, AGENT_TEMPERATURE, AGENT_MAX_TOKENS } from './src/lib/groq';

async function testGroq() {
  console.log(`Menguji koneksi ke Groq API...`);
  console.log(`Model: ${AGENT_MODEL}`);
  console.log(`Temperature: ${AGENT_TEMPERATURE}`);
  console.log(`Max Tokens: ${AGENT_MAX_TOKENS}`);
  console.log("--------------------------------------------------");

  try {
    const groq = getGroqClient();
    const startTime = Date.now();

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Anda adalah asisten AI yang membalas dalam bahasa Indonesia dengan singkat dan padat."
        },
        {
          role: "user",
          content: "Halo, jelaskan apa itu Groq API dalam 2 kalimat saja!"
        }
      ],
      model: AGENT_MODEL,
      temperature: AGENT_TEMPERATURE,
      max_tokens: AGENT_MAX_TOKENS,
    });

    const endTime = Date.now();
    
    console.log("✅ BERHASIL!");
    console.log(`Waktu Respons: ${endTime - startTime} ms`);
    console.log("Respon dari Groq:");
    console.log(">>", completion.choices[0]?.message?.content);
    console.log("\nInfo Usage Token:");
    console.log(completion.usage);
    
  } catch (error: any) {
    console.log("❌ GAGAL!");
    console.error("Pesan Error:", error.message);
    if (error.status === 429) {
      console.error("\n⚠️ ERROR 429 (RATE LIMIT): Ini berarti Anda sudah mencapai batas pemakaian dari Groq (Bukan dari kodingan kita). Groq memiliki batas Tokens Per Minute (TPM) atau Requests Per Minute (RPM) yang cukup ketat untuk free tier.");
    } else if (error.status === 404) {
      console.error(`\n⚠️ ERROR 404 (NOT FOUND): Model "${AGENT_MODEL}" mungkin tidak tersedia di Groq. Coba gunakan model standar Groq seperti "llama-3.1-70b-versatile" atau "mixtral-8x7b-32768".`);
    } else if (error.status === 401) {
      console.error("\n⚠️ ERROR 401 (UNAUTHORIZED): API Key tidak valid. Cek file .env Anda.");
    }
  }
}

testGroq();
