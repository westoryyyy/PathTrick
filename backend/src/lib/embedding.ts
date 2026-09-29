import { env } from "../config/env";
import { prisma } from "./prisma";
import { Prisma } from "@prisma/client";

// -----------------------------------------------------------------------
// Embedding helper untuk Agent 3 (Course Generator RAG).
//
// Model: Cohere embed-multilingual-v3.0 — 1024 dimensi.
// Sangat bagus untuk Bahasa Indonesia dan 100% gratis di Developer Tier.
//
// PENDEKATAN MVP (tanpa pgvector):
// Embedding disimpan sebagai Json (number[]) di PostgreSQL biasa.
// Similarity search dilakukan in-memory di TypeScript menggunakan
// cosine similarity.
// -----------------------------------------------------------------------

const EMBEDDING_MODEL = "embed-multilingual-v3.0";
const EMBEDDING_DIMENSIONS = 1024;

/**
 * Panggil Cohere Embeddings API, kembalikan vektor float[].
 * Cohere v3 mewajibkan inputType: "search_document" untuk DB,
 * dan "search_query" saat user mencari.
 */
export async function generateEmbedding(
  text: string,
  inputType: "search_document" | "search_query"
): Promise<number[]> {
  if (!env.COHERE_API_KEY) {
    throw new Error(
      "COHERE_API_KEY belum diisi di environment — embedding tidak bisa di-generate. " +
        "Tambahkan ke .env lalu restart server."
    );
  }

  const response = await fetch("https://api.cohere.ai/v1/embed", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.COHERE_API_KEY}`,
      // Cohere merekomendasikan header ini
      accept: "application/json",
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      texts: [text],
      input_type: inputType,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cohere Embeddings API error ${response.status}: ${errorText}`);
  }

  const data = (await response.json()) as { embeddings: number[][] };
  const embedding = data.embeddings[0];

  if (!embedding || embedding.length !== EMBEDDING_DIMENSIONS) {
    throw new Error(
      `Cohere returned unexpected embedding shape: length=${embedding?.length ?? "undefined"}, expected ${EMBEDDING_DIMENSIONS}`
    );
  }

  return embedding;
}

// -----------------------------------------------------------------------
// Cosine similarity in-memory — cukup untuk MVP
// -----------------------------------------------------------------------

/**
 * Hitung cosine similarity antara 2 vektor.
 * Return: 0–1, semakin tinggi semakin mirip.
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

export interface KnowledgeChunk {
  id: string;
  facultyTag: string;
  title: string;
  content: string;
  similarity: number; // 0–1
}

/**
 * Cari dokumen knowledge yang paling relevan untuk query tertentu.
 */
export async function searchKnowledge(
  query: string,
  facultyTag?: string,
  topK = 5
): Promise<KnowledgeChunk[]> {
  // Untuk search, Cohere v3 WAJIB pakai "search_query"
  const queryEmbedding = await generateEmbedding(query, "search_query");

  // Ambil semua dokumen yang sudah punya embedding
  const docs = await prisma.courseKnowledge.findMany({
    where: {
      ...(facultyTag ? { facultyTag } : {}),
      // Prisma DbNull = SQL NULL (kolom belum diisi sama sekali).
      // Prisma 6 mengubah penempatan tipe ini, jadi kita gunakan type cast.
      NOT: { embedding: { equals: (Prisma as any).DbNull } },
    },
    select: {
      id: true,
      facultyTag: true,
      title: true,
      content: true,
      embedding: true,
    },
  });

  if (docs.length === 0) return [];

  // Hitung similarity & urutkan
  const scored = docs
    .map((doc: any) => {
      const embeddingArray = doc.embedding as number[];
      return {
        id: doc.id,
        facultyTag: doc.facultyTag,
        title: doc.title,
        content: doc.content,
        similarity: cosineSimilarity(queryEmbedding, embeddingArray),
      };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);

  return scored;
}

/**
 * Update embedding sebuah CourseKnowledge record.
 * Dipanggil setelah admin menyimpan dokumen baru (via admin.service.ts).
 */
export async function updateKnowledgeEmbedding(id: string, content: string): Promise<void> {
  // Untuk disimpan ke DB, Cohere v3 WAJIB pakai "search_document"
  const embedding = await generateEmbedding(content, "search_document");

  await prisma.courseKnowledge.update({
    where: { id },
    data: { embedding },
  });
}
