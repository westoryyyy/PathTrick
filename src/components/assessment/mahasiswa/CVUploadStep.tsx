'use client';

import { useCallback, useRef, useState } from 'react';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import styles from './CVUploadStep.module.css';

import { classifySkills } from '@/data/wefSkillData';

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_SIZE_MB = 10;

/** Mock AI extraction — replaced by real backend/AI Engineer API later */
async function mockExtractCV() {
  await new Promise((r) => setTimeout(r, 1200));
  await new Promise((r) => setTimeout(r, 2200));

  return {
    skills: classifySkills([
      'JavaScript', 'React', 'Node.js', 'Python',
      'SQL', 'Git', 'REST API', 'Figma',
      'Critical Thinking', 'Teamwork', 'Adaptability',
    ]),
    experience: [
      'Frontend Developer Intern — PT Tech Indonesia (6 bulan)',
      'Freelance Web Developer — 10+ proyek',
      'Asisten Lab Pemrograman — Universitas XYZ',
    ],
    education: 'S1 Teknik Informatika — Universitas XYZ (2021–2025)',
  };
}

export default function CVUploadStep() {
  const store = useOnboardingStore();
  const {
    mahasiswaAssessment: mState,
    setMahasiswaField,
    setCVExtractedData,
  } = store;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  /* ── File Validation ── */
  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) return 'Format tidak didukung. Gunakan PDF, DOC, atau DOCX.';
    if (file.size > MAX_SIZE_MB * 1024 * 1024) return `Ukuran file melebihi ${MAX_SIZE_MB}MB.`;
    return null;
  };

  /* ── Handle CV Upload ── */
  const handleCVFile = useCallback(async (file: File) => {
    const error = validateFile(file);
    if (error) {
      alert(error);
      return;
    }

    setMahasiswaField('cvFile', file);
    setMahasiswaField('cvFileName', file.name);
    setMahasiswaField('cvExtractionStatus', 'uploading');

    try {
      // Phase 1: Upload
      await new Promise((r) => setTimeout(r, 800));
      setMahasiswaField('cvExtractionStatus', 'extracting');

      // Phase 2: AI Extraction
      const data = await mockExtractCV();
      setCVExtractedData(data);
    } catch {
      setMahasiswaField('cvExtractionStatus', 'error');
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
  const handlePortfolioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMahasiswaField('portfolioFile', file);
      setMahasiswaField('portfolioFileName', file.name);
    }
  };

  /* ── Reset CV ── */
  const handleRetry = () => {
    setMahasiswaField('cvFile', null);
    setMahasiswaField('cvFileName', '');
    setMahasiswaField('cvExtractionStatus', 'idle');
    setCVExtractedData(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const status = mState.cvExtractionStatus;

  return (
    <div className={styles.wrapper}>
      {/* ══════════ CV UPLOAD ZONE ══════════ */}
      <div
        className={`${styles.dropZone} ${isDragOver ? styles.dropZoneDragOver : ''} ${status === 'done' ? styles.dropZoneDone : ''} ${status === 'error' ? styles.dropZoneError : ''}`}
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
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className={styles.hiddenInput}
          aria-label="Upload CV"
        />

        {/* ── IDLE STATE ── */}
        {status === 'idle' && (
          <div className={styles.idleContent}>
            <span className={styles.uploadIcon}>📜</span>
            <p className={styles.uploadTitle}>Drag & Drop CV-mu di sini</p>
            <p className={styles.uploadHint}>atau klik untuk browse file</p>
            <p className={styles.uploadFormats}>PDF, DOC, DOCX • Maks {MAX_SIZE_MB}MB</p>
          </div>
        )}

        {/* ── UPLOADING STATE ── */}
        {status === 'uploading' && (
          <div className={styles.processingContent}>
            <div className={styles.uploadingIcon}>
              <span className={styles.uploadingSpinner} />
            </div>
            <p className={styles.processingTitle}>Mengunggah...</p>
            <p className={styles.processingFile}>{mState.cvFileName}</p>
            <div className={styles.progressBarWrap}>
              <div className={styles.progressBarFill} style={{ width: '60%' }} />
            </div>
          </div>
        )}

        {/* ── EXTRACTING STATE ── */}
        {status === 'extracting' && (
          <div className={styles.processingContent}>
            <div className={styles.scannerWrap}>
              <span className={styles.scannerIcon}>🤖</span>
              <div className={styles.scanLine} />
            </div>
            <p className={styles.processingTitle}>AI SEDANG MENGANALISIS SCROLL-MU...</p>
            <p className={styles.processingFile}>{mState.cvFileName}</p>
            <div className={styles.extractingDots}>
              <span className={styles.extractDot} />
              <span className={styles.extractDot} />
              <span className={styles.extractDot} />
            </div>
          </div>
        )}

        {/* ── DONE STATE ── */}
        {status === 'done' && mState.cvExtractedData && (
          <div className={styles.doneContent}>
            <div className={styles.doneHeader}>
              <span className={styles.doneIcon}>✅</span>
              <div>
                <p className={styles.doneTitle}>CV Berhasil Dianalisis!</p>
                <p className={styles.doneFile}>{mState.cvFileName}</p>
              </div>
              <button
                type="button"
                className={styles.retryBtn}
                onClick={(e) => { e.stopPropagation(); handleRetry(); }}
              >
                🔄 Ganti
              </button>
            </div>

            {/* Extracted Skills */}
            <div className={styles.extractedSection}>
              <p className={styles.extractedLabel}>🎯 Skills Terdeteksi (Hasil AI Ekstraksi CV & Portfolio)</p>
              <div className={styles.skillTags}>
                {(mState.cvExtractedData?.skills ?? []).map((skill, i) => (
                  <span key={i} className={styles.skillTag} style={{ animationDelay: `${i * 0.08}s` }}>
                    {skill.name} <span className={styles.skillLevel}>Lv.{skill.level}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Extracted Experience */}
            <div className={styles.extractedSection}>
              <p className={styles.extractedLabel}>💼 Pengalaman</p>
              <ul className={styles.expList}>
                {mState.cvExtractedData.experience.map((exp, i) => (
                  <li key={i} style={{ animationDelay: `${0.5 + i * 0.1}s` }}>{exp}</li>
                ))}
              </ul>
            </div>

            {/* Extracted Education */}
            <div className={styles.extractedSection}>
              <p className={styles.extractedLabel}>🎓 Pendidikan</p>
              <p className={styles.eduText}>{mState.cvExtractedData.education}</p>
            </div>
          </div>
        )}

        {/* ── ERROR STATE ── */}
        {status === 'error' && (
          <div className={styles.errorContent}>
            <span className={styles.errorIcon}>❌</span>
            <p className={styles.errorTitle}>Gagal menganalisis CV</p>
            <p className={styles.errorHint}>Terjadi kesalahan. Silakan coba lagi.</p>
            <button
              type="button"
              className={styles.retryBtnLarge}
              onClick={(e) => { e.stopPropagation(); handleRetry(); }}
            >
              🔄 Coba Lagi
            </button>
          </div>
        )}
      </div>

      {/* ══════════ PORTFOLIO UPLOAD (OPTIONAL) ══════════ */}
      <div className={styles.portfolioSection}>
        <div className={styles.portfolioHeader}>
          <span className={styles.portfolioLabel}>📎 Portfolio</span>
          <span className={styles.optBadge}>Opsional</span>
        </div>
        <div
          className={styles.portfolioZone}
          onClick={() => portfolioInputRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          <input
            ref={portfolioInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.zip"
            onChange={handlePortfolioChange}
            className={styles.hiddenInput}
            aria-label="Upload Portfolio"
          />
          {mState.portfolioFileName ? (
            <p className={styles.portfolioFile}>📄 {mState.portfolioFileName}</p>
          ) : (
            <p className={styles.portfolioHint}>Klik untuk upload portfolio (PDF, ZIP)</p>
          )}
        </div>
      </div>
    </div>
  );
}
