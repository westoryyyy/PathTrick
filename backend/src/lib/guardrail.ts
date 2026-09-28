import { z } from "zod";
import { prisma } from "./prisma";
import { AgentName } from "@prisma/client";

// ---------------------------------------------------------------------
// Guardrail generik dipakai Agent 1, Agent 2 (dan nanti agent lain kalau
// ada). Filosofinya: LLM call yang gagal di titik manapun -- error network,
// timeout, JSON rusak, bentuk tidak sesuai schema, atau ID hasil karangan
// yang tidak ada di kandidat -- SEMUA berujung ke fallback, TIDAK PERNAH
// membiarkan error mentah sampai ke Frontend atau bikin request menggantung.
//
// Urutan pertahanan (masing-masing baru dicek kalau yang sebelumnya lolos):
//   1. Panggilan LLM berhasil DALAM BATAS WAKTU (timeout di-enforce guardrail
//      sendiri, tidak digantungkan ke disiplin implementasi callLLM masing2)
//   2. Responsnya adalah JSON yang valid (tidak rusak/terpotong)
//   3. Bentuk JSON itu sesuai schema Zod yang disepakati
//   4. Semua ID yang direferensikan (courseId, universityId, dst) benar-benar
//      ada di daftar kandidat yang kita kirim, DAN tidak dobel dalam array
//      yang sama (dobel lolos Zod tapi nabrak @@unique saat insert ke DB)
//   5. KALAU sampai jalur fallback dipakai, fallback-nya SENDIRI juga
//      divalidasi ke schema yang sama -- fallback yang buggy tidak boleh
//      lolos diam-diam hanya karena "kan cuma fallback"
// ---------------------------------------------------------------------

const LLM_TIMEOUT_MS = 6000; // sedikit di atas SKPL-NF-01 (5 detik), biar guardrail yang motong duluan

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timeout setelah ${ms}ms`)), ms)
    ),
  ]);
}

interface RunAgentWithGuardrailParams<TInput, TOutput> {
  agent: AgentName;
  userId?: string;
  input: TInput;
  outputSchema: z.ZodType<TOutput>;
  /**
   * Fungsi yang benar-benar memanggil LLM. Dipisah sebagai parameter supaya
   * guardrail ini tidak perlu tahu SDK LLM apa yang dipakai (Groq/Gemini) --
   * itu tanggung jawab tim AI yang isi fungsi ini di masing-masing service
   * Agent 1 / Agent 2. Guardrail yang membungkus pemanggilannya dengan
   * timeout, jadi implementasi callLLM tidak perlu (dan tidak perlu)
   * menangani timeout-nya sendiri.
   */
  callLLM: (input: TInput) => Promise<string>; // wajib return raw string (belum di-JSON.parse)
  /**
   * Cross-check ID hasil LLM terhadap kandidat yang dikirim (termasuk
   * dedup). Return array kosong kalau semua valid, atau daftar pesan error
   * kalau ada ID yang "dikarang" atau muncul dobel.
   */
  checkReferencedIds: (input: TInput, output: TOutput) => string[];
  buildFallback: (input: TInput) => TOutput;
}

interface GuardrailResult<TOutput> {
  // null HANYA kalau fallback-nya sendiri juga gagal validasi (lihat
  // fallbackAlsoFailed). Endpoint pemanggil WAJIB cek fallbackAlsoFailed
  // sebelum memakai `data` -- jangan asumsikan selalu ada isinya.
  data: TOutput | null;
  usedFallback: boolean;
  fallbackAlsoFailed: boolean;
}

export async function runAgentWithGuardrail<TInput, TOutput>({
  agent,
  userId,
  input,
  outputSchema,
  callLLM,
  checkReferencedIds,
  buildFallback,
}: RunAgentWithGuardrailParams<TInput, TOutput>): Promise<GuardrailResult<TOutput>> {
  const startedAt = Date.now();

  try {
    const rawText = await withTimeout(callLLM(input), LLM_TIMEOUT_MS, `callLLM(${agent})`);

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(rawText);
    } catch {
      return await fallback(
        "Respons LLM bukan JSON yang valid (kemungkinan terpotong atau ada teks di luar JSON)",
        rawText
      );
    }

    const validation = outputSchema.safeParse(parsedJson);
    if (!validation.success) {
      return await fallback(
        `Bentuk JSON tidak sesuai schema: ${validation.error.message}`,
        rawText
      );
    }

    const idErrors = checkReferencedIds(input, validation.data);
    if (idErrors.length > 0) {
      return await fallback(`ID hasil LLM tidak valid: ${idErrors.join("; ")}`, rawText);
    }

    await logInteraction({
      agent,
      userId,
      requestPayload: input as object,
      responseRaw: parsedJson as object,
      status: "SUCCESS",
      latencyMs: Date.now() - startedAt,
    });

    return { data: validation.data, usedFallback: false, fallbackAlsoFailed: false };
  } catch (error) {
    return await fallback(
      error instanceof Error ? error.message : "Error tidak diketahui saat memanggil LLM",
      undefined
    );
  }

  async function fallback(reason: string, rawResponse: string | undefined) {
    const fallbackData = buildFallback(input);
    // Titik krusial: fallback-nya SENDIRI divalidasi ke schema yang sama.
    // Kalau candidateUniversities yang dikirim ke Agent 1 kebetulan kosong
    // (tidak ada satu pun universitas yang cocok di seed data), buildFallback
    // bisa balikin universityMatches: [] -- padahal outputSchema mewajibkan
    // .min(1). Tanpa pengecekan ini, fallback yang melanggar kontraknya
    // sendiri akan lolos diam-diam ke Frontend.
    const fallbackValidation = outputSchema.safeParse(fallbackData);

    await logInteraction({
      agent,
      userId,
      requestPayload: input as object,
      responseRaw: rawResponse ? safeJsonOrRaw(rawResponse) : null,
      status: fallbackValidation.success ? "FALLBACK_USED" : "FAILED",
      errorMessage: fallbackValidation.success
        ? reason
        : `${reason} | FALLBACK BUILDER JUGA GAGAL VALIDASI: ${fallbackValidation.error.message}`,
      latencyMs: Date.now() - startedAt,
    });

    return {
      data: fallbackValidation.success ? fallbackValidation.data : null,
      usedFallback: true,
      fallbackAlsoFailed: !fallbackValidation.success,
    };
  }
}

function safeJsonOrRaw(text: string): object {
  try {
    return JSON.parse(text);
  } catch {
    return { rawText: text };
  }
}

interface LogInteractionParams {
  agent: AgentName;
  userId?: string;
  requestPayload: object;
  responseRaw: object | null;
  status: "SUCCESS" | "FALLBACK_USED" | "FAILED";
  errorMessage?: string;
  latencyMs: number;
}

async function logInteraction(params: LogInteractionParams) {
  try {
    await prisma.aIInteractionLog.create({
      data: {
        agent: params.agent,
        userId: params.userId,
        requestPayload: params.requestPayload,
        responseRaw: params.responseRaw ?? undefined,
        status: params.status,
        errorMessage: params.errorMessage,
        latencyMs: params.latencyMs,
      },
    });
  } catch (logError) {
    // Logging gagal TIDAK BOLEH menggagalkan alur utama
    console.error("[guardrail] Gagal mencatat AIInteractionLog:", logError);
  }
}