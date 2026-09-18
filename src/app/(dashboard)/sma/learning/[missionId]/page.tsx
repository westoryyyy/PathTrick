'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import styles from './page.module.css';
import CodePlayground from '@/components/ui/CodePlayground';
import MintSBTButton from '@/components/ui/MintSBTButton';
import { mockBackendData } from '@/data/mockBackendData';
import { Stage } from '@/types/backend';
import { useMapStore } from '@/store/useMapStore';
import { MISSION_CONTENT } from '@/data/missionContent';
import { getQuizForMission } from '@/data/quizBank';

type Phase = 'MATERIAL' | 'QUIZ' | 'PROJECT' | 'CLAIM';

export default function MissionFlowPage() {
  const { missionId } = useParams();
  const router = useRouter();
  const { completeDynamicNode } = useMapStore();

  // Find the exact chapter from mock data by extracting base chapter ID
  const baseChapterId = (missionId as string)?.replace(/-level-\d+$/, '');
  const allChapters = mockBackendData.houses.flatMap(h => h.stages).flatMap(s => s.chapters || []);
  const currentChapter = allChapters.find(c => c.id === baseChapterId) || {
    name: 'Materi Pembelajaran',
    description: 'Selamat datang! Persiapkan dirimu untuk menerima ilmu baru.',
    duration: '6 Levels'
  };
  
  // Determine level type based on dynamic ID
  let baseLevelType: Phase = 'MATERIAL';
  const match = (missionId as string)?.match(/^(.*?)-level-(\d+)$/);
  
  let isBossLevel = false;
  if (match) {
    const levelNum = parseInt(match[2]);
    const numLevelsMatch = currentChapter.duration ? currentChapter.duration.match(/\d+/) : null;
    const totalLevels = numLevelsMatch ? parseInt(numLevelsMatch[0]) : 6;
    
    // Always start at MATERIAL for story/intro, even for Boss!
    baseLevelType = 'MATERIAL';
    
    if (levelNum === totalLevels) {
      isBossLevel = true;
    }
  } else {
    // Fallback for legacy IDs
    if ((missionId as string)?.includes('quiz')) baseLevelType = 'QUIZ';
    else if ((missionId as string)?.match(/(lab|project|boss)/)) {
      baseLevelType = 'PROJECT';
      isBossLevel = true;
    }
  }

  const [phase, setPhase] = useState<Phase>(baseLevelType);
  const [materialPage, setMaterialPage] = useState(0);
  const [code, setCode] = useState(() => {
    const m = (missionId as string) || '';
    const isTech = m.includes('python') || m.includes('data') || m.includes('javascript') || m.includes('js') || m.includes('html') || m.includes('css') || m.includes('tech');
    if (!isTech) return '';
    if (m.includes('python') || m.includes('data')) return '# Tulis kodemu di sini\n';
    if (m.includes('javascript') || m.includes('js')) return '// Tulis kodemu di sini\n';
    return '<!-- Tulis Kodemu di Sini -->\n';
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [playerHp, setPlayerHp] = useState(3);
  const [quizIndex, setQuizIndex] = useState(0);
  const [dialogState, setDialogState] = useState<{ isOpen: boolean; type: 'success' | 'error'; message: string; onConfirm?: () => void }>({ isOpen: false, type: 'success', message: '' });

  const showDialog = (type: 'success' | 'error', message: string, onConfirm?: () => void) => {
    setDialogState({ isOpen: true, type, message, onConfirm });
  };

  const closeDialog = () => {
    const { onConfirm } = dialogState;
    setDialogState(prev => ({ ...prev, isOpen: false }));
    if (onConfirm) onConfirm();
  };

  const handleLevelComplete = () => {
    completeDynamicNode(missionId as string);
    if (isBossLevel) {
      // If Boss is beaten, we go to SBT Claim / Certificate!
      router.push('/sma/certificate'); 
    } else {
      setPhase('CLAIM');
    }
  };

  // Simple animation variants
  const variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  // Get dynamic content or generate a fallback template
  let content = MISSION_CONTENT[missionId as string];
  if (!content) {
    const levelNumStr = (missionId as string)?.match(/-level-(\d+)$/)?.[1] || '1';
    const levelNum = parseInt(levelNumStr);
    const isBoss = levelNum === 6;

    const isPython = (missionId as string).includes('python') || (missionId as string).includes('data');
    const isJs = (missionId as string).includes('javascript') || (missionId as string).includes('js');
    const isHtml = (missionId as string).includes('html') || (missionId as string).includes('css');
    
    // Check if module is coding-related
    const isTech = isPython || isJs || isHtml || (missionId as string).includes('tech');
    
    const lang = isPython ? 'python' : isJs ? 'javascript' : 'html';
    const printCmd = isPython ? 'print("Hello Ksatria")' : isJs ? 'console.log("Hello Ksatria")' : '<h1>Hello Ksatria</h1>';

    // Get topic-specific quizzes from bank, fallback to generic if not available
    const bankQuizCount = isBoss ? 5 : 3;
    const bankQuizzes = getQuizForMission(missionId as string, bankQuizCount);
    const hasRealQuizzes = bankQuizzes.length > 0;

    // Generic fallback questions if bank is empty for this module
    const genericQuizzes = Array.from({ length: bankQuizCount }).map((_, i) => ({
      question: `Pertanyaan ${i + 1}: Manakah pernyataan yang PALING BENAR mengenai ${currentChapter.name}?`,
      options: [
        { text: `Memahami konsep fundamental adalah kunci utama penguasaan ${currentChapter.name}`, isCorrect: true, feedback: `Tepat! Fondasi yang kuat adalah kunci seorang Ksatria menguasai materi ini.` },
        { text: `Menghafal semua rumus tanpa memahami artinya`, isCorrect: false, feedback: `Menghafal tanpa pemahaman tidak efektif. Kembali ke materi!` },
        { text: `Melewati latihan praktik karena tidak penting`, isCorrect: false, feedback: `Latihan adalah bagian krusial dari pembelajaran. Jangan dilewati!` },
        { text: `Tidak perlu belajar materi ini secara mendalam`, isCorrect: false, feedback: `Penguasaan mendalam sangat diperlukan untuk menjadi ahli sejati.` }
      ]
    }));

    const finalQuizzes = hasRealQuizzes ? bankQuizzes : genericQuizzes;

    // Build topic-specific material description
    const materialIntro = isBoss
      ? `🏰 Ksatria! Penjaga Relic bab ini telah menantimu. Sebelum pertempuran final dimulai, pastikan kamu telah memahami semua konsep ${currentChapter.name} yang telah dipelajari di level-level sebelumnya.`
      : `Selamat datang Ksatria! Di Level ${levelNum} bab **${currentChapter.name}**, kamu akan memperdalam pemahamanmu. Baca materi berikut dengan seksama sebelum menghadapi Gauntlet Kuis!`;

    content = {
      materials: [
        <div key="1" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <span style={{ color: isBoss ? '#ef4444' : '#059669', fontSize: '1.2rem', flexShrink: 0 }}>{isBoss ? '⚔️' : '📖'}</span>
            <div>
              <strong style={{ fontFamily: '"Press Start 2P"', fontSize: '0.75rem', color: isBoss ? '#fbbf24' : '#1a2a3a', display: 'block', marginBottom: '8px', lineHeight: '1.6' }}>
                {currentChapter.name} — Level {levelNum} {isBoss ? '(BOSS FIGHT)' : ''}
              </strong>
              <p style={{ fontSize: '0.85rem', color: '#57534e', lineHeight: '1.8' }}>
                Pahami materi dasar ini dengan saksama untuk mempersiapkan diri menghadapi tantangan.
              </p>
            </div>
          </div>

          <div style={{ background: isBoss ? '#fef2f2' : '#f0fdf4', padding: '20px', borderRadius: '8px', borderLeft: `4px solid ${isBoss ? '#ef4444' : '#22c55e'}`, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h4 style={{ fontFamily: '"Press Start 2P"', fontSize: '0.65rem', color: isBoss ? '#ef4444' : '#059669', marginBottom: '12px' }}>
              {isBoss ? '⚠️ BRIEFING TERAKHIR' : '📜 TEORI DASAR'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '0.85rem', color: '#374151', lineHeight: '1.8' }}>
                {materialIntro}
              </p>
              {!isBoss && (
                <>
                  <p style={{ fontSize: '0.85rem', color: '#374151', lineHeight: '1.8' }}>
                    Secara fundamental, <strong>{currentChapter.name}</strong> melibatkan pemahaman mendalam terhadap prinsip-prinsip utama di bidang ini. Sebuah kesalahan umum bagi pemula adalah mengabaikan teori dasar dan langsung melompat ke praktik tingkat lanjut.
                  </p>
                  <p style={{ fontSize: '0.85rem', color: '#374151', lineHeight: '1.8' }}>
                    Di Level {levelNum} ini, kita fokus pada komponen inti: bagaimana elemen-elemen individual berinteraksi membentuk sistem yang utuh. Setiap konsep yang kamu pelajari di sini akan terus digunakan di modul-modul berikutnya. Pastikan kamu benar-benar menguasai logika di baliknya.
                  </p>
                </>
              )}
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '12px' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#475569', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>📋 Yang Akan Kamu Kuasai:</p>
            <ul style={{ fontSize: '0.85rem', color: '#374151', lineHeight: '1.9', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Mengidentifikasi konsep dasar dan terminologi penting dari <strong>{currentChapter.name}</strong></li>
              <li>Menganalisis studi kasus dan memecahkan masalah dasar pada Level {levelNum}</li>
              {isBoss ? <li><strong style={{color:'#ef4444'}}>⚠️ Ujian final: Buktikan bahwa kamu telah menguasai seluruh materi bab ini!</strong></li> : <li>Menjawab simulasi skenario dunia nyata dalam Gauntlet Kuis.</li>}
            </ul>
          </div>

          {!hasRealQuizzes && (
            <div style={{ background: '#fffbeb', padding: '12px 16px', borderRadius: '8px', border: '1px solid #fde68a', fontSize: '0.75rem', color: '#92400e' }}>
              💡 <strong>Tips Ksatria:</strong> Untuk bab {currentChapter.name}, pastikan kamu memahami konsep fundamental sebelum lanjut ke kuis!
            </div>
          )}
        </div>
      ],
      quiz: finalQuizzes,
      project: {
        type: isTech ? 'code' : 'essay',
        instruction: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ color: '#fbbf24', fontSize: '1rem', marginBottom: '8px', fontFamily: '"Press Start 2P"', lineHeight: '1.4' }}>
              {isBoss ? `⚔️ BOSS FIGHT: Penjaga ${currentChapter.name}` : `🛠 Tantangan Praktik — ${currentChapter.name} Lvl.${levelNum}`}
            </h3>
            <p style={{ color: '#d4d4d8', fontSize: '0.85rem', lineHeight: '1.7' }}>
              {isTech 
                ? (isBoss 
                  ? `Ksatria, ini adalah momen penentu! Tuliskan kode yang mencerminkan penguasaanmu atas ${currentChapter.name}. Pastikan kodenya valid dan berjalan dengan benar.` 
                  : `Saatnya mempraktikkan apa yang baru kamu pelajari! Terapkan konsep dari ${currentChapter.name} Level ${levelNum} dalam bentuk kode.`)
                : (isBoss 
                  ? `Penjaga Relic bab ini menantangmu! Tuliskan laporan analisa atau essay mendalam untuk membuktikan kelayakanmu sebagai Ksatria sejati.` 
                  : `Praktikkan pemahamanmu tentang ${currentChapter.name} dengan menuliskan analisa atau studi kasus singkat di bawah ini.`)
              }
            </p>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', border: '1px dashed #5a3a29', borderRadius: '4px' }}>
              <p style={{ color: '#fbbf24', fontSize: '0.7rem', marginBottom: '10px', fontFamily: '"Press Start 2P"' }}>SYARAT KELULUSAN:</p>
              <ul style={{ color: '#a3a3a3', fontSize: '0.85rem', lineHeight: '1.8', marginLeft: '20px', listStyleType: 'disc' }}>
                {isTech ? (
                  <>
                    <li>Tulis kode program menggunakan <strong style={{color:'#34d399'}}>{lang.toUpperCase()}</strong>.</li>
                    <li>Gunakan perintah output yang valid. Contoh: <code style={{color:'#34d399', background:'#000', padding:'2px 6px', borderRadius:'3px'}}>{printCmd}</code></li>
                    <li>Kode tidak boleh kosong (minimal 10 karakter).</li>
                  </>
                ) : (
                  <>
                    <li>Tuliskan analisa, laporan, atau studi kasusmu di kotak jawaban.</li>
                    <li>Gunakan terminologi/kata kunci yang relevan dengan materi ini.</li>
                    <li>Jawaban harus substansial (minimal 10 karakter).</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        ),
        defaultCode: isTech 
          ? (isPython ? `# Latihan: ${currentChapter.name}\n# Level ${levelNum}\n\n` : isJs ? `// Latihan: ${currentChapter.name}\n// Level ${levelNum}\n\n` : `<!-- Latihan: ${currentChapter.name} -->\n<!-- Level ${levelNum} -->\n\n`)
          : "",
        language: lang as 'html' | 'javascript' | 'python'
      }
    };
  }
  const materials = content.materials;

  const handleBossSubmit = async () => {
    setIsSubmitting(true);
    // Simulate AI grading delay
    try {
      const response = await fetch('/api/submit-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, missionId })
      });
      const data = await response.json();
      
      if (data.passed) {
        showDialog('success', data.message, () => handleLevelComplete());
      } else {
        const newHp = playerHp - 1;
        setPlayerHp(newHp);
        if (newHp > 0) {
          showDialog('error', `${data.message}\n\nSisa nyawamu: ${'♥'.repeat(newHp)}`);
        } else {
          showDialog('error', `GAME OVER!\n\n${data.message}\n\nNyawamu habis. Kamu harus mengulang dari awal materi!`, () => {
            setPlayerHp(3);
            setPhase('MATERIAL');
            setMaterialPage(0);
          });
        }
      }
    } catch (e) {
      showDialog('error', 'Gagal menghubungi AI backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPhase = () => {
    switch (phase) {
      case 'MATERIAL':
        return (
          <>
            <div className={styles.cardHeader}>
              <h2 className={styles.title}>{currentChapter.name}</h2>
              <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.4rem', color: '#8c5d41', background: '#fae1c5', padding: '8px', border: '2px solid #8c5d41', whiteSpace: 'nowrap', marginLeft: '16px' }}>
                Halaman {materialPage + 1}/{materials.length}
              </span>
            </div>
            <p className={styles.text}>{currentChapter.description || 'Pahami teori berikut sebelum lanjut ke tantangan selanjutnya!'}</p>
            
            <div className={styles.dialogueBox}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={materialPage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {materials[materialPage]}
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: 'auto' }}>
              {materialPage > 0 && (
                <button className={styles.secondaryBtn} onClick={() => setMaterialPage(p => p - 1)}>
                  ← SEBELUMNYA
                </button>
              )}
              {materialPage < materials.length - 1 ? (
                <button className={styles.btn} onClick={() => setMaterialPage(p => p + 1)}>
                  LANJUT (NEXT) ➔
                </button>
              ) : (
                <button 
                  className={styles.btn} 
                  onClick={() => {
                    if (content.quiz) setPhase('QUIZ');
                    else if (content.project) setPhase('PROJECT');
                    else handleLevelComplete();
                  }}
                >
                  {content.quiz ? 'SAYA PAHAM, MULAI UJIAN!' : (content.project ? 'SAYA PAHAM, MULAI TANTANGAN!' : 'SAYA PAHAM! (SELESAI)')}
                </button>
              )}
            </div>
          </>
        );
      
      case 'QUIZ':
        return (
          <>
            <div className={styles.cardHeader}>
              <h2 className={styles.title}>{currentChapter.name}</h2>
            </div>
            <p className={styles.text}>{currentChapter.description || 'Selesaikan tantangan berikut!'}</p>
            
            {content.quiz ? (() => {
              const quizArray = Array.isArray(content.quiz) ? content.quiz : [content.quiz];
              const currentQuiz = quizArray[quizIndex];
              return (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.65rem', fontFamily: '"Press Start 2P"' }}>NYAWA KSATRIA:</span>
                  <span style={{ color: '#ef4444', fontSize: '0.8rem', fontFamily: '"Press Start 2P"' }}>{'♥'.repeat(playerHp)}</span>
                </div>
                {quizArray.length > 1 && (
                  <div style={{ marginBottom: '16px', fontSize: '0.7rem', color: '#57534e', textAlign: 'center', fontFamily: '"Press Start 2P"' }}>
                    SOAL {quizIndex + 1} DARI {quizArray.length}
                  </div>
                )}
                <div className={styles.dialogueBox}>
                  {currentQuiz.question}
                </div>

                <div className={styles.quizOptions}>
                  {currentQuiz.options.map((opt: any, i: number) => (
                    <button 
                      key={i} 
                      className={styles.optionBtn} 
                      onClick={() => {
                        if (opt.isCorrect) {
                          showDialog('success', opt.feedback, () => {
                            if (quizIndex < quizArray.length - 1) {
                              setQuizIndex(quizIndex + 1);
                            } else {
                              if (content.project) setPhase('PROJECT');
                              else handleLevelComplete();
                            }
                          });
                        } else {
                          const newHp = playerHp - 1;
                          setPlayerHp(newHp);
                          if (newHp > 0) {
                            showDialog('error', `${opt.feedback}\n\nSisa nyawamu: ${'♥'.repeat(newHp)}`);
                          } else {
                            showDialog('error', `GAME OVER!\n\n${opt.feedback}\n\nNyawamu habis. Kamu harus mengulang dari awal materi!`, () => {
                              setPlayerHp(3);
                              setQuizIndex(0);
                              setPhase('MATERIAL');
                              setMaterialPage(0);
                            });
                          }
                        }
                      }}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </>
              );
            })() : (
              <div className={styles.bossFightContainer} style={{ textAlign: 'center' }}>
                <div className={styles.dialogueBox} style={{ marginBottom: '16px' }}>Kuis belum tersedia untuk level ini.</div>
                <button className={styles.btn} onClick={() => setPhase('PROJECT')}>LANJUT KE TANTANGAN ➔</button>
              </div>
            )}
          </>
        );

      case 'PROJECT':
        return (
          <>
            <div className={styles.cardHeader}>
              <h2 className={styles.title}>{currentChapter.name}</h2>
            </div>
            <p className={styles.text}>{currentChapter.description || 'Buktikan kemampuanmu!'}</p>
            
            {content.project ? (
              <div className={styles.bossFightContainer}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.65rem', fontFamily: '"Press Start 2P"' }}>NYAWA KSATRIA:</span>
                  <span style={{ color: '#ef4444', fontSize: '0.8rem', fontFamily: '"Press Start 2P"' }}>{'♥'.repeat(playerHp)}</span>
                </div>
                <p className={styles.text} style={{ marginBottom: '16px' }}>
                  {content.project.instruction}
                </p>
                
                {content.project.type === 'essay' ? (
                  <textarea 
                    className={styles.textarea} 
                    style={{ width: '100%', minHeight: '200px', padding: '16px', background: '#1c1917', color: '#d4d4d8', border: '2px solid #5a3a29', fontFamily: 'monospace', fontSize: '1rem' }}
                    placeholder="Ketikkan analisamu di sini..."
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                ) : (
                  <CodePlayground 
                    language={content.project.language}
                    initialCode={content.project.defaultCode}
                    onChange={(val) => setCode(val || '')}
                  />
                )}
                
                <button 
                  className={styles.btn} 
                  onClick={handleBossSubmit}
                  disabled={isSubmitting}
                  style={{ alignSelf: 'flex-end', marginTop: '16px' }}
                >
                  {isSubmitting ? 'AI SEDANG MENILAI...' : (content.project.type === 'essay' ? 'KUMPULKAN ESAI' : '⚔️ SERANG BOSS (SUBMIT)')}
                </button>
              </div>
            ) : (
              <div className={styles.bossFightContainer} style={{ textAlign: 'center' }}>
                <div className={styles.dialogueBox} style={{ marginBottom: '16px' }}>Tantangan praktik belum tersedia.</div>
                <button className={styles.btn} onClick={handleLevelComplete}>SAYA PAHAM! (SELESAI)</button>
              </div>
            )}
          </>
        );

      case 'CLAIM':
        return (
          <>
            <div className={styles.cardSuccess}>
              <div className={styles.successIcon}>📦</div>
              <h2 className={styles.titleSuccess}>MISI SELESAI!</h2>
              <p className={styles.text} style={{ color: '#3b261b', marginBottom: '8px' }}>
                Selamat! Kamu mendapatkan <strong style={{color:'#b45309'}}>+50 EXP</strong> dan <strong style={{color:'#ca8a04'}}>+20 Gold</strong>.
              </p>
              <p className={styles.text} style={{ color: '#3b261b', marginBottom: 0, fontSize: '0.6rem' }}>
                *Selesaikan semua misi di modul ini untuk mendapatkan Certificate (SBT)!
              </p>
              
              <button 
                className={styles.secondaryBtn}
                style={{ marginTop: '24px' }}
                onClick={() => router.push(`/map?chapter=${baseChapterId}`)}
              >
                KEMBALI KE PETA
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* ── TOP BAR ── */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => router.push(`/map?chapter=${baseChapterId}`)}>
          ← KEMBALI KE PETA
        </button>
        <div className={styles.missionId}>MISI: {missionId}</div>
      </div>

      {/* ── QUEST BOOK ── */}
      <div className={styles.questBook}>
        {/* TABS */}
        <div className={styles.tabsContainer}>
          <div className={`${styles.tab} ${phase === 'MATERIAL' ? styles.activeTab : styles.doneTab}`}>
            📚 TEORI
          </div>
          <div className={`${styles.tab} ${phase === 'QUIZ' ? styles.activeTab : (phase === 'PROJECT' || phase === 'CLAIM' ? styles.doneTab : '')}`}>
            ❓ KUIS
          </div>
          <div className={`${styles.tab} ${phase === 'PROJECT' ? styles.activeTab : (phase === 'CLAIM' ? styles.doneTab : '')}`}>
            ⚔️ BOSS
          </div>
          <div className={`${styles.tab} ${phase === 'CLAIM' ? styles.activeTab : ''}`}>
            🏆 REWARD
          </div>
        </div>

        {/* BOOK CONTENT (PARCHMENT) */}
        <div className={styles.bookContent}>
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1 }}
            >
              {renderPhase()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── CUSTOM DIALOG OVERLAY ── */}
      <AnimatePresence>
        {dialogState.isOpen && (
          <motion.div 
            className={styles.dialogOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDialog}
          >
            <motion.div 
              className={styles.dialogModal}
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className={styles.dialogTitle} style={{ color: dialogState.type === 'success' ? '#059669' : '#ef4444' }}>
                {dialogState.type === 'success' ? 'BERHASIL!' : 'UPS! SALAH'}
              </h2>
              <p className={styles.dialogMessage}>{dialogState.message}</p>
              <button className={styles.btn} onClick={closeDialog}>
                {dialogState.type === 'success' && dialogState.onConfirm ? 'LANJUT ➔' : 'TUTUP'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
