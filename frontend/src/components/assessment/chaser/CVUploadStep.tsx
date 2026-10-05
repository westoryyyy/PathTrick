'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { useTranslation } from '@/hooks/useTranslation';

import { classifySkills } from '@/data/wefSkillData';
import { extractTextFromPDF } from '@/lib/pdfExtractor';

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_SIZE_MB = 10;

/** Panggil backend (AI Agent 2) untuk mengekstrak skill/pengalaman dari teks CV & portfolio. */
async function extractCVFromBackend(cvText: string, portfolioText: string) {
  const { API_BASE_URL } = await import('@/config/pathtrick');
  const { getAuthHeaders } = await import('@/hooks/useAuthSync');
  const res = await fetch(`${API_BASE_URL}/api/assessment/chaser/analyze-cv`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ cvText, portfolioText: portfolioText || null }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || `HTTP ${res.status}`);
  }
  const data = await res.json();
  return {
    skills: classifySkills([]).concat(
      (data.skills ?? []).map((s: { name: string; level: number }) => ({
        name: s.name,
        level: Math.min(5, Math.max(1, s.level || 3)) as 1 | 2 | 3 | 4 | 5,
      }))
    ),
    experience: (data.experience ?? []) as string[],
    education: (data.education ?? '') as string,
  };
}

export default function CVUploadStep() {
  const { locale } = useTranslation();
  const store = useOnboardingStore();
  const {
    chaserAssessment: cState,
    setChaserField,
    setCVExtractedData,
  } = store;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState('');

  /* ── File Validation ── */
  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) return locale === 'id' ? 'Format tidak didukung. Gunakan PDF, DOC, atau DOCX.' : 'Format not supported. Use PDF, DOC, or DOCX.';
    if (file.size > MAX_SIZE_MB * 1024 * 1024) return locale === 'id' ? `Ukuran file melebihi ${MAX_SIZE_MB}MB.` : `File size exceeds ${MAX_SIZE_MB}MB.`;
    return null;
  };

  /* ── Handle CV Upload ── */
  const handleCVFile = useCallback(async (file: File) => {
    const error = validateFile(file);
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError('');

    setChaserField('cvFile', file);
    setChaserField('cvFileName', file.name);
    setChaserField('cvExtractionStatus', 'uploading');

    try {
      setChaserField('cvExtractionStatus', 'extracting');

      // Ekstrak teks dari PDF di frontend (Client-Side)
      const text = await extractTextFromPDF(file, 8000);
      
      if (text.length < 50) {
        setValidationError(locale === 'id' ? 'PDF tidak dapat dibaca (mungkin hasil scan). Coba PDF dari Word/Google Docs.' : 'PDF cannot be read (might be a scanned image). Try a text-based PDF.');
        setChaserField('cvExtractionStatus', 'error');
        return;
      }

      setChaserField('cvText', text);
      
      // Ekstraksi skill oleh AI Agent 2 di backend
      const data = await extractCVFromBackend(text, useOnboardingStore.getState().chaserAssessment.portfolioText);
      setCVExtractedData(data);
      
      setChaserField('cvExtractionStatus', 'done');
    } catch (err) {
      console.error(err);
      setChaserField('cvExtractionStatus', 'error');
      setValidationError(err instanceof Error && err.message ? (locale === 'id' ? `Gagal menganalisis CV: ${err.message}` : `Failed to analyze CV: ${err.message}`) : (locale === 'id' ? 'Gagal membaca PDF. Pastikan file tidak rusak.' : 'Failed to read PDF. Ensure the file is not corrupted.'));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Drag & Drop ── */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleCVFile(file);
  };

  /* ── File Input Change ── */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleCVFile(file);
  };

  /* ── Portfolio Upload ── */
  const handlePortfolioChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setChaserField('portfolioFile', file);
      setChaserField('portfolioFileName', file.name);
      
      try {
        const text = await extractTextFromPDF(file, 4000);
        setChaserField('portfolioText', text);
      } catch (err) {
        console.error('Failed to extract portfolio PDF', err);
      }
    }
  };

  /* ── Reset CV ── */
  const handleRetry = () => {
    setChaserField('cvFile', null);
    setChaserField('cvFileName', '');
    setChaserField('cvExtractionStatus', 'idle');
    setCVExtractedData(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const status = cState.cvExtractionStatus;

  return (
    <div className="flex flex-col gap-8 w-full max-w-[600px] mx-auto">
      {validationError && (
        <p role="alert" className="m-0 border-4 border-red-950 bg-red-900 px-4 py-3 font-pixel text-[0.6rem] leading-[1.6] text-red-100 shadow-[4px_4px_0_#2a120d]">
          {validationError}
        </p>
      )}
      {/* ══════════ CV UPLOAD ZONE ══════════ */}
      <div
        className={`relative w-full min-h-[280px] sm:min-h-[220px] flex flex-col justify-center bg-[#bc8f65] border-4 border-[#5a3a29] transition-colors duration-200 cursor-pointer shadow-[inset_0_0_16px_rgba(0,0,0,0.3),4px_4px_0_0_rgba(0,0,0,0.5)] ${isDragOver ? '!bg-[#cba37b] !border-[#f59e0b]' : ''} ${status === 'done' ? '!bg-[#1e1b4b] !border-[#4c1d95] !cursor-default' : ''} ${status === 'error' ? '!bg-[#450a0a] !border-[#ef4444]' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => status === 'idle' && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        id="cv-drop-zone"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload CV"
        />

        {/* ── IDLE STATE ── */}
        {status === 'idle' && (
          <div className="flex flex-col items-center gap-4 p-10 sm:p-7 text-center">
            <Image src="/Scroll.png" alt="" width={48} height={48} className="object-contain drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)] animate-[iconFloat_2s_ease-in-out_infinite]" />
            <p className="font-pixel text-[0.85rem] text-white m-0 tracking-[0.05em] drop-shadow-[1px_1px_0_#3b261b] leading-[1.6]">{locale === 'id' ? 'Drag & Drop CV-mu di sini' : 'Drag & Drop your CV here'}</p>
            <p className="font-pixel text-[0.6rem] text-white m-0 uppercase drop-shadow-[1px_1px_0_#3b261b]">{locale === 'id' ? 'atau klik untuk browse file' : 'or click to browse files'}</p>
            <p className="font-pixel text-[0.55rem] text-white m-0 tracking-[0.06em] drop-shadow-[1px_1px_0_#3b261b]">PDF ONLY • {locale === 'id' ? 'Maks' : 'Max'} {MAX_SIZE_MB}MB</p>
          </div>
        )}

        {/* ── UPLOADING STATE ── */}
        {status === 'uploading' && (
          <div className="flex flex-col items-center gap-3.5 px-6 py-10 text-center">
            <div className="w-12 h-12 flex items-center justify-center">
              <span className="block w-9 h-9 border-4 border-[#4c1d95] border-t-[#a855f7] animate-[spin_0.8s_steps(4)_infinite]" />
            </div>
            <p className="font-pixel text-[0.8rem] text-[#a855f7] m-0 tracking-[0.06em] uppercase drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]">{locale === 'id' ? 'Mengunggah...' : 'Uploading...'}</p>
            <p className="font-pixel text-[0.6rem] text-[rgba(240,232,255,0.7)] m-0">{cState.cvFileName}</p>
            <div className="w-[250px] h-4 bg-[#1e1b4b] border-4 border-[#4c1d95] shadow-[inset_4px_4px_0_rgba(0,0,0,0.4)] relative">
              <div className="h-full bg-[#a855f7] transition-[width] duration-500 ease-[steps(10)]" style={{ width: '60%' }} />
            </div>
          </div>
        )}

        {/* ── EXTRACTING STATE ── */}
        {status === 'extracting' && (
          <div className="flex flex-col items-center gap-3.5 px-6 py-10 text-center">
            <div className="relative w-16 h-16 flex items-center justify-center bg-[#1e1b4b] border-4 border-[#4c1d95] overflow-hidden">
              <Image src="/NPC Wizard.png" alt="" width={48} height={48} className="relative z-10 object-contain" />
              <div className="absolute left-0 right-0 h-1 bg-[#2dd4bf] shadow-[0_0_16px_#2dd4bf] animate-[scanMove_1.5s_steps(10)_infinite]" />
            </div>
            <p className="font-pixel text-[0.8rem] text-[#a855f7] m-0 tracking-[0.06em] uppercase drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]">{locale === 'id' ? 'AI SEDANG MENGANALISIS SCROLL-MU...' : 'AI IS ANALYZING YOUR SCROLL...'}</p>
            <p className="font-pixel text-[0.6rem] text-[rgba(240,232,255,0.7)] m-0">{cState.cvFileName}</p>
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 bg-[#7c3aed] border-2 border-white animate-[dotBounce_0.6s_steps(2)_infinite]" />
              <span className="w-2.5 h-2.5 bg-[#7c3aed] border-2 border-white animate-[dotBounce_0.6s_steps(2)_infinite] [animation-delay:0.2s]" />
              <span className="w-2.5 h-2.5 bg-[#7c3aed] border-2 border-white animate-[dotBounce_0.6s_steps(2)_infinite] [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        {/* ── DONE STATE ── */}
        {status === 'done' && cState.cvExtractedData && (
          <div className="flex flex-col gap-4.5 p-6 sm:p-3.5 w-full text-left">
            <div className="flex items-center gap-4">
              <Image src="/Healing Potions.png" alt="" width={48} height={48} className="shrink-0 object-contain drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]" />
              <div>
                <p className="font-pixel text-[0.85rem] text-white m-0 tracking-[0.06em] drop-shadow-[1px_1px_0_#3b261b] leading-[1.6]">{locale === 'id' ? 'CV Berhasil Dianalisis!' : 'CV Successfully Analyzed!'}</p>
                <p className="font-pixel text-[0.55rem] text-[rgba(240,232,255,0.7)] m-0 mt-2">{cState.cvFileName}</p>
              </div>
              <button
                type="button"
                className="ml-auto font-pixel text-[0.6rem] text-white bg-[#b91c1c] border-2 border-[#f87171] px-3 py-2 cursor-pointer shadow-[2px_2px_0_rgba(0,0,0,0.5)] transition-transform duration-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                onClick={(e) => { e.stopPropagation(); handleRetry(); }}
              >
                🔄 {locale === 'id' ? 'Ganti' : 'Change'}
              </button>
            </div>

            {/* Extracted Skills */}
            <div className="flex flex-col gap-3 pt-4 border-t-4 border-dashed border-white/10">
              <p className="font-pixel text-[0.7rem] text-white m-0 tracking-[0.06em] drop-shadow-[1px_1px_0_#3b261b]">{locale === 'id' ? 'Skills Terdeteksi (Hasil AI Ekstraksi CV & Portfolio)' : 'Detected Skills (AI Extraction Results)'}</p>
              <div className="flex flex-wrap gap-2.5">
                {(cState.cvExtractedData?.skills ?? []).map((skill, i) => (
                  <span key={i} className="font-pixel text-[0.55rem] text-white bg-[#4c1d95] border-2 border-[#a855f7] shadow-[2px_2px_0_rgba(0,0,0,0.5)] px-2.5 py-1.5 animate-[tagIn_0.35s_steps(4)_both]" style={{ animationDelay: `${i * 0.08}s` }}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Extracted Experience */}
            <div className="flex flex-col gap-3 pt-4 border-t-4 border-dashed border-white/10">
              <p className="font-pixel text-[0.7rem] text-white m-0 tracking-[0.06em] drop-shadow-[1px_1px_0_#3b261b]">{locale === 'id' ? 'Pengalaman' : 'Experience'}</p>
              <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                {cState.cvExtractedData.experience.map((exp, i) => (
                  <li key={i} className="font-pixel text-[0.55rem] text-[rgba(240,232,255,0.9)] pl-5 relative leading-[1.8] animate-[tagIn_0.35s_steps(4)_both] before:content-['>'] before:absolute before:left-0 before:text-[#34d399]" style={{ animationDelay: `${0.5 + i * 0.1}s` }}>{exp}</li>
                ))}
              </ul>
            </div>

            {/* Extracted Education */}
            <div className="flex flex-col gap-3 pt-4 border-t-4 border-dashed border-white/10">
              <p className="font-pixel text-[0.7rem] text-white m-0 tracking-[0.06em] drop-shadow-[1px_1px_0_#3b261b]">Pendidikan</p>
              <p className="font-pixel text-[0.55rem] text-[rgba(240,232,255,0.9)] m-0 leading-[1.8]">{cState.cvExtractedData.education}</p>
            </div>
          </div>
        )}

        {/* ── ERROR STATE ── */}
        {status === 'error' && (
          <div className="flex flex-col items-center gap-4 px-6 py-10 text-center">
            <Image src="/Red Potion.png" alt="" width={72} height={72} className="object-contain drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)]" />
            <p className="font-pixel text-[0.9rem] text-[#f87171] m-0 drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)] text-center">Gagal menganalisis CV</p>
            <p className="font-pixel text-[0.6rem] text-[rgba(240,232,255,0.7)] m-0 text-center leading-[1.6]">Terjadi kesalahan. Silakan coba lagi.</p>
            <button
              type="button"
              className="font-pixel text-[0.7rem] px-6 py-3 bg-[#991b1b] border-4 border-[#ef4444] shadow-[4px_4px_0_rgba(0,0,0,0.5)] text-white cursor-pointer mt-2.5 transition-transform duration-100 active:translate-x-1 active:translate-y-1 active:shadow-none"
              onClick={(e) => { e.stopPropagation(); handleRetry(); }}
            >
              🔄 Coba Lagi
            </button>
          </div>
        )}
      </div>

      {/* ══════════ PORTFOLIO UPLOAD (OPTIONAL) ══════════ */}
      <div className="flex flex-col gap-3 text-left">
        <div className="flex items-center gap-2.5">
          <span className="font-pixel text-[0.85rem] text-white tracking-[0.05em] drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]">📎 Portfolio</span>
          <span className="font-pixel text-[0.5rem] text-[#fbbf24] bg-[#78350f] border-2 border-[#b45309] px-2 py-1 shadow-[2px_2px_0_rgba(0,0,0,0.5)]">Opsional</span>
        </div>
        <div
          className="px-5 py-4 bg-[#bc8f65] border-4 border-dashed border-[#5a3a29] shadow-[inset_0_0_8px_rgba(0,0,0,0.3)] cursor-pointer text-center hover:bg-[#cba37b] hover:border-[#6a4734] transition-colors"
          onClick={() => portfolioInputRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          <input
            ref={portfolioInputRef}
            type="file"
            accept=".pdf"
            onChange={handlePortfolioChange}
            className="hidden"
            aria-label="Upload Portfolio"
          />
          {cState.portfolioFileName ? (
            <p className="font-pixel text-[0.6rem] text-[#34d399] m-0 drop-shadow-[1px_1px_0_rgba(0,0,0,0.5)]">📄 {cState.portfolioFileName}</p>
          ) : (
            <p className="font-pixel text-[0.55rem] text-[rgba(240,232,255,0.6)] m-0 uppercase">Klik untuk upload portfolio (PDF ONLY)</p>
          )}
        </div>
      </div>
    </div>
  );
}
