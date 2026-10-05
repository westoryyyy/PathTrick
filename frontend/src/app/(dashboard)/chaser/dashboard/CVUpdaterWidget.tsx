'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from '@/components/ui/Dashboard.module.css';
import { useTranslation } from '@/hooks/useTranslation';
import { API_BASE_URL } from '@/config/pathtrick';
import { getAuthHeaders } from '@/hooks/useAuthSync';
import { extractTextFromPDF } from '@/lib/pdfExtractor';

const MAX_SIZE_MB = 10;
const ACCEPTED_TYPES = [
  'application/pdf',
];

export default function CVUpdaterWidget() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<'idle' | 'uploading' | 'extracting' | 'done' | 'error'>('idle');
  const [result, setResult] = useState<{newSkills: string[], missingSkills: string[], xpGained: number} | null>(null);
  const [fileName, setFileName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [extractProgress, setExtractProgress] = useState(0);
  const [dots, setDots] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Animated dots for loading text
  useEffect(() => {
    if (status === 'uploading' || status === 'extracting') {
      const interval = setInterval(() => {
        setDots(d => d.length >= 3 ? '' : d + '.');
      }, 400);
      return () => clearInterval(interval);
    }
  }, [status]);

  // Animate upload progress bar
  useEffect(() => {
    if (status !== 'uploading') { setUploadProgress(0); return; }
    setUploadProgress(0);
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 15) + 8;
      if (current >= 100) {
        current = 100;
        setUploadProgress(100);
        clearInterval(interval);
        setTimeout(() => setStatus('extracting'), 400);
      } else {
        setUploadProgress(current);
      }
    }, 220);
    return () => clearInterval(interval);
  }, [status]);

  // Animate extract progress bar
  useEffect(() => {
    if (status !== 'extracting') { setExtractProgress(0); return; }
    setExtractProgress(0);
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 10) + 4;
      if (current >= 100) {
        current = 100;
        setExtractProgress(100);
        clearInterval(interval);
        setTimeout(() => setStatus('done'), 400);
      } else {
        setExtractProgress(current);
      }
    }, 260);
    return () => clearInterval(interval);
  }, [status]);

  const handleFileUpload = async (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setErrorMsg('Format tidak didukung. Gunakan file PDF.');
      setStatus('error');
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrorMsg(`Ukuran file melebihi ${MAX_SIZE_MB}MB.`);
      setStatus('error');
      return;
    }
    setFileName(file.name);
    setErrorMsg('');
    setStatus('uploading');

    try {
      setStatus('extracting');
      
      const cvText = await extractTextFromPDF(file);

      // Basic validation: ensure extracted text is non-empty
      if (!cvText || !cvText.trim()) {
        setErrorMsg('Teks CV tidak ditemukan. Pastikan file berisi teks (PDF berbasis teks, bukan gambar).');
        setStatus('error');
        return;
      }

      const headers = getAuthHeaders();

      const res = await fetch(`${API_BASE_URL}/api/cv/update`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cvText }),
      });

      if (!res.ok) {
        // Try parse backend error message, but handle gracefully
        let errMsg = 'Gagal memproses CV';
        try {
          const err = await res.json();
          if (err && (err.error || err.message)) errMsg = err.error || err.message;
        } catch (e) {
          // ignore parse errors
        }
        setErrorMsg(errMsg);
        setStatus('error');
        return;
      }

      const data = await res.json();
      setResult(data);
      setStatus('done');
      
      // Update global user/gamification data if needed by triggering an event or reload
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message);
      setStatus('error');
    }
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };
  const handleReset = () => {
    setStatus('idle'); setFileName(''); setErrorMsg(''); setResult(null);
    setUploadProgress(0); setExtractProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={styles.retroCard}>
      {/* ── Header ── */}
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>🧾 UPDATE CV &amp; SKILLS</span>
        {status === 'done' && (
          <button
            onClick={handleReset}
            style={{
              fontFamily: '"Pixelify Sans", sans-serif',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              background: '#fbbf24',
              border: '3px solid #3b261b',
              color: '#3b261b',
              padding: '8px 20px',
              cursor: 'pointer',
              boxShadow: '3px 3px 0 #3b261b',
              transition: 'transform 0.1s, box-shadow 0.1s',
            }}
            onMouseDown={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translate(2px, 2px)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
            }}
            onMouseUp={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = '';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '3px 3px 0 #3b261b';
            }}
          >
            RE-UPLOAD
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '24px', flex: 1, transition: 'all 0.3s ease' }}>

        {/* ── LEFT: Upload Zone ── */}
        <div style={{ flex: status === 'done' ? '0 0 320px' : 1, display: 'flex', flexDirection: 'column', gap: '12px', transition: 'flex 0.3s ease' }}>
          {status !== 'done' && (
            <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.65rem', color: '#d4d4d8', lineHeight: '1.7', margin: 0 }}>
              {t('common.uploadCvPrompt')}
            </p>
          )}

          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => status === 'idle' && fileInputRef.current?.click()}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              minHeight: status === 'done' ? '180px' : '240px',
              background: isDragOver
                ? 'rgba(245,158,11,0.15)'
                : status === 'done' ? 'rgba(251,191,36,0.07)'
                  : status === 'error' ? 'rgba(239,68,68,0.1)'
                    : 'rgba(0,0,0,0.25)',
              border: `3px dashed ${isDragOver ? '#f59e0b'
                  : status === 'done' ? '#b45309'
                    : status === 'error' ? '#ef4444'
                      : status === 'uploading' || status === 'extracting' ? '#b45309'
                        : '#5a3a29'
                }`,
              padding: '28px 20px',
              cursor: status === 'idle' ? 'pointer' : 'default',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              transition: 'border-color 0.2s, background 0.2s',
            }}
          >
            <input type="file" accept=".pdf" ref={fileInputRef} onChange={handleChange} style={{ display: 'none' }} />

            {/* IDLE */}
            {status === 'idle' && (
              <>
                <div style={{
                  width: '64px', height: '64px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(251,191,36,0.15)', border: '3px solid #b45309',
                  boxShadow: '0 0 20px rgba(251,191,36,0.2), 4px 4px 0 rgba(0,0,0,0.4)',
                }}>
                  <Image src="/Scroll.png" alt="" width={40} height={40} style={{ imageRendering: 'pixelated' }} />
                </div>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color: '#fbbf24', textShadow: '1px 1px 0 #3b261b', lineHeight: 1.6 }}>
                  Drag &amp; Drop CV di sini
                </span>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.55rem', color: '#a1a1aa', lineHeight: 1.6 }}>
                  atau klik untuk pilih file
                </span>
                <div style={{
                  background: 'rgba(0,0,0,0.3)', border: '2px solid #5a3a29',
                  padding: '4px 12px',
                  fontFamily: '"Pixelify Sans", sans-serif', fontSize: '0.75rem', color: '#d4d4d8',
                }}>
                  PDF ONLY &nbsp;|&nbsp; MAX {MAX_SIZE_MB}MB
                </div>
              </>
            )}

            {/* UPLOADING */}
            {status === 'uploading' && (
              <>
                {/* Pixel loading icon */}
                <div style={{
                  width: '72px', height: '72px', position: 'relative',
                  background: '#3b261b', border: '4px solid #78350f',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden', boxShadow: '0 0 16px rgba(251,191,36,0.2), 4px 4px 0 rgba(0,0,0,0.4)',
                }}>
                  <Image src="/Scroll.png" alt="" width={40} height={40} style={{ imageRendering: 'pixelated', position: 'relative', zIndex: 1 }} />
                  <div style={{
                    position: 'absolute', left: 0, right: 0, height: '2px',
                    background: '#fbbf24', boxShadow: '0 0 10px #fbbf24',
                    animation: 'scanLine 1.0s steps(10) infinite',
                  }} />
                </div>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color: '#fbbf24', textShadow: '1px 1px 0 #3b261b' }}>
                  UPLOADING{dots}
                </span>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.55rem', color: '#d4a373', maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  📄 {fileName}
                </span>
                {/* Progress Bar */}
                <div style={{ width: '100%', height: '16px', background: '#3b261b', border: '2px solid #78350f', boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.5)' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(uploadProgress, 100)}%`,
                    background: 'linear-gradient(90deg, #b45309, #fbbf24)',
                    transition: 'width 0.2s',
                    boxShadow: '0 0 8px rgba(251,191,36,0.5)',
                  }} />
                </div>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.5rem', color: '#fbbf24' }}>
                  {Math.min(uploadProgress, 100)}%
                </span>
              </>
            )}

            {/* EXTRACTING */}
            {status === 'extracting' && (
              <>
                <div style={{
                  width: '72px', height: '72px', position: 'relative',
                  background: '#3b261b', border: '4px solid #78350f',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden', boxShadow: '0 0 20px rgba(251,191,36,0.3)',
                }}>
                  <Image src="/NPC Wizard.png" alt="" width={52} height={52} style={{ imageRendering: 'pixelated', position: 'relative', zIndex: 1 }} />
                  {/* Scan line */}
                  <div style={{
                    position: 'absolute', left: 0, right: 0, height: '2px',
                    background: '#fbbf24', boxShadow: '0 0 12px #fbbf24, 0 0 24px rgba(251,191,36,0.5)',
                    animation: 'scanLine 1.2s steps(12) infinite',
                  }} />
                </div>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.7rem', color: '#fbbf24', textShadow: '1px 1px 0 #3b261b', lineHeight: 1.6 }}>
                  AI MENGANALISIS{dots}
                </span>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.55rem', color: '#d4a373' }}>Memperbarui skill profil kamu</span>
                {/* Pixel Progress Steps */}
                <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} style={{
                      width: '16px', height: '16px',
                      background: i < Math.floor(extractProgress / 10) ? '#fbbf24' : '#3b261b',
                      border: '2px solid #78350f',
                      boxShadow: i < Math.floor(extractProgress / 10) ? '0 0 6px rgba(251,191,36,0.6)' : 'none',
                      transition: 'background 0.15s',
                    }} />
                  ))}
                </div>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.5rem', color: '#d4a373' }}>
                  {Math.min(extractProgress, 100)}%
                </span>
              </>
            )}

            {/* DONE */}
            {status === 'done' && (
              <>
                <div style={{
                  width: '64px', height: '64px',
                  background: 'rgba(251,191,36,0.15)', border: '3px solid #b45309',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(251,191,36,0.3), 4px 4px 0 rgba(0,0,0,0.4)',
                }}>
                  <Image src="/Healing Potions.png" alt="" width={40} height={40} style={{ imageRendering: 'pixelated' }} />
                </div>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.8rem', color: '#fbbf24', textShadow: '1px 1px 0 #3b261b' }}>
                  ✓ PROFIL DIPERBARUI!
                </span>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.5rem', color: '#fff', maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Image src="/Scroll.png" alt="" width={14} height={14} style={{ imageRendering: 'pixelated', flexShrink: 0 }} />
                  {fileName}
                </span>
                {/* XP Gained */}
                <div style={{
                  background: '#78350f', border: '2px solid #b45309',
                  padding: '8px 20px', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)',
                  fontFamily: 'var(--font-pixel)', fontSize: '0.65rem', color: '#fbbf24',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <Image src="/Coin.png" alt="" width={15} height={15} style={{ imageRendering: 'pixelated', flexShrink: 0 }} />
                  +{result?.xpGained || 0} XP GAINED
                </div>
              </>
            )}

            {/* ERROR */}
            {status === 'error' && (
              <>
                <div style={{
                  width: '64px', height: '64px',
                  background: 'rgba(239,68,68,0.15)', border: '3px solid #991b1b',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(239,68,68,0.3), 4px 4px 0 rgba(0,0,0,0.4)',
                }}>
                  <Image src="/Red Potion.png" alt="" width={40} height={40} style={{ imageRendering: 'pixelated' }} />
                </div>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.8rem', color: '#f87171', textShadow: '0 0 8px #ef4444' }}>GAGAL!</span>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.6rem', color: '#fca5a5', lineHeight: 1.6 }}>{errorMsg}</span>
                <button onClick={handleReset} style={{
                  background: '#991b1b', border: '2px solid #ef4444',
                  color: '#fff', fontFamily: 'var(--font-pixel)', fontSize: '0.6rem',
                  padding: '8px 16px', cursor: 'pointer', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)',
                }}>
                  🔄 COBA LAGI
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── RIGHT: Skill Analysis Panel — only visible after upload starts ── */}
        {(status === 'uploading' || status === 'extracting' || status === 'done') && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* Panel Header */}
            <div style={{
              background: 'rgba(0,0,0,0.25)', border: '2px solid #5a3a29',
              padding: '10px 16px',
              fontFamily: 'var(--font-pixel)', fontSize: '0.65rem', color: '#fbbf24',
              textShadow: '1px 1px 0 #3b261b',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <Image src="/NPC Wizard.png" alt="" width={20} height={20} style={{ imageRendering: 'pixelated' }} />
              AI SKILL ANALYSIS RESULT
              {(status === 'uploading' || status === 'extracting') && (
                <span style={{ fontSize: '0.55rem', color: '#fbbf24', marginLeft: 'auto', background: 'rgba(120,53,15,0.8)', padding: '4px 10px', border: '1px solid #b45309', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  ● PROCESSING...
                </span>
              )}
              {status === 'done' && (
                <span style={{ fontSize: '0.55rem', color: '#fbbf24', marginLeft: 'auto', background: 'rgba(120,53,15,0.6)', padding: '4px 10px', border: '1px solid #b45309', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  ✓ DONE
                </span>
              )}
            </div>



            {/* Loading State */}
            {(status === 'uploading' || status === 'extracting') && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Membaca dokumen CV...', 'Mengekstrak skill & pengalaman...', 'Menganalisis gap vs target karir...'].map((step, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    background: 'rgba(0,0,0,0.2)', border: '2px solid #5a3a29',
                    padding: '12px 16px', opacity: status === 'extracting' ? 1 : i === 0 ? 1 : 0.4,
                  }}>
                    <div style={{
                      width: '12px', height: '12px', flexShrink: 0,
                      background: (status === 'extracting' && i < 2) ? '#fbbf24' : (status === 'uploading' && i === 0) ? '#fbbf24' : '#3b261b',
                      border: '2px solid',
                      borderColor: (status === 'extracting' && i < 2) ? '#b45309' : '#5a3a29',
                      animation: (status === 'uploading' && i === 0) || (status === 'extracting' && i === 2) ? 'pulse 0.8s steps(2) infinite' : 'none',
                    }} />
                    <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.55rem', color: '#d4d4d8', lineHeight: 1.5 }}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Done State: Show Analysis Result */}
            {status === 'done' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', overflow: 'auto' }}>

                {/* New Skills Detected */}
                <div style={{ background: 'rgba(59,38,27,0.6)', border: '2px solid #78350f', padding: '12px 16px' }}>
                  <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.55rem', color: '#fbbf24', margin: '0 0 8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Image src="/Energy Shard.png" alt="" width={14} height={14} style={{ imageRendering: 'pixelated', height: 14 }} />
                    Skill Baru Terdeteksi
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {result?.newSkills.length === 0 ? (
                       <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.5rem', color: '#a1a1aa' }}>Tidak ada skill baru</span>
                    ) : result?.newSkills.map((skill: string, i: number) => (
                      <span key={i} style={{
                        fontFamily: 'var(--font-pixel)', fontSize: '0.5rem', color: '#fff',
                        background: '#78350f', border: '2px solid #fbbf24',
                        padding: '4px 10px', boxShadow: '2px 2px 0 rgba(0,0,0,0.4)',
                      }}>
                        + {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills (Skill Gap) */}
                <div style={{ background: 'rgba(59,38,27,0.6)', border: '2px solid #991b1b', padding: '12px 16px' }}>
                  <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.55rem', color: '#f87171', margin: '0 0 8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Image src="/Red Potion.png" alt="" width={14} height={14} style={{ imageRendering: 'pixelated' }} />
                    Skill yang Masih Kurang
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {result?.missingSkills.length === 0 ? (
                       <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.5rem', color: '#a1a1aa' }}>Sudah lengkap!</span>
                    ) : result?.missingSkills.map((skill: string, i: number) => (
                      <span key={i} style={{
                        fontFamily: 'var(--font-pixel)', fontSize: '0.5rem', color: '#fff',
                        background: '#450a0a', border: '2px solid #991b1b',
                        padding: '4px 10px',
                      }}>
                        x {skill}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', borderTop: '1px dashed #5a3a29', paddingTop: '8px' }}>
                    <Image src="/learning-mission.png" alt="" width={16} height={16} style={{ imageRendering: 'pixelated', flexShrink: 0 }} />
                    <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.5rem', color: '#fff', margin: 0, lineHeight: 1.6 }}>
                      Kerjakan Learning Mission untuk melengkapi skill ini!
                    </p>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes scanLine {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
