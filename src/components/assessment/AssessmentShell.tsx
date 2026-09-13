'use client';

import styles from './AssessmentShell.module.css';

interface AssessmentShellProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  stepDescription?: string;
  /** Index of the first optional step (renders "Opsional" badge) */
  optionalFrom?: number;
  canNext: boolean;
  nextLabel?: string;
  onNext: () => void;
  onBack: () => void;
  showBack?: boolean;
  isSubmitting?: boolean;
  children: React.ReactNode;
}

const STEP_LABELS_SMA      = ['RIASEC', 'Budget', 'Preferensi'];
const STEP_LABELS_MAHASISWA = ['Upload CV', 'Minat Kerja'];

export default function AssessmentShell({
  currentStep,
  totalSteps,
  stepTitle,
  stepDescription,
  optionalFrom,
  canNext,
  nextLabel,
  onNext,
  onBack,
  showBack = true,
  isSubmitting = false,
  children,
}: AssessmentShellProps) {
  const stepLabels = totalSteps === 3 ? STEP_LABELS_SMA : STEP_LABELS_MAHASISWA;
  const isLast = currentStep === totalSteps - 1;
  const finalLabel = nextLabel ?? (isLast ? '🚀 Mulai Petualangan' : 'Lanjut →');

  return (
    <div className={styles.shell}>
      {/* ── Progress Bar ── */}
      <div className={styles.progressSection}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
        <div className={styles.stepDots}>
          {stepLabels.map((label, i) => {
            const isOptional = optionalFrom !== undefined && i >= optionalFrom;
            return (
              <div
                key={i}
                className={`${styles.stepDot} ${i <= currentStep ? styles.stepDotActive : ''} ${i === currentStep ? styles.stepDotCurrent : ''}`}
              >
                <span className={styles.dotCircle}>
                  {i < currentStep ? '✓' : i + 1}
                </span>
                <span className={styles.dotLabel}>
                  {label}
                  {isOptional && <span className={styles.optionalBadge}>Opsional</span>}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Step Header ── */}
      <div className={styles.stepHeader}>
        <h1 className={styles.stepTitle}>{stepTitle}</h1>
        {stepDescription && <p className={styles.stepDesc}>{stepDescription}</p>}
      </div>

      {/* ── Step Content ── */}
      <div className={styles.stepContent}>
        {children}
      </div>

      {/* ── Navigation Buttons ── */}
      <div className={styles.navBar}>
        {showBack && currentStep > 0 ? (
          <button
            className={styles.backBtn}
            onClick={onBack}
            disabled={isSubmitting}
            type="button"
          >
            ← Kembali
          </button>
        ) : (
          <div />
        )}

        <button
          className={`${styles.nextBtn} ${canNext ? styles.nextBtnActive : ''}`}
          onClick={onNext}
          disabled={!canNext || isSubmitting}
          type="button"
        >
          {isSubmitting ? (
            <><span className={styles.spinner} /> Memproses...</>
          ) : (
            finalLabel
          )}
        </button>
      </div>
    </div>
  );
}
