// @ts-nocheck
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

const rawText = `
# MODUL 1: Anatomi dan Fisiologi Dasar Manusia (Mesin Kehidupan)

## BAB 1: SISTEM KARDIOVASKULAR (MESIN KEHIDUPAN)

### LEVEL 1: Anatomi Jantung Sang Pompa Utama

#### Materi

Jantung manusia adalah organ berotot seukuran kepalan tangan yang terletak di rongga dada bagian tengah (mediastinum), sedikit condong ke kiri. Jantung terus berdetak tanpa henti sekitar 100.000 kali per hari. Secara anatomis, dinding jantung terdiri dari tiga lapisan:

1. **Epikardium (luar):** Lapisan pelindung luar. Jantung juga dibungkus oleh kantung ganda bernama **Perikardium** yang berisi cairan pelumas untuk mencegah gesekan saat jantung berdenyut.
2. **Miokardium (tengah):** Lapisan otot jantung yang tebal dan bertanggung jawab penuh atas kontraksi (denyut) jantung.
3. **Endokardium (dalam):** Lapisan endotel tipis yang melapisi bagian dalam ruang jantung dan katup.

Jantung terbagi menjadi 4 ruang:

- **Atrium (Serambi) Kanan & Kiri:** Berada di atas, berdinding tipis, berfungsi sebagai "ruang penerima" darah yang kembali ke jantung.
- **Ventrikel (Bilik) Kanan & Kiri:** Berada di bawah, berdinding tebal, berfungsi sebagai "pompa utama" yang mendorong darah keluar dari jantung. **Ventrikel kiri** memiliki dinding miokardium yang paling tebal (sekitar 3 kali lipat lebih tebal dari ventrikel kanan) karena tugasnya sangat berat: memompa darah melawan gravitasi dan tekanan ke seluruh ujung tubuh.

Untuk memastikan darah mengalir searah dan tidak kembali ke belakang (regurgitasi), jantung memiliki 4 katup (klep):

- **Katup Atrioventrikuler (AV):** Pemisah atrium dan ventrikel. Terdiri dari katup **Trikuspidalis** (kanan, 3 daun) dan katup **Bikuspidalis/Mitral** (kiri, 2 daun).
- **Katup Semilunar:** Terletak di jalur keluar ventrikel. Terdiri dari katup **Pulmonal** (menuju paru-paru) dan katup **Aorta** (menuju seluruh tubuh).

#### Kuis

1. Ruang jantung manusia yang berfungsi memompa darah kaya oksigen ke seluruh tubuh adalah... (A. Atrium kanan, B. Ventrikel kanan, C. Atrium kiri, **D. Ventrikel kiri**)
2. Katup yang membatasi antara atrium kiri dan ventrikel kiri disebut katup... (A. Trikuspidalis, **B. Bikuspidalis/Mitral**, C. Semilunar, D. Aorta)
3. Otot jantung disebut juga dengan istilah medis... (A. Epikardium, **B. Miokardium**, C. Endokardium, D. Perikardium)
4. Pembungkus jantung yang berfungsi melindungi dari gesekan disebut... (A. Pleura, **B. Perikardium**, C. Meninges, D. Kapsula Bowman)

### LEVEL 2: Jalan Raya Tubuh (Pembuluh Darah)

#### Materi

Sistem peredaran darah manusia adalah sistem tertutup, artinya darah selalu mengalir di dalam tabung pembuluh darah. Panjang total pembuluh darah manusia dewasa bisa mencapai 100.000 km! Terdapat tiga jenis utama pembuluh darah:

1. **Arteri (Pembuluh Nadi):**
Membawa darah *keluar* dari jantung. Karena menerima darah langsung dari pompaan bilik jantung, arteri harus menahan tekanan yang sangat tinggi. Oleh karena itu, dinding arteri sangat **tebal, berotot, dan sangat elastis** (bisa melebar dan menyempit). Semua arteri membawa darah kaya Oksigen (O2), *kecuali* Arteri Pulmonalis yang membawa darah kotor ke paru-paru. Letak arteri biasanya tersembunyi jauh di dalam permukaan tubuh.
2. **Vena (Pembuluh Balik):**
Membawa darah *kembali* menuju jantung. Tekanan darah di dalam vena sangat rendah. Agar darah dari kaki bisa naik ke jantung melawan gravitasi, vena memiliki ciri khas: **dindingnya tipis, tidak terlalu elastis, dan memiliki banyak katup (klep) satu arah** di sepanjang salurannya. Vena juga dibantu oleh kontraksi otot rangka (otot betis) yang memeras pembuluh vena untuk mendorong darah naik. Letak vena biasanya dekat dengan permukaan kulit dan tampak kebiruan.
3. **Kapiler:**
Pembuluh darah mikroskopis yang menjembatani ujung arteri terkecil (arteriol) dan vena terkecil (venula). Dinding kapiler hanya setebal satu lapis sel (endotelium) dan memiliki pori-pori. Di sinilah letak "pasar pertukaran" sesungguhnya terjadi: Oksigen dan nutrisi dari darah menembus dinding kapiler masuk ke dalam sel-sel tubuh, sementara Karbon dioksida dan zat sisa dari sel masuk ke dalam kapiler untuk dibuang.

#### Kuis

1. Ciri khas pembuluh nadi (arteri) dibandingkan pembuluh balik (vena) adalah... (**A. Dinding tebal dan elastis**, B. Letaknya dekat permukaan kulit, C. Memiliki banyak katup di sepanjang pembuluh, D. Darah mengalir lambat)
2. Pembuluh darah terkecil tempat terjadinya pertukaran gas oksigen dan karbon dioksida adalah... (A. Aorta, B. Vena Cava, **C. Kapiler**, D. Venula)
3. Satu-satunya arteri yang membawa darah kaya karbon dioksida adalah... (A. Arteri Koroner, B. Aorta, **C. Arteri Pulmonalis**, D. Arteri Karotis)
4. Jika pembuluh darah ini terluka, darah akan memancar. Ini adalah ciri pembuluh... (**A. Nadi/Arteri**, B. Balik/Vena, C. Kapiler, D. Limfe)

### LEVEL 3: Komponen Darah Manusia

#### Materi

Tubuh manusia dewasa mengandung sekitar 4,5 hingga 5,5 liter darah. Darah bukan sekadar cairan merah, melainkan sebuah jaringan ikat cair yang sangat kompleks. Jika darah dimasukkan ke tabung reaksi dan diputar di mesin sentrifuge, ia akan terpisah menjadi dua bagian utama:

1. **Plasma Darah (55%):** Bagian cairan yang berwarna kekuningan. Tersusun atas 90% air. Sisanya berisi zat-zat terlarut yang sangat penting: protein plasma (seperti *Albumin* untuk menjaga tekanan osmotik, *Globulin* untuk antibodi, dan *Fibrinogen* untuk pembekuan), hormon, nutrisi (glukosa, asam amino), gas terlarut, dan ion/elektrolit.
2. **Elemen Seluler (45%):**
    - **Eritrosit (Sel Darah Merah):** Jumlahnya paling banyak (4-5 juta/mm3). Bentuknya *bikonkaf* (seperti donat tanpa lubang tembus) untuk memperluas permukaan, dan uniknya: **tidak memiliki inti sel (nukleus)** saat dewasa agar bisa menampung lebih banyak molekul **Hemoglobin (Hb)**. Hemoglobin mengandung zat besi (Fe) yang mengikat oksigen secara reversibel.
    - **Leukosit (Sel Darah Putih):** Pasukan khusus sistem imun (kekebalan). Jumlahnya sekitar 5.000-10.000/mm3. Mereka bisa bergerak menembus dinding kapiler (diapedesis) untuk memburu bakteri. Terdiri dari *Neutrofil* dan *Makrofag* (spesialis memakan bakteri/fagositosis), serta *Limfosit* (pembuat antibodi).
    - **Trombosit (Keping Darah):** Fragmen sel kecil yang berperan krusial dalam kaskade pembekuan darah. Ketika pembuluh terluka, trombosit akan pecah dan mengeluarkan enzim **Tromboplastin**. Dengan bantuan Ion Kalsium (Ca2+) dan Vitamin K, tromboplastin mengubah *Protrombin* menjadi *Trombin*. Trombin lalu mengubah *Fibrinogen* (protein larut) menjadi **benang-benang Fibrin** yang bertindak seperti jaring untuk menambal luka.

#### Kuis

1. Protein pada sel darah merah yang berfungsi mengikat oksigen disebut... (A. Fibrinogen, B. Globulin, **C. Hemoglobin**, D. Albumin)
2. Sel darah yang memiliki fungsi utama menelan bakteri dan benda asing (fagositosis) adalah... (A. Eritrosit, **B. Leukosit**, C. Trombosit, D. Keping Darah)
3. Pada proses pembekuan darah, perubahan fibrinogen menjadi benang-benang fibrin dikatalisis oleh... (A. Tromboplastin, B. Protrombin, **C. Trombin**, D. Ion Kalsium)
4. Bagian cair dari darah yang mengangkut sari makanan dan hormon disebut... (A. Serum, **B. Plasma Darah**, C. Cairan Limfe, D. Cairan Intersisial)

### LEVEL 4: Rute Peredaran Darah (Besar & Kecil)

#### Materi

Mamalia (termasuk manusia) memiliki sistem peredaran darah tertutup dan ganda. Artinya, dalam satu kali beredar ke seluruh tubuh, darah harus melewati jantung sebanyak *dua kali*. Hal ini memisahkan darah kaya oksigen dengan darah kaya karbon dioksida secara sempurna.

1. **Peredaran Darah Kecil (Sirkulasi Pulmonal): Rute Pembersihan Darah***Tujuan: Membuang CO2 ke paru-paru dan mengambil O2.*
Darah kotor (kaya CO2) dari seluruh tubuh berkumpul di **Atrium Kanan** -> turun ke **Ventrikel Kanan** -> dipompa keluar melalui **Arteri Pulmonalis** -> masuk ke paru-paru kanan dan kiri. Di alveolus paru-paru, terjadi pertukaran gas. Darah yang kini sudah bersih (kaya O2) kembali ke jantung melalui **Vena Pulmonalis** -> masuk ke **Atrium Kiri**.
*(Ringkasan: Jantung Kanan -> Paru-paru -> Jantung Kiri)*
2. **Peredaran Darah Besar (Sirkulasi Sistemik): Rute Distribusi Energi***Tujuan: Mengirim O2 dan nutrisi ke otak, organ, dan seluruh jaringan tubuh.*
Darah bersih dari **Atrium Kiri** -> turun ke **Ventrikel Kiri** -> dipompa dengan tekanan sangat kuat melalui pembuluh darah terbesar di tubuh, yaitu **Aorta**. Aorta bercabang menjadi arteri, masuk ke kapiler di seluruh organ tubuh (terjadi pelepasan O2 ke sel). Darah yang kini kembali miskin O2 dan kaya CO2 akan dikumpulkan oleh pembuluh vena, dan bermuara di dua pembuluh raksasa: **Vena Cava Superior** (dari tubuh bagian atas/otak) dan **Vena Cava Inferior** (dari tubuh bagian bawah) -> kembali bermuara ke **Atrium Kanan**.
*(Ringkasan: Jantung Kiri -> Seluruh Tubuh -> Jantung Kanan)*

#### Kuis

1. Urutan peredaran darah kecil yang benar adalah... (**A. Ventrikel kanan -> Arteri pulmonalis -> Paru-paru -> Vena pulmonalis -> Atrium kiri**, B. Ventrikel kiri -> Aorta -> Seluruh tubuh -> Vena cava -> Atrium kanan...)
2. Darah yang masuk ke Atrium Kanan berasal dari... (A. Paru-paru, B. Ventrikel kanan, **C. Seluruh tubuh (Vena Cava)**, D. Aorta)
3. Peredaran darah dari ventrikel kiri menuju seluruh jaringan tubuh disebut sirkulasi... (A. Pulmonal, **B. Sistemik**, C. Koroner, D. Portal hepatik)
4. Pembuluh yang membawa darah kaya oksigen dari paru-paru kembali ke jantung adalah... (A. Arteri Pulmonalis, **B. Vena Pulmonalis**, C. Vena Cava Superior, D. Vena Cava Inferior)

### LEVEL 5: Sistem Golongan Darah

#### Materi

Pada tahun 1901, Dr. Karl Landsteiner menemukan bahwa darah manusia tidak semuanya sama, yang menjelaskan mengapa transfusi darah acak sering berakibat mematikan. Identitas darah ditentukan oleh keberadaan **Antigen (Aglutinogen)**—protein penanda yang menempel pada membran luar sel darah merah, dan **Antibodi (Aglutinin)**—protein pertahanan yang beredar di dalam plasma darah.

**1. Sistem ABO:**

- **Golongan A:** Punya Antigen A di sel darah merah, memproduksi Antibodi anti-B di plasmanya.
- **Golongan B:** Punya Antigen B di sel darah merah, memproduksi Antibodi anti-A di plasmanya.
- **Golongan AB:** Punya Antigen A DAN B di sel darah merah. Hebatnya, mereka **tidak memiliki antibodi** (anti-A maupun anti-B). Karena tidak punya "pasukan penyerang", AB disebut **Resipien Universal** (bisa menerima transfusi darah dari siapa saja).
- **Golongan O:** **Tidak punya Antigen sama sekali** di sel darah merahnya. Karena "botak" tanpa penanda, sel darah merah golongan O tidak akan dikenali sebagai musuh oleh antibodi penerima manapun, menjadikannya **Donor Universal**. Namun, plasma O mengandung anti-A dan anti-B, sehingga orang bergolongan O hanya bisa menerima darah sesama O.

Jika antigen A bertemu dengan anti-A, akan terjadi *Aglutinasi* (penggumpalan darah yang menyumbat pembuluh darah dan menyebabkan kematian).

**2. Sistem Rhesus (Rh):**
Ditemukan pada kera Rhesus. Jika di sel darah merah terdapat faktor Rh, disebut **Rh positif (+)**, jika tidak ada disebut **Rh negatif (-)**. Kasus fatal terjadi pada kehamilan (Penyakit **Eritroblastosis fetalis**): Jika Ibu Rh(-) mengandung janin Rh(+), pada kehamilan pertama, tubuh ibu akan mulai memproduksi antibodi anti-Rh. Pada kehamilan *kedua* (jika anak Rh+ lagi), antibodi ibu yang sudah kuat akan menembus plasenta dan menghancurkan sel darah merah janin, menyebabkan keguguran atau anemia berat pada bayi baru lahir.

#### Kuis

1. Seseorang dengan golongan darah O memiliki... (A. Antigen A dan B, B. Hanya Antigen A, C. Hanya Antigen B, **D. Tidak memiliki Antigen A maupun B**)
2. Golongan darah yang disebut sebagai resipien universal (bisa menerima semua darah) adalah... (A. A, B. B, **C. AB**, D. O)
3. Jika aglutinogen A bertemu dengan aglutinin α (anti-A), yang terjadi adalah... (**A. Penggumpalan/Aglutinasi**, B. Pembekuan darah normal, C. Hemolisis lambat, D. Tidak terjadi apa-apa)
4. Penyakit penghancuran sel darah merah janin akibat perbedaan rhesus ibu (Rh-) dan janin (Rh+) disebut... (A. Hemofilia, B. Thalasemia, C. Anemia sickle cell, **D. Eritroblastosis fetalis**)

### LEVEL 6 (BOSS LEVEL): Patologi & Kelainan Kardiovaskular

#### Materi

Sebagai mesin mekanik, sistem kardiovaskular bisa mengalami kerusakan. Dalam dunia kedokteran medis, pemahaman anatomi normal digunakan untuk mendeteksi penyakit (patologi). Berikut kelainan utama yang sering memakan korban:

1. **Aterosklerosis (Biang Keladi Serangan Jantung):**
Ini adalah kondisi kronis di mana terjadi penumpukan plak (terdiri dari kolesterol jahat/LDL, kalsium, dan jaringan ikat) pada dinding bagian dalam arteri (endotelium). Plak ini membuat pembuluh darah menjadi kaku (kehilangan elastisitas) dan rongganya semakin sempit. Jika ini terjadi di pembuluh darah otak, bisa memicu **Stroke**. Jika plak pecah, ia memicu pembekuan darah (trombus) yang langsung memblokir aliran darah sepenuhnya.
2. **Infark Miokard (Serangan Jantung):**
Otot jantung (miokardium) tidak mengambil oksigen dari darah yang beredar di dalam ruang jantung, melainkan dipasok secara khusus oleh pembuluh darah kecil yang menyelimuti jantung, yang disebut **Arteri Koroner**. Jika arteri koroner tersumbat (biasanya akibat aterosklerosis), sel-sel otot jantung tidak mendapat oksigen (iskemia). Jika dibiarkan lebih dari beberapa menit, sel otot jantung akan mati secara permanen (Nekrosis). Inilah yang disebut serangan jantung, ditandai dengan nyeri dada luar biasa yang menjalar ke lengan kiri dan leher.
3. **Hipertensi (Tekanan Darah Tinggi - The Silent Killer):**
Kondisi di mana tekanan darah pada dinding arteri secara konstan terlalu tinggi (biasanya di atas 140/90 mmHg). Hipertensi memaksa jantung bekerja terlalu keras setiap detiknya, membuat otot jantung membesar secara abnormal, dan merusak dinding dalam pembuluh darah seluruh tubuh, termasuk ginjal dan mata. Sering tidak bergejala sampai kerusakan organ terjadi.
4. **Hemofilia & Anemia:***Hemofilia* adalah penyakit genetika (diturunkan melalui kromosom X) di mana tubuh tidak bisa memproduksi faktor pembeku darah (seperti Faktor VIII). Luka kecil saja bisa menyebabkan penderita kehabisan darah.
*Anemia* adalah kondisi kurangnya kapasitas darah membawa oksigen. Bisa karena kurang zat besi, atau kelainan genetik seperti *Sickle Cell Anemia* (sel darah merah berbentuk bulan sabit sehingga kaku dan menyumbat kapiler).

#### Kuis

1. Kondisi di mana pembuluh darah menyempit dan mengeras akibat endapan lemak/kolesterol disebut... (A. Varises, B. Sklerosis multipel, **C. Aterosklerosis**, D. Arteriosklerosis)
2. Kematian jaringan otot jantung akibat terhentinya suplai darah melalui arteri koroner disebut... (A. Angina pektoris, **B. Infark miokard (Serangan jantung)**, C. Kardiomiopati, D. Gagal jantung kongestif)
3. Penyakit keturunan di mana darah sangat sulit atau tidak bisa membeku disebut... (A. Leukemia, B. Thalasemia, **C. Hemofilia**, D. Anemia Pernisiosa)
4. Pelebaran pembuluh vena pada bagian betis akibat disfungsi katup vena disebut... (**A. Varises**, B. Hemoroid, C. Trombus, D. Embolus)

#### SOAL ESSAY

- Pertanyaan
    - *Skenario:* Seorang pasien datang ke UGD dengan keluhan nyeri dada hebat yang menjalar ke lengan kiri bagian dalam, disertai keringat dingin dan sesak napas. Dokter mendiagnosis pasien mengalami *Infark Miokard akut* (Serangan Jantung).
    - *Instruksi:* Berdasarkan ilmu anatomi dan patologi yang telah kamu pelajari di Bab ini, jelaskan secara ilmiah (patofisiologi) hubungan sebab-akibat antara **Aterosklerosis**, kondisi **Arteri Koroner**, hingga terjadinya kematian sel otot jantung (*nekrosis*) pada pasien tersebut!
- Jawaban
    
    (Kunci Jawaban untuk acuan sistem/guru): Jawaban yang benar harus menjelaskan alur: Penumpukan kolesterol/plak pada pembuluh darah (Aterosklerosis) -> menyumbat "Arteri Koroner" (pembuluh spesifik penyuplai otot jantung) -> Suplai Oksigen terhenti total ke miokardium -> Sel-sel miokardium mengalami kematian (nekrosis) karena gagal berespirasi.
`;

function parseMarkdown(md) {
  const lines = md.split('\\n');
  let currentCourse = null;
  let currentChapter = null;
  let currentSection = null;
  let currentMode = null; // 'content', 'quiz', 'essay'
  
  const courses = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    if (line.startsWith('# ')) {
      currentCourse = {
        title: line.replace('# ', '').trim(),
        description: 'Auto-imported Course',
        chapters: []
      };
      courses.push(currentCourse);
      currentChapter = null;
      currentSection = null;
    } else if (line.startsWith('## ')) {
      currentChapter = {
        title: line.replace('## ', '').trim(),
        sections: []
      };
      if (currentCourse) currentCourse.chapters.push(currentChapter);
      currentSection = null;
    } else if (line.startsWith('### ')) {
      currentSection = {
        title: line.replace('### ', '').trim(),
        content: '',
        questions: []
      };
      if (currentChapter) currentChapter.sections.push(currentSection);
      currentMode = null;
    } else if (line === '#### Materi') {
      currentMode = 'content';
    } else if (line === '#### Kuis') {
      currentMode = 'quiz';
    } else if (line === '#### SOAL ESSAY') {
      currentMode = 'essay';
    } else {
      if (currentSection) {
        if (currentMode === 'content') {
          currentSection.content += line + '\\n\\n';
        } else if (currentMode === 'quiz') {
          if (line.match(/^\d+\.\s/)) {
            // parse quiz
            const parts = line.split(' (');
            if (parts.length >= 2) {
              const prompt = parts[0].replace(/^\d+\.\s/, '').trim();
              const optionsStr = parts.slice(1).join(' (').replace(/\)$/, '');
              const optionsRaw = optionsStr.split(/,\s+(?=[A-D]\.)|\s+(?=[A-D]\.)/);
              const options = [];
              let correctAnswer = null;
              
              optionsRaw.forEach(opt => {
                if(!opt) return;
                const isCorrect = opt.includes('**');
                const cleanText = opt.replace(/\*\*/g, '').trim();
                const optId = cleanText.substring(0, 1);
                const optText = cleanText.substring(3).trim();
                
                options.push({ id: optId, text: optText });
                if (isCorrect) correctAnswer = optId;
              });
              
              currentSection.questions.push({
                type: 'MULTIPLE_CHOICE',
                prompt,
                options,
                correctAnswer
              });
            }
          }
        } else if (currentMode === 'essay') {
          if (line.startsWith('- Pertanyaan') || line.startsWith('- Jawaban')) {
             // skip
          } else {
             const isJawaban = lines[i-1] && lines[i-1].includes('Jawaban');
             if (isJawaban) {
               currentSection.questions.push({
                 type: 'ESSAY',
                 prompt: currentSection.essayPrompt,
                 options: null,
                 correctAnswer: line
               });
             } else {
               currentSection.essayPrompt = (currentSection.essayPrompt || '') + line + '\\n';
             }
          }
        }
      }
    }
  }
  return courses;
}

async function run() {
  const courses = parseMarkdown(rawText);
  
  for (const courseData of courses) {
    console.log('Creating course:', courseData.title);
    const course = await prisma.course.create({
      data: {
        title: courseData.title,
        description: "Materi medis tingkat lanjut tentang " + courseData.title,
        facultyTags: ["med_doctor"],
        level: "beginner",
        isPublished: true,
        isFallback: false,
        chapters: {
          create: courseData.chapters.map((chap, cIdx) => ({
            title: chap.title,
            order: cIdx + 1,
            durationLabel: chap.sections.length + " Levels",
            sections: {
              create: chap.sections.map((sec, sIdx) => ({
                title: sec.title,
                order: sIdx + 1,
                content: sec.content,
                category: sec.title.includes('BOSS') ? 'milestone' : 'skill',
                xpReward: sec.title.includes('BOSS') ? 500 : 100,
                quiz: {
                  create: {
                    title: "Kuis: " + sec.title,
                    passingScore: 75,
                    questions: {
                      create: sec.questions.map((q, qIdx) => ({
                        prompt: q.prompt,
                        type: q.type,
                        options: q.options || [],
                        correctAnswer: q.correctAnswer,
                        points: q.type === 'ESSAY' ? 10 : 1,
                        order: qIdx + 1
                      }))
                    }
                  }
                }
              }))
            }
          }))
        }
      }
    });
    console.log('Successfully created course with ID:', course.id);
  }
}

run()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
