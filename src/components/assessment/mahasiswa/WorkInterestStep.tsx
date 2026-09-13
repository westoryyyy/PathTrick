'use client';

import { useOnboardingStore } from '@/store/useOnboardingStore';
import styles from './WorkInterestStep.module.css';

/* ── Industry categories ── */
const INDUSTRIES = [
  { value: 'tech',       label: 'Teknologi',     icon: '💻', color: '#3b82f6' },
  { value: 'finance',    label: 'Keuangan',      icon: '🏦', color: '#10b981' },
  { value: 'healthcare', label: 'Kesehatan',     icon: '🏥', color: '#ef4444' },
  { value: 'creative',   label: 'Kreatif & Desain', icon: '🎨', color: '#a855f7' },
  { value: 'education',  label: 'Pendidikan',    icon: '📚', color: '#f59e0b' },
  { value: 'ecommerce',  label: 'E-Commerce',    icon: '🛒', color: '#06b6d4' },
  { value: 'consulting', label: 'Konsulting',    icon: '📊', color: '#8b5cf6' },
  { value: 'media',      label: 'Media & Konten',icon: '📺', color: '#ec4899' },
  { value: 'government', label: 'Pemerintahan',  icon: '🏛️', color: '#64748b' },
  { value: 'startup',    label: 'Startup',       icon: '🚀', color: '#f97316' },
  { value: 'manufacture',label: 'Manufaktur',    icon: '🏭', color: '#78716c' },
  { value: 'ngo',        label: 'NGO / Sosial',  icon: '🌱', color: '#22c55e' },
];

function toggleInArray(arr: string[], value: string): string[] {
  return arr.includes(value)
    ? arr.filter((v) => v !== value)
    : [...arr, value];
}

export default function WorkInterestStep() {
  const extractedData = useOnboardingStore((s) => s.mahasiswaAssessment.cvExtractedData);
  const industries    = useOnboardingStore((s) => s.mahasiswaAssessment.preferredIndustries);
  const workInterests = useOnboardingStore((s) => s.mahasiswaAssessment.workInterests);
  const setField      = useOnboardingStore((s) => s.setMahasiswaField);

  /* ── Skill editing ── */
  const handleRemoveSkill = (skill: string) => {
    if (!extractedData) return;
    const updated = extractedData.skills.filter((s) => s !== skill);
    useOnboardingStore.getState().setCVExtractedData({
      ...extractedData,
      skills: updated,
    });
  };

  const handleAddInterest = (interest: string) => {
    setField('workInterests', toggleInArray(workInterests, interest));
  };

  return (
    <div className={styles.wrapper}>
      {/* ── Confirmed Skills from CV ── */}
      {extractedData && extractedData.skills.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>🎯 Skills dari CV-mu</h3>
            <span className={styles.editHint}>Klik ✕ untuk hapus yang tidak relevan</span>
          </div>
          <div className={styles.skillTags}>
            {extractedData.skills.map((skill) => (
              <span key={skill} className={styles.skillTag}>
                {skill}
                <button
                  type="button"
                  className={styles.skillRemove}
                  onClick={() => handleRemoveSkill(skill)}
                  aria-label={`Hapus ${skill}`}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ── Industry Selection ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>🏢 Industri yang Diminati</h3>
        </div>
        <p className={styles.sectionHint}>
          Pilih industri tempat kamu ingin berkarier (boleh lebih dari satu).
        </p>
        <div className={styles.industryGrid}>
          {INDUSTRIES.map((ind) => {
            const isSelected = industries.includes(ind.value);
            return (
              <button
                key={ind.value}
                type="button"
                className={`${styles.industryCard} ${isSelected ? styles.industrySelected : ''}`}
                style={{ '--ind-color': ind.color } as React.CSSProperties}
                onClick={() => setField('preferredIndustries', toggleInArray(industries, ind.value))}
              >
                <span className={styles.industryIcon}>{ind.icon}</span>
                <span className={styles.industryLabel}>{ind.label}</span>
                {isSelected && <span className={styles.industryCheck}>✓</span>}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Work Interest / Type ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>💼 Tipe Pekerjaan</h3>
        </div>
        <p className={styles.sectionHint}>Kamu lebih tertarik bekerja sebagai...</p>
        <div className={styles.typeChips}>
          {[
            'Full-time', 'Internship / Magang', 'Freelance',
            'Remote', 'Hybrid', 'On-site',
          ].map((type) => {
            const isSelected = workInterests.includes(type);
            return (
              <button
                key={type}
                type="button"
                className={`${styles.typeChip} ${isSelected ? styles.typeChipSelected : ''}`}
                onClick={() => handleAddInterest(type)}
              >
                {type}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
