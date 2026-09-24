'use client';

import { useOnboardingStore } from '@/store/useOnboardingStore';
import PixelIcon from '@/components/ui/PixelIcon';

const FACULTIES = [
  { value: 'agr_farm',    label: 'Agribisnis & Pertanian', icon: '🌾', description: 'Belajar cara modern mengelola hasil bumi, ternak, dan bisnis pangan. Cocok buat yang peduli ketahanan pangan!' },
  { value: 'biz_acc',     label: 'Akuntansi & Keuangan', icon: '📈', description: 'Jadi ahli ngelola uang, investasi, dan pembukuan. Skill wajib buat calon CFO atau pebisnis sukses!' },
  { value: 'biz_mgmt',    label: 'Bisnis & Manajemen', icon: '💼', description: 'Pelajari seni memimpin tim, strategi marketing, dan cara ngebangun startup atau perusahaan gede.' },
  { value: 'data_ai',     label: 'Data Science & AI',  icon: '🤖', description: 'Ngelatih AI dan bongkar rahasia dari jutaan data. Jurusan paling dicari di era digital saat ini!' },
  { value: 'arts_design', label: 'Desain & Seni Rupa', icon: '🎨', description: 'Tuangkan imajinasi liarmu jadi karya visual, animasi, atau UI/UX yang keren dan dibayar mahal.' },
  { value: 'sci_natural', label: 'Fisika, Kimia, Biologi', icon: '🧪', description: 'Meneliti alam semesta dari partikel terkecil sampai organisme hidup. Pas buat calon ilmuwan atau peneliti.' },
  { value: 'soc_ir',      label: 'Hubungan Internasional', icon: '🌍', description: 'Belajar diplomasi, politik global, dan isu antar negara. Siap-siap keliling dunia jadi diplomat!' },
  { value: 'law',         label: 'Ilmu Hukum',         icon: '⚖️', description: 'Pahami aturan main negara, hukum bisnis, dan perlindungan hak. Jalan pintas jadi pengacara atau jaksa.' },
  { value: 'soc_comm',    label: 'Ilmu Komunikasi',    icon: '📡', description: 'Jago public speaking, broadcasting, dan PR. Jurusan seru buat yang suka ngomong dan tampil di media.' },
  { value: 'cs_it',       label: 'Ilmu Komputer & TI', icon: '💻', description: 'Ngoding bikin software, web, dan game. Kalau kamu suka mecahin logika dan ngerakit sistem, ini tempatnya!' },
  { value: 'law_public',  label: 'Ilmu Politik & Publik', icon: '🏛️', description: 'Bedah kebijakan pemerintah dan strategi politik. Buat kamu yang pengen bawa perubahan di masyarakat.' },
  { value: 'med_doctor',  label: 'Kedokteran (Umum/Gigi)', icon: '🩺', description: 'Belajar anatomi, penyakit, dan cara nyembuhin orang. Profesi mulia dengan masa depan terjamin.' },
  { value: 'agr_env',     label: 'Kehutanan & Lingkungan', icon: '🌲', description: 'Jaga kelestarian alam, satwa liar, dan atasi perubahan iklim. Pahlawan bumi di kehidupan nyata!' },
  { value: 'med_nurse',   label: 'Keperawatan & Farmasi',  icon: '💊', description: 'Meracik obat-obatan atau merawat pasien sepenuh hati. Tulang punggung dunia kesehatan nih.' },
  { value: 'sci_math',    label: 'Matematika & Statistika',  icon: '📐', description: 'Pecahkan pola rumit dengan angka. Lulusannya super langka dan diincar banyak perusahaan teknologi.' },
  { value: 'eng_mech',    label: 'Mesin & Elektro',    icon: '⚙️', description: 'Bikin robot, mesin canggih, sampai sistem listrik. Jurusan buat para penemu masa depan.' },
  { value: 'edu_teacher', label: 'Pendidikan Guru',    icon: '🏫', description: 'Bentuk generasi penerus bangsa! Belajar psikologi anak dan metode ngajar yang asik.' },
  { value: 'soc_psy',     label: 'Psikologi',          icon: '🧠', description: 'Pahami isi pikiran dan perilaku manusia. Bisa jadi HRD, terapis, atau sekadar jadi teman curhat yang pro.' },
  { value: 'arts_lang',   label: 'Sastra & Bahasa',    icon: '✍️', description: 'Selami budaya lewat bahasa dan karya tulis. Lulusannya bisa jadi translator, penulis, atau diplomat.' },
  { value: 'eng_civil',   label: 'Sipil & Arsitektur', icon: '🏗️', description: 'Rancang dan bangun gedung pencakar langit sampai jembatan anti-gempa. Tangan kanan para developer!' },
  { value: 'edu_tech',    label: 'Teknologi Pendidikan', icon: '📚', description: 'Bikin aplikasi belajar, e-learning, dan inovasi pendidikan. Mengawinkan teknologi dan sekolah.' },
];

/* ── Country options ── */
const COUNTRIES = [
  { value: 'australia',  label: 'Australia',  flag: '🇦🇺' },
  { value: 'belanda',    label: 'Belanda',    flag: '🇳🇱' },
  { value: 'indonesia',  label: 'Indonesia',  flag: '🇮🇩' },
  { value: 'inggris',    label: 'Inggris',    flag: '🇬🇧' },
  { value: 'jepang',     label: 'Jepang',     flag: '🇯🇵' },
  { value: 'jerman',     label: 'Jerman',     flag: '🇩🇪' },
  { value: 'korea',      label: 'Korea',      flag: '🇰🇷' },
  { value: 'malaysia',   label: 'Malaysia',   flag: '🇲🇾' },
  { value: 'singapura',  label: 'Singapura',  flag: '🇸🇬' },
  { value: 'usa',        label: 'USA',        flag: '🇺🇸' },
];

function toggleInArray(arr: string[], value: string): string[] {
  return arr.includes(value)
    ? arr.filter((v) => v !== value)
    : [...arr, value];
}

export default function PreferencesStep() {
  const faculties = useOnboardingStore((s) => s.smaAssessment.facultyPreferences);
  const countries = useOnboardingStore((s) => s.smaAssessment.countryPreferences);
  const setField  = useOnboardingStore((s) => s.setSMAField);

  return (
    <div className="flex flex-col gap-8 w-full max-w-[600px] mx-auto">
      {/* ── Faculty ── */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <h3 className="flex items-center gap-2 font-pixel text-[0.85rem] text-white m-0 tracking-[0.05em] drop-shadow-[1px_1px_0_#3b261b]"><PixelIcon icon="🎓" size={22} /> Fakultas / Jurusan</h3>
          <span className="font-pixel text-[0.5rem] text-[#fbbf24] bg-[#78350f] border-2 border-[#b45309] px-2 py-1 tracking-[0.06em] shadow-[2px_2px_0_0_rgba(0,0,0,0.5)]">Opsional</span>
        </div>
        <p className="font-pixel text-[0.55rem] text-[rgba(240,232,255,0.7)] m-0 leading-[1.6] uppercase">Pilih jurusan yang kamu minati (boleh lebih dari satu).</p>
        <div className="grid grid-cols-3 gap-2.5">
          {FACULTIES.map((f) => {
            const isSelected = faculties.includes(f.value);
            return (
              <button
                key={f.value}
                type="button"
                className={`group relative flex items-center gap-2.5 py-2 px-3 h-[70px] bg-[#bc8f65] border-2 border-[#5a3a29] shadow-[inset_0_0_8px_rgba(0,0,0,0.3),2px_2px_0_0_rgba(0,0,0,0.5)] text-white font-pixel text-[0.55rem] text-left drop-shadow-[1px_1px_0_#3b261b] cursor-pointer transition-transform duration-100 hover:bg-[#cba37b] hover:border-[#6a4734] hover:text-white active:translate-x-[1px] active:translate-y-[1px] active:shadow-[inset_0_0_8px_rgba(0,0,0,0.3),1px_1px_0_0_rgba(0,0,0,0.5)] ${isSelected ? '!bg-[#d4a373] !border-[#f59e0b] !text-white !shadow-[inset_0_0_8px_rgba(0,0,0,0.3),0_0_0_2px_rgba(245,158,11,0.6)] translate-x-[1px] translate-y-[1px]' : ''}`}
                onClick={() => setField('facultyPreferences', toggleInArray(faculties, f.value))}
              >
                <PixelIcon icon={f.icon} size={36} className="drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)] shrink-0" />
                <span>{f.label}</span>
                
                {/* Custom RPG Tooltip */}
                <div className="absolute z-50 bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-[180px] p-2.5 bg-[#3b2416] border-2 border-[#6a4734] shadow-[0_4px_12px_rgba(0,0,0,0.5)] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200">
                  <p className="font-pixel text-[0.45rem] leading-[1.6] text-[#fdf6e3] m-0 text-center drop-shadow-[1px_1px_0_#1a100a]">
                    {f.description}
                  </p>
                  <div className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#6a4734]"></div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Country ── */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <h3 className="font-pixel text-[0.85rem] text-white m-0 tracking-[0.05em] drop-shadow-[1px_1px_0_#3b261b]">🌍 Negara Tujuan</h3>
          <span className="font-pixel text-[0.5rem] text-[#fbbf24] bg-[#78350f] border-2 border-[#b45309] px-2 py-1 tracking-[0.06em] shadow-[2px_2px_0_0_rgba(0,0,0,0.5)]">Opsional</span>
        </div>
        <p className="font-pixel text-[0.55rem] text-[rgba(240,232,255,0.7)] m-0 leading-[1.6] uppercase">Di negara mana kamu ingin kuliah?</p>
        <div className="grid grid-cols-3 gap-2.5">
          {COUNTRIES.map((c) => {
            const isSelected = countries.includes(c.value);
            return (
              <button
                key={c.value}
                type="button"
                className={`flex items-center gap-2.5 py-2 px-3 h-[60px] bg-[#bc8f65] border-2 border-[#5a3a29] shadow-[inset_0_0_8px_rgba(0,0,0,0.3),2px_2px_0_0_rgba(0,0,0,0.5)] text-white font-pixel text-[0.55rem] text-left drop-shadow-[1px_1px_0_#3b261b] cursor-pointer transition-transform duration-100 hover:bg-[#cba37b] hover:border-[#6a4734] hover:text-white active:translate-x-[1px] active:translate-y-[1px] active:shadow-[inset_0_0_8px_rgba(0,0,0,0.3),1px_1px_0_0_rgba(0,0,0,0.5)] ${isSelected ? '!bg-[#d4a373] !border-[#f59e0b] !text-white !shadow-[inset_0_0_8px_rgba(0,0,0,0.3),0_0_0_2px_rgba(245,158,11,0.6)] translate-x-[1px] translate-y-[1px]' : ''}`}
                onClick={() => setField('countryPreferences', toggleInArray(countries, c.value))}
              >
                <PixelIcon icon="🌍" size={32} className="drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]" />
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
