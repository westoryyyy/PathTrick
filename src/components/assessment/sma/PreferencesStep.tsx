'use client';

import { useOnboardingStore } from '@/store/useOnboardingStore';
import styles from './PreferencesStep.module.css';

/* ── Faculty options ── */
const FACULTIES = [
  { value: 'teknik',      label: 'Teknik',       icon: '⚙️' },
  { value: 'kedokteran',  label: 'Kedokteran',   icon: '🩺' },
  { value: 'hukum',       label: 'Hukum',        icon: '⚖️' },
  { value: 'ekonomi',     label: 'Ekonomi',      icon: '📈' },
  { value: 'sains',       label: 'Sains',        icon: '🧪' },
  { value: 'seni',        label: 'Seni & Desain',icon: '🎭' },
  { value: 'pendidikan',  label: 'Pendidikan',   icon: '📚' },
  { value: 'psikologi',   label: 'Psikologi',    icon: '🧠' },
  { value: 'komunikasi',  label: 'Komunikasi',   icon: '📡' },
  { value: 'pertanian',   label: 'Pertanian',    icon: '🌾' },
  { value: 'ilkom',       label: 'Ilmu Komputer',icon: '💻' },
  { value: 'farmasi',     label: 'Farmasi',      icon: '💊' },
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
