import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const universitiesData = [
  {
    name: "Universitas Indonesia",
    country: "Indonesia",
    website: "http://www.ui.ac.id/",
    facultyTags: ["Kedokteran Umum/Gigi", "Ilmu Politik & Publik", "Psikologi", "Ilmu Komputer & TI"],
    estimatedCostMin: 15000000,
    estimatedCostMax: 25000000, // Premium
    admissionRequirements: "Rapor semester 1-5, UTBK SNBT, Ujian Mandiri (SIMAK UI)",
    coverImageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "Institut Teknologi Bandung",
    country: "Indonesia",
    website: "http://www.itb.ac.id/",
    facultyTags: ["Sipil & Arsitektur", "Mesin & Elektro", "Ilmu Komputer & TI", "Matematika & Statistika", "Bisnis & Manajemen"],
    estimatedCostMin: 12500000,
    estimatedCostMax: 20000000, // Menengah - Premium
    admissionRequirements: "Rapor semester 1-5, UTBK SNBT, Ujian Mandiri (SM-ITB)",
    coverImageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "Universitas Gadjah Mada",
    country: "Indonesia",
    website: "http://www.ugm.ac.id/",
    facultyTags: ["Kedokteran Umum/Gigi", "Agribisnis & Pertanian", "Sastra & Bahasa", "Hukum"],
    estimatedCostMin: 8000000,
    estimatedCostMax: 15000000, // Menengah
    admissionRequirements: "Rapor semester 1-5, UTBK SNBT, Ujian Mandiri (CBT-UM UGM)",
    coverImageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "Binus University",
    country: "Indonesia",
    website: "http://www.binus.ac.id/",
    facultyTags: ["Ilmu Komputer & TI", "Bisnis & Manajemen", "Desain & Seni Rupa"],
    estimatedCostMin: 20000000,
    estimatedCostMax: 35000000, // Premium - Eksklusif
    admissionRequirements: "Tes Potensi Keberhasilan Studi (TPKS), Rapor SMA, Interview",
    coverImageUrl: "https://images.unsplash.com/photo-1606761568499-6d2451b08c66?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "Universitas Brawijaya",
    country: "Indonesia",
    website: "http://www.ub.ac.id/",
    facultyTags: ["Agribisnis & Pertanian", "Hukum", "Keperawatan & Farmasi", "Ilmu Komputer & TI"],
    estimatedCostMin: 4000000,
    estimatedCostMax: 12000000, // Terjangkau - Menengah
    admissionRequirements: "Rapor semester 1-5, UTBK SNBT, Ujian Mandiri (SMUB)",
    coverImageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "Universitas Terbuka Indonesia",
    country: "Indonesia",
    website: "http://www.ut.ac.id/",
    facultyTags: ["Pendidikan Guru", "Bisnis & Manajemen", "Ilmu Komunikasi"],
    estimatedCostMin: 1500000,
    estimatedCostMax: 3500000, // Terjangkau
    admissionRequirements: "Lulus SMA/Sederajat (Tanpa tes masuk), Pendaftaran Online",
    coverImageUrl: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&auto=format&fit=crop&q=60",
  }
];

const scholarshipsData = [
  {
    name: "Beasiswa LPDP (Reguler)",
    country: "Indonesia",
    scope: "keduanya", // Bisa dalam/luar negeri
    deadline: new Date(new Date().setMonth(new Date().getMonth() + 3)), // 3 bulan dari sekarang
    requirements: "IPK min 3.00, TOEFL ITP min 500 / IELTS min 6.0, Surat Rekomendasi, LoA Unconditional (opsional)",
    requiredDocuments: ["Ijazah & Transkrip", "Sertifikat Bahasa Inggris", "Esai Kontribusi", "Surat Rekomendasi"],
    facultyTags: ["Ilmu Komputer & TI", "Sipil & Arsitektur", "Kedokteran Umum/Gigi", "Bisnis & Manajemen", "Pendidikan Guru"],
  },
  {
    name: "Beasiswa Unggulan Kemendikbudristek",
    country: "Indonesia",
    scope: "dalam_negeri",
    deadline: new Date(new Date().setMonth(new Date().getMonth() + 2)),
    requirements: "Mahasiswa baru/on-going (maks semester 3), IPK min 3.25, Sertifikat Prestasi (Minimal Tingkat Kabupaten)",
    requiredDocuments: ["KTM/LoA", "KHS/Transkrip", "Sertifikat Prestasi", "Proposal Rencana Studi"],
    facultyTags: ["Pendidikan Guru", "Desain & Seni Rupa", "Sastra & Bahasa", "Psikologi", "Ilmu Hukum"],
  },
  {
    name: "AAS (Australia Awards Scholarship)",
    country: "Australia",
    scope: "luar_negeri",
    deadline: new Date(new Date().setMonth(new Date().getMonth() + 5)),
    requirements: "WNI, IELTS min 5.5, Pengalaman Kerja min 2 tahun (tergantung kategori), Komitmen kembali ke Indonesia",
    requiredDocuments: ["Akte Kelahiran", "Ijazah & Transkrip Terjemahan Tersumpah", "IELTS/PTE", "CV dalam Bahasa Inggris"],
    facultyTags: ["Ilmu Politik & Publik", "Kesehatan Masyarakat", "Agribisnis & Pertanian", "Teknologi Pendidikan"],
  }
];

async function main() {
  // Ambil user admin (berdasarkan Role "ADMIN")
  const adminRole = await prisma.role.findUnique({ where: { name: "ADMIN" } });
  const adminUser = adminRole ? await prisma.user.findFirst({ where: { roleId: adminRole.id } }) : null;

  if (!adminUser) {
    console.warn("⚠️ Admin user belum ada. Data akan di-seed dengan createdByUserId = null.");
  }

  console.log("Seeding Universities...");
  for (const univ of universitiesData) {
    await prisma.university.create({
      data: {
        ...univ,
        createdByUserId: adminUser?.id || undefined,
      },
    });
  }
  console.log(`✅ Seeded ${universitiesData.length} Universities`);

  console.log("Seeding Scholarships...");
  for (const schol of scholarshipsData) {
    await prisma.scholarship.create({
      data: {
        ...schol,
        createdByUserId: adminUser?.id || undefined,
      },
    });
  }
  console.log(`✅ Seeded ${scholarshipsData.length} Scholarships`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
