/**
 * Batch embedding generator untuk CourseKnowledge menggunakan Cohere.
 *
 * Jalankan SETELAH seed-knowledge.ts.
 * Membutuhkan COHERE_API_KEY di .env.
 *
 * Usage: npx tsx prisma/embed-knowledge.ts
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const EMBEDDING_MODEL = "embed-multilingual-v3.0";
const BATCH_DELAY_MS = 500; // jeda antar request untuk hindari rate limit

async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.COHERE_API_KEY;
  if (!apiKey) throw new Error("COHERE_API_KEY tidak ditemukan di environment");

  const response = await fetch("https://api.cohere.ai/v1/embed", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      accept: "application/json",
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      texts: [text],
      input_type: "search_document", // Cohere v3 requirement
    }),
  });

  if (!response.ok) {
    throw new Error(`Cohere API error ${response.status}: ${await response.text()}`);
  }

  const data = (await response.json()) as { embeddings: number[][] };
  return data.embeddings[0];
}

async function embedAllKnowledge() {
  // Kolom `embedding` bertipe Json? — Prisma tidak bisa filter dengan null biasa.
  // Prisma.DbNull = nilai NULL di database (field belum diisi sama sekali).
  // Prisma.JsonNull = JSON literal `null` (berbeda!).
  // Dokumen baru yang belum di-embed nilainya DbNull.
  const { Prisma } = await import("@prisma/client");

  const docs = await prisma.courseKnowledge.findMany({
    where: { embedding: { equals: Prisma.DbNull } },
    select: { id: true, title: true, content: true, facultyTag: true },
    orderBy: [{ facultyTag: "asc" }, { title: "asc" }],
  });

  if (docs.length === 0) {
    console.log("✅ Semua dokumen sudah punya embedding. Tidak ada yang perlu di-process.");
    return;
  }

  console.log(`🔄 Mulai generate embedding untuk ${docs.length} dokumen dengan Cohere...`);

  let success = 0;
  let failed = 0;

  for (const doc of docs) {
    try {
      const embedding = await generateEmbedding(doc.content);

      await prisma.courseKnowledge.update({
        where: { id: doc.id },
        data: { embedding },
      });

      console.log(`  ✅ [${doc.facultyTag}] ${doc.title}`);
      success++;

      // Jeda antar request untuk hindari rate limit (Cohere trial limit cukup ketat)
      await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS));
    } catch (err) {
      console.error(`  ❌ [${doc.facultyTag}] ${doc.title}: ${err instanceof Error ? err.message : err}`);
      failed++;
    }
  }

  console.log(`\n✨ Selesai! ${success} berhasil, ${failed} gagal.`);
}

embedAllKnowledge()
  .catch((e) => {
    console.error("❌ Embedding batch gagal:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
