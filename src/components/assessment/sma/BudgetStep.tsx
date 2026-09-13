'use client';

import { useOnboardingStore } from '@/store/useOnboardingStore';
import styles from './BudgetStep.module.css';

const BUDGET_OPTIONS = [
  { value: 'under5',    label: '< Rp 5 jt / semester',  icon: '🪙', desc: 'Terjangkau' },
  { value: '5to15',     label: 'Rp 5 – 15 jt',          icon: '💰', desc: 'Menengah' },
  { value: '15to30',    label: 'Rp 15 – 30 jt',         icon: '💎', desc: 'Premium' },
  { value: 'above30',   label: '> Rp 30 jt',             icon: '👑', desc: 'Eksklusif' },
  { value: 'beasiswa',  label: 'Beasiswa Penuh',         icon: '🎓', desc: 'Full Scholarship' },
];

export default function BudgetStep() {
  const budget = useOnboardingStore((s) => s.smaAssessment.budgetPreference);
  const setField = useOnboardingStore((s) => s.setSMAField);

  return (
    <div className={styles.wrapper}>
      <p className={styles.hint}>
        Pilih satu rentang biaya kuliah yang sesuai dengan rencana keluargamu.
      </p>
      <div className={styles.list}>
        {BUDGET_OPTIONS.map((opt) => {
          const isSelected = budget === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
              onClick={() => setField('budgetPreference', opt.value)}
              id={`budget-${opt.value}`}
            >
              <span className={styles.cardIcon}>{opt.icon}</span>
              <div className={styles.cardText}>
                <span className={styles.cardLabel}>{opt.label}</span>
                <span className={styles.cardDesc}>{opt.desc}</span>
              </div>
              {isSelected && <span className={styles.checkMark}>✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
