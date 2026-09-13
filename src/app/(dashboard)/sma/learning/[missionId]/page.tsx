'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import styles from './page.module.css';

type Phase = 'MATERIAL' | 'QUIZ' | 'PROJECT' | 'CLAIM';

export default function MissionFlowPage() {
  const { missionId } = useParams();
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('MATERIAL');

  // Simple animation variants
  const variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  const renderPhase = () => {
    switch (phase) {
      case 'MATERIAL':
        return (
          <div className={styles.card}>
            <h2 className={styles.title}>Materi Pembelajaran</h2>
            <p className={styles.text}>
              Read through this material to understand the basics. Once you&apos;re ready, take the quiz!
            </p>
            <div className={styles.fakeContent}>
              [Scrollable Material Content Here]
            </div>
            <button className={styles.btn} onClick={() => setPhase('QUIZ')}>
              MULAI QUIZ
            </button>
          </div>
        );
      
      case 'QUIZ':
        return (
          <div className={styles.card}>
            <h2 className={styles.title}>Quiz Time!</h2>
            <p className={styles.text}>Answer the following question to unlock the mini project.</p>
            
            <div className={styles.quizOptions}>
              <button className={styles.optionBtn} onClick={() => alert('Salah!')}>A. Incorrect Option</button>
              <button className={styles.optionBtn} onClick={() => setPhase('PROJECT')}>B. Correct Option (Click Me)</button>
              <button className={styles.optionBtn} onClick={() => alert('Salah!')}>C. Incorrect Option</button>
            </div>
          </div>
        );

      case 'PROJECT':
        return (
          <div className={styles.card}>
            <h2 className={styles.title}>Mini Project</h2>
            <p className={styles.text}>Submit your mini project here to complete the mission.</p>
            <textarea 
              className={styles.textarea} 
              placeholder="Paste your GitHub link or write your submission here..." 
            />
            <button className={styles.btn} onClick={() => setPhase('CLAIM')}>
              SUBMIT PROJECT
            </button>
          </div>
        );

      case 'CLAIM':
        return (
          <div className={styles.cardSuccess}>
            <div className={styles.successIcon}>🎉</div>
            <h2 className={styles.titleSuccess}>MISSION COMPLETE!</h2>
            <p className={styles.text}>You have unlocked a new Skill Badge (SBT).</p>
            <button className={styles.btnSuccess} onClick={() => router.push('/sma/certificate')}>
              MINT BADGE TO WALLET
            </button>
          </div>
        );
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.push('/sma/learning')}>
          ← Back
        </button>
        <span className={styles.missionId}>Mission: {missionId}</span>
      </div>

      {/* Progress Bar (Visual only for now) */}
      <div className={styles.progressTracker}>
        <div className={`${styles.step} ${phase === 'MATERIAL' ? styles.activeStep : styles.doneStep}`}>1. Materi</div>
        <div className={`${styles.step} ${phase === 'QUIZ' ? styles.activeStep : (phase === 'PROJECT' || phase === 'CLAIM' ? styles.doneStep : '')}`}>2. Quiz</div>
        <div className={`${styles.step} ${phase === 'PROJECT' ? styles.activeStep : (phase === 'CLAIM' ? styles.doneStep : '')}`}>3. Project</div>
        <div className={`${styles.step} ${phase === 'CLAIM' ? styles.activeStep : ''}`}>4. Claim</div>
      </div>

      <div className={styles.contentArea}>
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {renderPhase()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
