export interface AIQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface AIQuestContent {
  id: string;
  title: string;
  materi: string; // Markdown or HTML content
  questions: AIQuestion[];
  playgroundLang?: 'html' | 'python';
  playgroundCode?: string;
}

export const fetchAIQuestContentMock = async (questId: string): Promise<AIQuestContent> => {
  // Simulate AI/Backend latency
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Base fallback template
  let content: AIQuestContent = {
    id: questId,
    title: 'Materi Pembelajaran',
    materi: `
<h1>Pengenalan Konsep</h1>
<p>Konsep ini sangat penting dalam memahami fondasi utama dari materi yang sedang kamu pelajari. Berikut adalah poin-poin utamanya:</p>
<ul>
  <li><strong>Pemahaman Dasar</strong>: Mulai dengan definisi sederhana.</li>
  <li><strong>Implementasi Nyata</strong>: Bagaimana hal ini digunakan di dunia nyata.</li>
  <li><strong>Praktik Terbaik</strong>: Hindari kesalahan umum.</li>
</ul>
<p>Teruslah belajar dan berlatih untuk mengasah insting problem-solving kamu!</p>
    `,
    questions: [
      {
        question: 'Berdasarkan materi di atas, apa hal paling pertama yang harus dilakukan saat mempelajari konsep baru?',
        options: [
          'Menghafal rumus',
          'Memahami definisi sederhana',
          'Langsung mengerjakan tugas berat',
          'Mengabaikan kesalahan umum'
        ],
        correctAnswerIndex: 1,
        explanation: 'Memahami definisi sederhana adalah langkah pertama (Pemahaman Dasar) sebelum masuk ke implementasi.',
      }
    ],
  };

  if (questId === 'html-1') {
    content = {
      id: questId,
      title: 'Deep Dive: Arsitektur HTML Modern',
      materi: `
<h1>HyperText Markup Language (HTML)</h1>
<p>Secara konseptual, HTML bukanlah sekadar teks statis, melainkan sebuah <strong>Document Object Model (DOM)</strong> yang di-<em>parsing</em> oleh browser untuk membentuk struktur node hirarkis (Tree Structure).</p>
<br/>
<h2>1. Anatomi Elemen Semantik</h2>
<p>Sejak rilisnya HTML5, penggunaan elemen semantik (<em>semantic tags</em>) menjadi standar industri mutlak untuk memastikan aksesibilitas (a11y) dan Search Engine Optimization (SEO) yang optimal. Membungkus segala hal dengan <code>&lt;div&gt;</code> (div-soup) adalah <em>anti-pattern</em>.</p>
<ul>
  <li><code>&lt;main&gt;</code>: Merepresentasikan konten utama dokumen. Hanya boleh ada satu tag ini per halaman.</li>
  <li><code>&lt;article&gt;</code>: Konten independen yang dapat didistribusikan secara mandiri (misal: postingan blog, berita).</li>
  <li><code>&lt;section&gt;</code>: Bagian tematik dari sebuah dokumen, idealnya memiliki heading (<code>&lt;h1&gt;-&lt;h6&gt;</code>) sendiri.</li>
  <li><code>&lt;nav&gt;</code>: Khusus untuk blok tautan navigasi utama.</li>
</ul>
<br/>
<h2>2. Metadata & Critical Rendering Path</h2>
<p>Bagian <code>&lt;head&gt;</code> dari HTML sangat krusial karena menentukan bagaimana browser merender halaman sebelum pengguna melihat apapun.</p>
<pre><code>
&lt;!DOCTYPE html&gt;
&lt;html lang="id"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
    &lt;meta name="description" content="Platform belajar web dev terbaik"&gt;
    &lt;link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin&gt;
    &lt;title&gt;PathTrick - Mastery&lt;/title&gt;
&lt;/head&gt;
</code></pre>
<p>Tag <code>&lt;meta name="viewport"&gt;</code> memastikan situsmu responsif di perangkat mobile. Sementara <code>&lt;link rel="preload"&gt;</code> adalah teknik <em>performance optimization</em> tingkat lanjut untuk memaksa browser mengunduh aset kritikal (seperti font atau hero image) lebih awal, mencegah fenomena FOUT (Flash of Unstyled Text).</p>
<br/>
<h2>3. Atribut Global (Global Attributes)</h2>
<p>Beberapa atribut dapat diaplikasikan ke hampir semua elemen HTML, memberikan kontrol ekstensif pada behavior dan styling:</p>
<ul>
  <li><strong>class</strong> & <strong>id</strong>: Kait (hooks) utama untuk CSS dan JavaScript. (Catatan: <code>id</code> harus unik di seluruh dokumen).</li>
  <li><strong>data-*</strong> (Custom Data Attributes): Sangat berguna untuk menyimpan data kustom tanpa harus menggunakan properti non-standar. Misalnya: <code>&lt;button data-user-id="123"&gt;</code>.</li>
  <li><strong>aria-*</strong> (Accessible Rich Internet Applications): Meningkatkan aksesibilitas bagi pengguna *screen reader*.</li>
</ul>
      `,
      questions: [
        {
          question: 'Berdasarkan materi di atas, manakah praktik TERBAIK yang sesuai dengan standar HTML5 modern?',
          options: [
            'Membungkus semua konten menggunakan <div> untuk memudahkan styling CSS.',
            'Menggunakan tag <article> untuk blok navigasi utama agar SEO meningkat.',
            'Memanfaatkan custom data attributes (data-*) untuk menyimpan data state di dalam elemen.',
            'Menghilangkan tag <meta name="viewport"> untuk mempercepat loading speed di mobile.'
          ],
          correctAnswerIndex: 2,
          explanation: 'Benar! Atribut data-* adalah standar HTML5 yang aman untuk menyisipkan data kustom ke elemen DOM. Pilihan lain salah (div-soup adalah anti-pattern, nav untuk navigasi, dan viewport wajib untuk responsivitas).',
        },
        {
          question: 'Apa fungsi dari <link rel="preload"> pada bagian <head>?',
          options: [
            'Menghubungkan halaman HTML dengan file CSS secara asinkron.',
            'Memaksa browser mengunduh aset kritikal lebih awal untuk mencegah FOUT.',
            'Memuat halaman berikutnya di background (prefetch) saat user hover link.',
            'Menandakan bahwa halaman tersebut memiliki prioritas SEO tertinggi.'
          ],
          correctAnswerIndex: 1,
          explanation: 'Tepat! <link rel="preload"> digunakan sebagai teknik performance optimization tingkat lanjut untuk memaksa browser mengunduh aset krusial (seperti font) sedini mungkin.',
        }
      ],
      playgroundLang: 'html',
      playgroundCode: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; text-align: center; margin-top: 50px; }
    button { padding: 10px 20px; font-size: 16px; background: #3b82f6; color: white; border: none; border-radius: 5px; cursor: pointer; }
    button:hover { background: #2563eb; }
  </style>
</head>
<body>
  <h1>Hello PathTrick!</h1>
  <p>Coba ubah teks ini dan klik Run.</p>
  <button onclick="alert('Tombol ditekan!')">Klik Saya</button>
</body>
</html>`
    };
  } else if (questId === 'html-2') {
    content = {
      id: questId,
      title: 'Tags & Elements',
      materi: `
<h1>Menyusun Konten dengan Elemen HTML</h1>
<p>Kalau House 1 mengajarkan bahwa HTML adalah kerangka rumah, maka materi ini membahas cara menata isi ruangannya. Heading adalah papan nama ruangan, paragraf adalah isi percakapan di dalam ruangan, list adalah rak yang membuat barang tersusun, dan link adalah pintu yang membawa pengunjung ke tempat lain.</p>
<p>Tujuan materi ini bukan sekadar hafal nama tag, tapi memahami kapan sebuah tag dipakai. Browser, mesin pencari, dan screen reader membaca HTML seperti membaca denah. Semakin jelas labelnya, semakin mudah halamanmu dipahami.</p>
<br/>

<h2>Analogi Utama: Label Ruangan dan Kardus Pindahan</h2>
<p>Bayangkan kamu baru pindah rumah. Kalau semua barang ditaruh dalam kardus polos tanpa label, kamu akan bingung mencari buku, pakaian, atau alat masak. Tag HTML bekerja seperti label kardus itu. <code>&lt;h1&gt;</code> memberi tahu "ini judul utama", <code>&lt;p&gt;</code> memberi tahu "ini paragraf", <code>&lt;ul&gt;</code> memberi tahu "ini daftar", dan <code>&lt;a&gt;</code> memberi tahu "ini pintu menuju alamat lain".</p>
<p>Kesalahan pemula biasanya memakai tag hanya karena tampilannya terlihat cocok. Padahal HTML lebih dulu bicara soal makna. Tampilan nanti diurus CSS.</p>
<br/>

<h2>1. Heading dan Hierarchy</h2>
<p>HTML menyediakan 6 level heading: <code>&lt;h1&gt;</code> sampai <code>&lt;h6&gt;</code>. Anggap heading seperti daftar isi buku. <code>&lt;h1&gt;</code> adalah judul buku, <code>&lt;h2&gt;</code> adalah bab, <code>&lt;h3&gt;</code> adalah sub-bab, dan seterusnya.</p>
<p>Aturan utamanya adalah <strong>jangan melompati level heading</strong>. Jika kamu punya <code>&lt;h2&gt;</code>, sub-bagian di dalamnya sebaiknya menggunakan <code>&lt;h3&gt;</code>, bukan langsung <code>&lt;h4&gt;</code>. Ini penting untuk SEO dan pengguna screen reader, karena mereka sering menavigasi halaman dari struktur heading.</p>
<pre><code>&lt;h1&gt;Portfolio Rania&lt;/h1&gt;
&lt;h2&gt;Tentang Saya&lt;/h2&gt;
&lt;p&gt;Saya belajar web development untuk membangun produk digital.&lt;/p&gt;
&lt;h2&gt;Project&lt;/h2&gt;
&lt;h3&gt;Website Bio Personal&lt;/h3&gt;</code></pre>
<p>Pola di atas lebih rapi daripada tiba-tiba memakai <code>&lt;h4&gt;</code> hanya karena ukurannya terlihat pas. Ukuran teks adalah urusan CSS, bukan alasan memilih heading.</p>
<br/>

<h2>2. Paragraf dan Penekanan Teks</h2>
<p>Tag <code>&lt;p&gt;</code> dipakai untuk paragraf, yaitu satu blok ide yang utuh. Jangan menulis banyak kalimat panjang langsung di dalam <code>&lt;body&gt;</code> tanpa tag, karena browser memang masih bisa menampilkan teksnya, tapi struktur dokumennya jadi kabur.</p>
<p>Untuk memberi penekanan, gunakan tag yang punya makna:</p>
<ul>
  <li><code>&lt;strong&gt;</code>: menandai teks yang penting, biasanya tampil tebal.</li>
  <li><code>&lt;em&gt;</code>: menandai penekanan atau intonasi, biasanya tampil miring.</li>
  <li><code>&lt;br&gt;</code>: memaksa pindah baris, tetapi jangan dipakai untuk membuat layout.</li>
</ul>
<pre><code>&lt;p&gt;Saya sedang belajar &lt;strong&gt;HTML&lt;/strong&gt; karena ingin membuat portfolio yang &lt;em&gt;rapi dan mudah dibaca&lt;/em&gt;.&lt;/p&gt;</code></pre>
<br/>

<h2>3. Inline vs Block Elements</h2>
<p>Memahami perbedaan ini adalah kunci sebelum belajar CSS:</p>
<ul>
  <li><strong>Block Elements</strong> (misal: <code>&lt;p&gt;</code>, <code>&lt;div&gt;</code>, <code>&lt;h1&gt;</code>): Mengambil lebar penuh dari parent-nya dan selalu mulai di baris baru.</li>
  <li><strong>Inline Elements</strong> (misal: <code>&lt;span&gt;</code>, <code>&lt;a&gt;</code>, <code>&lt;strong&gt;</code>): Hanya mengambil lebar sebesar kontennya dan tidak memaksa baris baru.</li>
</ul>
<p>Analogi sederhananya: block element seperti meja besar yang mengambil satu baris ruangan, sedangkan inline element seperti stabilo di atas kalimat. Ia menempel pada teks tanpa memecah alur bacaan.</p>
<pre><code>&lt;p&gt;Ini paragraf block. Di dalamnya ada &lt;strong&gt;teks penting&lt;/strong&gt; yang inline.&lt;/p&gt;
&lt;p&gt;Ini paragraf block berikutnya, otomatis mulai di baris baru.&lt;/p&gt;</code></pre>
<br/>

<h2>4. Membuat Daftar: UL, OL, dan LI</h2>
<p>List dipakai ketika informasi lebih enak dibaca sebagai butir-butir. Untuk daftar yang urutannya tidak penting, gunakan <code>&lt;ul&gt;</code> atau unordered list. Untuk langkah yang harus berurutan, gunakan <code>&lt;ol&gt;</code> atau ordered list. Setiap item di dalamnya wajib memakai <code>&lt;li&gt;</code>.</p>
<pre><code>&lt;h2&gt;Skills&lt;/h2&gt;
&lt;ul&gt;
  &lt;li&gt;HTML semantic&lt;/li&gt;
  &lt;li&gt;Menulis konten web&lt;/li&gt;
  &lt;li&gt;Membuat struktur portfolio&lt;/li&gt;
&lt;/ul&gt;

&lt;h2&gt;Langkah Belajar&lt;/h2&gt;
&lt;ol&gt;
  &lt;li&gt;Baca materi&lt;/li&gt;
  &lt;li&gt;Coba live lab&lt;/li&gt;
  &lt;li&gt;Kerjakan mini project&lt;/li&gt;
&lt;/ol&gt;</code></pre>
<p>Kesalahan yang sering terjadi adalah menaruh teks langsung di dalam <code>&lt;ul&gt;</code> tanpa <code>&lt;li&gt;</code>. Itu seperti punya rak, tapi barangnya dilempar begitu saja tanpa kotak.</p>
<br/>

<h2>5. Link dengan Tag A</h2>
<p>Tag <code>&lt;a&gt;</code> atau anchor adalah pintu antar halaman. Atribut paling pentingnya adalah <code>href</code>, yaitu alamat tujuan.</p>
<pre><code>&lt;a href="https://pathtrick.example"&gt;Kunjungi Portfolio Saya&lt;/a&gt;</code></pre>
<p>Kalau link dibuka di tab baru dengan <code>target="_blank"</code>, tambahkan <code>rel="noopener noreferrer"</code> agar lebih aman.</p>
<pre><code>&lt;a href="https://example.com" target="_blank" rel="noopener noreferrer"&gt;
  Buka Referensi
&lt;/a&gt;</code></pre>
<br/>

<h2>6. Checklist Berpikir Saat Memilih Tag</h2>
<ul>
  <li>Apakah ini judul bagian? Gunakan heading sesuai levelnya.</li>
  <li>Apakah ini satu blok penjelasan? Gunakan <code>&lt;p&gt;</code>.</li>
  <li>Apakah ini daftar item? Gunakan <code>&lt;ul&gt;</code> atau <code>&lt;ol&gt;</code> dengan <code>&lt;li&gt;</code>.</li>
  <li>Apakah ini menuju halaman lain? Gunakan <code>&lt;a&gt;</code> dengan <code>href</code>.</li>
  <li>Apakah kamu memilih tag karena ukuran tampilannya? Berhenti dulu. Ukuran diatur CSS.</li>
</ul>
<br/>

<h2>7. Mini Latihan Mental</h2>
<p>Kalimat "Rania adalah calon frontend developer yang suka membuat interface rapi" sebaiknya dibungkus dengan <code>&lt;p&gt;</code>. Teks "Skills" sebaiknya menjadi heading seperti <code>&lt;h2&gt;</code>. Tiga skill seperti "HTML", "CSS", dan "JavaScript" sebaiknya masuk ke dalam <code>&lt;ul&gt;</code> dengan tiga <code>&lt;li&gt;</code>.</p>
<p>Begitu kamu mulai melihat konten sebagai struktur, HTML terasa jauh lebih masuk akal: bukan hafalan tag, tapi seni memberi nama yang benar pada bagian-bagian halaman.</p>
      `,
      questions: [
        {
          question: 'Kenapa kita tidak boleh sembarangan melompati urutan tag Heading (h1, h2, lalu tiba-tiba h4)?',
          options: [
            'Karena akan merusak algoritma CSS Flexbox.',
            'Karena browser akan gagal me-render halaman tersebut.',
            'Karena bisa membingungkan algoritma SEO dan pengguna Screen Reader.',
            'Hanya karena alasan estetika semata.'
          ],
          correctAnswerIndex: 2,
          explanation: 'Benar! Heading hierarchy membentuk kerangka logis dari dokumen. Melewatinya merusak aksesibilitas dan SEO.',
        },
        {
          question: 'Mana dari tag di bawah ini yang secara *default* ber-tipe INLINE?',
          options: [
            '<p>',
            '<div>',
            '<h1>',
            '<span>'
          ],
          correctAnswerIndex: 3,
          explanation: 'Tepat! <span> adalah elemen inline, sedangkan p, div, dan h1 adalah elemen block.',
        },
        {
          question: 'Kapan kita sebaiknya memakai <ol> dibanding <ul>?',
          options: [
            'Saat daftar punya urutan langkah yang penting.',
            'Saat ingin teks tampil lebih besar.',
            'Saat membuat paragraf panjang.',
            'Saat membuat link ke halaman lain.'
          ],
          correctAnswerIndex: 0,
          explanation: 'Benar. <ol> cocok untuk langkah berurutan, sedangkan <ul> cocok untuk daftar yang urutannya tidak terlalu penting.',
        },
        {
          question: 'Apa kesalahan konsep yang sering terjadi saat memilih tag heading?',
          options: [
            'Memakai heading berdasarkan makna struktur.',
            'Memakai heading hanya karena ukuran teksnya terlihat cocok.',
            'Memakai <h1> untuk judul utama halaman.',
            'Memakai <h2> untuk judul bagian setelah <h1>.'
          ],
          correctAnswerIndex: 1,
          explanation: 'Tepat. Heading dipilih berdasarkan struktur informasi, bukan ukuran visual. Ukuran visual nanti diatur dengan CSS.',
        }
      ],
      playgroundLang: 'html',
      playgroundCode: `<!-- Rapikan struktur konten ini.
Tugas:
1. Jadikan nama sebagai <h1>
2. Jadikan "Tentang Saya" dan "Skills" sebagai <h2>
3. Bungkus deskripsi diri dengan <p>
4. Buat daftar skills memakai <ul> dan <li>
5. Tambahkan satu link portfolio dengan <a href="#"> -->

Rania Putri
Tentang Saya
Saya sedang belajar frontend development karena ingin membuat website portfolio yang rapi, mudah dibaca, dan ramah mesin pencari.
Skills
HTML semantic
Menulis konten web
Membuat struktur portfolio
Portfolio saya`
    };
  } else if (questId === 'html-3') {
    content = {
      id: questId,
      title: 'Quiz Komprehensif HTML Dasar',
      materi: `
<h1>Ujian Tengah Modul</h1>
<p>Di tahap ini, mari kita asah insting *debugging* dan pemahaman sintaksmu. Tidak ada materi baru di sini, langsung terjun ke *Playground* untuk memperbaiki *bug* dan jawab soal teorinya!</p>
<p><em>Misi: Perbaiki kode di Playground sehingga link tersebut bisa diklik dan terbuka di tab baru!</em></p>
      `,
      questions: [
        {
          question: 'Untuk membuat link terbuka di tab baru (new tab), atribut apa yang harus ditambahkan pada tag <a>?',
          options: [
            'target="_blank"',
            'href="new_tab"',
            'window="new"',
            'rel="noopener"'
          ],
          correctAnswerIndex: 0,
          explanation: 'Benar! Atribut target="_blank" memerintahkan browser membuka tautan di tab baru.',
        },
        {
          question: 'Jika sebuah path gambar tertulis <img src="../images/logo.png">, apa arti dari "../"?',
          options: [
            'Masuk ke dalam folder "images".',
            'Mencari file gambar dari server eksternal.',
            'Mundur satu tingkat ke parent directory (folder di atasnya).',
            'Berarti direktori tersebut disembunyikan (hidden folder).'
          ],
          correctAnswerIndex: 2,
          explanation: 'Tepat! Simbol "../" digunakan pada *relative path* untuk naik satu tingkat direktori.',
        }
      ],
      playgroundLang: 'html',
      playgroundCode: `<!-- Terdapat BUG pada kode di bawah. Perbaiki! -->
<a href="https://google.com">
  Klik untuk ke Google
</a href>`
    };
  } else if (questId === 'html-4') {
    content = {
      id: questId,
      title: 'Mini Project: Bio Page',
      materi: `
<h1>Membangun Mini Portofolio</h1>
<p>Tiba saatnya mengimplementasikan semua yang sudah dipelajari. Sebuah halaman "Link in Bio" atau portofolio sederhana membutuhkan gabungan elemen block, inline, gambar, dan list.</p>
<br/>
<h2>Menggunakan Media dan Gambar</h2>
<p>Tag <code>&lt;img&gt;</code> bersifat *self-closing* (tidak butuh tag penutup). Wajib hukumnya menyediakan atribut <code>alt</code> untuk aksesibilitas dan antisipasi gambar gagal dimuat.</p>
<pre><code>
&lt;img src="profile.jpg" alt="Foto profil John Doe" width="150"&gt;
</code></pre>
      `,
      questions: [
        {
          question: 'Apa fungsi utama dari atribut "alt" pada tag <img>?',
          options: [
            'Menentukan alternatif sumber gambar jika gambar utama lambat.',
            'Memberikan deskripsi tekstual untuk Screen Reader dan ketika gambar gagal di-load.',
            'Menyimpan resolusi asli dari gambar.',
            'Memberikan efek hover text otomatis (tooltip).'
          ],
          correctAnswerIndex: 1,
          explanation: 'Benar! Atribut alt adalah pilar aksesibilitas web.',
        },
        {
          question: 'Apakah tag <img> merupakan elemen *self-closing*?',
          options: [
            'Ya, tidak membutuhkan tag penutup seperti </img>.',
            'Tidak, ia wajib ditutup dengan </img>.',
            'Tergantung versi HTML yang digunakan.',
            'Hanya self-closing jika berada di dalam tag <div>.'
          ],
          correctAnswerIndex: 0,
          explanation: 'Betul! <img>, <input>, <br>, dan <hr> adalah contoh void elements (self-closing).',
        }
      ],
      playgroundLang: 'html',
      playgroundCode: `<div style="border: 2px solid #ccc; padding: 20px; border-radius: 10px; max-width: 300px; margin: auto; text-align: center;">
  <!-- Tambahkan tag img di bawah ini untuk foto profil -->
  
  <h2>Nama Kamu</h2>
  <p style="color: gray;">Web Developer</p>
  <ul style="list-style: none; padding: 0;">
    <li style="margin: 10px 0; background: #eee; padding: 10px; border-radius: 5px;">
      <a href="#" style="text-decoration: none; color: black;">Portofolio</a>
    </li>
  </ul>
</div>`
    };
  } else if (questId === 'html-5') {
    content = {
      id: questId,
      title: 'Boss Battle: HTML Mastery',
      materi: `
<h1>Ujian Akhir: Master of HTML</h1>
<p>Selamat! Kamu telah mencapai gerbang akhir modul HTML Basics. Di tahap ini, kamu akan menghadapi bos terakhir. Pertanyaan ini akan menguji seluruh pemahaman komprehensifmu tentang arsitektur HTML5.</p>
<p>Tidak ada *playground* yang akan menuntunmu di sini. Andalkan insting dan logikamu!</p>
      `,
      questions: [
        {
          question: 'Dalam arsitektur form HTML5 yang tepat saing, bagaimana cara terbaik menghubungkan sebuah <label> dengan <input> text?',
          options: [
            'Membungkus <input> dengan <div> lalu menambahkan label di atasnya.',
            'Menggunakan atribut "id" pada <input> dan menghubungkannya dengan atribut "for" pada <label>.',
            'Menggunakan tag <link> di antara keduanya.',
            'Hanya dengan meletakkan tag <label> tepat di sebelah kiri tag <input>.'
          ],
          correctAnswerIndex: 1,
          explanation: 'Sempurna! <label for="username"> harus menunjuk ke <input id="username">. Ini sangat krusial untuk UX dan Screen Readers.',
        },
        {
          question: 'Manakah dari struktur HTML5 berikut yang paling merepresentasikan *Semantic Web*?',
          options: [
            '<body> <div id="nav">...</div> <div id="main">...</div> </body>',
            '<body> <header>...</header> <main>...</main> <footer>...</footer> </body>',
            '<body> <b>Header</b> <p>Main</p> <i>Footer</i> </body>',
            '<html> <nav>...</nav> <section>...</section> </html>'
          ],
          correctAnswerIndex: 1,
          explanation: 'Luar Biasa! Kamu telah membuktikan pemahamanmu akan Semantic Web HTML5. Penggunaan header, main, dan footer adalah struktur yang ideal.',
        }
      ],
    };
  } else if (questId.startsWith('py-')) {
    content = {
      id: questId,
      title: 'Python: Arsitektur & Logika Lanjutan',
      materi: `
<h1>Menyelami Python: Dynamic Typing & Object Philosophy</h1>
<p>Python adalah bahasa tingkat tinggi dengan paradigma <em>multi-paradigm</em> (mendukung object-oriented, procedural, dan functional programming). Di Python, <strong>segala hal adalah objek</strong> (Everything is an object), mulai dari angka integer sederhana hingga fungsi itu sendiri (First-class functions).</p>
<br/>
<h2>1. Memory Management & Dynamic Typing</h2>
<p>Python tidak mensyaratkan deklarasi tipe data secara eksplisit (Dynamic Typing). Variabel di Python hanyalah sekadar "label" atau "referensi" (pointer) yang menunjuk ke lokasi memori suatu objek.</p>
<pre><code>
x = 10        # 'x' menunjuk ke objek integer 10
x = "Hello"   # sekarang 'x' pindah menunjuk ke objek string
</code></pre>
<p>Hal ini berbeda dengan bahasa seperti C++ atau Java (Static Typing). Keuntungannya adalah fleksibilitas yang sangat tinggi, namun risikonya adalah <em>runtime error</em> yang sulit dideteksi jika kamu tidak menggunakan Type Hinting (standar modern PEP 484).</p>
<br/>
<h2>2. Control Flow: Beyond if-else</h2>
<p>Di balik struktur dasar <code>if</code>, <code>elif</code>, dan <code>else</code>, Python memiliki fitur <em>list comprehension</em> yang sangat diandalkan oleh para Pythonista untuk menulis logika iterasi yang elegan dan efisien.</p>
<pre><code>
# Cara tradisional
squares = []
for i in range(10):
    if i % 2 == 0:
        squares.append(i**2)

# Cara Pythonic (List Comprehension)
squares = [i**2 for i in range(10) if i % 2 == 0]
</code></pre>
<p>List comprehension tidak hanya lebih singkat secara sintaksis, tetapi juga dioptimasi pada level C di dalam CPython, sehingga eksekusinya jauh lebih cepat daripada for-loop biasa.</p>
<br/>
<h2>3. The Zen of Python</h2>
<p>Prinsip utama yang membedakan kode Python yang *expert* ("Pythonic") dengan kode pemula diringkas dalam PEP 20 (The Zen of Python). Beberapa di antaranya:</p>
<ul>
  <li><em>Explicit is better than implicit.</em> (Jangan biarkan <em>magic</em> menyembunyikan alur programmu).</li>
  <li><em>Readability counts.</em> (Kode lebih sering dibaca daripada ditulis).</li>
</ul>
      `,
      questions: [
        {
          question: 'Mengapa list comprehension seringkali lebih direkomendasikan dibandingkan for-loop tradisional di Python?',
          options: [
            'Karena list comprehension secara otomatis mendeklarasikan tipe data statis di belakang layar.',
            'Karena list comprehension dioptimasi pada level C dan seringkali dieksekusi lebih cepat, selain lebih mudah dibaca.',
            'Karena for-loop tradisional tidak mendukung kondisi (if) di dalam iterasi.',
            'Karena list comprehension mengonsumsi memori (RAM) 50% lebih sedikit daripada for-loop.'
          ],
          correctAnswerIndex: 1,
          explanation: 'Benar! List comprehension eksekusinya di CPython lebih cepat karena meniadakan *overhead* dari pemanggilan metode .append() berulang kali.',
        },
        {
          question: 'Konsep "Dynamic Typing" di Python berarti...',
          options: [
            'Kita harus mendeklarasikan tipe data setiap variabel secara eksplisit sebelum menjalankannya.',
            'Tipe data variabel dikonversi secara otomatis ke String setiap kali di-print.',
            'Variabel hanyalah label/pointer yang bisa menunjuk ke objek memori dengan tipe data apa pun selama runtime.',
            'Semua data bertipe statis pada saat kompilasi, namun dinamis saat dieksekusi.'
          ],
          correctAnswerIndex: 2,
          explanation: 'Betul! Variabel di Python hanyalah label (pointer) yang menunjuk ke lokasi memori suatu objek, sehingga bisa menunjuk tipe objek yang berbeda selama program berjalan.',
        }
      ],
      playgroundLang: 'python',
      playgroundCode: `# Coba jalankan kode Python ini!
def sapa_petualang(nama):
    print(f"Halo {nama}, selamat datang di PathTrick!")

sapa_petualang("Ksatria Kode")

# List comprehension example
squares = [i**2 for i in range(1, 6)]
print("Squares:", squares)`
    };
  }

  return content;
};
