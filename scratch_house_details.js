const fs = require('fs');
let content = fs.readFileSync('src/data/mockBackendData.ts', 'utf8');

const houseDetails = {
  'house-education': {
    skillsOverview: "['Manajemen Kelas', 'Desain Kurikulum', 'Psikologi Anak', 'Public Speaking', 'Teknologi EdTech']",
    idealFor: "['Senang mengajar & berbagi ilmu', 'Sabar dan empatik', 'Visioner dalam mencerdaskan bangsa', 'Suka berinteraksi dengan orang lain']"
  },
  'house-arts': {
    skillsOverview: "['Berpikir Kritis', 'Kreativitas Visual', 'Analisis Sejarah', 'Komunikasi Tulisan', 'Pemecahan Masalah Abstrak']",
    idealFor: "['Imajinatif & out of the box', 'Suka mengekspresikan diri lewat karya', 'Tertarik pada budaya dan sejarah', 'Senang menganalisis teks atau visual']"
  },
  'house-social': {
    skillsOverview: "['Riset Sosial', 'Public Relations', 'Analisis Kebijakan', 'Jurnalisme Investigasi', 'Negosiasi']",
    idealFor: "['Peduli pada isu-isu sosial', 'Kritis terhadap berita dan media', 'Pintar bersosialisasi dan diplomasi', 'Senang mengamati perilaku manusia']"
  },
  'house-business': {
    skillsOverview: "['Analisis Keuangan', 'Strategi Marketing', 'Manajemen Risiko', 'Hukum Perdata', 'Leadership']",
    idealFor: "['Suka tantangan & kompetisi', 'Pintar mengelola uang', 'Punya jiwa kepemimpinan', 'Tertarik membangun bisnis sendiri']"
  },
  'house-science': {
    skillsOverview: "['Analisis Data', 'Metode Ilmiah', 'Pemodelan Matematika', 'Riset Laboratorium', 'Observasi Alam']",
    idealFor: "['Sangat logis dan analitis', 'Suka eksperimen', 'Selalu penasaran dengan cara alam semesta bekerja', 'Teliti dan sabar terhadap data']"
  },
  'house-ict': {
    skillsOverview: "['Coding & Programming', 'Software Engineering', 'Cybersecurity', 'AI & Data Science', 'System Architecture']",
    idealFor: "['Suka memecahkan teka-teki logika', 'Tertarik dengan gadget dan software baru', 'Senang bekerja di depan komputer', 'Inovatif dan adaptif terhadap teknologi']"
  },
  'house-engineering': {
    skillsOverview: "['Desain CAD', 'Mekanika & Termodinamika', 'Manajemen Proyek', 'Sirkuit Elektronik', 'K3 (Keselamatan Kerja)']",
    idealFor: "['Suka membongkar dan merakit barang', 'Tertarik pada mesin dan struktur', 'Praktis dan problem solver', 'Mampu membayangkan objek 3D']"
  },
  'house-agriculture': {
    skillsOverview: "['Manajemen Lahan', 'Kesehatan Hewan', 'Agronomi', 'Ekologi Konservasi', 'Bioteknologi Pertanian']",
    idealFor: "['Cinta alam dan lingkungan', 'Suka bekerja di luar ruangan', 'Peduli pada ketahanan pangan', 'Senang memelihara tanaman/hewan']"
  },
  'house-health': {
    skillsOverview: "['Diagnosis Klinis', 'Asuhan Keperawatan', 'Farmakologi', 'Konseling Psikologi', 'Manajemen Kesehatan']",
    idealFor: "['Sangat peduli dan ingin membantu orang sakit', 'Tahan banting menghadapi situasi darurat', 'Teliti dalam memberikan obat', 'Punya empati tinggi']"
  },
  'house-services': {
    skillsOverview: "['Hospitality & Pelayanan', 'Culinary Arts', 'Event Organizing', 'Manajemen Logistik', 'Ilmu Olahraga']",
    idealFor: "['Ramah dan suka melayani orang lain', 'Suka traveling atau memasak', 'Pandai mengatur acara', 'Aktif dan dinamis']"
  }
};

for (const [id, details] of Object.entries(houseDetails)) {
  const searchStr = `id: '${id}',`;
  const idx = content.indexOf(searchStr);
  if (idx !== -1) {
    const endOfHouse = content.indexOf('stages: [', idx);
    const beforeStages = content.substring(0, endOfHouse);
    const afterStages = content.substring(endOfHouse);
    content = beforeStages + `skillsOverview: ${details.skillsOverview},\n      idealFor: ${details.idealFor},\n      ` + afterStages;
  }
}

fs.writeFileSync('src/data/mockBackendData.ts', content);
console.log('House details added!');
