import Groq from "groq-sdk";
import { env } from "../config/env";

// Lazy initialization: Groq client dibuat hanya saat pertama kali dipakai,
// bukan saat module di-import. Ini mencegah crash saat startup kalau
// GROQ_API_KEY belum diisi (misal di environment development tanpa AI).
// Error akan muncul saat PERTAMA KALI agent dipanggil, bukan saat server start.
let _groqClient: Groq | null = null;

export function getGroqClient(): Groq {
  if (!_groqClient) {
    if (!env.GROQ_API_KEY) {
      throw new Error(
        "GROQ_API_KEY belum diisi di .env — tambahkan key dari console.groq.com lalu restart server."
      );
    }
    _groqClient = new Groq({ apiKey: env.GROQ_API_KEY });
  }
  return _groqClient;
}

// Alias untuk kompatibilitas dengan kode yang sudah ada (agent1, agent2, agent3 service)
// yang masih import `groq` langsung. Ini proxy object yang delegasikan ke getGroqClient().
export const groq = new Proxy({} as Groq, {
  get(_target, prop) {
    return (getGroqClient() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

// Kalau nanti P95 latency di AIInteractionLog.latencyMs kelihatan mepet ke
// limit pas demo, turunkan ke "llama-3.1-8b-instant" (lebih cepat, reasoning
// lebih sederhana) — putuskan berdasar data log itu, jangan tebak-tebak.
export const AGENT_MODEL = "qwen/qwen3.8-27b";

// Dipakai bersama Agent 1, 2 & 3 supaya konsisten kalau nanti mau diubah sekaligus.
export const AGENT_TEMPERATURE = 0.4; // rendah — ini tugas terstruktur/scoring, bukan tugas kreatif
export const AGENT_MAX_TOKENS = 2048;
