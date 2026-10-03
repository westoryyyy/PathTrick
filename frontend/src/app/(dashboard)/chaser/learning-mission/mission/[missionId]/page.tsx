'use client';

import { useState, useEffect, useRef } from 'react';
import { audioController } from '@/utils/audio';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import styles from './page.module.css';
import { useMapStore } from '@/store/useMapStore';
import { useUserStore } from '@/store/useUserStore';
import { MISSION_CONTENT } from '@/data/missionContent';
import { getQuizForMission } from '@/data/quizBank';
import MintSBTButton from '@/components/ui/MintSBTButton';
import CertificatePreview from '@/components/ui/CertificatePreview';
import { usePrivy, useWallets } from '@privy-io/react-auth';


const generateCourseId = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

type Phase = 'MATERIAL' | 'QUIZ' | 'PROJECT' | 'CLAIM';

export default function MissionFlowPage() {
  useEffect(() => {
    audioController.preload('/mission completed.ogg');
    audioController.preload('/Poin.ogg');
    audioController.preload('/NyawaBerkurang.ogg');
    audioController.preload('/LoveAbis.ogg');
  }, []);
  const { missionId } = useParams();
  const searchParams = useSearchParams();
  const isNotRecommended = searchParams.get('isNotRecommended') === 'true';
  const penaltyFactor = isNotRecommended ? 0.5 : 1;
  const router = useRouter();
  const { completeDynamicNode } = useMapStore();
  const { addXP, triggerLevelUp, completeQuiz, displayName: savedName } = useUserStore();
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const activeWallet = wallets[0];
  const displayName = savedName
    || user?.google?.name
    || user?.email?.address?.split('@')[0]
    || (activeWallet ? `${activeWallet.address.slice(0, 6)}...${activeWallet.address.slice(-4)}` : 'Chaser');
  const walletShort = activeWallet
    ? `${activeWallet.address.slice(0, 8)}...${activeWallet.address.slice(-6)}`
    : 'Not Connected';

  // Fetch the chapter from DB based on baseChapterId
  const baseChapterId = searchParams.get('chapter') || (missionId as string)?.replace(/-level-\d+$/, '');
  const [currentChapter, setCurrentChapter] = useState<{name: string, description?: string, duration?: string}>({
    name: 'Materi Pembelajaran',
    description: 'Selamat datang! Persiapkan dirimu untuk menerima ilmu baru.',
    duration: '6 Levels'
  });

  useEffect(() => {
    async function loadChapter() {
      if (baseChapterId) {
        import('@/hooks/useAuthSync').then(({ getAuthHeaders }) => {
          import('@/config/pathtrick').then(({ API_BASE_URL }) => {
            fetch(`${API_BASE_URL}/api/chapters/${baseChapterId}`, { headers: getAuthHeaders() })
              .then(res => { if (res.ok) return res.json(); throw new Error('Not found'); })
              .then(data => {
                if (data && !data.error) {
                  setCurrentChapter({
                    name: data.title,
                    description: data.description || 'Pelajari materi ini dengan cermat.',
                    duration: data.sections?.length ? `${data.sections.length} Levels` : '6 Levels'
                  });
                }
              })
              .catch(err => console.error(err));
          });
        });
      }
    }
    loadChapter();
  }, [baseChapterId]);

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
  const [isBossMinted, setIsBossMinted] = useState(false);
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [playerHp, setPlayerHp] = useState(3);
  const [quizIndex, setQuizIndex] = useState(0);
  const [dialogState, setDialogState] = useState<{ isOpen: boolean; type: 'success' | 'error'; message: string; onConfirm?: () => void }>({ isOpen: false, type: 'success', message: '' });

  const [highestPhaseReached, setHighestPhaseReached] = useState<number>(0);
  const [isClaiming, setIsClaiming] = useState(false);
  const [dbSection, setDbSection] = useState<any>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (phase !== 'MATERIAL' || !contentRef.current) return;
    const el = contentRef.current;
    
    const calculateTotalPages = () => {
      // clientWidth is the width of the visible window (2 columns + 1 gap)
      // scrollWidth is the total width of all columns + gaps
      // 1 page = clientWidth
      if (el.scrollWidth <= el.clientWidth + 10) {
        setTotalPages(1);
      } else {
        const gap = 112; // Matches columnGap
        const pages = Math.ceil((el.scrollWidth - el.clientWidth) / (el.clientWidth + gap)) + 1;
        setTotalPages(Math.max(1, pages));
      }
    };

    const observer = new ResizeObserver(() => {
      calculateTotalPages();
    });
    
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    
    // Fallback recalculation for when fonts/images load
    const timeout1 = setTimeout(calculateTotalPages, 100);
    const timeout2 = setTimeout(calculateTotalPages, 500);
    const timeout3 = setTimeout(calculateTotalPages, 1000);
    
    return () => {
      observer.disconnect();
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, [phase, dbSection]);

  useEffect(() => {
    if (MISSION_CONTENT[missionId as string]) return;
    import('@/hooks/useAuthSync').then(({ getAuthHeaders }) => {
      import('@/config/pathtrick').then(({ API_BASE_URL }) => {
        fetch(`${API_BASE_URL}/api/missions/${missionId as string}`, { headers: getAuthHeaders() })
          .then(res => res.json())
          .then(data => {
             if (data && !data.error) setDbSection(data);
          })
          .catch(() => {});
      });
    });
  }, [missionId]);

  const setPhaseWithProgress = (p: Phase) => {
    setPhase(p);
    const phaseOrder = ['MATERIAL', 'QUIZ', 'PROJECT', 'CLAIM'];
    const pIndex = phaseOrder.indexOf(p);
    if (pIndex > highestPhaseReached) {
      setHighestPhaseReached(pIndex);
    }
  };

  const showDialog = (type: 'success' | 'error', message: string, onConfirm?: () => void) => {
    setDialogState({ isOpen: true, type, message, onConfirm });
  };

  const closeDialog = () => {
    const { onConfirm } = dialogState;
    setDialogState(prev => ({ ...prev, isOpen: false }));
    if (onConfirm) onConfirm();
  };

  const handleLevelComplete = () => {
    audioController.play('/mission completed.ogg');
    completeDynamicNode(missionId as string);
    setPhase('CLAIM');
  };

  // 3D Page flip animation variants for Right Page
  const rightVariants: Variants = {
    initial: { opacity: 0, rotateY: 90, scale: 0.98, originX: 0 },
    animate: { opacity: 1, rotateY: 0, scale: 1, originX: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    exit: { opacity: 0, rotateY: -90, scale: 0.98, originX: 0, zIndex: 10, transition: { duration: 0.5, ease: 'easeIn' } },
  };

  // Simple fade for Left Page to prevent awkward double-flips
  const leftVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
    exit: { opacity: 0, transition: { duration: 0.5, ease: 'easeIn' } },
  };

  const playSwipeSound = () => {
    const audio = new Audio('/BookSwipe.ogg');
    audio.volume = 0.5;
    audio.play().catch(console.error);
  };

  const playHoverSound = () => {
    try {
      const audio = new Audio('/HoverTombol.ogg');
      audio.volume = 0.3;
      audio.play().catch(() => { });
    } catch (e) { }
  };

  // Get dynamic content or generate a fallback template
  let content = dbSection ? {
    materials: [
      <div key="1" style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'var(--font-vt323), sans-serif' }}>
        <h4 style={{ fontSize: '1.05rem', color: '#059669', marginBottom: '6px', textTransform: 'uppercase' }}>
          {dbSection.title}
        </h4>
        <div style={{ fontSize: '1rem', color: '#3b261b', lineHeight: '1.5' }} className="prose-content">
          <ReactMarkdown>{dbSection.content || ''}</ReactMarkdown>
        </div>
      </div>
    ],
    quiz: dbSection.quiz?.questions?.map((q: any, i: number) => ({
      question: `Pertanyaan ${i + 1}: ${q.pertanyaan || q.question}`,
      options: (q.pilihan || q.options || []).map((opt: any) => {
        const isCorrect = (opt.id === q.jawabanBenar) || opt.isCorrect === true;
        return {
          text: (opt.id ? `${opt.id}. ` : '') + (opt.teks || opt.text),
          isCorrect,
          feedback: isCorrect ? 'Benar! Kerja bagus.' : 'Masih kurang tepat. Coba ingat lagi materinya.'
        };
      })
    })) || [],
    project: dbSection.expectedKeywords ? {
      type: 'essay',
      instruction: `Praktikkan materi ini. Sistem akan mengecek pemahamanmu secara otomatis.`,
      defaultCode: '',
      language: 'html',
      codeValidation: (c: string) => {
        const kws = Array.isArray(dbSection.expectedKeywords) ? dbSection.expectedKeywords : [dbSection.expectedKeywords];
        return kws.some((kw: string) => c.toLowerCase().includes(kw.toLowerCase()));
      },
      successMsg: `Luar biasa, pemahamanmu terbukti!`,
      errorMsg: `Hasil karyamu masih kurang tepat. Ingat konsep utamanya!`,
    } : null
  } : MISSION_CONTENT[missionId as string];

  if (!content) {
    const levelNumStr = (missionId as string)?.match(/-level-(\d+)$/)?.[1] || '1';
    const levelNum = parseInt(levelNumStr);
    const isBoss = levelNum === 6;

    const isPython = (missionId as string).includes('python') || (missionId as string).includes('data');
    const isJs = (missionId as string).includes('javascript') || (missionId as string).includes('js');
    const isHtml = (missionId as string).includes('html') || (missionId as string).includes('css') || (missionId as string).includes('tailwind');

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
        { text: `Menghafal semua rumus tanpa memahami artinya`, isCorrect: false, feedback: `Menghafal tanpa pemahaman tidak efektif.\nKembali ke materi!` },
        { text: `Melewati latihan praktik karena tidak penting`, isCorrect: false, feedback: `Latihan adalah bagian krusial dari pembelajaran.\nJangan dilewati!` },
        { text: `Tidak perlu belajar materi ini secara mendalam`, isCorrect: false, feedback: `Penguasaan mendalam sangat diperlukan untuk menjadi ahli sejati.\nKembali ke materi!` }
      ]
    }));

    const finalQuizzes = hasRealQuizzes ? bankQuizzes : genericQuizzes;

    // Build topic-specific material description
    const materialIntro = isBoss
      ? `🏰 Ksatria! Penjaga Relic bab ini telah menantimu. Sebelum pertempuran final dimulai, pastikan kamu telah memahami semua konsep ${currentChapter.name} yang telah dipelajari di level-level sebelumnya.`
      : `Selamat datang Ksatria! Di Level ${levelNum} bab **${currentChapter.name}**, kamu akan memperdalam pemahamanmu. Baca materi berikut dengan seksama sebelum menghadapi Gauntlet Kuis!`;

    content = {
      materials: [
        <div key="1" style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'var(--font-vt323), sans-serif' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <span style={{ color: isBoss ? '#ef4444' : '#059669', fontSize: '1.2rem', flexShrink: 0 }}>{isBoss ? '⚔️' : '📖'}</span>
            <div>
              <strong style={{ fontSize: '1rem', color: isBoss ? '#fbbf24' : '#1a2a3a', display: 'block', marginBottom: '4px', lineHeight: '1.3' }}>
                {currentChapter.name} — Level {levelNum} {isBoss ? '(BOSS FIGHT)' : ''}
              </strong>
              <p style={{ fontSize: '1rem', color: '#57534e', lineHeight: '1.5', marginBottom: '8px' }}>
                Pahami materi dasar ini dengan saksama untuk mempersiapkan diri menghadapi tantangan.
              </p>
            </div>
          </div>
          <div>
            <p style={{ fontSize: '1rem', fontWeight: 'bold', color: '#8c5d41', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>📋 Yang Akan Kamu Kuasai:</p>
            <ul style={{ fontSize: '1rem', color: '#3b261b', lineHeight: '1.5', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>Mengidentifikasi konsep dasar dan terminologi penting dari <strong style={{ color: '#047857' }}>{currentChapter.name}</strong></li>
              <li>Menganalisis studi kasus dan memecahkan masalah dasar pada Level {levelNum}</li>
              {isBoss ? <li><strong style={{ color: '#ef4444' }}>⚠️ Ujian final: Buktikan bahwa kamu telah menguasai seluruh materi bab ini!</strong></li> : <li>Menjawab simulasi skenario dunia nyata dalam Gauntlet Kuis.</li>}
            </ul>
          </div>
          {!hasRealQuizzes && (
            <div style={{ padding: '6px 0', fontSize: '0.8rem', color: '#92400e', marginTop: 'auto' }}>
              💡 <strong>Tips Ksatria:</strong> Untuk bab {currentChapter.name}, pastikan kamu memahami konsep fundamental sebelum lanjut ke kuis!
            </div>
          )}
        </div>,
        <div key="2" style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'var(--font-vt323), sans-serif' }}>
          <div>
            <h4 style={{ fontSize: '1.05rem', color: isBoss ? '#ef4444' : '#059669', marginBottom: '6px' }}>
              {isBoss ? '⚠️ BRIEFING TERAKHIR' : '📜 TEORI DASAR'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p style={{ fontSize: '1rem', color: '#3b261b', lineHeight: '1.5' }}>
                {materialIntro}
              </p>
              {!isBoss && (
                <>
                  <p style={{ fontSize: '1rem', color: '#3b261b', lineHeight: '1.5' }}>
                    Secara fundamental, <strong>{currentChapter.name}</strong> melibatkan pemahaman mendalam terhadap prinsip-prinsip utama di bidang ini. Sebuah kesalahan umum bagi pemula adalah mengabaikan teori dasar dan langsung melompat ke praktik tingkat lanjut.
                  </p>
                  <p style={{ fontSize: '1rem', color: '#3b261b', lineHeight: '1.5' }}>
                    Di Level {levelNum} ini, kita fokus pada komponen inti: bagaimana elemen-elemen individual berinteraksi membentuk sistem yang utuh. Setiap konsep yang kamu pelajari di sini akan terus digunakan di modul-modul berikutnya. Pastikan kamu benar-benar menguasai logika di baliknya.
                  </p>
                  <p style={{ fontSize: '1rem', color: '#3b261b', lineHeight: '1.5' }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                  </p>
                  <p style={{ fontSize: '1rem', color: '#3b261b', lineHeight: '1.5' }}>
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula.
                  </p>
                  <p style={{ fontSize: '1rem', color: '#3b261b', lineHeight: '1.5' }}>
                    Donec id justo. Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu pellentesque magna erat vitae risus. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>,
        <div key="3" style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'var(--font-vt323), sans-serif' }}>
          <div>
            <h4 style={{ fontSize: '1.05rem', color: '#059669', marginBottom: '6px' }}>
              📖 LANJUTAN TEORI
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p style={{ fontSize: '1rem', color: '#3b261b', lineHeight: '1.5' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </p>
              <p style={{ fontSize: '1rem', color: '#3b261b', lineHeight: '1.5' }}>
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula.
              </p>
              <p style={{ fontSize: '1rem', color: '#3b261b', lineHeight: '1.5' }}>
                Donec id justo. Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu pellentesque magna erat vitae risus. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
              </p>
            </div>
          </div>
        </div>,
        <div key="4" style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'var(--font-vt323), sans-serif' }}>
          <div>
            <h4 style={{ fontSize: '1.05rem', color: '#059669', marginBottom: '6px' }}>
              📚 MATERI EKSTRA (HALAMAN KANAN)
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p style={{ fontSize: '1rem', color: '#3b261b', lineHeight: '1.5' }}>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.
              </p>
              <p style={{ fontSize: '1rem', color: '#3b261b', lineHeight: '1.5' }}>
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
              </p>
              <p style={{ fontSize: '1rem', color: '#3b261b', lineHeight: '1.5' }}>
                Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
              </p>
              <p style={{ fontSize: '1rem', color: '#3b261b', lineHeight: '1.5' }}>
                Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.
              </p>
            </div>
          </div>
        </div>
      ],
      quiz: finalQuizzes,
      project: (isBoss || isTech) ? {
        type: isTech ? 'code' : 'essay',
        instruction: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'var(--font-vt323), sans-serif' }}>
            <h3 style={{ color: isBoss ? '#ef4444' : '#d97706', fontSize: '1rem', marginBottom: '4px', lineHeight: '1.3' }}>
              {isBoss ? `⚔️ BOSS FIGHT: Penjaga ${currentChapter.name}` : `🛠 Tantangan Praktik — ${currentChapter.name} Lvl.${levelNum}`}
            </h3>
            <p style={{ color: '#3b261b', fontSize: '1rem', lineHeight: '1.5' }}>
              {isTech
                ? (isBoss
                  ? `Ksatria, ini adalah momen penentu! Tuliskan kode yang mencerminkan penguasaanmu atas ${currentChapter.name}. Pastikan kodenya valid dan berjalan dengan benar.`
                  : `Saatnya mempraktikkan apa yang baru kamu pelajari! Terapkan konsep dari ${currentChapter.name} Level ${levelNum} dalam bentuk kode.`)
                : (isBoss
                  ? `Penjaga Relic bab ini menantangmu! Tuliskan laporan analisa atau essay mendalam untuk membuktikan kelayakanmu sebagai Ksatria sejati.`
                  : `Praktikkan pemahamanmu tentang ${currentChapter.name} dengan menuliskan analisa atau studi kasus singkat di bawah ini.`)
              }
            </p>
            <div style={{ background: '#fae1c5', padding: '10px 14px', border: '2px dashed #8c5d41', borderRadius: '4px' }}>
              <p style={{ color: '#92400e', fontSize: '1rem', marginBottom: '8px', fontWeight: 'bold' }}>SYARAT KELULUSAN:</p>
              <ul style={{ color: '#3b261b', fontSize: '1rem', lineHeight: '1.5', marginLeft: '16px', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {isTech ? (
                  <>
                    <li>Tulis kode program menggunakan <strong style={{ color: '#047857' }}>{lang.toUpperCase()}</strong>.</li>
                    <li>Gunakan perintah output yang valid. Contoh: <code style={{ color: '#fbbf24', background: '#3b261b', padding: '2px 6px', borderRadius: '3px' }}>{printCmd}</code></li>
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
      } : undefined
    };
  }
  const materials = content.materials;

  const handleBossSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { getAuthHeaders } = await import('@/hooks/useAuthSync');
      const { API_BASE_URL } = await import('@/config/pathtrick');
      const response = await fetch(`${API_BASE_URL}/api/missions/${missionId}/project/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ code })
      });
      const data = await response.json();

      if (response.ok && data.passed) {
        audioController.play('/Poin.ogg');
        showDialog('success', data.message || 'Luar biasa! Kodemu benar.', () => handleLevelComplete());
      } else {
        const newHp = playerHp - 1;
        if (response.status === 503 || data.error === 'AiEvaluatorError' || data.error === 'InternalError') {
          showDialog('error', 'Gagal terhubung ke AI Evaluator. Coba lagi beberapa saat!');
          setPlayerHp(playerHp); // Do not reduce HP for system error
        } else {
          audioController.play(newHp > 0 ? '/NyawaBerkurang.ogg' : '/LoveAbis.ogg');

          setPlayerHp(newHp);
          if (newHp > 0) {
            const errorMessage = data.message || data.error || 'Tebakan/Kodemu masih kurang tepat. Coba perbaiki lagi!';
            showDialog('error', `Tebakanmu meleset!\n${errorMessage}\n\nSisa nyawa: ${'♥'.repeat(newHp)}`);
          } else {
            const errorMessage = data.message || data.error || 'Tebakan/Kodemu salah.';
            showDialog('error', `☠️ GAME OVER ☠️\nNyawamu telah habis!\n\n${errorMessage}\n\nSilakan pelajari ulang materi ini untuk memulihkan nyawamu dan mencoba lagi!`, () => {
              setPlayerHp(3);
              setPhase('MATERIAL');
              setMaterialPage(0);
            });
          }
        }
      }
    } catch {
      showDialog('error', 'Gagal menghubungi AI backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderLeftPage = () => {
    switch (phase) {
      case 'MATERIAL':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingTop: '16px' }}>
            {materialPage === 0 && (
              <div className={styles.cardHeader}>
                <h2 className={styles.title}>{currentChapter.name}</h2>
              </div>
            )}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: materialPage === 0 ? '20px' : '0', overflowY: 'auto', paddingRight: '8px' }} className={styles.scrollableContent}>
              {materials[materialPage * 2]}
            </div>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-start', marginTop: 'auto' }}>
              {materialPage > 0 && (
                <button onMouseEnter={playHoverSound} className={styles.secondaryBtn} onClick={() => { playSwipeSound(); setMaterialPage(p => p - 1); }}>
                  ← SEBELUMNYA
                </button>
              )}
            </div>
          </div>
        );

      case 'QUIZ':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingTop: '16px' }}>
            <div className={styles.cardHeader}>
              <h2 className={styles.title}>{currentChapter.name} - KUIS</h2>
            </div>

            {content.quiz && content.quiz.length > 0 ? (() => {
              const quizArray = Array.isArray(content.quiz) ? content.quiz : [content.quiz];
              const currentQuiz = quizArray[quizIndex];
              return (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '1.05rem', fontFamily: 'var(--font-vt323), sans-serif', color: '#8c5d41', fontWeight: 'bold' }}>NYAWA KSATRIA:</span>
                    <span style={{ color: '#ef4444', fontSize: '1.2rem' }}>{'♥'.repeat(playerHp)}</span>
                  </div>
                  {quizArray.length > 1 && (
                    <div style={{ marginBottom: '16px', fontSize: '1.05rem', color: '#57534e', textAlign: 'left', fontFamily: 'var(--font-vt323), sans-serif', fontWeight: 'bold' }}>
                      SOAL {quizIndex + 1} DARI {quizArray.length}
                    </div>
                  )}
                  <div className={styles.dialogueBox} style={{ fontFamily: 'var(--font-vt323), sans-serif', fontSize: '1.2rem', lineHeight: '1.6' }}>
                    {currentQuiz.question}
                  </div>
                </>
              );
            })() : (
              <div style={{ flex: 1 }}>
                <p className={styles.text}>Kuis belum tersedia untuk level ini.</p>
              </div>
            )}
          </div>
        );

      case 'PROJECT':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingTop: '16px' }}>
            <div className={styles.cardHeader}>
              <h2 className={styles.title} style={{ fontFamily: 'var(--font-vt323), sans-serif', fontSize: '1.8rem' }}>{currentChapter.name} - BOSS</h2>
            </div>
            {content.project ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '1.05rem', fontFamily: 'var(--font-vt323), sans-serif', color: '#8c5d41', fontWeight: 'bold' }}>NYAWA KSATRIA:</span>
                  <span style={{ color: '#ef4444', fontSize: '1.2rem' }}>{'♥'.repeat(playerHp)}</span>
                </div>
                <div className={styles.text} style={{ flex: 1, fontFamily: 'var(--font-vt323), sans-serif', fontSize: '1.2rem', lineHeight: '1.6' }}>
                  {content.project.instruction}
                </div>
              </>
            ) : (
              <p className={styles.text} style={{ flex: 1 }}>Tantangan praktik belum tersedia.</p>
            )}
          </div>
        );

      case 'CLAIM':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <div className={styles.cardSuccess}>
              <h2 className={styles.title} style={{ color: '#059669', textAlign: 'center', marginBottom: '16px' }}>
                MISSION CLEARED!
              </h2>
              <p className={styles.text} style={{ textAlign: 'center' }}>
                Luar biasa, Ksatria! Kamu telah berhasil menaklukkan tantangan di bab ini.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderRightPage = () => {
    switch (phase) {
      case 'MATERIAL':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingTop: '16px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', paddingRight: '8px' }} className={styles.scrollableContent}>
              {materials[materialPage * 2 + 1] || (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#8c5d41', opacity: 0.5, marginTop: '100px' }}>
                  <p style={{ fontFamily: 'var(--font-vt323), sans-serif', fontSize: '1.2rem' }}>[ Halaman Kosong ]</p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '16px' }}>
              {materialPage < Math.ceil(materials.length / 2) - 1 ? (
                <button onMouseEnter={playHoverSound} className={styles.btn} onClick={() => { playSwipeSound(); setMaterialPage(p => p + 1); }}>
                  LANJUT ➔
                </button>
              ) : (
                <button onMouseEnter={playHoverSound}
                  className={styles.btn}
                  onClick={() => {
                    playSwipeSound();
                    if (content.quiz) setPhaseWithProgress('QUIZ');
                    else if (content.project) setPhaseWithProgress('PROJECT');
                    else handleLevelComplete();
                  }}
                >
                  SAYA PAHAM!
                </button>
              )}
            </div>
          </div>
        );

      case 'QUIZ':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ height: '48px', marginBottom: '16px' }}></div>
            {content.quiz && content.quiz.length > 0 ? (() => {
              const quizArray = Array.isArray(content.quiz) ? content.quiz : [content.quiz];
              const currentQuiz = quizArray[quizIndex];
              return (
                <div className={styles.quizOptions}>
                  {currentQuiz.options.map((opt: any, i: number) => (
                    <button onMouseEnter={playHoverSound}
                      key={i}
                      className={styles.optionBtn}
                      onClick={() => {
                        if (opt.isCorrect) {
                          audioController.play('/Poin.ogg');
                          showDialog('success', opt.feedback, () => {
                            if (quizIndex < quizArray.length - 1) {
                              setQuizIndex(quizIndex + 1);
                            } else {
                              if (content.project) setPhaseWithProgress('PROJECT');
                              else handleLevelComplete();
                            }
                          });
                        } else {
                          const newHp = playerHp - 1;
                          audioController.play(newHp > 0 ? '/NyawaBerkurang.ogg' : '/LoveAbis.ogg');

                          setPlayerHp(newHp);
                          if (newHp > 0) {
                            showDialog('error', `Tebakanmu meleset!\n${opt.feedback}\nSisa nyawa: ${'♥'.repeat(newHp)}`);
                          } else {
                            showDialog('error', `Nyawamu telah habis!\nSilakan pelajari ulang materi ini untuk memulihkan nyawamu dan mencoba lagi!`, () => {
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
              );
            })() : (
              <div style={{ textAlign: 'center' }}>
                <button onMouseEnter={playHoverSound} className={styles.btn} onClick={() => { playSwipeSound(); setPhaseWithProgress('PROJECT'); }}>LANJUT TANTANGAN ➔</button>
              </div>
            )}
          </div>
        );

      case 'PROJECT':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {content.project ? (
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%' }}>
                <textarea
                  className={styles.textarea}
                  style={{ flex: 1, padding: '24px', background: '#fae1c5', color: '#3b261b', border: '4px solid #8c5d41', borderRadius: '8px', fontFamily: 'var(--font-vt323), sans-serif', fontSize: '1.2rem', resize: 'none', boxShadow: 'inset 4px 4px 0 rgba(140, 93, 65, 0.2)', outline: 'none' }}
                  placeholder="Ketikkan analisamu di sini..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <button onMouseEnter={playHoverSound}
                  className={styles.btn}
                  onClick={handleBossSubmit}
                  disabled={isSubmitting}
                  style={{ alignSelf: 'flex-end', marginTop: '16px' }}
                >
                  {isSubmitting ? 'AI SEDANG MENILAI...' : '⚔️ SERANG BOSS (SUBMIT)'}
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <button onMouseEnter={playHoverSound} className={styles.btn} onClick={handleLevelComplete}>SAYA PAHAM! (SELESAI)</button>
              </div>
            )}
          </div>
        );

      case 'CLAIM':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
            <div style={{ textAlign: 'center', background: '#fffbeb', padding: '16px', borderRadius: '8px', border: '1px solid #fde68a' }}>
              <span style={{ display: 'block', marginBottom: '8px' }}>REWARD</span>
              <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#92400e', lineHeight: '1.6' }}>
                Reward XP dan item telah ditambahkan ke akunmu.
              </p>
            </div>
            <button onMouseEnter={playHoverSound} className={styles.btn} onClick={() => router.push(`/map?chapter=${baseChapterId}`)} style={{ fontSize: '0.8rem', padding: '16px 32px' }}>
              KLAIM REWARD & KEMBALI KE PETA
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* ── TOP BAR ── */}
      <div className={styles.topBar}>
        <button onMouseEnter={playHoverSound} className={styles.backBtn} onClick={() => router.push(`/map?chapter=${baseChapterId}`)}>
          ← KEMBALI KE PETA
        </button>
        <div className={styles.missionId}>MISI: {missionId}</div>
      </div>

      {/* ── QUEST BOOK ── */}
      <div className={styles.questBook}>
        {/* BOOK CONTENT (PARCHMENT) */}
        <div className={styles.bookContent}>
          {/* THE PHYSICAL LEFT PAGE */}
          <div className={styles.leftPage}>
            {phase !== 'CLAIM' && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${phase}-${phase === 'MATERIAL' ? materialPage : phase === 'QUIZ' ? quizIndex : ''}-left`}
                  variants={leftVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1 }}
                >
                  {renderLeftPage()}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          <div className={styles.bookSpine}></div>

          {/* THE PHYSICAL RIGHT PAGE */}
          <div className={styles.rightPage}>
            {phase !== 'CLAIM' && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${phase}-${phase === 'MATERIAL' ? materialPage : phase === 'QUIZ' ? quizIndex : ''}-right`}
                  variants={rightVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1 }}
                >
                  {renderRightPage()}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* MATERIAL TEXT OVERLAY FOR PAGINATION */}
          {phase === 'MATERIAL' && (
            <div style={{
              position: 'absolute',
              top: '40px',
              bottom: '100px', // Space for the pagination buttons
              left: '40px',
              right: '40px',
              overflow: 'hidden',
              zIndex: 10
            }}>
              <div ref={contentRef} style={{
                columnCount: 2,
                columnGap: '112px',
                columnFill: 'auto',
                height: '100%',
                transition: 'transform 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)',
                transform: `translateX(calc(${materialPage} * (-100% - 112px)))`,
                willChange: 'transform'
              }}>
                <div style={{ fontFamily: 'var(--font-vt323), sans-serif', fontSize: '1.2rem', color: '#3b261b', lineHeight: '1.5' }}>
                  {content?.materials}
                </div>
              </div>
            </div>
          )}

          {/* CLAIM CERTIFICATE OVERLAY */}
          {phase === 'CLAIM' && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px', zIndex: 10, background: 'rgba(60, 30, 10, 0.4)', backdropFilter: 'blur(6px)', borderRadius: '24px' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key="claim-page"
                  variants={leftVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', background: '#fdf6e3', border: '4px dashed #059669', padding: '24px 32px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
                >
                  <h2 className={styles.title} style={{ color: '#059669', textAlign: 'center', fontFamily: 'var(--font-vt323), sans-serif', fontSize: '1.8rem', lineHeight: '1.6' }}>
                    {isBossLevel ? 'BOSS DEFEATED!' : 'MISSION CLEARED!'}
                  </h2>
                  <p className={styles.text} style={{ textAlign: 'center', fontFamily: 'var(--font-vt323), sans-serif', fontSize: '1.2rem', lineHeight: '1.6' }}>
                    {isBossLevel
                      ? 'Luar biasa, Ksatria! Kamu telah menaklukkan Boss dan menguasai bab ini sepenuhnya.'
                      : 'Luar biasa, Ksatria! Kamu telah berhasil menaklukkan tantangan di misi ini.'}
                  </p>
                  {/* ─── CERTIFICATE CARD (same style as OnChainCertificates) ─── */}
                  {isBossLevel && (
                    <div style={{
                      width: '100%', maxWidth: '360px',
                      background: '#c8a96e',
                      border: '4px solid #5a3520',
                      borderRadius: '4px',
                      padding: '4px',
                      boxShadow: '4px 4px 0 #3b1f0e, inset 0 0 0 2px #e8c98a',
                    }}>
                      <div style={{
                        display: 'flex', flexDirection: 'column', gap: '12px',
                        background: '#784626',
                        border: '2px solid #3b1f0e',
                        borderRadius: '2px',
                        padding: '12px',
                        position: 'relative'
                      }}>
                        {/* Certificate Preview */}
                        <CertificatePreview
                          userName={displayName}
                          moduleName={currentChapter.name}
                          walletAddress={walletShort}
                          date={new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          isMinted={isBossMinted}
                        />
                        {/* Status label under card */}
                        <p style={{ fontFamily: 'var(--font-vt323), sans-serif', fontSize: '0.9rem', color: isBossMinted ? '#34d399' : '#fbbf24', textAlign: 'center', lineHeight: '1.6' }}>
                          {isBossMinted
                            ? '✓ ON-CHAIN SBT BERHASIL DICETAK'
                            : '🔒 SERTIFIKAT BELUM DICETAK KE BLOCKCHAIN'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Non-boss: coin reward */}
                  {!isBossLevel && (
                    <div style={{ textAlign: 'center', padding: '8px 0' }}>
                      <motion.div
                        key="coin-anim"
                        initial={{ scale: 1, rotate: 0, opacity: 1, y: 0 }}
                        animate={isClaiming ? { scale: [1, 1.5, 0], rotate: [0, 180, 360], opacity: [1, 1, 0], y: 0 } : { scale: 1, rotate: 0, opacity: 1, y: [0, -10, 0] }}
                        transition={isClaiming ? { duration: 0.8, ease: "easeInOut" } : { repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        style={{ display: 'inline-block' }}
                      >
                        <img src="/Coin.png" alt="Reward" style={{ width: '64px', height: '64px', objectFit: 'contain', imageRendering: 'pixelated' }} />
                      </motion.div>
                      <p className={styles.text} style={{ marginTop: '8px', fontSize: '1.1rem', color: '#92400e' }}>
                        Reward XP dan item telah ditambahkan ke akunmu.
                      </p>
                    </div>
                  )}

                  {isBossLevel ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '400px' }}>
                        <MintSBTButton
                          courseId={generateCourseId(baseChapterId)}
                          customStyle={{
                            width: '100%',
                          }}
                          onSuccess={() => {
                            setIsBossMinted(true);
                            addXP(Math.floor((dbSection?.xpReward ?? 100) * penaltyFactor));
                            completeQuiz();
                          }}
                          certificate={{ userName: displayName, moduleName: currentChapter.name, walletAddress: walletShort, date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }}
                          onAlreadyMinted={() => setIsBossMinted(true)}
                        />
                      {!isBossMinted ? (
                          <button onMouseEnter={playHoverSound}
                            className={styles.secondaryBtn}
                            style={{ width: '100%', padding: '14px 28px', fontSize: '1.2rem', opacity: isClaiming ? 0.7 : 1 }}
                            onClick={() => {
                              if (!isClaiming) {
                                setIsClaiming(true);
                                addXP(Math.floor((dbSection?.xpReward ?? 100) * penaltyFactor));
                                completeQuiz();
                                setTimeout(() => router.push(`/map?chapter=${baseChapterId}`), 1200);
                              }
                            }}
                            disabled={isClaiming}
                          >
                            {isClaiming ? 'MENGKLAIM...' : 'NANTI AJA'}
                          </button>
                      ) : (
                        <button onMouseEnter={playHoverSound}
                          className={styles.secondaryBtn}
                          style={{ width: '100%', padding: '14px 28px', fontSize: '1.2rem' }}
                          onClick={() => router.push(`/map?chapter=${baseChapterId}`)}
                        >
                          KEMBALI KE PETA
                        </button>
                      )}
                    </div>
                  ) : (
                    <button onMouseEnter={playHoverSound}
                      className={styles.btn}
                      style={{ width: '100%', maxWidth: '400px', padding: '14px 28px', fontSize: '1.2rem', opacity: isClaiming ? 0.7 : 1 }}
                      onClick={() => {
                        if (!isClaiming) {
                          setIsClaiming(true);
                          addXP(Math.floor((dbSection?.xpReward ?? 100) * penaltyFactor));
                          if (isBossLevel) {
                            triggerLevelUp();
                          }
                          completeQuiz();
                          setTimeout(() => router.push(`/map?chapter=${baseChapterId}`), 1200);
                        }
                      }}
                      disabled={isClaiming}
                    >
                      {isClaiming ? 'MENGKLAIM...' : 'KLAIM REWARD & KEMBALI KE PETA'}
                    </button>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* TABS (Now on the right) */}
        <div className={styles.tabsContainer}>
          <div
            className={`${styles.tab} ${styles.tabTeori} ${phase === 'MATERIAL' ? styles.activeTab : ''}`}
            onClick={() => { if (highestPhaseReached >= 0) setPhaseWithProgress('MATERIAL'); }}
            style={{ cursor: highestPhaseReached >= 0 ? 'pointer' : 'not-allowed' }}
          >
            TEORI
          </div>
          <div
            className={`${styles.tab} ${styles.tabKuis} ${phase === 'QUIZ' ? styles.activeTab : ''}`}
            onClick={() => { if (highestPhaseReached >= 1) setPhaseWithProgress('QUIZ'); }}
            style={{ cursor: highestPhaseReached >= 1 ? 'pointer' : 'not-allowed', opacity: (highestPhaseReached >= 1 || phase === 'QUIZ') ? 1 : 0.6 }}
          >
            KUIS
          </div>
          {isBossLevel && (
            <div
              className={`${styles.tab} ${styles.tabBoss} ${phase === 'PROJECT' ? styles.activeTab : ''}`}
              onClick={() => { if (highestPhaseReached >= 2) setPhaseWithProgress('PROJECT'); }}
              style={{ cursor: highestPhaseReached >= 2 ? 'pointer' : 'not-allowed', opacity: (highestPhaseReached >= 2 || phase === 'PROJECT') ? 1 : 0.6 }}
            >
              BOSS
            </div>
          )}
          <div
            className={`${styles.tab} ${styles.tabReward} ${phase === 'CLAIM' ? styles.activeTab : ''}`}
            onClick={() => { if (highestPhaseReached >= 3) setPhaseWithProgress('CLAIM'); }}
            style={{ cursor: highestPhaseReached >= 3 ? 'pointer' : 'not-allowed', opacity: (highestPhaseReached >= 3 || phase === 'CLAIM') ? 1 : 0.6 }}
          >
            REWARD
          </div>
        </div>
      </div>

      {/* FULL SCREEN FLASH EFFECT ON CLAIM */}
      <AnimatePresence>
        {isClaiming && (
          <motion.div
            key="flash-effect"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'white', zIndex: 9999, pointerEvents: 'none' }}
          />
        )}
      </AnimatePresence>

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
              <button onMouseEnter={playHoverSound} className={styles.btn} onClick={closeDialog}>
                {dialogState.type === 'success' && dialogState.onConfirm ? 'LANJUT ➔' : 'TUTUP'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
