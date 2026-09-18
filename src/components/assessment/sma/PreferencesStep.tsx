'use client';

import { useOnboardingStore } from '@/store/useOnboardingStore';
import styles from './PreferencesStep.module.css';

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
    <div className={styles.wrapper}>
      {/* ── Faculty ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>🎓 Fakultas / Jurusan</h3>
          <span className={styles.optBadge}>Opsional</span>
        </div>
        <p className={styles.sectionHint}>Pilih jurusan yang kamu minati (boleh lebih dari satu).</p>
        <div className={styles.chipGrid}>
          {FACULTIES.map((f) => {
            const isSelected = faculties.includes(f.value);
            return (
              <button
                key={f.value}
                type="button"
                className={`${styles.chip} ${isSelected ? styles.chipSelected : ''}`}
                onClick={() => setField('facultyPreferences', toggleInArray(faculties, f.value))}
              >
                <span className={styles.chipIcon}>{f.icon}</span>
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Country ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>🌍 Negara Tujuan</h3>
          <span className={styles.optBadge}>Opsional</span>
        </div>
        <p className={styles.sectionHint}>Di negara mana kamu ingin kuliah?</p>
        <div className={styles.chipGrid}>
          {COUNTRIES.map((c) => {
            const isSelected = countries.includes(c.value);
            return (
              <button
                key={c.value}
                type="button"
                className={`${styles.chip} ${isSelected ? styles.chipSelected : ''}`}
                onClick={() => setField('countryPreferences', toggleInArray(countries, c.value))}
              >
                <span className={styles.chipIcon}>{c.flag}</span>
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
