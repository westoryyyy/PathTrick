'use client';

import { useOnboardingStore } from '@/store/useOnboardingStore';
import { GICS_SECTORS, GICSSectorCode } from '@/data/gicsData';
import styles from './WorkInterestStep.module.css';

function toggleInArray<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
}

const MAX_SECTORS = 3;

export default function WorkInterestStep() {
  const extractedData  = useOnboardingStore(s => s.mahasiswaAssessment.cvExtractedData);
  const preferredGICS  = useOnboardingStore(s => s.mahasiswaAssessment.preferredGICS);
  const workInterests  = useOnboardingStore(s => s.mahasiswaAssessment.workInterests);
  const setField       = useOnboardingStore(s => s.setMahasiswaField);

  /* ── Skill editing ── */
  const handleRemoveSkill = (skillName: string) => {
    if (!extractedData) return;
    const updated = extractedData.skills.filter(s => s.name !== skillName);
    useOnboardingStore.getState().setCVExtractedData({ ...extractedData, skills: updated });
  };

  /* ── GICS sector toggle (max 3) ── */
  const handleToggleSector = (code: GICSSectorCode) => {
    const isSelected = preferredGICS.includes(code);
    if (!isSelected && preferredGICS.length >= MAX_SECTORS) return; // cap at 3
    setField('preferredGICS', toggleInArray(preferredGICS, code));
  };

  /* ── Work interest type toggle ── */
  const handleAddInterest = (interest: string) => {
    setField('workInterests', toggleInArray(workInterests, interest));
  };

  /* ── Selected sector metadata ── */
  const selectedSectors = GICS_SECTORS.filter(s => preferredGICS.includes(s.code));

  return (
    <div className={styles.wrapper}>

      {/* ── Confirmed Skills from CV (grouped by pillar) ── */}
      {extractedData && extractedData.skills.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>🎯 Skills dari CV-mu</h3>
            <span className={styles.editHint}>Klik ✕ untuk hapus yang tidak relevan</span>
          </div>
          <div className={styles.skillTags}>
            {extractedData.skills.map(skill => (
              <span key={skill.name} className={styles.skillTag}>
                {skill.name}
                <button
                  type="button"
                  className={styles.skillRemove}
                  onClick={() => handleRemoveSkill(skill.name)}
                  aria-label={`Hapus ${skill.name}`}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ── GICS Sector Picker ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>🌐 Sektor Industri (GICS)</h3>
          <span className={styles.editHint} style={{
            color: preferredGICS.length >= MAX_SECTORS ? '#ef4444' : undefined
          }}>
            Pilih maks. {MAX_SECTORS} sektor ({preferredGICS.length}/{MAX_SECTORS})
          </span>
        </div>
        <p className={styles.sectionHint}>
          Standar GICS digunakan LinkedIn &amp; bursa saham global untuk memetakan 11 sektor industri.
          Pilih sektor tempat kamu ingin berkarier.
        </p>

        <div className={styles.industryGrid}>
          {GICS_SECTORS.map(sector => {
            const isSelected = preferredGICS.includes(sector.code);
            const isDisabled = !isSelected && preferredGICS.length >= MAX_SECTORS;
            return (
              <button
                key={sector.code}
                type="button"
                className={`${styles.industryCard} ${isSelected ? styles.industrySelected : ''} ${isDisabled ? styles.industryDisabled : ''}`}
                style={{ '--ind-color': sector.accentColor } as React.CSSProperties}
                onClick={() => handleToggleSector(sector.code)}
                disabled={isDisabled}
                title={sector.description}
              >
                <span className={styles.industryIcon}>{sector.icon}</span>
                <span className={styles.industryLabel}>{sector.nameID}</span>
                {isSelected && <span className={styles.industryCheck}>✓</span>}
              </button>
            );
          })}
        </div>

        {/* Selected sector example roles */}
        {selectedSectors.length > 0 && (
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {selectedSectors.map(sector => (
              <div key={sector.code} style={{
                padding: '10px 14px',
                background: 'rgba(255,255,255,0.06)',
                border: `1px solid ${sector.accentColor}40`,
                borderRadius: '6px',
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{sector.icon}</span>
                <div>
                  <span style={{ fontFamily: "var(--font-pixel)", fontSize: '0.5rem', color: sector.accentColor, display: 'block', marginBottom: '4px' }}>
                    {sector.nameID}
                  </span>
                  <span style={{ fontFamily: "var(--font-pixel)", fontSize: '0.45rem', color: '#94a3b8', lineHeight: '1.6' }}>
                    Contoh: {sector.exampleRoles.slice(0, 3).join(' · ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Work Interest / Type ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>💼 Tipe Pekerjaan</h3>
        </div>
        <p className={styles.sectionHint}>Kamu lebih tertarik bekerja sebagai...</p>
        <div className={styles.typeChips}>
          {['Full-time', 'Internship / Magang', 'Freelance', 'Remote', 'Hybrid', 'On-site'].map(type => {
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
