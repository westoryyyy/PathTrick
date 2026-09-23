'use client';

import { useOnboardingStore } from '@/store/useOnboardingStore';
import { GICS_SECTORS, GICSSectorCode } from '@/data/gicsData';

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
    <div className="flex flex-col gap-7">

      {/* ── Confirmed Skills from CV (grouped by pillar) ── */}
      {extractedData && extractedData.skills.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="font-pixel text-[0.7rem] text-[#f0e8ff] m-0 tracking-[0.06em]">🎯 Skills dari CV-mu</h3>
            <span className="font-pixel text-[0.5rem] text-[rgba(240,232,255,0.5)]">Klik ✕ untuk hapus yang tidak relevan</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {extractedData.skills.map(skill => (
              <span key={skill.name} className="flex items-center gap-1.5 font-pixel text-[0.55rem] text-[#c084fc] bg-[rgba(168,85,247,0.1)] border border-[rgba(168,85,247,0.25)] py-1.5 px-2.5 transition-all duration-200 hover:border-[rgba(168,85,247,0.5)] hover:bg-[rgba(168,85,247,0.15)]">
                {skill.name}
                <button
                  type="button"
                  className="bg-none border-none text-[rgba(240,232,255,0.3)] text-[0.9rem] cursor-pointer px-0.5 leading-none transition-colors duration-150 hover:text-[#ef4444]"
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
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="font-pixel text-[0.7rem] text-[#f0e8ff] m-0 tracking-[0.06em]">🌐 Sektor Industri (GICS)</h3>
          <span className="font-pixel text-[0.5rem] text-[rgba(240,232,255,0.5)]" style={{
            color: preferredGICS.length >= MAX_SECTORS ? '#ef4444' : undefined
          }}>
            Pilih maks. {MAX_SECTORS} sektor ({preferredGICS.length}/{MAX_SECTORS})
          </span>
        </div>
        <p className="font-pixel text-[0.55rem] text-[rgba(240,232,255,0.6)] m-0 leading-[1.5]">
          Standar GICS digunakan LinkedIn &amp; bursa saham global untuk memetakan 11 sektor industri.
          Pilih sektor tempat kamu ingin berkarier.
        </p>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2.5 sm:gap-2">
          {GICS_SECTORS.map(sector => {
            const isSelected = preferredGICS.includes(sector.code);
            const isDisabled = !isSelected && preferredGICS.length >= MAX_SECTORS;
            return (
              <button
                key={sector.code}
                type="button"
                className={`relative flex flex-col items-center gap-2 py-4 px-3 sm:py-3 sm:px-2 bg-[#bc8f65] border-2 border-[#5a3a29] shadow-[inset_0_0_8px_rgba(0,0,0,0.3),2px_2px_0_0_rgba(0,0,0,0.5)] cursor-pointer text-white transition-all duration-100 hover:bg-[#cba37b] hover:border-[#6a4734] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[inset_0_0_8px_rgba(0,0,0,0.3),3px_3px_0_0_rgba(0,0,0,0.5)] ${isSelected ? '!bg-[#d4a373] !border-[#f59e0b] !shadow-[inset_0_0_8px_rgba(0,0,0,0.3),0_0_0_2px_rgba(245,158,11,0.6)] -translate-x-[1px] -translate-y-[1px]' : ''} ${isDisabled ? 'opacity-50 cursor-not-allowed hover:bg-[#bc8f65] hover:border-[#5a3a29] hover:translate-x-0 hover:translate-y-0 hover:shadow-[inset_0_0_8px_rgba(0,0,0,0.3),2px_2px_0_0_rgba(0,0,0,0.5)]' : ''}`}
                style={{ '--ind-color': sector.accentColor } as React.CSSProperties}
                onClick={() => handleToggleSector(sector.code)}
                disabled={isDisabled}
                title={sector.description}
              >
                <span className="text-[2rem] leading-none">{sector.icon}</span>
                <span className={`font-pixel text-[0.5rem] text-white tracking-[0.05em] text-center leading-[1.4] drop-shadow-[1px_1px_0_#3b261b] ${isSelected ? 'text-white' : ''}`}>{sector.nameID}</span>
                {isSelected && <span className="absolute top-1.5 right-2 font-pixel text-[0.55rem] text-[color:var(--ind-color)] animate-[checkPop_0.25s_cubic-bezier(0.22,1,0.36,1)]">✓</span>}
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
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="font-pixel text-[0.7rem] text-[#f0e8ff] m-0 tracking-[0.06em]">💼 Tipe Pekerjaan</h3>
        </div>
        <p className="font-pixel text-[0.55rem] text-[rgba(240,232,255,0.6)] m-0 leading-[1.5]">Kamu lebih tertarik bekerja sebagai...</p>
        <div className="flex flex-wrap gap-2">
          {['Full-time', 'Internship / Magang', 'Freelance', 'Remote', 'Hybrid', 'On-site'].map(type => {
            const isSelected = workInterests.includes(type);
            return (
              <button
                key={type}
                type="button"
                className={`py-2.5 px-4 font-pixel text-[0.6rem] text-white drop-shadow-[1px_1px_0_#3b261b] bg-[#bc8f65] border-2 border-[#5a3a29] shadow-[inset_0_0_8px_rgba(0,0,0,0.3),2px_2px_0_0_rgba(0,0,0,0.5)] cursor-pointer transition-colors duration-100 hover:bg-[#cba37b] hover:border-[#6a4734] ${isSelected ? '!bg-[#d4a373] !border-[#f59e0b] !shadow-[inset_0_0_8px_rgba(0,0,0,0.3),0_0_0_2px_rgba(245,158,11,0.6)]' : ''}`}
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
