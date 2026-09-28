/**
 * Seed Knowledge Base — jalankan setelah `prisma migrate dev`
 *
 * Script ini membaca file .md dari folder knowledge-base/,
 * parsing frontmatter YAML untuk metadata (jurusan, facultyTag),
 * dan memecah konten per heading "## " menjadi chunk terpisah.
 * Setiap chunk disimpan sebagai 1 row di tabel CourseKnowledge.
 *
 * Format file markdown yang didukung:
 * ---
 * jurusan: Software Engineering
 * facultyTag: teknologi
 * ---
 *
 * ## Judul Section 1
 * Konten section 1...
 *
 * ## Judul Section 2
 * Konten section 2...
 *
 * Usage: npm run knowledge:seed
 */

import { PrismaClient, Prisma } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const KNOWLEDGE_BASE_DIR = path.join(process.cwd(), "knowledge-base");

interface Chunk {
  facultyTag: string;
  title: string;
  content: string;
  chunkIndex: number;
}

// -----------------------------------------------------------------------
// Parser frontmatter sederhana (tanpa dependency gray-matter)
// -----------------------------------------------------------------------

function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) {
    return { data: {}, content: raw };
  }
  const data: Record<string, string> = {};
  for (const line of fmMatch[1].split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim();
      data[key] = value;
    }
  }
  return { data, content: fmMatch[2] };
}

// -----------------------------------------------------------------------
// Chunking: pecah 1 file jadi beberapa chunk per heading "## "
// Setiap chunk = 1 row di DB, 1 embedding vektor
// -----------------------------------------------------------------------

function chunkMarkdownFile(filePath: string): Chunk[] {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = parseFrontmatter(raw);

  if (!data.facultyTag) {
    console.warn(`⚠️  ${path.basename(filePath)}: frontmatter tidak punya "facultyTag", skip.`);
    return [];
  }

  // Pecah per heading "## "
  const sections = content.split(/\n(?=## )/g).filter((s) => s.trim().length > 0);

  if (sections.length === 0) {
    // File tanpa heading ## — simpan seluruh konten sebagai 1 chunk
    const title = path.basename(filePath, ".md");
    return [{ facultyTag: data.facultyTag, title, content: content.trim(), chunkIndex: 0 }];
  }

  return sections.map((section, index) => {
    const headingMatch = section.match(/^##\s+(.+)$/m);
    const title = headingMatch ? headingMatch[1].trim() : `${data.facultyTag} — bagian ${index + 1}`;
    return {
      facultyTag: data.facultyTag,
      title,
      content: section.trim(),
      chunkIndex: index,
    };
  });
}

function listMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }
  return files;
}

async function seedKnowledge() {
  if (!fs.existsSync(KNOWLEDGE_BASE_DIR)) {
    console.error(`❌ Folder knowledge-base tidak ditemukan di: ${KNOWLEDGE_BASE_DIR}`);
    process.exit(1);
  }

  const files = listMarkdownFiles(KNOWLEDGE_BASE_DIR);
  console.log(`📚 Ditemukan ${files.length} file markdown. Mulai chunking & seed...\n`);

  let totalChunks = 0;
  let upserted = 0;
  let skipped = 0;

  for (const filePath of files) {
    const chunks = chunkMarkdownFile(filePath);
    const fileName = path.relative(KNOWLEDGE_BASE_DIR, filePath);
    console.log(`📄 ${fileName}: ${chunks.length} chunk`);

    for (const chunk of chunks) {
      totalChunks++;
      try {
        // Hapus embedding lama (reset) supaya embed-knowledge.ts akan re-generate
        await prisma.courseKnowledge.upsert({
          where: {
            facultyTag_title_chunkIndex: {
              facultyTag: chunk.facultyTag,
              title: chunk.title,
              chunkIndex: chunk.chunkIndex,
            },
          },
          update: {
            content: chunk.content,
            embedding: Prisma.DbNull, // reset embedding agar di-regenerate
          },
          create: {
            facultyTag: chunk.facultyTag,
            title: chunk.title,
            content: chunk.content,
            chunkIndex: chunk.chunkIndex,
            embedding: Prisma.DbNull,
          },
        });
        console.log(`   ✅ [${chunk.facultyTag}] "${chunk.title}" (chunk ${chunk.chunkIndex})`);
        upserted++;
      } catch (err) {
        console.error(`   ❌ [${chunk.facultyTag}] "${chunk.title}": ${err instanceof Error ? err.message : err}`);
        skipped++;
      }
    }
  }

  console.log(`\n✨ Selesai! ${upserted}/${totalChunks} chunk berhasil di-seed, ${skipped} gagal.`);
  console.log(`\n📌 Langkah berikutnya: generate embedding untuk semua chunk`);
  console.log(`   npm run knowledge:embed`);
}

seedKnowledge()
  .catch((e) => {
    console.error("❌ Seeder gagal:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
