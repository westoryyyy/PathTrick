'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import styles from './page.module.css';
import CodePlayground from '@/components/ui/CodePlayground';
import MintSBTButton from '@/components/ui/MintSBTButton';
import { mockBackendData } from '@/data/mockBackendData';
import { Stage } from '@/types/backend';

type Phase = 'MATERIAL' | 'QUIZ' | 'PROJECT' | 'CLAIM';

export default function MissionFlowPage() {
  const { missionId } = useParams();
  const router = useRouter();

  // Find the exact stage from mock data
  const allStages = mockBackendData.houses.flatMap(h => h.stages);
  const currentStage = allStages.find(s => s.id === missionId) || {
    name: 'Materi: Senjata Pertama (HTML)',
    description: 'Selamat datang, Ksatria Kode! Sebelum terjun ke medan pertempuran, kamu harus mengenali struktur dasar dari dunia web.'
  } as Stage;
  const getInitialPhase = (id: string): Phase => {
    if (!id) return 'MATERIAL';
    if (id.includes('quiz')) return 'QUIZ';
    if (id.includes('lab') || id.includes('project')) return 'PROJECT';
    return 'MATERIAL';
  };

  const [phase, setPhase] = useState<Phase>(getInitialPhase(missionId as string));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [code, setCode] = useState(`<!-- Tulis Kodemu di Sini -->\n`);

  // Simple animation variants
  const variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  const handleBossSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/submit-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, missionId })
      });
      const data = await res.json();
      
      if (data.passed) {
        setPhase('CLAIM');
      } else {
        alert(`AI Feedback: ${data.message}`);
      }
    } catch (e) {
      alert('Gagal menghubungi AI backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPhase = () => {
    switch (phase) {
      case 'MATERIAL':
        return (
          <div className={styles.card}>
            <h2 className={styles.title}>{currentStage.name}</h2>
            <p className={styles.text}>{currentStage.description}</p>
            <div className={styles.dialogueBox}>
              HTML (HyperText Markup Language) adalah kerangka tulang dari sebuah website.
              <br/><br/>
              Beberapa "mantra" dasar yang wajib kamu hafal:
              <span className={styles.materialCode}>&lt;h1&gt;Judul Utama&lt;/h1&gt;</span>
              Digunakan untuk membuat judul terbesar di halamanmu.
              <span className={styles.materialCode}>&lt;p&gt;Ini adalah paragraf.&lt;/p&gt;</span>
              Digunakan untuk menuliskan teks panjang atau deskripsi.
              <span className={styles.materialCode}>&lt;button&gt;Klik Aku!&lt;/button&gt;</span>
              Menciptakan tombol yang bisa ditekan oleh user.
            </div>
            <button className={styles.btn} onClick={() => setPhase('QUIZ')}>
              SAYA PAHAM, MULAI UJIAN!
            </button>
          </div>
        );
      
      case 'QUIZ':
        return (
          <div className={styles.card}>
            <h2 className={styles.title}>{currentStage.name}</h2>
            <p className={styles.text}>{currentStage.description}</p>
            
            <div className={styles.dialogueBox}>
              Jika kamu ingin membuat sebuah teks paragraf menceritakan kisah petualanganmu, tag HTML apa yang paling tepat digunakan?
            </div>

            <div className={styles.quizOptions}>
              <button className={styles.optionBtn} onClick={() => alert('Salah! Itu untuk Judul.')}>
                A. &lt;h1&gt;Ceritaku&lt;/h1&gt;
              </button>
              <button className={styles.optionBtn} onClick={() => setPhase('PROJECT')}>
                B. &lt;p&gt;Ceritaku...&lt;/p&gt;
              </button>
              <button className={styles.optionBtn} onClick={() => alert('Salah! Itu untuk Tombol.')}>
                C. &lt;button&gt;Cerita&lt;/button&gt;
              </button>
            </div>
          </div>
        );

      case 'PROJECT':
        return (
          <div className={styles.card}>
            <h2 className={styles.title}>{currentStage.name}</h2>
            <p className={styles.text}>{currentStage.description}</p>
            
            <div className={styles.bossFightContainer}>
              <CodePlayground 
                language="html" 
                initialCode={code}
                onChange={(newCode) => setCode(newCode)}
              />
              <button 
                className={styles.btn} 
                onClick={handleBossSubmit}
                disabled={isSubmitting}
                style={{ alignSelf: 'flex-end', background: isSubmitting ? '#4b5563' : '#b91c1c', borderColor: '#7f1d1d' }}
              >
                {isSubmitting ? 'AI SEDANG MENILAI...' : '⚔️ SERANG BOSS (SUBMIT)'}
              </button>
            </div>
          </div>
        );

      case 'CLAIM':
        return (
          <div className={styles.cardSuccess}>
            <div className={styles.successIcon}>🎉</div>
            <h2 className={styles.titleSuccess}>BOSS DIKALAHKAN!</h2>
            <p className={styles.text}>AI telah menyetujui kodemu. Kamu berhak mendapatkan Soulbound Token (SBT) sebagai bukti kompetensi HTML-mu!</p>
            
            <MintSBTButton courseId={parseInt(missionId as string) || 1} />
            
            <button 
              style={{
                background: 'transparent', 
                border: 'none', 
                color: '#34d399', 
                fontFamily: '"Press Start 2P", monospace', 
                fontSize: '0.45rem', 
                marginTop: '16px', 
                cursor: 'pointer',
                textDecoration: 'underline'
              }} 
              onClick={() => router.push('/mahasiswa/learning')}
            >
              Lewati (Kembali ke Modules)
            </button>
          </div>
        );
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.push('/mahasiswa/learning')}>
          ← Peta Dunia
        </button>
        <span className={styles.missionId}>MISI: {missionId}</span>
      </div>

      <div className={styles.progressTracker}>
        <div className={`${styles.step} ${phase === 'MATERIAL' ? styles.activeStep : styles.doneStep}`}>1. TEORI</div>
        <div className={`${styles.step} ${phase === 'QUIZ' ? styles.activeStep : (phase === 'PROJECT' || phase === 'CLAIM' ? styles.doneStep : '')}`}>2. KUIS</div>
        <div className={`${styles.step} ${phase === 'PROJECT' ? styles.activeStep : (phase === 'CLAIM' ? styles.doneStep : '')}`}>3. BOSS</div>
        <div className={`${styles.step} ${phase === 'CLAIM' ? styles.activeStep : ''}`}>4. REWARD</div>
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
