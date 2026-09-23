'use client';

import { useOnboardingStore } from '@/store/useOnboardingStore';

/* ── Faculty/Majors options (Mapped to 10 Houses) ── */
const FACULTIES = [
  // ICT & Tech
  { value: 'cs_it',       label: 'Ilmu Komputer & TI', icon: '💻' },
  { value: 'data_ai',     label: 'Data Science & AI',  icon: '🤖' },
  // Engineering & Architecture
  { value: 'eng_civil',   label: 'Sipil & Arsitektur', icon: '🏗️' },
  { value: 'eng_mech',    label: 'Mesin & Elektro',    icon: '⚙️' },
  // Health & Medicine
  { value: 'med_doctor',  label: 'Kedokteran (Umum/Gigi)', icon: '🩺' },
  { value: 'med_nurse',   label: 'Keperawatan & Farmasi',  icon: '💊' },
  // Business & Management
  { value: 'biz_mgmt',    label: 'Bisnis & Manajemen', icon: '💼' },
  { value: 'biz_acc',     label: 'Akuntansi & Keuangan', icon: '📈' },
  // Law & Public Policy
  { value: 'law',         label: 'Ilmu Hukum',         icon: '⚖️' },
  { value: 'law_public',  label: 'Ilmu Politik & Publik', icon: '🏛️' },
  // Social Sciences
  { value: 'soc_comm',    label: 'Ilmu Komunikasi',    icon: '📡' },
  { value: 'soc_ir',      label: 'Hubungan Internasional', icon: '🌍' },
  { value: 'soc_psy',     label: 'Psikologi',          icon: '🧠' },
  // Education
  { value: 'edu_teacher', label: 'Pendidikan Guru',    icon: '🏫' },
  { value: 'edu_tech',    label: 'Teknologi Pendidikan', icon: '📚' },
  // Arts & Humanities
  { value: 'arts_design', label: 'Desain & Seni Rupa', icon: '🎨' },
  { value: 'arts_lang',   label: 'Sastra & Bahasa',    icon: '✍️' },
  // Science & Math
  { value: 'sci_math',    label: 'Matematika & Stat',  icon: '📐' },
  { value: 'sci_natural', label: 'Fisika, Kimia, Biologi', icon: '🧪' },
  // Agriculture & Environment
  { value: 'agr_farm',    label: 'Agribisnis & Pertanian', icon: '🌾' },
  { value: 'agr_env',     label: 'Kehutanan & Lingkungan', icon: '🌲' },
];

/* ── Country options ── */
const COUNTRIES = [
  { value: 'indonesia',  label: 'Indonesia',  flag: '🇮🇩' },
  { value: 'singapura',  label: 'Singapura',  flag: '🇸🇬' },
  { value: 'malaysia',   label: 'Malaysia',   flag: '🇲🇾' },
  { value: 'jepang',     label: 'Jepang',     flag: '🇯🇵' },
  { value: 'korea',      label: 'Korea',      flag: '🇰🇷' },
  { value: 'australia',  label: 'Australia',  flag: '🇦🇺' },
  { value: 'inggris',    label: 'Inggris',    flag: '🇬🇧' },
  { value: 'jerman',     label: 'Jerman',     flag: '🇩🇪' },
  { value: 'belanda',    label: 'Belanda',    flag: '🇳🇱' },
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
          <h3 className="font-pixel text-[0.85rem] text-white m-0 tracking-[0.05em] drop-shadow-[1px_1px_0_#3b261b]">🎓 Fakultas / Jurusan</h3>
          <span className="font-pixel text-[0.5rem] text-[#fbbf24] bg-[#78350f] border-2 border-[#b45309] px-2 py-1 tracking-[0.06em] shadow-[2px_2px_0_0_rgba(0,0,0,0.5)]">Opsional</span>
        </div>
        <p className="font-pixel text-[0.55rem] text-[rgba(240,232,255,0.7)] m-0 leading-[1.6] uppercase">Pilih jurusan yang kamu minati (boleh lebih dari satu).</p>
        <div className="flex flex-wrap gap-3 sm:gap-2">
          {FACULTIES.map((f) => {
            const isSelected = faculties.includes(f.value);
            return (
              <button
                key={f.value}
                type="button"
                className={`flex items-center gap-2 py-2.5 px-3.5 sm:py-2 sm:px-2.5 bg-[#bc8f65] border-2 border-[#5a3a29] shadow-[inset_0_0_8px_rgba(0,0,0,0.3),2px_2px_0_0_rgba(0,0,0,0.5)] text-white font-pixel text-[0.6rem] sm:text-[0.5rem] drop-shadow-[1px_1px_0_#3b261b] cursor-pointer transition-transform duration-100 hover:bg-[#cba37b] hover:border-[#6a4734] hover:text-white active:translate-x-[1px] active:translate-y-[1px] active:shadow-[inset_0_0_8px_rgba(0,0,0,0.3),1px_1px_0_0_rgba(0,0,0,0.5)] ${isSelected ? '!bg-[#d4a373] !border-[#f59e0b] !text-white !shadow-[inset_0_0_8px_rgba(0,0,0,0.3),0_0_0_2px_rgba(245,158,11,0.6)] translate-x-[1px] translate-y-[1px]' : ''}`}
                onClick={() => setField('facultyPreferences', toggleInArray(faculties, f.value))}
              >
                <span className="text-[1.8rem] leading-none drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">{f.icon}</span>
                <span>{f.label}</span>
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
        <div className="flex flex-wrap gap-3 sm:gap-2">
          {COUNTRIES.map((c) => {
            const isSelected = countries.includes(c.value);
            return (
              <button
                key={c.value}
                type="button"
                className={`flex items-center gap-2 py-2.5 px-3.5 sm:py-2 sm:px-2.5 bg-[#bc8f65] border-2 border-[#5a3a29] shadow-[inset_0_0_8px_rgba(0,0,0,0.3),2px_2px_0_0_rgba(0,0,0,0.5)] text-white font-pixel text-[0.6rem] sm:text-[0.5rem] drop-shadow-[1px_1px_0_#3b261b] cursor-pointer transition-transform duration-100 hover:bg-[#cba37b] hover:border-[#6a4734] hover:text-white active:translate-x-[1px] active:translate-y-[1px] active:shadow-[inset_0_0_8px_rgba(0,0,0,0.3),1px_1px_0_0_rgba(0,0,0,0.5)] ${isSelected ? '!bg-[#d4a373] !border-[#f59e0b] !text-white !shadow-[inset_0_0_8px_rgba(0,0,0,0.3),0_0_0_2px_rgba(245,158,11,0.6)] translate-x-[1px] translate-y-[1px]' : ''}`}
                onClick={() => setField('countryPreferences', toggleInArray(countries, c.value))}
              >
                <span className="text-[1.8rem] leading-none drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">{c.flag}</span>
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
