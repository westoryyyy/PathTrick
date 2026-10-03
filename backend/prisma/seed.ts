import { PrismaClient, QuestionType, QuestionDifficulty } from "@prisma/client";

const prisma = new PrismaClient();

// ---------------------------------------------------------------------
// Catatan: seed ini HANYA untuk master data yang memang diisi Admin
// (Role, House, University, Scholarship, Job, Skill, Course + Chapter + Section + Quiz).
// ---------------------------------------------------------------------

async function seedRoles() {
  const roleDefs = [
    {
      id: "role-dreamer",
      name: "DREAMER",
      displayName: "The Dreamer", // Di frontend The Dreamer itu SMA
      title: "Siswa SMA",
      description:
        "Masih SMA & bingung mau kuliah apa? Temukan jurusan & karier sesuai bakatmu.",
      perks: [
        "Asesmen Minat & Bakat",
        "Tes RIASEC",
        "Rekomendasi Jurusan",
        "Info Beasiswa",
      ],
      iconUrl: "/NPC High School Student.png",
      color: "#a855f7",
      glow: "rgba(168,85,247,0.5)",
      tag: "POPULER",
      isSelectable: true,
      sortOrder: 1,
    },
    {
      id: "role-chaser",
      name: "CHASER",
      displayName: "The Chaser", // Di frontend The Chaser itu Mahasiswa
      title: "Mahasiswa / Fresh Grad",
      description:
        "Mahasiswa atau baru lulus? Upload CV-mu dan biarkan AI membuatkan roadmap kariermu.",
      perks: [
        "Asesmen Karier AI",
        "CV Analysis",
        "Job Matching",
        "Career Roadmap",
      ],
      iconUrl: "/NPC University Student.png",
      color: "#f59e0b",
      glow: "rgba(245,158,11,0.5)",
      tag: null,
      isSelectable: true,
      sortOrder: 2,
    },
    {
      id: "role-admin",
      name: "ADMIN",
      displayName: "Administrator",
      title: "Admin",
      description: "Admin platform Pathtrick â€” akses penuh ke panel manajemen konten.",
      perks: [
        "Akses Admin Panel",
        "Generate Course via AI (Agent 3)",
        "Kelola Knowledge Base",
        "Publish / Unpublish Course",
      ],
      iconUrl: null,
      color: "#3b82f6",
      glow: "rgba(59,130,246,0.5)",
      tag: null,
      isSelectable: false,
      sortOrder: 99,
    },
  ];

  for (const role of roleDefs) {
    await prisma.role.upsert({
      where: { id: role.id },
      update: {
        displayName: role.displayName,
        title: role.title,
        description: role.description,
        perks: role.perks,
        iconUrl: role.iconUrl,
        color: role.color,
        glow: role.glow,
        tag: role.tag,
        isSelectable: role.isSelectable,
        sortOrder: role.sortOrder,
      },
      create: role,
    });
  }

  console.log("[seed] Roles siap: DREAMER, CHASER, ADMIN");
}

async function seedHouses() {
  const houseDefs = [
    {
      id: "house-education",
      title: "House of Education",
      description: "Teori Pendidikan, Psikologi Belajar & Teknologi Pembelajaran",
      icon: "🎓",
      houseNumber: 1,
      gradient: "from-yellow-400 via-amber-400 to-orange-400",
      skillsOverview: ["Manajemen Kelas", "Desain Kurikulum", "Psikologi Anak", "EdTech"],
      idealFor: ["Senang mengajar & berbagi ilmu", "Sabar & empatik", "Visioner kecerdasan bangsa"],
      status: "active",
      isPublished: true,
    },
    {
      id: "house-arts",
      title: "House of Arts & Humanities",
      description: "Seni Rupa, Bahasa, Sastra, Sejarah & Filsafat",
      icon: "🎨",
      houseNumber: 2,
      gradient: "from-pink-400 via-rose-400 to-purple-400",
      skillsOverview: ["Berpikir Kritis", "Kreativitas Visual", "Analisis Sejarah", "Komunikasi Tulisan"],
      idealFor: ["Imajinatif & out of the box", "Suka mengekspresikan diri lewat karya", "Tertarik pada budaya dan sejarah"],
      status: "active",
      isPublished: true,
    },
    {
      id: "house-social",
      title: "House of Social Sciences",
      description: "Sosiologi, Ilmu Politik, Jurnalisme & Komunikasi",
      icon: "🌐",
      houseNumber: 3,
      gradient: "from-teal-400 via-cyan-400 to-sky-400",
      skillsOverview: ["Riset Sosial", "Public Relations", "Analisis Kebijakan", "Jurnalisme Investigasi"],
      idealFor: ["Peduli pada isu-isu sosial", "Kritis terhadap berita dan media", "Pintar bersosialisasi dan diplomasi"],
      status: "active",
      isPublished: true,
    },
    {
      id: "house-business",
      title: "House of Business & Law",
      description: "Akuntansi, Manajemen, Pemasaran, Kewirausahaan & Hukum",
      icon: "⚖️",
      houseNumber: 4,
      gradient: "from-emerald-400 via-green-400 to-teal-500",
      skillsOverview: ["Analisis Keuangan", "Strategi Marketing", "Manajemen Risiko", "Hukum Perdata"],
      idealFor: ["Suka tantangan & kompetisi", "Pintar mengelola uang", "Punya jiwa kepemimpinan"],
      status: "active",
      isPublished: true,
    },
    {
      id: "house-science",
      title: "House of Natural Sciences",
      description: "Fisika, Kimia, Biologi, Matematika & Statistik",
      icon: "🔬",
      houseNumber: 5,
      gradient: "from-violet-400 via-purple-400 to-indigo-400",
      skillsOverview: ["Analisis Data", "Metode Ilmiah", "Pemodelan Matematika", "Riset Laboratorium"],
      idealFor: ["Sangat logis dan analitis", "Suka eksperimen", "Selalu penasaran dengan cara alam semesta bekerja"],
      status: "active",
      isPublished: true,
    },
    {
      id: "house-ict",
      title: "House of ICT",
      description: "Pemrograman, Software Dev, Keamanan Siber & AI/ML",
      icon: "💻",
      houseNumber: 6,
      gradient: "from-blue-500 via-indigo-500 to-sky-500",
      skillsOverview: ["Coding & Programming", "Software Engineering", "Cybersecurity", "AI & Data Science"],
      idealFor: ["Suka memecahkan teka-teki logika", "Tertarik dengan gadget dan software baru", "Senang bekerja di depan komputer"],
      status: "active",
      isPublished: true,
    },
    {
      id: "house-engineering",
      title: "House of Engineering",
      description: "Teknik Sipil, Teknik Mesin, Elektro & Konstruksi",
      icon: "⚙️",
      houseNumber: 7,
      gradient: "from-amber-400 via-orange-400 to-amber-500",
      skillsOverview: ["Desain CAD", "Mekanika & Termodinamika", "Manajemen Proyek", "Sirkuit Elektronik"],
      idealFor: ["Suka membongkar dan merakit barang", "Tertarik pada mesin dan struktur", "Praktis dan problem solver"],
      status: "locked",
      isPublished: false,
    },
    {
      id: "house-agriculture",
      title: "House of Agriculture",
      description: "Agronomi, Peternakan, Kehutanan & Perikanan",
      icon: "🌱",
      houseNumber: 8,
      gradient: "from-lime-400 via-green-500 to-emerald-500",
      skillsOverview: ["Manajemen Lahan", "Kesehatan Hewan", "Agronomi", "Ekologi Konservasi"],
      idealFor: ["Cinta alam dan lingkungan", "Suka bekerja di luar ruangan", "Peduli pada ketahanan pangan"],
      status: "locked",
      isPublished: false,
    },
    {
      id: "house-health",
      title: "House of Health & Welfare",
      description: "Kedokteran, Keperawatan, Farmasi & Pekerjaan Sosial",
      icon: "🏥",
      houseNumber: 9,
      gradient: "from-rose-400 via-red-400 to-pink-500",
      skillsOverview: ["Diagnosis Klinis", "Asuhan Keperawatan", "Farmakologi", "Konseling Psikologi"],
      idealFor: ["Sangat peduli dan ingin membantu orang sakit", "Tahan banting menghadapi situasi darurat", "Punya empati tinggi"],
      status: "locked",
      isPublished: false,
    },
    {
      id: "house-services",
      title: "House of Services",
      description: "Perhotelan, Kuliner, Pariwisata, Olahraga & Logistik",
      icon: "🏨",
      houseNumber: 10,
      gradient: "from-orange-400 via-amber-500 to-yellow-500",
      skillsOverview: ["Hospitality & Pelayanan", "Culinary Arts", "Event Organizing", "Manajemen Logistik"],
      idealFor: ["Ramah dan suka melayani orang lain", "Suka traveling atau memasak", "Pandai mengatur acara"],
      status: "locked",
      isPublished: false,
    }
  ];

  const houses = [];
  for (const h of houseDefs) {
    const house = await prisma.house.upsert({
      where: { id: h.id },
      update: h,
      create: h,
    });
    houses.push(house);
  }

  console.log("[seed] Houses siap:", houses.map((h) => h.title).join(", "));
  return houses;
}

async function seedSkills() {
  const skillDefs = [
    { name: "Node.js", coverImageUrl: "https://cdn.pathtrick.app/skills/nodejs.png" },
    { name: "PostgreSQL", coverImageUrl: "https://cdn.pathtrick.app/skills/postgresql.png" },
    { name: "API Design", coverImageUrl: "https://cdn.pathtrick.app/skills/api-design.png" },
    { name: "HTML/CSS", coverImageUrl: "https://cdn.pathtrick.app/skills/html-css.png" },
    { name: "React", coverImageUrl: "https://cdn.pathtrick.app/skills/react.png" },
  ];

  const skills = [];
  for (const def of skillDefs) {
    const skill = await prisma.skill.upsert({
      where: { name: def.name },
      update: {},
      create: {
        name: def.name,
        coverImageUrl: def.coverImageUrl,
        createdByUserId: null,
      },
    });
    skills.push(skill);
  }

  console.log("[seed] Skill master data siap:", skills.map((s) => s.name).join(", "));
  return skills;
}

async function seedUniversity() {
  const university = await prisma.university.upsert({
    where: { id: "seed-university-unila" },
    update: {},
    create: {
      id: "seed-university-unila",
      name: "Universitas Lampung",
      country: "Indonesia",
      coverImageUrl: "https://cdn.pathtrick.app/universities/unila-cover.jpg",
      facultyTags: ["Teknik", "Ilmu Komputer", "Teknologi Informasi"],
      estimatedCostMin: 3000000,
      estimatedCostMax: 10000000,
      admissionRequirements: "Lulus SMA/SMK sederajat, lolos SNBP/SNBT.",
      website: "https://unila.ac.id",
      createdByUserId: null,
    },
  });

  console.log("[seed] University siap:", university.name);
  return university;
}

async function seedScholarship() {
  const scholarship = await prisma.scholarship.upsert({
    where: { id: "seed-scholarship-unggulan-teknologi" },
    update: {},
    create: {
      id: "seed-scholarship-unggulan-teknologi",
      name: "Beasiswa Unggulan Teknologi",
      country: "Indonesia",
      deadline: new Date("2026-12-31T23:59:59Z"),
      requirements: "Nilai rata-rata rapor minimal 85. Aktif berorganisasi.",
      requiredDocuments: ["Transkrip Nilai", "Surat Rekomendasi", "Sertifikat Lomba"],
      facultyTags: ["Teknik", "Sistem Informasi"],
      scope: "dalam_negeri",
      createdByUserId: null,
    },
  });

  console.log("[seed] Scholarship siap:", scholarship.name);
  return scholarship;
}

async function seedJob() {
  const job = await prisma.job.upsert({
    where: { id: "seed-job-backend-intern" },
    update: {},
    create: {
      id: "seed-job-backend-intern",
      title: "Backend Developer Intern",
      company: "TechVerse ID",
      type: "internship",
      skillsRequired: ["Node.js", "PostgreSQL", "API Design"],
      description: "Magang 3 bulan untuk pengembangan REST API.",
      applyUrl: "https://techverse.id/careers",
      createdByUserId: null,
    },
  });

  console.log("[seed] Job siap:", job.title);
  return job;
}

async function seedCourses(skillIds: string[]) {
  // Course 1 under House of ICT
  const course1 = await prisma.course.upsert({
    where: { id: "seed-course-web-backend" },
    update: {},
    create: {
      id: "seed-course-web-backend",
      title: "Pemrograman Web & Backend Fundamentals",
      description: "Pelajari HTML semantik, REST API Fastify, dan database Prisma ORM.",
      coverImageUrl: "https://cdn.pathtrick.app/courses/web-backend-cover.jpg",
      mapBackgroundUrl: "https://cdn.pathtrick.app/courses/backend-intro-map-bg.png",
      facultyTags: ["Ilmu Komputer", "Teknologi Informasi"],
      level: "Beginner",
      contentType: "material",
      houseId: "house-ict",
      createdByUserId: null,
      skills: {
        connect: skillIds.map((id) => ({ id })),
      },
      chapters: {
        create: [
          {
            id: "chapter-web-1",
            title: "BAB 1: Fondasi HTML & Struktur Web",
            order: 1,
            durationLabel: "6 Levels",
            sections: {
              create: [
                {
                  id: "section-web-1-1",
                  title: "Pengenalan HTML & Tag Dasar",
                  order: 1,
                  category: "skill",
                  xpReward: 100,
                  content:
                    "HTML (HyperText Markup Language) adalah kerangka dasar website. Tag seperti <h1>, <p>, <a>, dan <img> memberitahu browser bagaimana menampilkan konten.",
                  quiz: {
                    create: {
                      title: "Kuis: Dasar HTML",
                      passingScore: 75,
                      questions: {
                        create: [
                          {
                            type: QuestionType.MULTIPLE_CHOICE,
                            prompt: "Kalau sebuah website adalah rumah, peran HTML adalah sebagai apa?",
                            options: [
                              { id: "a", text: "Cat dan dekorasi ruangan" },
                              { id: "b", text: "Batu bata, semen, dan kerangka struktur" },
                              { id: "c", text: "Listrik dan saluran air" },
                            ],
                            correctAnswer: { id: "b" },
                            points: 50,
                            difficulty: QuestionDifficulty.EASY,
                            order: 1,
                          },
                          {
                            type: QuestionType.MULTIPLE_CHOICE,
                            prompt: "Tag HTML mana yang digunakan untuk membuat judul paling utama?",
                            options: [
                              { id: "a", text: "<p>" },
                              { id: "b", text: "<h1>" },
                              { id: "c", text: "<span>" },
                            ],
                            correctAnswer: { id: "b" },
                            points: 50,
                            difficulty: QuestionDifficulty.EASY,
                            order: 2,
                          },
                        ],
                      },
                    },
                  },
                },
                {
                  id: "section-web-1-2",
                  title: "Struktur Semantik HTML5",
                  order: 2,
                  category: "skill",
                  xpReward: 100,
                  content:
                    "Semantic HTML seperti <header>, <main>, dan <footer> membantu mesin pencari (SEO) dan pembaca layar memahami struktur dokumen dengan jelas.",
                  quiz: {
                    create: {
                      title: "Kuis: HTML Semantik",
                      passingScore: 75,
                      questions: {
                        create: [
                          {
                            type: QuestionType.MULTIPLE_CHOICE,
                            prompt: "Tag semantik apa yang menandai area konten utama pada halaman web?",
                            options: [
                              { id: "a", text: "<header>" },
                              { id: "b", text: "<main>" },
                              { id: "c", text: "<footer>" },
                            ],
                            correctAnswer: { id: "b" },
                            points: 50,
                            difficulty: QuestionDifficulty.MEDIUM,
                            order: 1,
                          },
                        ],
                      },
                    },
                  },
                },
              ],
            },
          },
          {
            id: "chapter-web-2",
            title: "BAB 2: REST API & Database Postgres",
            order: 2,
            durationLabel: "6 Levels",
            sections: {
              create: [
                {
                  id: "section-web-2-1",
                  title: "Arsitektur REST API & HTTP Method",
                  order: 1,
                  category: "skill",
                  xpReward: 150,
                  content:
                    "REST API menggunakan method HTTP seperti GET, POST, PUT, dan DELETE untuk manipulasi data antar sistem.",
                  quiz: {
                    create: {
                      title: "Kuis: HTTP Methods",
                      passingScore: 75,
                      questions: {
                        create: [
                          {
                            type: QuestionType.MULTIPLE_CHOICE,
                            prompt: "Method HTTP apa yang dipakai untuk menambahkan data baru?",
                            options: [
                              { id: "a", text: "GET" },
                              { id: "b", text: "POST" },
                              { id: "c", text: "DELETE" },
                            ],
                            correctAnswer: { id: "b" },
                            points: 50,
                            difficulty: QuestionDifficulty.EASY,
                            order: 1,
                          },
                        ],
                      },
                    },
                  },
                },
                {
                  id: "section-web-2-2",
                  title: "Database Modeling & Prisma ORM",
                  order: 2,
                  category: "skill",
                  xpReward: 150,
                  content:
                    "Prisma mendefinisikan tabel database dalam schema.prisma dan menyediakan query type-safe.",
                  quiz: {
                    create: {
                      title: "Kuis: Prisma ORM",
                      passingScore: 75,
                      questions: {
                        create: [
                          {
                            type: QuestionType.MULTIPLE_CHOICE,
                            prompt: "Perintah Prisma apa yang digunakan untuk membuat file Prisma Client terbaru?",
                            options: [
                              { id: "a", text: "prisma generate" },
                              { id: "b", text: "prisma studio" },
                              { id: "c", text: "prisma init" },
                            ],
                            correctAnswer: { id: "a" },
                            points: 50,
                            difficulty: QuestionDifficulty.EASY,
                            order: 1,
                          },
                        ],
                      },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("[seed] Courses siap:", course1.title);
  return [course1];
}


async function seedRiasecQuestions() {
  const questions = [
    { id: "q01", text: "Aku suka bekerja mandiri", category: "A" as const, order: 1 },
    { id: "q02", text: "Aku suka merapikan barang-barang (buku, alat tulis, kamar)", category: "C" as const, order: 2 },
    { id: "q03", text: "Aku suka membuat target untuk diriku sendiri", category: "E" as const, order: 3 },
    { id: "q04", text: "Aku suka mengerjakan puzzle", category: "I" as const, order: 4 },
    { id: "q05", text: "Aku suka mengulik peralatan", category: "R" as const, order: 5 },
    { id: "q06", text: "Aku suka bekerja dalam kelompok", category: "S" as const, order: 6 },
    { id: "q07", text: "Aku suka membaca buku tentang seni dan musik", category: "A" as const, order: 7 },
    { id: "q08", text: "Aku suka mengerjakan hal-hal dengan instruksi yang jelas", category: "C" as const, order: 8 },
    { id: "q09", text: "Aku suka meyakinkan teman untuk mengikuti caraku", category: "E" as const, order: 9 },
    { id: "q10", text: "Aku suka melakukan percobaan/eksperimen", category: "I" as const, order: 10 },
    { id: "q11", text: "Aku suka menyusun balok/LEGO", category: "R" as const, order: 11 },
    { id: "q12", text: "Aku suka menjelaskan sesuatu kepada teman", category: "S" as const, order: 12 },
    { id: "q13", text: "Aku suka membuat karya berbentuk tulisan", category: "A" as const, order: 13 },
    { id: "q14", text: "Aku tidak berkeberatan bekerja melebihi waktu yang ditentukan", category: "C" as const, order: 14 },
    { id: "q15", text: "Aku suka menjual sesuatu", category: "E" as const, order: 15 },
    { id: "q16", text: "Aku suka sains", category: "I" as const, order: 16 },
    { id: "q17", text: "Aku suka memelihara binatang", category: "R" as const, order: 17 },
    { id: "q18", text: "Aku suka membantu orang lain memecahkan persoalan", category: "S" as const, order: 18 },
    { id: "q19", text: "Aku adalah orang yang kreatif", category: "A" as const, order: 19 },
    { id: "q20", text: "Aku suka memperhatikan detail", category: "C" as const, order: 20 },
    { id: "q21", text: "Aku suka mendapatkan tantangan baru", category: "E" as const, order: 21 },
    { id: "q22", text: "Aku suka mencari tahu cara kerja sebuah alat", category: "I" as const, order: 22 },
    { id: "q23", text: "Aku suka merangkaikan atau merakit benda", category: "R" as const, order: 23 },
    { id: "q24", text: "Aku suka menghibur teman", category: "S" as const, order: 24 },
    { id: "q25", text: "Aku suka memainkan alat musik atau bernyanyi", category: "A" as const, order: 25 },
    { id: "q26", text: "Aku suka merapikan catatan", category: "C" as const, order: 26 },
    { id: "q27", text: "Aku ingin membuka usaha sendiri suatu saat nanti", category: "E" as const, order: 27 },
    { id: "q28", text: "Aku suka mencari tahu penyebab suatu kejadian", category: "I" as const, order: 28 },
    { id: "q29", text: "Aku suka memasak", category: "R" as const, order: 29 },
    { id: "q30", text: "Aku suka mempelajari budaya berbagai daerah", category: "S" as const, order: 30 },
    { id: "q31", text: "Aku suka bermain peran/drama", category: "A" as const, order: 31 },
    { id: "q32", text: "Aku suka merapikan kamarku", category: "C" as const, order: 32 },
    { id: "q33", text: "Aku suka memimpin kelompok atau kelas", category: "E" as const, order: 33 },
    { id: "q34", text: "Aku suka mengerjakan soal matematika atau grafik", category: "I" as const, order: 34 },
    { id: "q35", text: "Aku suka mempraktikkan hal-hal yang aku pelajari", category: "R" as const, order: 35 },
    { id: "q36", text: "Aku suka mendiskusikan hal-hal yang terjadi di sekitarku", category: "S" as const, order: 36 },
    { id: "q37", text: "Aku suka menggambar", category: "A" as const, order: 37 },
    { id: "q38", text: "Aku suka berkegiatan di dalam ruangan dengan meja-kursi", category: "C" as const, order: 38 },
    { id: "q39", text: "Aku suka berbicara di depan umum", category: "E" as const, order: 39 },
    { id: "q40", text: "Aku suka menghitung", category: "I" as const, order: 40 },
    { id: "q41", text: "Aku suka berkegiatan di luar ruangan", category: "R" as const, order: 41 },
    { id: "q42", text: "Aku suka menolong orang", category: "S" as const, order: 42 },
  ];

  for (const q of questions) {
    await prisma.riasecQuestion.upsert({
      where: { id: q.id },
      create: q,
      update: { text: q.text, order: q.order, isActive: true },
    });
  }
  console.log(`[seed] RiasecQuestion siap: ${questions.length} soal`);
}
async function main() {
  console.log("[seed] Memulai seeding database.");

  await seedRoles();
  await seedHouses();
  const skills = await seedSkills();

  await seedUniversity();
  await seedScholarship();
  await seedJob();
  await seedCourses(skills.map((s) => s.id));
  await seedRiasecQuestions();

  console.log("[seed] Seeding selesai dengan sukses!");
}

main()
  .catch((error) => {
    console.error("[seed] Gagal menjalankan seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
