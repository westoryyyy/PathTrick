'use client';

import { useOnboardingStore } from '@/store/useOnboardingStore';
import PixelIcon from '@/components/ui/PixelIcon';
import { useTranslation } from '@/hooks/useTranslation';

const FACULTIES = [
  { value: 'agr_farm',    label: 'Agribisnis & Pertanian', labelEn: 'Agribusiness & Agriculture', icon: '🌾', description: 'Belajar cara modern mengelola hasil bumi, ternak, dan bisnis pangan. Cocok buat yang peduli ketahanan pangan!', descriptionEn: 'Learn modern ways to manage crops, livestock, and food business. Perfect for those who care about food security!' },
  { value: 'biz_acc',     label: 'Akuntansi & Keuangan', labelEn: 'Accounting & Finance', icon: '📈', description: 'Jadi ahli ngelola uang, investasi, dan pembukuan. Skill wajib buat calon CFO atau pebisnis sukses!', descriptionEn: 'Become an expert in managing money, investments, and bookkeeping. Essential skills for future CFOs or successful business people!' },
  { value: 'biz_mgmt',    label: 'Bisnis & Manajemen', labelEn: 'Business & Management', icon: '💼', description: 'Pelajari seni memimpin tim, strategi marketing, dan cara ngebangun startup atau perusahaan gede.', descriptionEn: 'Learn the art of leading teams, marketing strategies, and how to build startups or large companies.' },
  { value: 'data_ai',     label: 'Data Science & AI', labelEn: 'Data Science & AI',  icon: '🤖', description: 'Ngelatih AI dan bongkar rahasia dari jutaan data. Jurusan paling dicari di era digital saat ini!', descriptionEn: 'Train AI and uncover secrets from millions of data points. The most sought-after major in today\'s digital era!' },
  { value: 'arts_design', label: 'Desain & Seni Rupa', labelEn: 'Design & Fine Arts', icon: '🎨', description: 'Tuangkan imajinasi liarmu jadi karya visual, animasi, atau UI/UX yang keren dan dibayar mahal.', descriptionEn: 'Pour your wild imagination into visual works, animations, or cool UI/UX that pay well.' },
  { value: 'sci_natural', label: 'Fisika, Kimia, Biologi', labelEn: 'Physics, Chemistry, Biology', icon: '🧪', description: 'Meneliti alam semesta dari partikel terkecil sampai organisme hidup. Pas buat calon ilmuwan atau peneliti.', descriptionEn: 'Research the universe from the smallest particles to living organisms. Perfect for future scientists or researchers.' },
  { value: 'soc_ir',      label: 'Hubungan Internasional', labelEn: 'International Relations', icon: '🌍', description: 'Belajar diplomasi, politik global, dan isu antar negara. Siap-siap keliling dunia jadi diplomat!', descriptionEn: 'Learn diplomacy, global politics, and international issues. Get ready to travel the world as a diplomat!' },
  { value: 'law',         label: 'Ilmu Hukum', labelEn: 'Law',         icon: '⚖️', description: 'Pahami aturan main negara, hukum bisnis, dan perlindungan hak. Jalan pintas jadi pengacara atau jaksa.', descriptionEn: 'Understand the rules of the state, business law, and rights protection. The shortcut to becoming a lawyer or prosecutor.' },
  { value: 'soc_comm',    label: 'Ilmu Komunikasi', labelEn: 'Communication Studies',    icon: '📡', description: 'Jago public speaking, broadcasting, dan PR. Jurusan seru buat yang suka ngomong dan tampil di media.', descriptionEn: 'Master public speaking, broadcasting, and PR. A fun major for those who like to talk and appear in the media.' },
  { value: 'cs_it',       label: 'Ilmu Komputer & TI', labelEn: 'Computer Science & IT', icon: '💻', description: 'Ngoding bikin software, web, dan game. Kalau kamu suka mecahin logika dan ngerakit sistem, ini tempatnya!', descriptionEn: 'Code to build software, web, and games. If you like solving logic and assembling systems, this is the place!' },
  { value: 'law_public',  label: 'Ilmu Politik & Publik', labelEn: 'Political & Public Science', icon: '🏛️', description: 'Bedah kebijakan pemerintah dan strategi politik. Buat kamu yang pengen bawa perubahan di masyarakat.', descriptionEn: 'Dissect government policies and political strategies. For those who want to bring change to society.' },
  { value: 'med_doctor',  label: 'Kedokteran (Umum/Gigi)', labelEn: 'Medicine (General/Dental)', icon: '🩺', description: 'Belajar anatomi, penyakit, dan cara nyembuhin orang. Profesi mulia dengan masa depan terjamin.', descriptionEn: 'Learn anatomy, diseases, and how to heal people. A noble profession with a guaranteed future.' },
  { value: 'agr_env',     label: 'Kehutanan & Lingkungan', labelEn: 'Forestry & Environment', icon: '🌲', description: 'Jaga kelestarian alam, satwa liar, dan atasi perubahan iklim. Pahlawan bumi di kehidupan nyata!', descriptionEn: 'Protect nature conservation, wildlife, and tackle climate change. Real-life earth heroes!' },
  { value: 'med_nurse',   label: 'Keperawatan & Farmasi', labelEn: 'Nursing & Pharmacy',  icon: '💊', description: 'Meracik obat-obatan atau merawat pasien sepenuh hati. Tulang punggung dunia kesehatan nih.', descriptionEn: 'Formulate medicines or care for patients wholeheartedly. The backbone of the healthcare world.' },
  { value: 'sci_math',    label: 'Matematika & Statistika', labelEn: 'Mathematics & Statistics',  icon: '📐', description: 'Pecahkan pola rumit dengan angka. Lulusannya super langka dan diincar banyak perusahaan teknologi.', descriptionEn: 'Solve complex patterns with numbers. Graduates are super rare and highly sought after by tech companies.' },
  { value: 'eng_mech',    label: 'Mesin & Elektro', labelEn: 'Mechanical & Electrical',    icon: '⚙️', description: 'Bikin robot, mesin canggih, sampai sistem listrik. Jurusan buat para penemu masa depan.', descriptionEn: 'Build robots, advanced machines, to electrical systems. The major for future inventors.' },
  { value: 'edu_teacher', label: 'Pendidikan Guru', labelEn: 'Teacher Education',    icon: '🏫', description: 'Bentuk generasi penerus bangsa! Belajar psikologi anak dan metode ngajar yang asik.', descriptionEn: 'Shape the nation\'s next generation! Learn child psychology and fun teaching methods.' },
  { value: 'soc_psy',     label: 'Psikologi', labelEn: 'Psychology',          icon: '🧠', description: 'Pahami isi pikiran dan perilaku manusia. Bisa jadi HRD, terapis, atau sekadar jadi teman curhat yang pro.', descriptionEn: 'Understand human mind and behavior. Can become HRD, therapist, or just a pro confidant.' },
  { value: 'arts_lang',   label: 'Sastra & Bahasa', labelEn: 'Literature & Languages',    icon: '✍️', description: 'Selami budaya lewat bahasa dan karya tulis. Lulusannya bisa jadi translator, penulis, atau diplomat.', descriptionEn: 'Dive into culture through language and written works. Graduates can become translators, writers, or diplomats.' },
  { value: 'eng_civil',   label: 'Sipil & Arsitektur', labelEn: 'Civil & Architecture', icon: '🏗️', description: 'Rancang dan bangun gedung pencakar langit sampai jembatan anti-gempa. Tangan kanan para developer!', descriptionEn: 'Design and build skyscrapers to earthquake-proof bridges. The right hand of developers!' },
  { value: 'edu_tech',    label: 'Teknologi Pendidikan', labelEn: 'Educational Technology', icon: '📚', description: 'Bikin aplikasi belajar, e-learning, dan inovasi pendidikan. Mengawinkan teknologi dan sekolah.', descriptionEn: 'Build learning apps, e-learning, and educational innovations. Marrying technology and schools.' },
];

/* ── Country options ── */
const COUNTRIES = [
  { value: 'australia',  label: 'Australia', labelEn: 'Australia',  flag: '🇦🇺' },
  { value: 'belanda',    label: 'Belanda', labelEn: 'Netherlands',    flag: '🇳🇱' },
  { value: 'indonesia',  label: 'Indonesia', labelEn: 'Indonesia',  flag: '🇮🇩' },
  { value: 'inggris',    label: 'Inggris', labelEn: 'UK',    flag: '🇬🇧' },
  { value: 'jepang',     label: 'Jepang', labelEn: 'Japan',     flag: '🇯🇵' },
  { value: 'jerman',     label: 'Jerman', labelEn: 'Germany',     flag: '🇩🇪' },
  { value: 'korea',      label: 'Korea', labelEn: 'Korea',      flag: '🇰🇷' },
  { value: 'malaysia',   label: 'Malaysia', labelEn: 'Malaysia',   flag: '🇲🇾' },
  { value: 'singapura',  label: 'Singapura', labelEn: 'Singapore',  flag: '🇸🇬' },
  { value: 'usa',        label: 'USA', labelEn: 'USA',        flag: '🇺🇸' },
];

function toggleInArray(arr: string[], value: string): string[] {
  return arr.includes(value)
    ? arr.filter((v) => v !== value)
    : [...arr, value];
}

export default function PreferencesStep() {
  const { locale } = useTranslation();
  const faculties = useOnboardingStore((s) => s.dreamerAssessment.facultyPreferences);
  const countries = useOnboardingStore((s) => s.dreamerAssessment.countryPreferences);
  const setField  = useOnboardingStore((s) => s.setDreamerField);

  return (
    <div className="flex flex-col gap-8 w-full max-w-[600px] mx-auto">
      {/* ── Faculty ── */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <h3 className="flex items-center gap-2 font-pixel text-[0.85rem] text-white m-0 tracking-[0.05em] drop-shadow-[1px_1px_0_#3b261b]"><PixelIcon icon="🎓" size={22} /> {locale === 'id' ? 'Fakultas / Jurusan' : 'Faculty / Major'}</h3>
          <span className="font-pixel text-[0.5rem] text-[#fbbf24] bg-[#78350f] border-2 border-[#b45309] px-2 py-1 tracking-[0.06em] shadow-[2px_2px_0_0_rgba(0,0,0,0.5)]">{locale === 'id' ? 'Opsional' : 'Optional'}</span>
        </div>
        <p className="font-pixel text-[0.55rem] text-[rgba(240,232,255,0.7)] m-0 leading-[1.6] uppercase">{locale === 'id' ? 'Pilih jurusan yang kamu minati (boleh lebih dari satu).' : 'Choose your preferred major (you can select multiple).'}</p>
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
                <span>{locale === 'id' ? f.label : f.labelEn}</span>
                
                {/* Custom RPG Tooltip */}
                <div className="absolute z-50 bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-[180px] p-2.5 bg-[#3b2416] border-2 border-[#6a4734] shadow-[0_4px_12px_rgba(0,0,0,0.5)] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200">
                  <p className="font-pixel text-[0.45rem] leading-[1.6] text-[#fdf6e3] m-0 text-center drop-shadow-[1px_1px_0_#1a100a]">
                    {locale === 'id' ? f.description : f.descriptionEn}
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
          <h3 className="font-pixel text-[0.85rem] text-white m-0 tracking-[0.05em] drop-shadow-[1px_1px_0_#3b261b]">🌍 {locale === 'id' ? 'Negara Tujuan' : 'Study Destination'}</h3>
          <span className="font-pixel text-[0.5rem] text-[#fbbf24] bg-[#78350f] border-2 border-[#b45309] px-2 py-1 tracking-[0.06em] shadow-[2px_2px_0_0_rgba(0,0,0,0.5)]">{locale === 'id' ? 'Opsional' : 'Optional'}</span>
        </div>
        <p className="font-pixel text-[0.55rem] text-[rgba(240,232,255,0.7)] m-0 leading-[1.6] uppercase">{locale === 'id' ? 'Di negara mana kamu ingin kuliah?' : 'Which country do you want to study in?'}</p>
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
                <span>{locale === 'id' ? c.label : c.labelEn}</span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
