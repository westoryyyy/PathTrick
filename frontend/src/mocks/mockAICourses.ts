export type QuizQuestion = {
  id: string;
  question: string;
  choices: string[];
  correctIndex: number;
};

export type MaterialBlock = {
  id: string;
  label: string;
  title: string;
  body: string;
  points?: string[];
};

export type LabConfig = {
  id: string;
  title: string;
  description: string;
  task: string;
  initialCode: string;
};

export type MiniProject = {
  id: string;
  title: string;
  prompt: string;
  requiresUpload: boolean;
  aiRubric: string[];
};

export type House = {
  id: string;
  title: string;
  shortDescription: string;
  materi?: string;
  materialBlocks?: MaterialBlock[];
  lab?: LabConfig;
  quiz?: QuizQuestion[];
  miniProject?: MiniProject;
};

export const HOUSE_1: House = {
  id: 'house-1',
  title: 'House 1: HTML - Struktur Rumah Website',
  shortDescription: 'Bangun kerangka halaman web dengan tag dasar, struktur semantik, dan latihan portfolio sederhana.',
  materi: `Analogi Utama: "Bayangkan kamu sedang membangun sebuah rumah. HTML (HyperText Markup Language) adalah batu bata, semen, dan kerangka besi dari rumah tersebut. Ia yang menentukan di mana letak kamar, pintu, dan jendela. Nanti, CSS adalah cat dan dekorasinya, sedangkan JavaScript adalah listrik dan air yang membuat rumah itu hidup."

Konsep Inti: Jelaskan Tag dasar (<h1> sampai <h6>, <p>, <a>, <img>). Gunakan analogi bahwa "Tag" itu seperti label pada kardus pindahan—memberi tahu *browser* apa isi di dalamnya.

Semantic HTML: Jelaskan pentingnya <header>, <main>, <footer> agar website tidak cuma bisa dibaca manusia, tapi juga dimengerti oleh mesin pencari (SEO).`,
  materialBlocks: [
    {
      id: 'analogi-utama',
      label: 'Analogi Utama',
      title: 'HTML adalah kerangka rumah digital',
      body: 'Bayangkan kamu sedang membangun sebuah rumah. HTML (HyperText Markup Language) adalah batu bata, semen, dan kerangka besi dari rumah tersebut. Ia yang menentukan di mana letak kamar, pintu, dan jendela. Nanti, CSS adalah cat dan dekorasinya, sedangkan JavaScript adalah listrik dan air yang membuat rumah itu hidup.',
    },
    {
      id: 'konsep-inti',
      label: 'Konsep Inti',
      title: 'Tag seperti label pada kardus pindahan',
      body: 'Jelaskan Tag dasar (<h1> sampai <h6>, <p>, <a>, <img>). Gunakan analogi bahwa "Tag" itu seperti label pada kardus pindahan—memberi tahu *browser* apa isi di dalamnya. Kalau kardus bertuliskan "buku", orang tahu isinya buku. Kalau HTML memakai <h1>, browser tahu itu judul utama. Kalau memakai <p>, browser tahu itu paragraf.',
      points: [
        '<h1> sampai <h6> dipakai untuk heading, dari judul paling penting sampai subjudul yang lebih kecil.',
        '<p> dipakai untuk paragraf, yaitu blok teks yang menjelaskan sebuah ide.',
        '<a> dipakai untuk link, seperti pintu yang mengantar pengunjung ke ruangan atau alamat lain.',
        '<img> dipakai untuk gambar, seperti memasang foto atau ilustrasi di dinding halaman.',
      ],
    },
    {
      id: 'semantic-html',
      label: 'Semantic HTML',
      title: 'Struktur yang dipahami manusia dan mesin',
      body: 'Jelaskan pentingnya <header>, <main>, <footer> agar website tidak cuma bisa dibaca manusia, tapi juga dimengerti oleh mesin pencari (SEO). <header> memberi sinyal area pembuka, <main> menunjukkan konten utama, dan <footer> menandai bagian penutup. Dibanding memakai <div> terus-menerus, tag semantik membuat peta rumah website jauh lebih jelas.',
      points: [
        '<header> biasanya memuat judul halaman, logo, atau navigasi awal.',
        '<main> memuat konten utama yang paling penting pada halaman.',
        '<footer> memuat informasi penutup seperti kontak, hak cipta, atau link tambahan.',
      ],
    },
  ],
  lab: {
    id: 'lab-html-bio-tags',
    title: 'Live Lab: Rapikan Bio Personal',
    description: 'Kode awal berisi teks bio yang masih berantakan dan belum diberi struktur HTML yang benar.',
    task: 'Ask the user to wrap the text in the correct <h1>, <p>, and <ul> tags and see the result instantly in the iframe.',
    initialCode: `nama saya rania putri
saya sedang belajar web development karena ingin membuat portfolio online untuk mendaftar magang.
skill saya
html dasar
menulis konten
desain sederhana`,
  },
  quiz: [
    {
      id: 'h1-q1',
      question: 'Kalau sebuah website adalah rumah, peran HTML adalah sebagai apa?',
      choices: [
        'Cat dan dekorasi ruangan',
        'Kerangka dan struktur bangunan',
        'Listrik dan air yang membuat rumah hidup',
        'Alamat rumah di peta',
      ],
      correctIndex: 1,
    },
    {
      id: 'h1-q2',
      question: 'Tag mana yang tepat digunakan untuk membuat paragraf?',
      choices: ['<h1>', '<p>', '<img>', '<footer>'],
      correctIndex: 1,
    },
    {
      id: 'h1-q3',
      question: 'Kenapa kita sebaiknya menggunakan tag <main> dan <footer> daripada cuma pakai <div> terus-menerus?',
      choices: [
        'Agar warna halaman otomatis lebih bagus',
        'Agar struktur kode lebih bermakna dan ramah mesin pencari / SEO',
        'Agar JavaScript tidak diperlukan lagi',
        'Agar semua gambar otomatis punya alt text',
      ],
      correctIndex: 1,
    },
  ],
  miniProject: {
    id: 'h1-portfolio-structure',
    title: 'Mini Project: Struktur Portfolio HTML',
    prompt: 'Buatlah struktur HTML untuk halaman Portofolio sederhana. Harus memuat 1 Heading utama, 1 Paragraf deskripsi diri, dan 1 Unordered List berisi 3 keahlian (skills).',
    requiresUpload: false,
    aiRubric: [
      'AI must check if <h1>, <p>, <ul>, and <li> exist and are properly closed.',
      'The <li> check should confirm the portfolio includes at least 3 skills.',
    ],
  },
};

export const HOUSE_2: House = {
  id: 'house-2',
  title: 'House 2: Tags & Elements - Teks dan Tata Letak',
  shortDescription: 'Pelajari perbedaan elemen block vs inline, hierarki heading, dan cara membuat list (daftar) pada halaman web.',
  materi: `Analogi Utama (Block vs Inline): "Bayangin lagi nongkrong di kantin sekolah. Elemen 'Block' itu kayak meja panjang yang dibooking buat satu ekskul—makan tempat dari ujung ke ujung, kelompok lain harus pindah ke baris bawahnya. Nah, kalau elemen 'Inline', itu kayak kursi-kursi biasa. Temen-temen kamu bisa duduk jejeran berdampingan selama masih ada ruang kosong."

Konsep Inti 1 (Heading & Hierarchy): Jelaskan <h1> sampai <h6>. Aturan emasnya: Jangan pernah lompat level heading (misal dari <h2> langsung ke <h4>). Analogi: Kayak bikin struktur proposal pensi: Judul Proposal (<h1>), Latar Belakang (<h2>), dan Tujuan (<h3>). Kalau urutannya lompat-lompat, yang baca bakal bingung. Ini juga penting banget buat Screen Readers (aksesibilitas).

Konsep Inti 2 (Lists & Text Formatting): Jelaskan bedanya <ul> (Unordered/Bulleted List) dan <ol> (Ordered/Numbered List), serta tag pelengkap seperti <strong> (tebal) dan <em> (miring).`,
  materialBlocks: [
    {
      id: 'h2-analogi-utama',
      label: 'Analogi Utama',
      title: 'Block vs Inline',
      body: 'Bayangin lagi nongkrong di kantin sekolah. Elemen "Block" itu kayak meja panjang yang dibooking buat satu ekskul—makan tempat dari ujung ke ujung, kelompok lain harus pindah ke baris bawahnya. Nah, kalau elemen "Inline", itu kayak kursi-kursi biasa. Temen-temen kamu bisa duduk jejeran berdampingan selama masih ada ruang kosong di sebelah teks atau elemen lain.',
    },
    {
      id: 'h2-konsep-inti-1',
      label: 'Konsep Inti 1',
      title: 'Heading & Hierarchy',
      body: 'Jelaskan <h1> sampai <h6>. Aturan emasnya: Jangan pernah lompat level heading (misal dari <h2> langsung ke <h4>). Analogi: Kayak bikin struktur proposal pensi: Judul Proposal (<h1>), Latar Belakang (<h2>), dan Tujuan (<h3>). Kalau urutannya lompat-lompat, panitia yang baca bakal bingung. Ini juga penting banget buat Screen Readers (aksesibilitas).',
    },
    {
      id: 'h2-konsep-inti-2',
      label: 'Konsep Inti 2',
      title: 'Lists & Text Formatting',
      body: 'Jelaskan bedanya <ul> (Unordered/Bulleted List) dan <ol> (Ordered/Numbered List), serta tag pelengkap seperti <strong> (tebal) dan <em> (miring).',
    },
  ],
  lab: {
    id: 'lab-html-recipe',
    title: 'Live Lab: Format Resep Masakan',
    description: 'Kode awal berisi teks resep yang masih berantakan. Rapikan menggunakan tag yang tepat.',
    task: 'Ask the user to format the recipe. They must use <h2> for the recipe title, <p> for the description, <ul> for the ingredients, and <ol> for the step-by-step cooking instructions.',
    initialCode: `Nasi Goreng Spesial
Ini adalah resep nasi goreng yang sangat mudah dibuat dan lezat untuk sarapan.
Nasi putih
Bawang merah
Bawang putih
Telur
Kecap manis
Panaskan minyak di wajan.
Tumis bumbu halus sampai harum.
Masukkan telur, orak-arik.
Masukkan nasi, aduk rata dengan bumbu.
Tambahkan kecap, aduk sampai matang.`,
  },
  quiz: [
    {
      id: 'h2-q1',
      question: 'Apa perbedaan utama antara elemen "Block" (seperti <h1> atau <p>) dengan elemen "Inline" (seperti <span> atau <a>)?',
      choices: [
        'Elemen Block bisa diberi warna, sedangkan Inline tidak bisa.',
        'Elemen Block mengambil lebar penuh layar dan mulai di baris baru, sedangkan Inline hanya mengambil lebar sesuai kontennya.',
        'Elemen Block hanya untuk teks, sedangkan Inline untuk gambar.',
        'Elemen Block mempercepat loading website, sedangkan Inline memperlambat.',
      ],
      correctIndex: 1,
    },
    {
      id: 'h2-q2',
      question: 'Mengapa melompati hierarki heading (misalnya dari <h2> langsung ke <h4>) sangat dilarang dalam best practice HTML?',
      choices: [
        'Karena akan membuat ukuran teks terlalu kecil.',
        'Karena font tidak akan bisa diubah di CSS.',
        'Mengacaukan struktur logis halaman dan menyulitkan pengguna Screen Reader.',
        'Karena Google tidak akan bisa membaca website kita sama sekali.',
      ],
      correctIndex: 2,
    },
    {
      id: 'h2-q3',
      question: 'Tag apa yang tepat untuk membuat daftar langkah-langkah memasak yang berurutan?',
      choices: [
        '<ul>',
        '<li>',
        '<ol>',
        '<dl>',
      ],
      correctIndex: 2,
    },
  ],
  miniProject: {
    id: 'h2-restaurant-menu',
    title: 'Mini Project: Menu Restoran',
    prompt: 'Buatlah halaman "Menu Restoran" sederhana. Kamu wajib menggunakan 1 buah <h1> (Nama Restoran), beberapa <h2> (Kategori: Minuman, Makanan Utama), dan setidaknya satu <ul> (daftar menu minuman) serta satu <ol> (Top 3 Makanan Terlaris).',
    requiresUpload: false,
    aiRubric: [
      'AI must strictly verify the presence of <h1>, <h2>, <ul>, <ol>, and <li>.',
      'AI must also check that no heading levels are skipped.',
    ],
  },
};

export const HOUSES: House[] = [
  HOUSE_1,
  HOUSE_2,
  {
    id: 'house-3',
    title: 'House 3: JavaScript Basics - Listrik yang Membuat Halaman Hidup',
    shortDescription: 'Pelajari variabel, fungsi, kondisi, loop, dan interaksi DOM dasar.',
  },
  {
    id: 'house-4',
    title: 'House 4: DOM & Events - Tombol, Pintu, dan Reaksi Pengguna',
    shortDescription: 'Tangani klik, input, perubahan konten, dan event browser secara terstruktur.',
  },
  {
    id: 'house-5',
    title: 'House 5: Responsive Design - Rumah yang Nyaman di Semua Ukuran Layar',
    shortDescription: 'Bangun layout mobile-first dengan media query, Flexbox, Grid, dan unit responsif.',
  },
  {
    id: 'house-6',
    title: 'House 6: Git, GitHub, & Workflow - Buku Catatan Renovasi Developer',
    shortDescription: 'Kelola versi kode, branch, commit, pull request, dan kolaborasi proyek.',
  },
  {
    id: 'house-7',
    title: 'House 7: React Fundamentals - Komponen seperti Lego UI',
    shortDescription: 'Bangun antarmuka berbasis komponen dengan props, state, dan hooks dasar.',
  },
  {
    id: 'house-8',
    title: 'House 8: APIs & Async JavaScript - Kurir Data dari Dunia Luar',
    shortDescription: 'Ambil data dari API dengan fetch, Promise, async/await, JSON, dan error handling.',
  },
  {
    id: 'house-9',
    title: 'House 9: Next.js & Routing - Denah Kota untuk Aplikasi Web',
    shortDescription: 'Pelajari routing, halaman, rendering, metadata, dan struktur aplikasi modern.',
  },
  {
    id: 'house-10',
    title: 'House 10: Accessibility & SEO - Membuka Pintu untuk Semua Orang',
    shortDescription: 'Buat halaman yang ramah pembaca layar, mesin pencari, dan berbagai kebutuhan pengguna.',
  },
  {
    id: 'house-11',
    title: 'House 11: Testing, Debugging, & Deployment - Inspeksi Sebelum Rumah Dibuka',
    shortDescription: 'Temukan bug, tulis pengujian dasar, optimalkan performa, dan deploy ke hosting.',
  },
  {
    id: 'house-12',
    title: 'House 12: Web3 & DApp Intro - Kunci Kepemilikan di Internet Baru',
    shortDescription: 'Kenali wallet, smart contract, transaksi, NFT/SBT, dan cara frontend terhubung ke blockchain.',
  },
];

const mockAICourses = {
  HOUSES,
  HOUSE_1,
  HOUSE_2,
};

export default mockAICourses;
