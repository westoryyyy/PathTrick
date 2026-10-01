'use client';

import { useOnboardingStore } from '@/store/useOnboardingStore';
import { GICS_SECTORS, GICSSectorCode } from '@/data/gicsData';
import PixelIcon from '@/components/ui/PixelIcon';
import { useTranslation } from '@/hooks/useTranslation';

function toggleInArray<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
}

const MAX_SECTORS = 3;

export default function WorkInterestStep() {
  const { locale } = useTranslation();
  const extractedData  = useOnboardingStore(s => s.chaserAssessment.cvExtractedData);
  const preferredGICS  = useOnboardingStore(s => s.chaserAssessment.preferredGICS);
  const workInterests  = useOnboardingStore(s => s.chaserAssessment.workInterests);
  const setField       = useOnboardingStore(s => s.setChaserField);

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
          <div className="flex flex-col gap-1.5">
            <h3 className="flex items-center gap-2 font-pixel text-[0.85rem] text-[#fde047] drop-shadow-[2px_2px_0_#3b261b] m-0 tracking-[0.06em]">Skill Hasil Scan CV-mu</h3>
            <span className="font-pixel text-[0.5rem] text-[#fdf6e3]">Ada yang kurang pas? Klik ✕ buat hapus aja.</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {extractedData.skills.map(skill => (
              <span key={skill.name} className="flex items-center gap-1.5 font-pixel text-[0.55rem] text-[#fdf6e3] drop-shadow-[1px_1px_0_#3b261b] bg-[#784626] border-2 border-[#5a3520] py-1.5 px-2.5 transition-all duration-200 hover:border-[#8b5c40] hover:bg-[#8a5532]">
                {skill.name}
                <button
                  type="button"
                  className="bg-none border-none text-[rgba(240,232,255,0.5)] text-[0.9rem] cursor-pointer px-0.5 leading-none transition-colors duration-150 hover:text-[#ef4444]"
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
          <h3 className="font-pixel text-[0.85rem] text-[#fde047] drop-shadow-[2px_2px_0_#3b261b] m-0 tracking-[0.06em]">Bidang Industri Pilihanmu</h3>
          <span className="font-pixel text-[0.5rem] text-[#fdf6e3]" style={{
            color: preferredGICS.length >= MAX_SECTORS ? '#ef4444' : undefined
          }}>
            Boleh pilih sampai {MAX_SECTORS} sektor ({preferredGICS.length}/{MAX_SECTORS})
          </span>
        </div>
        <p className="font-pixel text-[0.55rem] text-[#fdf6e3] m-0 leading-[1.6]">
          Standar industri global membagi seluruh bidang karir jadi 11 sektor utama.<br/>
          Nah, kamu paling tertarik terjun ke sektor yang mana nih?
        </p>

        <div className="flex flex-wrap gap-2.5 sm:gap-3">
          {GICS_SECTORS.map(sector => {
            const isSelected = preferredGICS.includes(sector.code);
            const isDisabled = !isSelected && preferredGICS.length >= MAX_SECTORS;
            return (
              <button
                key={sector.code}
                type="button"
                className={`group relative flex flex-col justify-center items-center gap-2 py-3 px-2 w-[130px] sm:w-[140px] h-[105px] sm:h-[110px] bg-[#bc8f65] border-2 border-[#5a3a29] shadow-[inset_0_0_8px_rgba(0,0,0,0.3),2px_2px_0_0_rgba(0,0,0,0.5)] cursor-pointer text-white transition-all duration-100 hover:bg-[#cba37b] hover:border-[#6a4734] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[inset_0_0_8px_rgba(0,0,0,0.3),3px_3px_0_0_rgba(0,0,0,0.5)] ${isSelected ? '!bg-[#d4a373] !border-[#f59e0b] !shadow-[inset_0_0_8px_rgba(0,0,0,0.3),0_0_0_2px_rgba(245,158,11,0.6)] -translate-x-[1px] -translate-y-[1px]' : ''} ${isDisabled ? 'opacity-50 cursor-not-allowed hover:bg-[#bc8f65] hover:border-[#5a3a29] hover:translate-x-0 hover:translate-y-0 hover:shadow-[inset_0_0_8px_rgba(0,0,0,0.3),2px_2px_0_0_rgba(0,0,0,0.5)]' : ''}`}
                style={{ '--ind-color': sector.accentColor } as React.CSSProperties}
                onClick={() => handleToggleSector(sector.code)}
                disabled={isDisabled}
              >
                <PixelIcon icon={sector.icon} size={40} />
                <span className={`font-pixel text-[0.5rem] text-white tracking-[0.05em] text-center leading-[1.4] drop-shadow-[1px_1px_0_#3b261b] whitespace-pre-line ${isSelected ? 'text-white' : ''}`}>{locale === 'en' ? sector.nameEN : sector.nameID}</span>
                {isSelected && <span className="absolute top-1.5 right-2 font-pixel text-[0.55rem] text-[color:var(--ind-color)] animate-[checkPop_0.25s_cubic-bezier(0.22,1,0.36,1)]">✓</span>}
                
                {/* Custom RPG Tooltip */}
                <div className="absolute z-50 bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-[180px] p-2.5 bg-[#3b2416] border-2 border-[#6a4734] shadow-[0_4px_12px_rgba(0,0,0,0.5)] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200">
                  <p className="font-pixel text-[0.45rem] leading-[1.6] text-[#fdf6e3] m-0 text-center drop-shadow-[1px_1px_0_#1a100a]">
                    {sector.description}
                  </p>
                  {/* Tooltip Arrow */}
                  <div className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#6a4734]"></div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected sector example roles */}
        {selectedSectors.length > 0 && (
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {selectedSectors.map(sector => (
              <div key={sector.code} style={{
                padding: '12px 14px',
                background: '#784626',
                border: '2px solid #5a3520',
                boxShadow: 'inset 0 0 8px rgba(0,0,0,0.4), 2px 2px 0 0 rgba(0,0,0,0.5)',
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start',
              }}>
                <PixelIcon icon={sector.icon} size={24} />
                <div>
                  <span style={{ fontFamily: "var(--font-pixel)", fontSize: '0.5rem', color: '#fde047', display: 'block', marginBottom: '6px', textShadow: '1px 1px 0 #3b261b' }}>
                    {sector.nameID.replace('\n', ' ')}
                  </span>
                  <span style={{ fontFamily: "var(--font-pixel)", fontSize: '0.45rem', color: '#fdf6e3', lineHeight: '1.6', textShadow: '1px 1px 0 #3b261b' }}>
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
          <h3 className="flex items-center gap-2 font-pixel text-[0.85rem] text-[#fde047] drop-shadow-[2px_2px_0_#3b261b] m-0 tracking-[0.06em]">Tipe Pekerjaan</h3>
        </div>
        <p className="font-pixel text-[0.55rem] text-[#fdf6e3] m-0 leading-[1.5]">Kamu lebih tertarik bekerja sebagai...</p>
        <div className="flex flex-wrap gap-2">
          {['Full-time', 'Internship / Magang', 'Freelance', 'Remote', 'Hybrid', 'On-site'].map(type => {
            const isSelected = workInterests.includes(type);
            const descriptions: Record<string, string> = {
              'Full-time': 'Kerja tetap full 40 jam seminggu. Biasanya Senin-Jumat dari pagi sampai sore.',
              'Internship / Magang': 'Cocok buat nambah jam terbang dan pengalaman sebelum beneran lulus.',
              'Freelance': 'Kerja bebas! Ambil proyek sesukamu tanpa harus terikat ngantor tiap hari.',
              'Remote': 'Kerja full online! Boleh dari rumah, cafe, atau mana aja asal ada internet.',
              'Hybrid': 'Fleksibel abis! Bisa ngantor, bisa juga kerja dari rumah (remote) gantian.',
              'On-site': 'Wajib ngantor! Harus datang langsung ke tempat kerja setiap harinya.'
            };
            const desc = descriptions[type] || '';
            
            return (
              <button
                key={type}
                type="button"
                className={`group relative py-2.5 px-4 font-pixel text-[0.6rem] text-white drop-shadow-[1px_1px_0_#3b261b] bg-[#bc8f65] border-2 border-[#5a3a29] shadow-[inset_0_0_8px_rgba(0,0,0,0.3),2px_2px_0_0_rgba(0,0,0,0.5)] cursor-pointer transition-colors duration-100 hover:bg-[#cba37b] hover:border-[#6a4734] ${isSelected ? '!bg-[#d4a373] !border-[#f59e0b] !shadow-[inset_0_0_8px_rgba(0,0,0,0.3),0_0_0_2px_rgba(245,158,11,0.6)]' : ''}`}
                onClick={() => handleAddInterest(type)}
              >
                {type}
                {/* Custom RPG Tooltip */}
                <div className="absolute z-50 bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-[160px] p-2.5 bg-[#3b2416] border-2 border-[#6a4734] shadow-[0_4px_12px_rgba(0,0,0,0.5)] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200">
                  <p className="font-pixel text-[0.45rem] leading-[1.6] text-[#fdf6e3] m-0 text-center drop-shadow-[1px_1px_0_#1a100a] whitespace-pre-wrap">
                    {desc}
                  </p>
                  {/* Tooltip Arrow */}
                  <div className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#6a4734]"></div>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
