import { BackendResponse } from '@/types/backend';

// ─── MOCK BACKEND DATA: AI-Generated User Progress, Houses & Career Tracks ───
export const mockBackendData: BackendResponse = {
  user: {
    userId: 'user-tukiman-001',
    totalXP: 2450,
    level: 7,
    claimedSBTs: [
      {
        id: 'sbt-html-basics',
        name: 'HTML Basics Master',
        description: 'Completed House of Tech — HTML Module',
        icon: '🛡️',
        claimedAt: '2026-09-05',
        isClaimed: true,
      },
      {
        id: 'sbt-python-logic',
        name: 'Python Logic Core',
        description: 'Completed Algorithm Fundamentals',
        icon: '⚔️',
        claimedAt: '2026-09-10',
        isClaimed: true,
      },
    ],
    activeSBT: {
      id: 'sbt-fullstack-journey',
      name: 'Full-Stack Developer Path',
      progress: 43,
      icon: '🚀',
      nextMilestone: 'React Mastery',
    },
    dailyBounty: {
      id: 'bounty-daily-001',
      title: 'Daily Skill Builder',
      description: 'Complete 1 quiz module to earn +150 XP',
      xpReward: 150,
      icon: '🎁',
      isClaimed: false,
      nextClaimAt: '2026-09-14',
    },
  },

  houses: [
    // ═══════════════════════════════════════════════════
    // 1. HOUSE OF EDUCATION — Ilmu Pendidikan
    // ═══════════════════════════════════════════════════
    {
      id: 'house-education',
      title: 'House of Education',
      description: 'Teori Pendidikan, Psikologi Belajar & Teknologi Pembelajaran',
      icon: '🎓',
      status: 'active',
      houseNumber: 1,
      gradient: 'from-yellow-400 via-amber-400 to-orange-400',
      progress: 0,
      skillsOverview: ['Manajemen Kelas', 'Desain Kurikulum', 'Psikologi Anak', 'Public Speaking', 'Teknologi EdTech'],
      idealFor: ['Senang mengajar & berbagi ilmu', 'Sabar dan empatik', 'Visioner dalam mencerdaskan bangsa', 'Suka berinteraksi dengan orang lain'],
      stages: [
        {
          id: 'module-education-1',
          name: 'Modul: Teori Pendidikan & Kurikulum',
          description: 'Filosofi pendidikan, pengembangan kurikulum, dan pelatihan guru.',
          isCompleted: false,
          duration: '6 Levels',
          contentType: 'material',
          chapters: [
            { id: 'module-education-1-bab-1', name: 'BAB 1: Filosofi & Sejarah Pendidikan', duration: '6 Levels' },
            { id: 'module-education-1-bab-2', name: 'BAB 2: Pengembangan Kurikulum', duration: '6 Levels' }
          ]
        },
        {
          id: 'module-education-2',
          name: 'Modul: Psikologi Pembelajaran',
          description: 'Teori belajar, motivasi, dan perkembangan kognitif peserta didik.',
          isCompleted: false,
          duration: '6 Levels',
          contentType: 'lab',
          chapters: [
            { id: 'module-education-2-bab-1', name: 'BAB 1: Teori Belajar & Motivasi', duration: '6 Levels' },
            { id: 'module-education-2-bab-2', name: 'BAB 2: Perkembangan Kognitif Peserta Didik', duration: '6 Levels' }
          ]
        },
        {
          id: 'module-education-3',
          name: 'Modul: Teknologi Pendidikan',
          description: 'E-learning, media pembelajaran digital, dan inovasi EdTech.',
          isCompleted: false,
          duration: '6 Levels',
          contentType: 'project',
          chapters: [
            { id: 'module-education-3-bab-1', name: 'BAB 1: Pengantar E-Learning & Media Digital', duration: '6 Levels' },
            { id: 'module-education-3-bab-2', name: 'BAB 2: Inovasi EdTech & Platform LMS', duration: '6 Levels' }
          ]
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // 2. HOUSE OF ARTS & HUMANITIES — Seni & Humaniora
    // ═══════════════════════════════════════════════════
    {
      id: 'house-arts',
      title: 'House of Arts & Humanities',
      description: 'Seni Rupa, Bahasa, Sastra, Sejarah & Filsafat',
      icon: '🎨',
      status: 'active',
      houseNumber: 2,
      gradient: 'from-pink-400 via-rose-400 to-purple-400',
      progress: 0,
      skillsOverview: ['Berpikir Kritis', 'Kreativitas Visual', 'Analisis Sejarah', 'Komunikasi Tulisan', 'Pemecahan Masalah Abstrak'],
      idealFor: ['Imajinatif & out of the box', 'Suka mengekspresikan diri lewat karya', 'Tertarik pada budaya dan sejarah', 'Senang menganalisis teks atau visual'],
      stages: [
        {
          id: 'module-arts-1',
          name: 'Modul: Seni Rupa & Desain Kreatif',
          description: 'Prinsip desain, tipografi, seni visual, dan fotografi.',
          isCompleted: false,
          duration: '6 Levels',
          contentType: 'material',
          chapters: [
            { id: 'module-arts-1-bab-1', name: 'BAB 1: Prinsip Desain & Elemen Visual', duration: '6 Levels' },
            { id: 'module-arts-1-bab-2', name: 'BAB 2: Tipografi, Fotografi & Portofolio', duration: '6 Levels' }
          ]
        },
        {
          id: 'module-arts-2',
          name: 'Modul: Bahasa & Sastra',
          description: 'Linguistik, analisis sastra, penulisan kreatif, dan retorika.',
          isCompleted: false,
          duration: '6 Levels',
          contentType: 'lab',
          chapters: [
            { id: 'module-arts-2-bab-1', name: 'BAB 1: Dasar Linguistik & Struktur Bahasa', duration: '6 Levels' },
            { id: 'module-arts-2-bab-2', name: 'BAB 2: Analisis Sastra & Penulisan Kreatif', duration: '6 Levels' }
          ]
        },
        {
          id: 'module-arts-3',
          name: 'Modul: Sejarah & Filsafat',
          description: 'Sejarah peradaban, filsafat barat dan timur, serta teologi.',
          isCompleted: false,
          duration: '6 Levels',
          contentType: 'project',
          chapters: [
            { id: 'module-arts-3-bab-1', name: 'BAB 1: Sejarah Peradaban Dunia', duration: '6 Levels' },
            { id: 'module-arts-3-bab-2', name: 'BAB 2: Filsafat Barat, Timur & Teologi', duration: '6 Levels' }
          ]
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // 3. HOUSE OF SOCIAL SCIENCES — Ilmu Sosial & Jurnalisme
    // ═══════════════════════════════════════════════════
    {
      id: 'house-social',
      title: 'House of Social Sciences',
      description: 'Sosiologi, Ilmu Politik, Jurnalisme & Komunikasi',
      icon: '🌐',
      status: 'active',
      houseNumber: 3,
      gradient: 'from-teal-400 via-cyan-400 to-sky-400',
      progress: 0,
      skillsOverview: ['Riset Sosial', 'Public Relations', 'Analisis Kebijakan', 'Jurnalisme Investigasi', 'Negosiasi'],
      idealFor: ['Peduli pada isu-isu sosial', 'Kritis terhadap berita dan media', 'Pintar bersosialisasi dan diplomasi', 'Senang mengamati perilaku manusia'],
      stages: [
        {
          id: 'module-social-1',
          name: 'Modul: Sosiologi & Antropologi',
          description: 'Struktur sosial, budaya, dinamika masyarakat, dan etnografi.',
          isCompleted: false,
          duration: '6 Levels',
          contentType: 'material',
          chapters: [
            { id: 'module-social-1-bab-1', name: 'BAB 1: Struktur Sosial & Budaya', duration: '6 Levels' },
            { id: 'module-social-1-bab-2', name: 'BAB 2: Dinamika Masyarakat & Etnografi', duration: '6 Levels' }
          ]
        },
        {
          id: 'module-social-2',
          name: 'Modul: Ilmu Politik & Hub. Internasional',
          description: 'Sistem pemerintahan, diplomasi, hukum internasional, dan geopolitik.',
          isCompleted: false,
          duration: '6 Levels',
          contentType: 'lab',
          chapters: [
            { id: 'module-social-2-bab-1', name: 'BAB 1: Sistem Pemerintahan & Demokrasi', duration: '6 Levels' },
            { id: 'module-social-2-bab-2', name: 'BAB 2: Diplomasi & Hukum Internasional', duration: '6 Levels' }
          ]
        },
        {
          id: 'module-social-3',
          name: 'Modul: Jurnalisme & Ilmu Komunikasi',
          description: 'Jurnalisme investigatif, media sosial, PR, dan ilmu penyiaran.',
          isCompleted: false,
          duration: '6 Levels',
          contentType: 'project',
          chapters: [
            { id: 'module-social-3-bab-1', name: 'BAB 1: Dasar Jurnalisme & Etika Media', duration: '6 Levels' },
            { id: 'module-social-3-bab-2', name: 'BAB 2: Komunikasi Digital & Public Relations', duration: '6 Levels' }
          ]
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // 4. HOUSE OF BUSINESS & LAW — Bisnis & Hukum
    // ═══════════════════════════════════════════════════
    {
      id: 'house-business',
      title: 'House of Business & Law',
      description: 'Akuntansi, Manajemen, Pemasaran, Kewirausahaan & Hukum',
      icon: '⚖️',
      status: 'active',
      houseNumber: 4,
      gradient: 'from-emerald-400 via-green-400 to-teal-500',
      progress: 0,
      skillsOverview: ['Analisis Keuangan', 'Strategi Marketing', 'Manajemen Risiko', 'Hukum Perdata', 'Leadership'],
      idealFor: ['Suka tantangan & kompetisi', 'Pintar mengelola uang', 'Punya jiwa kepemimpinan', 'Tertarik membangun bisnis sendiri'],
      stages: [
        {
          id: 'module-business-1',
          name: 'Modul: Akuntansi & Manajemen Keuangan',
          description: 'Laporan keuangan, akuntansi biaya, analisis investasi, dan perpajakan.',
          isCompleted: false,
          duration: '6 Levels',
          contentType: 'material',
          chapters: [
            { id: 'module-business-1-bab-1', name: 'BAB 1: Dasar Akuntansi & Laporan Keuangan', duration: '6 Levels' },
            { id: 'module-business-1-bab-2', name: 'BAB 2: Analisis Investasi & Perpajakan', duration: '6 Levels' }
          ]
        },
        {
          id: 'module-business-2',
          name: 'Modul: Pemasaran & Kewirausahaan',
          description: 'Strategi marketing digital, branding, business plan, dan startup.',
          isCompleted: false,
          duration: '6 Levels',
          contentType: 'lab',
          chapters: [
            { id: 'module-business-2-bab-1', name: 'BAB 1: Strategi Marketing & Branding', duration: '6 Levels' },
            { id: 'module-business-2-bab-2', name: 'BAB 2: Business Plan & Startup', duration: '6 Levels' }
          ]
        },
        {
          id: 'module-business-3',
          name: 'Modul: Hukum & Tata Negara',
          description: 'Hukum perdata, hukum pidana, hukum internasional, dan konstitusi.',
          isCompleted: false,
          duration: '6 Levels',
          contentType: 'project',
          chapters: [
            { id: 'module-business-3-bab-1', name: 'BAB 1: Hukum Perdata & Pidana', duration: '6 Levels' },
            { id: 'module-business-3-bab-2', name: 'BAB 2: Hukum Internasional & Konstitusi', duration: '6 Levels' }
          ]
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // 5. HOUSE OF NATURAL SCIENCES — Ilmu Alam, Mat & Statistik
    // ═══════════════════════════════════════════════════
    {
      id: 'house-science',
      title: 'House of Natural Sciences',
      description: 'Fisika, Kimia, Biologi, Matematika & Statistik',
      icon: '🔬',
      status: 'active',
      houseNumber: 5,
      gradient: 'from-violet-400 via-purple-400 to-indigo-400',
      progress: 0,
      skillsOverview: ['Analisis Data', 'Metode Ilmiah', 'Pemodelan Matematika', 'Riset Laboratorium', 'Observasi Alam'],
      idealFor: ['Sangat logis dan analitis', 'Suka eksperimen', 'Selalu penasaran dengan cara alam semesta bekerja', 'Teliti dan sabar terhadap data'],
      stages: [
        {
          id: 'module-science-1',
          name: 'Modul: Fisika & Kimia',
          description: 'Mekanika, termodinamika, kimia organik, dan reaksi kimia.',
          isCompleted: false,
          duration: '6 Levels',
          contentType: 'material',
          chapters: [
            { id: 'module-science-1-bab-1', name: 'BAB 1: Mekanika & Termodinamika', duration: '6 Levels' },
            { id: 'module-science-1-bab-2', name: 'BAB 2: Kimia Organik & Reaksi Kimia', duration: '6 Levels' }
          ]
        },
        {
          id: 'module-science-2',
          name: 'Modul: Biologi & Ilmu Bumi',
          description: 'Sel, ekosistem, genetika, geologi, dan ilmu lingkungan.',
          isCompleted: false,
          duration: '6 Levels',
          contentType: 'lab',
          chapters: [
            { id: 'module-science-2-bab-1', name: 'BAB 1: Sel, Genetika & Ekosistem', duration: '6 Levels' },
            { id: 'module-science-2-bab-2', name: 'BAB 2: Geologi & Ilmu Lingkungan', duration: '6 Levels' }
          ]
        },
        {
          id: 'module-science-3',
          name: 'Modul: Matematika & Statistik Terapan',
          description: 'Kalkulus, aljabar linier, probabilitas, dan analisis statistik.',
          isCompleted: false,
          duration: '6 Levels',
          contentType: 'project',
          chapters: [
            { id: 'module-science-3-bab-1', name: 'BAB 1: Kalkulus & Aljabar Linier', duration: '6 Levels' },
            { id: 'module-science-3-bab-2', name: 'BAB 2: Probabilitas & Analisis Statistik', duration: '6 Levels' }
          ]
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // 6. HOUSE OF ICT — Teknologi Informasi & Komunikasi
    // ═══════════════════════════════════════════════════
    {
      id: 'house-ict',
      title: 'House of ICT',
      description: 'Pemrograman, Software Dev, Keamanan Siber & AI/ML',
      icon: '💻',
      status: 'active',
      houseNumber: 6,
      gradient: 'from-blue-500 via-indigo-500 to-sky-500',
      progress: 0,
      skillsOverview: ['Coding & Programming', 'Software Engineering', 'Cybersecurity', 'AI & Data Science', 'System Architecture'],
      idealFor: ['Suka memecahkan teka-teki logika', 'Tertarik dengan gadget dan software baru', 'Senang bekerja di depan komputer', 'Inovatif dan adaptif terhadap teknologi'],
      stages: [
        {
          // Keep original ID for backward compatibility (progress not lost)
          id: 'module-html-css',
          name: 'Modul: Pemrograman & Software Development',
          description: 'HTML, CSS, JavaScript, dan dasar pengembangan perangkat lunak.',
          isCompleted: false,
          duration: '6 Levels',
          contentType: 'material',
          chapters: [
            { id: 'module-html-css-bab-1', name: 'BAB 1: Struktur HTML & Semantic Web', duration: '6 Levels' },
            { id: 'module-html-css-bab-2', name: 'BAB 2: Styling dengan CSS & Responsive Design', duration: '6 Levels' }
          ]
        },
        {
          id: 'module-ict-security',
          name: 'Modul: Keamanan Siber',
          description: 'Ethical hacking, kriptografi, keamanan jaringan, dan forensik digital.',
          isCompleted: false,
          duration: '6 Levels',
          contentType: 'lab',
          chapters: [
            { id: 'module-ict-security-bab-1', name: 'BAB 1: Pengantar Ethical Hacking', duration: '6 Levels' },
            { id: 'module-ict-security-bab-2', name: 'BAB 2: Kriptografi & Forensik Digital', duration: '6 Levels' }
          ]
        },
        {
          id: 'module-ict-ai',
          name: 'Modul: Kecerdasan Buatan & Machine Learning',
          description: 'Algoritma ML, neural network, pengolahan data, dan Python AI.',
          isCompleted: false,
          duration: '6 Levels',
          contentType: 'project',
          chapters: [
            { id: 'module-ict-ai-bab-1', name: 'BAB 1: Algoritma ML & Neural Network', duration: '6 Levels' },
            { id: 'module-ict-ai-bab-2', name: 'BAB 2: Pengolahan Data & Python AI', duration: '6 Levels' }
          ]
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // 7. HOUSE OF ENGINEERING — Teknik & Rekayasa
    // ═══════════════════════════════════════════════════
    {
      id: 'house-engineering',
      title: 'House of Engineering',
      description: 'Teknik Sipil, Teknik Mesin, Elektro & Konstruksi',
      icon: '⚙️',
      status: 'active',
      houseNumber: 7,
      gradient: 'from-amber-400 via-orange-400 to-amber-500',
      progress: 0,
      skillsOverview: ['Desain CAD', 'Mekanika & Termodinamika', 'Manajemen Proyek', 'Sirkuit Elektronik', 'K3 (Keselamatan Kerja)'],
      idealFor: ['Suka membongkar dan merakit barang', 'Tertarik pada mesin dan struktur', 'Praktis dan problem solver', 'Mampu membayangkan objek 3D'],
      stages: [
        {
          id: 'module-engineering-1',
          name: 'Modul: Teknik Sipil & Arsitektur',
          description: 'Struktur bangunan, material konstruksi, dan perencanaan wilayah.',
          isCompleted: false,
          duration: '6 Levels',
          contentType: 'material',
          chapters: [
            { id: 'module-engineering-1-bab-1', name: 'BAB 1: Material Konstruksi & Struktur', duration: '6 Levels' },
            { id: 'module-engineering-1-bab-2', name: 'BAB 2: Perencanaan Wilayah & Arsitektur', duration: '6 Levels' }
          ]
        },
        {
          id: 'module-engineering-2',
          name: 'Modul: Teknik Mesin & Elektro',
          description: 'Termodinamika mesin, rangkaian listrik, dan sistem kontrol.',
          isCompleted: false,
          duration: '6 Levels',
          contentType: 'lab',
          chapters: [
            { id: 'module-engineering-2-bab-1', name: 'BAB 1: Rangkaian Listrik & Elektronika', duration: '6 Levels' },
            { id: 'module-engineering-2-bab-2', name: 'BAB 2: Termodinamika Mesin & Kontrol', duration: '6 Levels' }
          ]
        },
        {
          id: 'module-engineering-3',
          name: 'Modul: Manufaktur & Konstruksi',
          description: 'Proses produksi, manajemen proyek konstruksi, dan K3.',
          isCompleted: false,
          duration: '6 Levels',
          contentType: 'project',
          chapters: [
            { id: 'module-engineering-3-bab-1', name: 'BAB 1: Proses Produksi & Manufaktur', duration: '6 Levels' },
            { id: 'module-engineering-3-bab-2', name: 'BAB 2: Manajemen Proyek & K3', duration: '6 Levels' }
          ]
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // 8. HOUSE OF AGRICULTURE — Pertanian, Kehutanan & Peternakan
    // ═══════════════════════════════════════════════════
    {
      id: 'house-agriculture',
      title: 'House of Agriculture',
      description: 'Agronomi, Peternakan, Kehutanan & Perikanan',
      icon: '🌱',
      status: 'active',
      houseNumber: 8,
      gradient: 'from-lime-400 via-green-500 to-emerald-500',
      progress: 0,
      skillsOverview: ['Manajemen Lahan', 'Kesehatan Hewan', 'Agronomi', 'Ekologi Konservasi', 'Bioteknologi Pertanian'],
      idealFor: ['Cinta alam dan lingkungan', 'Suka bekerja di luar ruangan', 'Peduli pada ketahanan pangan', 'Senang memelihara tanaman/hewan'],
      stages: [
        {
          id: 'module-agriculture-1',
          name: 'Modul: Budidaya Tanaman & Agronomi',
          description: 'Ilmu tanah, teknik bercocok tanam, dan pertanian berkelanjutan.',
          isCompleted: false,
          duration: '6 Levels',
          contentType: 'material',
          chapters: [
            { id: 'module-agriculture-1-bab-1', name: 'BAB 1: Ilmu Tanah & Teknik Bercocok Tanam', duration: '6 Levels' },
            { id: 'module-agriculture-1-bab-2', name: 'BAB 2: Pertanian Berkelanjutan', duration: '6 Levels' }
          ]
        },
        {
          id: 'module-agriculture-2',
          name: 'Modul: Peternakan & Kesehatan Hewan',
          description: 'Budidaya ternak, nutrisi hewan, dan kedokteran hewan dasar.',
          isCompleted: false,
          duration: '6 Levels',
          contentType: 'lab',
          chapters: [
            { id: 'module-agriculture-2-bab-1', name: 'BAB 1: Budidaya Ternak & Nutrisi Hewan', duration: '6 Levels' },
            { id: 'module-agriculture-2-bab-2', name: 'BAB 2: Kedokteran Hewan Dasar', duration: '6 Levels' }
          ]
        },
        {
          id: 'module-agriculture-3',
          name: 'Modul: Kehutanan & Perikanan',
          description: 'Manajemen hutan, budidaya ikan/udang, dan ekologi pesisir.',
          isCompleted: false,
          duration: '6 Levels',
          contentType: 'project',
          chapters: [
            { id: 'module-agriculture-3-bab-1', name: 'BAB 1: Manajemen Hutan & Ekologi', duration: '6 Levels' },
            { id: 'module-agriculture-3-bab-2', name: 'BAB 2: Budidaya Perikanan & Pesisir', duration: '6 Levels' }
          ]
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // 9. HOUSE OF HEALTH & WELFARE — Kesehatan & Kesejahteraan
    // ═══════════════════════════════════════════════════
    {
      id: 'house-health',
      title: 'House of Health & Welfare',
      description: 'Kedokteran, Keperawatan, Farmasi & Pekerjaan Sosial',
      icon: '🏥',
      status: 'active',
      houseNumber: 9,
      gradient: 'from-rose-400 via-red-400 to-pink-500',
      progress: 0,
      skillsOverview: ['Diagnosis Klinis', 'Asuhan Keperawatan', 'Farmakologi', 'Konseling Psikologi', 'Manajemen Kesehatan'],
      idealFor: ['Sangat peduli dan ingin membantu orang sakit', 'Tahan banting menghadapi situasi darurat', 'Teliti dalam memberikan obat', 'Punya empati tinggi'],
      stages: [
        {
          id: 'module-health-1',
          name: 'Modul: Kedokteran & Ilmu Kesehatan',
          description: 'Anatomi, fisiologi, patologi, dan ilmu kedokteran dasar.',
          isCompleted: false,
          duration: '6 Levels',
          contentType: 'material',
          chapters: [
            { id: 'module-health-1-bab-1', name: 'BAB 1: Anatomi & Fisiologi Tubuh', duration: '6 Levels' },
            { id: 'module-health-1-bab-2', name: 'BAB 2: Patologi & Ilmu Kedokteran Dasar', duration: '6 Levels' }
          ]
        },
        {
          id: 'module-health-2',
          name: 'Modul: Keperawatan & Farmasi',
          description: 'Asuhan keperawatan, farmakologi, dan manajemen obat.',
          isCompleted: false,
          duration: '6 Levels',
          contentType: 'lab',
          chapters: [
            { id: 'module-health-2-bab-1', name: 'BAB 1: Asuhan Keperawatan & Prosedur Klinis', duration: '6 Levels' },
            { id: 'module-health-2-bab-2', name: 'BAB 2: Farmakologi & Manajemen Obat', duration: '6 Levels' }
          ]
        },
        {
          id: 'module-health-3',
          name: 'Modul: Pekerjaan Sosial & Konseling',
          description: 'Psikologi klinis, konseling, dan intervensi sosial.',
          isCompleted: false,
          duration: '6 Levels',
          contentType: 'project',
          chapters: [
            { id: 'module-health-3-bab-1', name: 'BAB 1: Psikologi Klinis & Konseling', duration: '6 Levels' },
            { id: 'module-health-3-bab-2', name: 'BAB 2: Intervensi Sosial & Advokasi', duration: '6 Levels' }
          ]
        },
      ],
    },

    // ═══════════════════════════════════════════════════
    // 10. HOUSE OF SERVICES — Jasa & Layanan
    // ═══════════════════════════════════════════════════
    {
      id: 'house-services',
      title: 'House of Services',
      description: 'Perhotelan, Kuliner, Pariwisata, Olahraga & Logistik',
      icon: '🏨',
      status: 'active',
      houseNumber: 10,
      gradient: 'from-orange-400 via-amber-500 to-yellow-500',
      progress: 0,
      skillsOverview: ['Hospitality & Pelayanan', 'Culinary Arts', 'Event Organizing', 'Manajemen Logistik', 'Ilmu Olahraga'],
      idealFor: ['Ramah dan suka melayani orang lain', 'Suka traveling atau memasak', 'Pandai mengatur acara', 'Aktif dan dinamis'],
      stages: [
        {
          id: 'module-services-1',
          name: 'Modul: Perhotelan & Pariwisata',
          description: 'Manajemen hotel, hospitality, destinasi wisata, dan event organizer.',
          isCompleted: false,
          duration: '6 Levels',
          contentType: 'material',
          chapters: [
            { id: 'module-services-1-bab-1', name: 'BAB 1: Manajemen Hotel & Hospitality', duration: '6 Levels' },
            { id: 'module-services-1-bab-2', name: 'BAB 2: Destinasi Wisata & Event Organizer', duration: '6 Levels' }
          ]
        },
        {
          id: 'module-services-2',
          name: 'Modul: Kuliner & Tata Boga',
          description: 'Teknik memasak, pastry, food safety, dan manajemen restoran.',
          isCompleted: false,
          duration: '6 Levels',
          contentType: 'lab',
          chapters: [
            { id: 'module-services-2-bab-1', name: 'BAB 1: Teknik Memasak & Food Safety', duration: '6 Levels' },
            { id: 'module-services-2-bab-2', name: 'BAB 2: Pastry & Manajemen Restoran', duration: '6 Levels' }
          ]
        },
        {
          id: 'module-services-3',
          name: 'Modul: Logistik, Olahraga & K3',
          description: 'Manajemen rantai pasok, ilmu olahraga, dan keselamatan kerja.',
          isCompleted: false,
          duration: '6 Levels',
          contentType: 'project',
          chapters: [
            { id: 'module-services-3-bab-1', name: 'BAB 1: Manajemen Rantai Pasok & Logistik', duration: '6 Levels' },
            { id: 'module-services-3-bab-2', name: 'BAB 2: Ilmu Olahraga & Keselamatan Kerja', duration: '6 Levels' }
          ]
        },
      ],
    },
  ],

  careerTracks: [
    {
      id: 'track-fullstack-web3',
      title: 'Full-Stack Web3 Developer',
      description: 'Master blockchain development with Solidity, Web3.js, and decentralized applications.',
      techTags: ['💎 Solidity Smart Contracts', '🔗 Blockchain Architecture', '⚙️ Web3.js Integration'],
      iconType: '⛓️',
      category: 'Blockchain',
      difficulty: 'intermediate',
      estimatedWeeks: 16,
    },
    {
      id: 'track-mobile-native',
      title: 'Mobile App Developer (Native)',
      description: 'Build high-performance iOS and Android apps with Swift and Kotlin.',
      techTags: ['🍎 Swift/iOS Development', '🤖 Kotlin/Android', '📱 Native Performance'],
      iconType: '📱',
      category: 'Mobile',
      difficulty: 'intermediate',
      estimatedWeeks: 14,
    },
    {
      id: 'track-ai-ml-engineer',
      title: 'AI/ML Engineer',
      description: 'Develop machine learning models and deploy AI systems at scale.',
      techTags: ['🧠 TensorFlow/PyTorch', '📊 Data Engineering', '🤖 LLM Fine-tuning'],
      iconType: '🤖',
      category: 'Artificial Intelligence',
      difficulty: 'advanced',
      estimatedWeeks: 20,
    },
    {
      id: 'track-cloud-devops',
      title: 'Cloud & DevOps Engineer',
      description: 'Master cloud infrastructure, containerization, and CI/CD pipelines.',
      techTags: ['☁️ AWS/GCP/Azure', '🐳 Docker & Kubernetes', '🔄 CI/CD Automation'],
      iconType: '☁️',
      category: 'Infrastructure',
      difficulty: 'intermediate',
      estimatedWeeks: 12,
    },
    {
      id: 'track-game-dev',
      title: 'Game Developer',
      description: 'Create 2D/3D games with Unity and Unreal Engine for multiple platforms.',
      techTags: ['🎮 Unity 3D Engine', '🎬 Unreal Engine 5', '🎨 Game Design'],
      iconType: '🎮',
      category: 'Gaming',
      difficulty: 'intermediate',
      estimatedWeeks: 18,
    },
    {
      id: 'track-fullstack-web-mern',
      title: 'Full-Stack Web Developer (MERN)',
      description: 'Build modern web applications with MongoDB, Express, React, and Node.js.',
      techTags: ['⚛️ React & Next.js', '🟩 Node.js/Express', '🍃 MongoDB Atlas'],
      iconType: '🌐',
      category: 'Web Development',
      difficulty: 'beginner',
      estimatedWeeks: 12,
    },
    {
      id: 'track-ux-design-systems',
      title: 'UX Designer & Design Systems',
      description: 'Master user-centered design and build scalable design systems.',
      techTags: ['🎨 Figma Mastery', '♿ Accessibility (WCAG)', '🎯 Design Thinking'],
      iconType: '🎨',
      category: 'Design',
      difficulty: 'beginner',
      estimatedWeeks: 10,
    },
    {
      id: 'track-backend-scalable',
      title: 'Scalable Backend Architect',
      description: 'Design and build high-performance backend systems for millions of users.',
      techTags: ['🗄️ Database Design', '⚡ System Architecture', '🔄 Microservices'],
      iconType: '🏛️',
      category: 'Backend',
      difficulty: 'advanced',
      estimatedWeeks: 16,
    },
    {
      id: 'track-cybersecurity-pro',
      title: 'Cybersecurity Professional',
      description: 'Protect systems and data with advanced security techniques and tools.',
      techTags: ['🔒 Penetration Testing', '🛡️ Network Security', '🚨 Incident Response'],
      iconType: '🔐',
      category: 'Security',
      difficulty: 'advanced',
      estimatedWeeks: 14,
    },
  ],

  metadata: {
    riasecScore: 'Investigative + Realistic',
    primaryTrack: 'Full-Stack Web Developer',
    targetCountry: 'Singapore',
  },
};
