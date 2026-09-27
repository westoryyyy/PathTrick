import React from 'react';
/* eslint-disable react/no-unescaped-entities */

export interface MissionContentData {
  materials: React.ReactNode[];
  quiz?: {
    question: React.ReactNode;
    options: { text: string; isCorrect: boolean; feedback: string }[];
  } | {
    question: React.ReactNode;
    options: { text: string; isCorrect: boolean; feedback: string }[];
  }[];
  project?: {
    type?: 'code' | 'essay';
    instruction: React.ReactNode;
    defaultCode: string;
    language: 'html' | 'javascript' | 'python';
  };
}

export const MISSION_CONTENT: Record<string, MissionContentData> = {
  // === MODUL MAHASISWA: ANALYTICAL THINKING ===
  'module-analytical-bab-1-level-1': {
    materials: [
      <div key="1" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#059669' }}>▶</span> <strong>Pengantar Analytical Thinking</strong>
        </p>
        <p style={{ fontSize: '0.9rem', color: '#57534e', lineHeight: '1.6' }}>
          Berpikir analitis adalah kemampuan memecah masalah kompleks menjadi bagian-bagian kecil yang lebih mudah dikelola. Di level ini, kita akan mempelajari konsep <strong>First Principles Thinking</strong>, metode yang digunakan oleh inovator seperti Elon Musk untuk menyelesaikan masalah dari akarnya.
        </p>
      </div>
    ],
    quiz: [
      {
        question: "Apa tujuan utama dari First Principles Thinking?",
        options: [
          { text: "Memecahkan masalah dengan mencari akar kebenaran yang tidak bisa diragukan lagi", isCorrect: true, feedback: "Tepat! First Principles membongkar masalah sampai ke fakta dasar." },
          { text: "Melihat apa yang dilakukan kompetitor dan menirunya", isCorrect: false, feedback: "Itu adalah berpikir berdasarkan analogi, bukan First Principles." },
          { text: "Memecahkan masalah dengan menebak", isCorrect: false, feedback: "Analytical thinking tidak mengandalkan tebakan." }
        ]
      }
    ]
  },
  'module-analytical-bab-1-level-2': {
    materials: [
      <div key="1" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#059669' }}>▶</span> <strong>Root Cause Analysis (5 Whys)</strong>
        </p>
        <p style={{ fontSize: '0.9rem', color: '#57534e', lineHeight: '1.6' }}>
          Metode <strong>5 Whys</strong> dikembangkan oleh Sakichi Toyoda. Teknik ini mengharuskan kita bertanya "Mengapa?" sebanyak lima kali ketika menghadapi suatu masalah untuk menemukan akar masalah yang sesungguhnya, bukan sekadar menangani gejala di permukaan.
        </p>
      </div>
    ],
    quiz: [
      {
        question: "Kapan kita harus berhenti bertanya 'Mengapa' dalam metode 5 Whys?",
        options: [
          { text: "Ketika kita sudah menemukan akar masalah sistemik yang bisa diperbaiki", isCorrect: true, feedback: "Tepat! Tujuannya adalah perbaikan sistem." },
          { text: "Tepat pada pertanyaan kelima, tidak boleh lebih", isCorrect: false, feedback: "Angka 5 hanya panduan, bisa kurang atau lebih." },
          { text: "Ketika kita sudah bisa menyalahkan seseorang", isCorrect: false, feedback: "Tujuannya mencari akar masalah sistem, bukan menyalahkan individu." }
        ]
      }
    ]
  },
  'module-analytical-bab-1-level-3': {
    materials: [
      <div key="1" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#059669' }}>▶</span> <strong>Praktik Kasus: Data Anomali</strong>
        </p>
        <p style={{ fontSize: '0.9rem', color: '#57534e', lineHeight: '1.6' }}>
          Bayangkan aplikasi kita tiba-tiba mengalami lonjakan error di akhir pekan. Sebagai seorang analis, langkah pertamamu bukan me-restart server, tapi melihat data log. Kita harus mencari korelasi antara waktu error dengan perubahan sistem terakhir (deploy) atau lonjakan traffic pengguna.
        </p>
      </div>
    ],
    quiz: [
      {
        question: "Tindakan analitis pertama saat terjadi lonjakan error adalah...",
        options: [
          { text: "Mengumpulkan data log dan menganalisis polanya", isCorrect: true, feedback: "Tepat! Kita butuh data sebelum bertindak." },
          { text: "Langsung me-restart server", isCorrect: false, feedback: "Itu adalah solusi reaktif tanpa analisis." },
          { text: "Menyalahkan tim developer", isCorrect: false, feedback: "Itu tidak menyelesaikan masalah teknis." }
        ]
      }
    ]
  },

  'module-system-design-bab-1-level-1': {
    materials: [
      <div key="1" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#059669' }}>▶</span> <strong>Pengantar System Design</strong>
        </p>
        <p style={{ fontSize: '0.9rem', color: '#57534e', lineHeight: '1.6' }}>
          System design adalah proses mendefinisikan arsitektur, komponen, modul, antarmuka, dan data untuk sistem agar memenuhi persyaratan tertentu. Bayangkan kamu sedang membangun rumah: sebelum menyusun batu bata (coding), kamu butuh cetak biru (blueprint) yang memikirkan ventilasi, pondasi, dan instalasi listrik.
        </p>
      </div>
    ],
    quiz: [
      {
        question: "Mengapa System Design penting dalam pengembangan software skala besar?",
        options: [
          { text: "Agar sistem dapat di-scale, mudah di-maintain, dan handal", isCorrect: true, feedback: "Tepat! System design mencegah arsitektur yang rapuh saat pengguna bertambah." },
          { text: "Untuk membuat UI yang lebih cantik", isCorrect: false, feedback: "Itu tugas UI/UX design, bukan system design." },
          { text: "Agar bisa menggunakan bahasa pemrograman terbaru", isCorrect: false, feedback: "System design bersifat language-agnostic (tidak terikat bahasa tertentu)." }
        ]
      }
    ]
  },
  'module-system-design-bab-1-level-2': {
    materials: [
      <div key="1" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#059669' }}>▶</span> <strong>Client-Server Model</strong>
        </p>
        <p style={{ fontSize: '0.9rem', color: '#57534e', lineHeight: '1.6' }}>
          Dalam model ini, <strong>Client</strong> (seperti browser di laptopmu) meminta resources atau service, dan <strong>Server</strong> (komputer di pusat data) merespons permintaan tersebut. Ini adalah fondasi dasar internet modern.
        </p>
      </div>
    ],
    quiz: [
      {
        question: "Dalam model Client-Server, siapa yang biasanya menyimpan database utama?",
        options: [
          { text: "Server", isCorrect: true, feedback: "Benar! Server bertugas menyimpan dan mengelola data secara terpusat." },
          { text: "Client", isCorrect: false, feedback: "Client biasanya tidak menyimpan database utama karena alasan keamanan dan kapasitas." },
          { text: "Keduanya menyimpan data yang sama secara permanen", isCorrect: false, feedback: "Client mungkin menyimpan cache, tapi sumber kebenaran (source of truth) ada di Server." }
        ]
      }
    ]
  },
  'module-system-design-bab-1-level-3': {
    materials: [
      <div key="1" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#059669' }}>▶</span> <strong>Scalability: Vertical vs Horizontal</strong>
        </p>
        <p style={{ fontSize: '0.9rem', color: '#57534e', lineHeight: '1.6' }}>
          Ketika aplikasimu tiba-tiba viral, servermu butuh tenaga ekstra. <br/>
          <strong>Vertical Scaling (Scale Up)</strong>: Membeli CPU/RAM yang lebih kuat untuk satu server yang sama.<br/>
          <strong>Horizontal Scaling (Scale Out)</strong>: Menambah lebih banyak server kecil untuk membagi beban (Load Balancing).
        </p>
      </div>
    ],
    quiz: [
      {
        question: "Jika kamu menambah jumlah server dari 1 menjadi 5 untuk menangani traffic, metode apa yang kamu gunakan?",
        options: [
          { text: "Horizontal Scaling", isCorrect: true, feedback: "Tepat! Menambah instans server adalah Horizontal Scaling." },
          { text: "Vertical Scaling", isCorrect: false, feedback: "Vertical scaling berarti memperbesar spesifikasi pada SATU server." },
          { text: "Database Sharding", isCorrect: false, feedback: "Itu adalah teknik khusus untuk memecah database, bukan sekadar menambah server aplikasi." }
        ]
      }
    ]
  },

  // === MODUL BISNIS: AKUNTANSI ===
  'module-business-1-bab-1-level-1': {
    materials: [
      <div key="1" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#059669' }}>▶</span> <strong>Apa itu Akuntansi?</strong>
        </p>
        <p style={{ fontSize: '0.9rem', color: '#57534e', lineHeight: '1.6' }}>
          Akuntansi sering disebut sebagai <strong>"Bahasa Bisnis"</strong>. Secara sederhana, akuntansi adalah proses mencatat, mengklasifikasi, mengolah, dan menyajikan data transaksi agar bisa menjadi informasi keuangan yang berguna.
          <br/><br/>
          Bayangkan kamu punya kedai kopi. Kamu perlu tahu berapa uang yang masuk dari jualan kopi (Pemasukan) dan berapa uang yang keluar untuk beli biji kopi, gaji karyawan, dan sewa tempat (Pengeluaran). Proses mencatat inilah yang disebut Akuntansi.
        </p>
      </div>,
      <div key="2" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#059669' }}>▶</span> <strong>Persamaan Dasar Akuntansi</strong>
        </p>
        <p style={{ fontSize: '0.9rem', color: '#57534e', lineHeight: '1.6' }}>
          Ini adalah fondasi mutlak yang harus kamu hafal dan pahami:
        </p>
        <div style={{ background: '#292524', color: '#fbbf24', padding: '16px', borderRadius: '8px', fontFamily: '"Press Start 2P"', fontSize: '0.6rem', textAlign: 'center', lineHeight: '1.8' }}>
          HARTA (Aset) =<br/>UTANG (Kewajiban) + MODAL (Ekuitas)
        </div>
        <p style={{ fontSize: '0.9rem', color: '#57534e', lineHeight: '1.6' }}>
          Semua harta yang dimiliki perusahaan (Aset) pasti berasal dari salah satu dari dua sumber: uang hasil pinjaman (Utang) atau uang milik pemilik sendiri (Modal). Persamaan ini <strong>HARUS SELALU SEIMBANG (Balance)</strong> setiap kali ada transaksi.
        </p>
      </div>
    ],
    quiz: [
      {
        question: "Manakah yang merupakan Persamaan Dasar Akuntansi yang benar?",
        options: [
          { text: "Harta = Utang + Modal", isCorrect: true, feedback: "Tepat! Ini adalah hukum mutlak dalam akuntansi." },
          { text: "Harta = Utang - Modal", isCorrect: false, feedback: "Salah. Harta didapat dari GABUNGAN utang dan modal." },
          { text: "Modal = Harta + Utang", isCorrect: false, feedback: "Salah. Ingat, Harta adalah total dari utang dan modal." }
        ]
      },
      {
        question: "Apa tujuan utama dari Akuntansi?",
        options: [
          { text: "Menyajikan informasi keuangan untuk pengambil keputusan", isCorrect: true, feedback: "Benar! Laporan keuangan sangat krusial untuk investor dan manajemen." },
          { text: "Hanya untuk menghitung pajak perusahaan", isCorrect: false, feedback: "Pajak hanya salah satu fungsinya, bukan tujuan utamanya." },
          { text: "Mencari kelemahan saingan bisnis", isCorrect: false, feedback: "Ini bukan fungsi akuntansi." }
        ]
      }
    ]
  },
  
  'module-business-1-bab-1-level-2': {
    materials: [
      <div key="1" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#059669' }}>▶</span> <strong>Pengenalan Debit dan Kredit</strong>
        </p>
        <p style={{ fontSize: '0.9rem', color: '#57534e', lineHeight: '1.6' }}>
          Dalam akuntansi, setiap transaksi dicatat setidaknya di dua tempat yang berbeda agar persamaan akuntansi tetap seimbang. Ini disebut sistem <em>Double-Entry Bookkeeping</em>.
          <br/><br/>
          Kita menggunakan dua istilah penting: <strong>Debit (Dr)</strong> di sisi kiri, dan <strong>Kredit (Cr)</strong> di sisi kanan.
        </p>
      </div>,
      <div key="2" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#059669' }}>▶</span> <strong>Aturan Main Debit & Kredit</strong>
        </p>
        <ul style={{ fontSize: '0.9rem', color: '#57534e', lineHeight: '1.6', paddingLeft: '20px' }}>
          <li><strong>Harta (Aset):</strong> Bertambah di Debit, Berkurang di Kredit.</li>
          <li><strong>Utang & Modal:</strong> Bertambah di Kredit, Berkurang di Debit.</li>
          <li><strong>Pendapatan:</strong> Bertambah di Kredit.</li>
          <li><strong>Beban (Biaya):</strong> Bertambah di Debit.</li>
        </ul>
        <div style={{ background: '#fef3c7', borderLeft: '4px solid #f59e0b', padding: '12px', fontSize: '0.85rem', color: '#92400e' }}>
          <strong>Tips:</strong> Ingat rumus singkatan <strong>H-U-M-P-B</strong> (Harta, Utang, Modal, Pendapatan, Beban). Harta dan Beban bersaudara (Debit jika bertambah). Utang, Modal, dan Pendapatan bersaudara (Kredit jika bertambah).
        </div>
      </div>,
      <div key="3" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#059669' }}>▶</span> <strong>Contoh Kasus Sederhana</strong>
        </p>
        <p style={{ fontSize: '0.9rem', color: '#57534e', lineHeight: '1.6' }}>
          Tuan Budi menyetorkan uang Rp 10.000.000 sebagai modal awal usahanya. Bagaimana jurnalnya?
          <br/><br/>
          1. <strong>Kas (Harta)</strong> bertambah Rp 10.000.000 (Debit).<br/>
          2. <strong>Modal</strong> bertambah Rp 10.000.000 (Kredit).
        </p>
      </div>
    ],
    quiz: [
      {
        question: "Jika perusahaan membeli peralatan seharga Rp 5.000.000 secara tunai, bagaimana pengaruhnya terhadap Harta?",
        options: [
          { text: "Peralatan (Harta) bertambah di Debit, Kas (Harta) berkurang di Kredit", isCorrect: true, feedback: "Sempurna! Harta berupa peralatan naik, tapi harta berupa uang kas turun." },
          { text: "Peralatan bertambah di Kredit, Kas berkurang di Debit", isCorrect: false, feedback: "Terbalik! Harta bertambah di Debit." },
          { text: "Harta bertambah Rp 5.000.000 dan Utang bertambah", isCorrect: false, feedback: "Tidak ada utang karena dibeli secara tunai." }
        ]
      },
      {
        question: "Akun mana yang akan bertambah di sebelah Kredit?",
        options: [
          { text: "Utang Bank", isCorrect: true, feedback: "Benar! Utang selalu bertambah di sisi Kredit." },
          { text: "Beban Sewa", isCorrect: false, feedback: "Salah. Beban bertambah di sisi Debit." },
          { text: "Piutang Usaha", isCorrect: false, feedback: "Salah. Piutang adalah Harta, jadi bertambah di Debit." }
        ]
      }
    ]
  },

  // LEVEL 1: TEORI DASAR (MATERIAL)
  'module-html-css-level-1': {
    materials: [
      <div key="1" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#059669' }}>▶</span> <strong>Selamat datang di Web Development!</strong>
        </p>
        <p style={{ fontSize: '0.9rem', color: '#57534e', lineHeight: '1.6' }}>
          Website yang kamu lihat setiap hari (termasuk PathTrick ini) dibangun dari sebuah pondasi bernama <strong>HTML (HyperText Markup Language)</strong>.
          <br/><br/>
          Bayangkan HTML sebagai <strong>tulang punggung</strong> atau kerangka bangunan. Tanpa HTML, tidak akan ada teks, gambar, atau tombol di layar.
        </p>
      </div>,
      <div key="2" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#059669' }}>▶</span> <strong>Anatomi Tag HTML</strong>
        </p>
        <p style={{ fontSize: '0.9rem', color: '#57534e', lineHeight: '1.6' }}>
          HTML bekerja menggunakan sistem <strong>Tag</strong>. Sebuah tag biasanya memiliki pembuka dan penutup, mengapit konten di dalamnya.
        </p>
        <div style={{ background: '#292524', color: '#a7f3d0', padding: '16px', borderRadius: '8px', fontFamily: 'monospace' }}>
          &lt;namatag&gt; Konten kamu di sini &lt;/namatag&gt;
        </div>
      </div>,
      <div key="3" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#059669' }}>▶</span> <strong>Struktur Dasar (Head & Body)</strong>
        </p>
        <p style={{ fontSize: '0.9rem', color: '#57534e', lineHeight: '1.6' }}>
          Dokumen HTML ibarat tubuh manusia:
          <br/>- <strong>&lt;head&gt;</strong>: Kepala/otak. Berisi pengaturan (judul tab, metadata) yang tidak terlihat langsung oleh pengguna.
          <br/>- <strong>&lt;body&gt;</strong>: Tubuh. Semua hal yang terlihat di layar browser diletakkan di dalam tag ini!
        </p>
      </div>
    ],
    quiz: {
      question: "Semua teks, gambar, dan tombol yang bisa dilihat pengunjung di layar website harus diletakkan di dalam tag apa?",
      options: [
        { text: "A. <head>", isCorrect: false, feedback: "Salah! Tag <head> digunakan untuk metadata dan pengaturan yang tersembunyi dari layar utama." },
        { text: "B. <body>", isCorrect: true, feedback: "Tepat sekali! Ibarat tubuh, <body> memuat segala hal yang tampak pada website." },
        { text: "C. <title>", isCorrect: false, feedback: "Salah! <title> hanya untuk mengubah teks di tab browser (di dalam <head>)." }
      ]
    },
    project: {
      instruction: (
        <>
          Sebagai ritual pertama setiap programmer, mari kita buat dokumen <strong>Hello World</strong>!<br/><br/>
          Tuliskan tag pembuka <code>&lt;body&gt;</code> dan tag penutup <code>&lt;/body&gt;</code>, lalu di dalamnya ketikkan teks "Hello World".
        </>
      ),
      defaultCode: "<!-- Tulis kodemu di bawah ini -->\n",
      language: "html"
    }
  },

  // LEVEL 2: KUIS PRAKTIK TEXT (QUIZ)
  'module-html-css-level-2': {
    materials: [
      <div key="1" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#059669' }}>▶</span> <strong>Hirarki Judul (Heading)</strong>
        </p>
        <p style={{ fontSize: '0.9rem', color: '#57534e', lineHeight: '1.6' }}>
          Dalam HTML, kita memiliki 6 tingkat judul dari <strong>&lt;h1&gt;</strong> hingga <strong>&lt;h6&gt;</strong>.<br/><br/>
          - <strong>&lt;h1&gt;</strong>: Adalah judul utama (paling besar). Ibarat judul buku. <em>Hanya boleh ada satu h1 dalam sebuah halaman!</em><br/>
          - <strong>&lt;h2&gt;</strong>: Sub-judul atau judul bab.<br/>
          - <strong>&lt;h3&gt;</strong> hingga <strong>&lt;h6&gt;</strong>: Digunakan untuk sub-bagian yang lebih kecil lagi.
        </p>
        <div style={{ background: '#292524', color: '#fde047', padding: '16px', borderRadius: '8px', fontFamily: 'monospace' }}>
          &lt;h1&gt;Dunia Sihir PathTrick&lt;/h1&gt;<br/>
          &lt;h2&gt;Bab 1: Hutan Pemula&lt;/h2&gt;
        </div>
      </div>,
      <div key="2" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#059669' }}>▶</span> <strong>Menulis Paragraf (&lt;p&gt;)</strong>
        </p>
        <p style={{ fontSize: '0.9rem', color: '#57534e', lineHeight: '1.6' }}>
          Setelah judul, kamu pasti ingin menuliskan cerita atau konten. Gunakan tag <strong>&lt;p&gt;</strong> (Paragraph).<br/><br/>
          Browser akan secara otomatis memberikan jarak (margin) di atas dan di bawah elemen paragraf agar teks mudah dibaca dan tidak bertumpuk.
        </p>
        <div style={{ background: '#292524', color: '#a7f3d0', padding: '16px', borderRadius: '8px', fontFamily: 'monospace' }}>
          &lt;p&gt;Pada zaman dahulu, hiduplah seorang ksatria kode...&lt;/p&gt;
        </div>
      </div>,
      <div key="3" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#059669' }}>▶</span> <strong>Gaya Teks Tambahan</strong>
        </p>
        <p style={{ fontSize: '0.9rem', color: '#57534e', lineHeight: '1.6' }}>
          Kamu juga bisa memberikan penekanan pada kata-kata tertentu di dalam paragraf:<br/><br/>
          - <strong>&lt;strong&gt;</strong> atau <strong>&lt;b&gt;</strong>: Membuat teks menjadi <b>Tebal (Bold)</b>.<br/>
          - <strong>&lt;em&gt;</strong> atau <strong>&lt;i&gt;</strong>: Membuat teks menjadi <i>Miring (Italic)</i>.<br/>
          - <strong>&lt;br&gt;</strong>: Membuat baris baru (Enter) tanpa membuat paragraf baru. Tag ini tidak butuh penutup!
        </p>
        <div style={{ background: '#292524', color: '#fca5a5', padding: '16px', borderRadius: '8px', fontFamily: 'monospace' }}>
          &lt;p&gt;Hati-hati, monster itu sangat &lt;strong&gt;berbahaya&lt;/strong&gt;!&lt;br&gt;Kita harus lari!&lt;/p&gt;
        </div>
      </div>
    ],
    quiz: {
      question: "Jika kamu ingin membuat sebuah teks paragraf untuk menceritakan kisah petualanganmu, tag HTML apa yang paling tepat digunakan?",
      options: [
        { text: "A. <h1>Ceritaku</h1>", isCorrect: false, feedback: "Salah! Tag <h1> digunakan untuk Judul Utama, bukan teks cerita panjang." },
        { text: "B. <p>Ceritaku...</p>", isCorrect: true, feedback: "Tepat sekali! Tag <p> (Paragraph) digunakan untuk teks panjang." },
        { text: "C. <text>Cerita</text>", isCorrect: false, feedback: "Salah! Tidak ada tag <text> standar di HTML untuk paragraf." }
      ]
    },
    project: {
      instruction: (
        <>
          Coba buat sebuah <strong>Judul Utama (&lt;h1&gt;)</strong> dan di bawahnya sebuah <strong>Paragraf (&lt;p&gt;)</strong>.<br/><br/>
          Jangan lupa tutup tag-nya dengan benar!
        </>
      ),
      defaultCode: "<!-- Buat h1 dan p di sini -->\n",
      language: "html"
    }
  },

  // LEVEL 3: KUIS PRAKTIK LIST (QUIZ)
  'module-html-css-level-3': {
    materials: [
      <div key="1" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#059669' }}>▶</span> <strong>Membuat Daftar (List)</strong>
        </p>
        <p style={{ fontSize: '0.9rem', color: '#57534e', lineHeight: '1.6' }}>
          Dalam HTML, daftar dibuat menggunakan dua jenis tag utama pembungkus:<br/>
          - <strong>&lt;ul&gt; (Unordered List)</strong>: Daftar dengan titik (bullet).<br/>
          - <strong>&lt;ol&gt; (Ordered List)</strong>: Daftar bernomor (1, 2, 3).<br/><br/>
          Isi dari daftar tersebut harus dibungkus dengan tag <strong>&lt;li&gt; (List Item)</strong>.
        </p>
      </div>,
      <div key="2" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#059669' }}>▶</span> <strong>Menambahkan Tautan (Hyperlink)</strong>
        </p>
        <p style={{ fontSize: '0.9rem', color: '#57534e', lineHeight: '1.6' }}>
          Website tidak akan lengkap tanpa <strong>Hyperlink</strong> yang menghubungkan antar halaman. Kita menggunakan tag <strong>&lt;a&gt;</strong> (Anchor).<br/><br/>
          Penting: Tag ini wajib memiliki atribut <code>href</code> (Hypertext Reference) untuk memberi tahu browser ke mana tautan itu akan pergi!
        </p>
        <div style={{ background: '#292524', color: '#60a5fa', padding: '16px', borderRadius: '8px', fontFamily: 'monospace' }}>
          &lt;a href="https://pathtrick.com"&gt;Pergi ke PathTrick&lt;/a&gt;
        </div>
      </div>,
      <div key="3" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#059669' }}>▶</span> <strong>Atribut Target</strong>
        </p>
        <p style={{ fontSize: '0.9rem', color: '#57534e', lineHeight: '1.6' }}>
          Terkadang kamu ingin tautan terbuka di tab baru agar pengunjung tidak meninggalkan website-mu. Kamu bisa menambahkan atribut <code>target="_blank"</code>.<br/><br/>
          Ingat: Atribut selalu diletakkan di dalam tag pembuka!
        </p>
        <div style={{ background: '#292524', color: '#60a5fa', padding: '16px', borderRadius: '8px', fontFamily: 'monospace' }}>
          &lt;a href="https://google.com" target="_blank"&gt;Cari di Google&lt;/a&gt;
        </div>
      </div>,
      <div key="4" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#059669' }}>▶</span> <strong>Memasukkan Gambar</strong>
        </p>
        <p style={{ fontSize: '0.9rem', color: '#57534e', lineHeight: '1.6' }}>
          Untuk menampilkan gambar, gunakan tag <strong>&lt;img&gt;</strong>.<br/>
          Mirip dengan &lt;br&gt;, tag img <strong>tidak memiliki tag penutup</strong>!<br/><br/>
          Dua atribut wajib untuk &lt;img&gt;:<br/>
          - <code>src</code> (Source): Alamat/lokasi file gambar.<br/>
          - <code>alt</code> (Alternative text): Teks pengganti jika gambar gagal dimuat.
        </p>
        <div style={{ background: '#292524', color: '#fca5a5', padding: '16px', borderRadius: '8px', fontFamily: 'monospace' }}>
          &lt;img src="foto-kucing.jpg" alt="Kucing Oren" /&gt;
        </div>
      </div>
    ],
    quiz: {
      question: "Atribut wajib apa yang harus ditambahkan pada tag <a> agar tautan tersebut bisa diklik dan mengarah ke halaman lain?",
      options: [
        { text: "A. src", isCorrect: false, feedback: "Salah! 'src' digunakan untuk sumber gambar (<img>)." },
        { text: "B. link", isCorrect: false, feedback: "Salah! 'link' bukanlah atribut, melainkan tag HTML." },
        { text: "C. href", isCorrect: true, feedback: "Benar! 'href' (Hypertext Reference) adalah atribut wajib untuk tautan." },
        { text: "D. alt", isCorrect: false, feedback: "Salah! 'alt' digunakan untuk teks alternatif pada gambar." }
      ]
    },
    project: {
      instruction: (
        <>
          Coba tampilkan sebuah gambar dan tautan di dalam body!<br/><br/>
          Tulis 1 tag <code>&lt;img&gt;</code> dan 1 tag <code>&lt;a&gt;</code>.
        </>
      ),
      defaultCode: "<!-- Buat img dan a di sini -->\n",
      language: "html"
    }
  },

  // LEVEL 4: MINI PROJECT TEXT (LIVE CODE)
  'module-html-css-level-4': {
    materials: [
      <div key="1" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#059669' }}>▶</span> <strong>Mini Project: Membuat Biodata Personal</strong>
        </p>
        <p style={{ fontSize: '0.9rem', color: '#57534e', lineHeight: '1.6' }}>
          Sekarang saatnya menggabungkan semua teori yang sudah kamu pelajari!<br/><br/>
          Kamu akan membuat sebuah halaman profil sederhana yang memuat:<br/>
          - 1 Judul Utama (Nama Kamu)<br/>
          - 1 Sub-judul (Profesi/Role Kamu)<br/>
          - 1 Paragraf deskripsi singkat tentang dirimu<br/>
          - 1 Tautan (Misalnya ke media sosial atau portofolio)
        </p>
      </div>,
      <div key="2" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#059669' }}>▶</span> <strong>Panduan Live Code</strong>
        </p>
        <p style={{ fontSize: '0.9rem', color: '#57534e', lineHeight: '1.6' }}>
          Tulis kodemu secara berurutan. Gunakan heading terbesar untuk nama, dan sub-heading untuk rolamu.
          Setelah selesai, AI Assistant kami akan otomatis mengevaluasi hasil kerjamu!
        </p>
        <div style={{ background: '#292524', color: '#a7f3d0', padding: '16px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.8rem' }}>
          &lt;h1&gt;Petualang&lt;/h1&gt;<br/>
          &lt;h2&gt;Level 1&lt;/h2&gt;<br/>
          &lt;p&gt;Halo dunia!&lt;/p&gt;<br/>
          &lt;a href="https://pathtrick.com"&gt;Websituku&lt;/a&gt;
        </div>
      </div>
    ],
    quiz: {
      question: "Mengapa kita sebaiknya menggunakan tag <h2> alih-alih <h1> untuk sub-judul?",
      options: [
        { text: "A. Karena <h2> warnanya lebih bagus secara otomatis.", isCorrect: false, feedback: "Salah! Warna bawaan h1 dan h2 sama (hitam), hanya ukurannya yang berbeda." },
        { text: "B. Karena <h1> idealnya hanya digunakan sekali untuk judul utama halaman.", isCorrect: true, feedback: "Benar! Menjaga hirarki <h1> sangat penting untuk aksesibilitas dan SEO." },
        { text: "C. Bebas saja, tidak ada aturan hirarki HTML.", isCorrect: false, feedback: "Salah! Aturan hirarki tag Heading (h1-h6) sangat penting." }
      ]
    },
    project: {
      instruction: (
        <>
          Mini Project: Buat halaman bio personal menggunakan tag <code>&lt;h1&gt;</code>, <code>&lt;h2&gt;</code>, <code>&lt;p&gt;</code>, dan <code>&lt;a&gt;</code>.
        </>
      ),
      defaultCode: "<!-- Tulis seluruh kodemu di bawah ini -->\n",
      language: "html"
    }
  },

  // LEVEL 5: KUIS PRAKTIK CSS BASIC (QUIZ)
  'module-html-css-level-5': {
    materials: [
      <div key="1" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#059669' }}>▶</span> <strong>Mengenal CSS (Cascading Style Sheets)</strong>
        </p>
        <p style={{ fontSize: '0.9rem', color: '#57534e', lineHeight: '1.6' }}>
          Jika HTML adalah struktur tulangnya, maka <strong>CSS</strong> adalah kulit dan pakaian dari website.<br/><br/>
          CSS digunakan untuk mewarnai teks, mengatur ukuran, memberikan latar belakang, dan membuat tampilan menjadi sangat menarik dan estetik.
        </p>
      </div>,
      <div key="2" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#059669' }}>▶</span> <strong>Struktur Dasar Kode CSS</strong>
        </p>
        <p style={{ fontSize: '0.9rem', color: '#57534e', lineHeight: '1.6' }}>
          Penulisan CSS selalu terdiri dari dua bagian utama:<br/>
          1. <strong>Selector</strong>: Elemen HTML mana yang mau dihias (misal: <code>h1</code>, <code>p</code>).<br/>
          2. <strong>Declaration Block</strong>: Hiasannya apa saja (ditulis di dalam kurung kurawal <code>&#123; &#125;</code>).
        </p>
        <div style={{ background: '#292524', color: '#a7f3d0', padding: '16px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.8rem' }}>
          h1 &#123;<br/>
          &nbsp;&nbsp;color: red;<br/>
          &nbsp;&nbsp;font-size: 24px;<br/>
          &#125;
        </div>
      </div>,
      <div key="3" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#059669' }}>▶</span> <strong>Properti Warna dan Latar</strong>
        </p>
        <p style={{ fontSize: '0.9rem', color: '#57534e', lineHeight: '1.6' }}>
          Terdapat dua properti yang paling sering digunakan di CSS:<br/>
          - <code>color</code>: Untuk mengubah warna teks atau tulisan font.<br/>
          - <code>background-color</code>: Untuk mengubah warna latar belakang elemen.
        </p>
        <div style={{ background: '#292524', color: '#fbcfe8', padding: '16px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.8rem' }}>
          body &#123;<br/>
          &nbsp;&nbsp;background-color: black;<br/>
          &nbsp;&nbsp;color: white;<br/>
          &#125;
        </div>
      </div>
    ],
    quiz: {
      question: "Apa perbedaan antara properti 'color' dan 'background-color' dalam CSS?",
      options: [
        { text: "A. color untuk latar belakang, background-color untuk teks", isCorrect: false, feedback: "Salah! Terbalik. 'color' itu untuk hurufnya." },
        { text: "B. Keduanya melakukan hal yang sama", isCorrect: false, feedback: "Salah! Keduanya memiliki target pewarnaan yang sangat berbeda." },
        { text: "C. color untuk warna teks tulisan, background-color untuk warna blok latar belakang", isCorrect: true, feedback: "Benar! 'color' menargetkan font, sedangkan 'background-color' menargetkan blok latar." }
      ]
    },
    project: {
      instruction: (
        <>
          Saatnya menggunakan sihir warna! Buatlah tag <code>&lt;style&gt;</code> di dalam HTML dan berikan warna pada judul <code>h1</code> menjadi merah (red).
        </>
      ),
      defaultCode: "<h1>Teks ini harus berwarna merah!</h1>\n<!-- Tulis tag style di bawah ini -->\n",
      language: "html"
    }
  },

  // LEVEL 6: BOSS FIGHT (PROJECT & MEGA QUIZ)
  'module-html-css-level-6': {
    materials: [
      <div key="1" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#059669' }}>▶</span> <strong>Ujian Akhir: Ujian Pengetahuan!</strong>
        </p>
        <p style={{ fontSize: '0.9rem', color: '#57534e', lineHeight: '1.6' }}>
          Selamat datang di gerbang terakhir Modul HTML & CSS! <br/><br/>
          Sebelum berhadapan dengan Final Boss (Live Code), kamu harus melewati <strong>Gauntlet 20 Pertanyaan</strong> berturut-turut yang menguji semua ingatanmu dari Level 1 hingga Level 5.
          Hati-hati, kamu hanya punya 3 Nyawa!
        </p>
      </div>
    ],
    quiz: [
      { question: "1. Tag apa yang menandakan awal dari sebuah dokumen HTML?", options: [ { text: "A. <body>", isCorrect: false, feedback: "Salah! <body> adalah untuk konten." }, { text: "B. <html>", isCorrect: true, feedback: "Benar! Seluruh dokumen HTML harus dibungkus tag <html>." }, { text: "C. <head>", isCorrect: false, feedback: "Salah! <head> ada di dalam <html>." } ] },
      { question: "2. Elemen mana yang berfungsi sebagai kerangka kepala yang menyimpan metadata (tidak terlihat langsung oleh pengguna)?", options: [ { text: "A. <head>", isCorrect: true, feedback: "Tepat sekali! Metadata disimpan di <head>." }, { text: "B. <header>", isCorrect: false, feedback: "Salah! <header> adalah elemen navigasi visual." }, { text: "C. <title>", isCorrect: false, feedback: "Salah! <title> memang ada di kepala, namun tag induknya adalah <head>." } ] },
      { question: "3. Di dalam tag apa kita menuliskan SEMUA konten (teks, gambar) yang akan tampil di layar browser?", options: [ { text: "A. <screen>", isCorrect: false, feedback: "Tag tersebut tidak ada dalam standar HTML." }, { text: "B. <head>", isCorrect: false, feedback: "Salah! <head> tidak merender visual ke layar." }, { text: "C. <body>", isCorrect: true, feedback: "Luar biasa! <body> adalah tulang punggung visual web." } ] },
      { question: "4. Tag HTML manakah yang digunakan untuk membuat Judul Paling Besar (Heading 1)?", options: [ { text: "A. <heading>", isCorrect: false, feedback: "Salah! Bukan <heading>." }, { text: "B. <h1>", isCorrect: true, feedback: "Benar! h1 adalah heading paling utama." }, { text: "C. <h6", isCorrect: false, feedback: "Salah! h6 justru paling kecil." } ] },
      { question: "5. Apa perbedaan utama antara <h1> dan <h2>?", options: [ { text: "A. <h1> lebih besar dan lebih penting dari <h2>", isCorrect: true, feedback: "Betul! Urutan prioritas dari 1 sampai 6." }, { text: "B. <h2> lebih tebal dari <h1>", isCorrect: false, feedback: "Salah! Ketebalan font secara default mirip." }, { text: "C. Tidak ada bedanya", isCorrect: false, feedback: "Salah besar!" } ] },
      { question: "6. Tag apa yang digunakan untuk menulis sebuah paragraf teks yang panjang?", options: [ { text: "A. <para>", isCorrect: false, feedback: "Bukan <para>." }, { text: "B. <p>", isCorrect: true, feedback: "Benar! <p> singkatan dari Paragraph." }, { text: "C. <text>", isCorrect: false, feedback: "Tag ini tidak standar." } ] },
      { question: "7. Bagaimana cara yang benar untuk menampilkan gambar di HTML?", options: [ { text: "A. <image src='...' />", isCorrect: false, feedback: "Salah! Bukan <image>." }, { text: "B. <img src='...'>", isCorrect: true, feedback: "Benar! Tag-nya adalah <img>." }, { text: "C. <picture link='...'>", isCorrect: false, feedback: "Salah! Sintaks tidak tepat." } ] },
      { question: "8. Apakah tag <img> membutuhkan tag penutup </img>?", options: [ { text: "A. Ya, semua tag wajib ditutup", isCorrect: false, feedback: "Salah! Ada pengecualian di HTML." }, { text: "B. Tidak, <img> adalah self-closing tag", isCorrect: true, feedback: "Benar! Elemen hampa (void) tidak perlu ditutup dengan </img>." } ] },
      { question: "9. Atribut apa yang WAJIB ada di dalam tag <img> untuk memberitahu browser letak file gambarnya?", options: [ { text: "A. link", isCorrect: false, feedback: "Salah!" }, { text: "B. href", isCorrect: false, feedback: "Salah! href untuk tautan." }, { text: "C. src", isCorrect: true, feedback: "Benar! src singkatan dari source." } ] },
      { question: "10. Atribut apa yang digunakan untuk menampilkan Teks Alternatif jika gambar gagal dimuat?", options: [ { text: "A. alt", isCorrect: true, feedback: "Benar! 'alt' sangat penting untuk aksesibilitas orang tunanetra." }, { text: "B. title", isCorrect: false, feedback: "Salah! 'title' untuk tooltip saat di-hover." }, { text: "C. desc", isCorrect: false, feedback: "Salah! Tidak ada atribut desc untuk gambar." } ] },
      { question: "11. Tag apa yang digunakan untuk membuat Tautan / Hyperlink agar bisa diklik?", options: [ { text: "A. <link>", isCorrect: false, feedback: "Salah! <link> biasanya dipakai di <head> untuk CSS." }, { text: "B. <a>", isCorrect: true, feedback: "Benar! <a> singkatan dari Anchor." }, { text: "C. <href>", isCorrect: false, feedback: "Salah! href adalah atribut, bukan tag." } ] },
      { question: "12. Atribut penting apa yang HARUS ada di dalam tag <a> agar tombolnya tahu mau diarahkan ke mana?", options: [ { text: "A. src", isCorrect: false, feedback: "Salah! src untuk sumber media seperti gambar." }, { text: "B. href", isCorrect: true, feedback: "Benar! href (Hypertext Reference) menentukan URL tujuan." }, { text: "C. go", isCorrect: false, feedback: "Salah!" } ] },
      { question: "13. Jika kamu ingin membuat daftar yang TIDAK BERURUTAN (menggunakan titik/bullet), tag pelindung utamanya adalah?", options: [ { text: "A. <ol>", isCorrect: false, feedback: "Salah! <ol> untuk daftar angka berurutan (Ordered)." }, { text: "B. <ul>", isCorrect: true, feedback: "Benar! <ul> = Unordered List." }, { text: "C. <list>", isCorrect: false, feedback: "Salah!" } ] },
      { question: "14. Setiap baris atau item di dalam sebuah daftar <ul> atau <ol> wajib dibungkus oleh tag apa?", options: [ { text: "A. <item>", isCorrect: false, feedback: "Salah!" }, { text: "B. <li>", isCorrect: true, feedback: "Tepat sekali! <li> = List Item." }, { text: "C. <p>", isCorrect: false, feedback: "Salah!" } ] },
      { question: "15. Apa fungsi utama dari CSS (Cascading Style Sheets)?", options: [ { text: "A. Untuk membuat logika matematika", isCorrect: false, feedback: "Salah! Itu fungsi Javascript." }, { text: "B. Untuk merancang tampilan, warna, dan tata letak web", isCorrect: true, feedback: "Luar biasa! CSS adalah spesialis desain." }, { text: "C. Untuk menyimpan data ke server", isCorrect: false, feedback: "Salah! Itu fungsi database." } ] },
      { question: "16. Tag apa yang kita gunakan jika kita ingin menulis kode CSS langsung di file HTML kita?", options: [ { text: "A. <css>", isCorrect: false, feedback: "Salah!" }, { text: "B. <design>", isCorrect: false, feedback: "Salah!" }, { text: "C. <style>", isCorrect: true, feedback: "Benar! Kita menggunakan tag <style>." } ] },
      { question: "17. Properti CSS apa yang digunakan untuk mengubah WARNA TEKS?", options: [ { text: "A. color", isCorrect: true, feedback: "Benar! Cukup 'color'." }, { text: "B. text-color", isCorrect: false, feedback: "Salah! Tidak ada properti text-color." }, { text: "C. font-color", isCorrect: false, feedback: "Salah!" } ] },
      { question: "18. Properti CSS apa yang digunakan untuk mengubah WARNA LATAR BELAKANG?", options: [ { text: "A. bg-color", isCorrect: false, feedback: "Salah! Itu kelas utility di framework tertentu." }, { text: "B. background-color", isCorrect: true, feedback: "Benar!" }, { text: "C. back-color", isCorrect: false, feedback: "Salah!" } ] },
      { question: "19. Dalam CSS, apa itu yang disebut sebagai 'Selector'?", options: [ { text: "A. Cara kita memilih elemen HTML mana yang ingin kita hias", isCorrect: true, feedback: "Benar! (contoh: h1, p, body)." }, { text: "B. Nilai warna yang kita berikan", isCorrect: false, feedback: "Salah! Itu namanya Value." }, { text: "C. Kurung kurawal buka tutup {}", isCorrect: false, feedback: "Salah! Itu namanya Declaration Block." } ] },
      { question: "20. Jika kamu ingin membuat SEMUA paragraf <p> memiliki ukuran font 20px, cara penulisan CSS yang benar adalah?", options: [ { text: "A. p { font-size: 20px; }", isCorrect: true, feedback: "SEMPURNA! Kamu telah menguasai dasar HTML & CSS!" }, { text: "B. p = font: 20px", isCorrect: false, feedback: "Salah!" }, { text: "C. <p size='20px'>", isCorrect: false, feedback: "Salah! Itu atribut HTML kuno, bukan CSS." } ] }
    ],
    project: {
      instruction: (
        <>
          <strong>FINAL BOSS FIGHT!</strong><br/><br/>
          Rangkai semua senjatamu dan bangun sebuah <strong>Web Portofolio Utuh</strong> dari nol! 
          Syarat kelulusan:<br/><br/>
          - Struktur <code>&lt;html&gt;</code>, <code>&lt;head&gt;</code>, dan <code>&lt;body&gt;</code>.<br/>
          - <code>&lt;style&gt;</code> untuk gaya CSS.<br/>
          - <code>&lt;h1&gt;</code> untuk namamu.<br/>
          - <code>&lt;p&gt;</code> untuk deskripsi profil.<br/>
          - <code>&lt;img&gt;</code> untuk pas fotomu.<br/>
          - <code>&lt;ul&gt;</code> dan <code>&lt;li&gt;</code> untuk daftar keahlian.<br/>
          - <code>&lt;a&gt;</code> untuk menaruh tautan media sosial.
        </>
      ),
      defaultCode: "<!-- Ujian Akhir Dimulai! Ketik semuanya dari nol! -->\n",
      language: "html"
    }
  },

};
