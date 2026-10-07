'use client';

import { useEffect, useState } from 'react';
import styles from './NodeInfoPanel.module.css';
import type { CourseNodeData } from '@/phaser/config';
import { ASSET_PATHS } from '@/phaser/config';
import { useMapStore } from '@/store/useMapStore';
import { useUserStore } from '@/store/useUserStore';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import MintSBTButton from './MintSBTButton';

interface NodeInfoPanelProps {
  node: CourseNodeData | null;
  isNearby: boolean;
  onStartCourse: (node: CourseNodeData) => void;
  onClose: () => void;
}

const CATEGORY_META: Record<CourseNodeData['category'], { icon: string; label: string; color: string }> = {
  foundation: { icon: ASSET_PATHS.OBJ_COMPASS_ROSE, label: 'Fondasi', color: '#7c3aed' },
  skill: { icon: ASSET_PATHS.OBJ_SWORD, label: 'Skill', color: '#14b8a6' },
  project: { icon: ASSET_PATHS.OBJ_SCROLL, label: 'Proyek', color: '#f59e0b' },
  milestone: { icon: ASSET_PATHS.BADGE_COURSE_MASTER, label: 'Milestone', color: '#10b981' },
  bonus: { icon: ASSET_PATHS.OBJ_COMPASS_ROSE, label: 'Bonus', color: '#ec4899' },
};

const STATUS_META = {
  locked: { label: 'Terkunci', badge: 'badge-purple', icon: '🔒' },
  available: { label: 'Tersedia', badge: 'badge-teal', icon: '✨' },
  in_progress: { label: 'Sedang Berjalan', badge: 'badge-gold', icon: '📖' },
  completed: { label: 'Selesai', badge: 'badge-green', icon: '✅' },
};

const generateCourseId = (str: string) => {
  if (/^[0-9]+$/.test(str)) return Number(str);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

// Sequential boss dialogue moved inside to access dynamic player name
const TypewriterText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i > text.length) {
        clearInterval(interval);
      }
    }, 90); // 90ms delay per char (slower typing)
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
};

export default function NodeInfoPanel({
  node,
  onStartCourse,
  onClose,
}: NodeInfoPanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [displayNode, setDisplayNode] = useState<CourseNodeData | null>(null);
  const [bossLineIndex, setBossLineIndex] = useState(0);
  const role = useMapStore(state => state.role);

  const { user } = usePrivy();
  const { wallets } = useWallets();
  const activeWallet = wallets[0];
  const { displayName: savedName } = useUserStore();

  const playerName = savedName
    || user?.google?.name
    || user?.email?.address?.split('@')[0]
    || (activeWallet ? `${activeWallet.address.slice(0, 6)}...${activeWallet.address.slice(-4)}` : 'Ksatria');

  const BOSS_DIALOGUE_LINES = [
    `⚔️  Ini bukan quest biasa, ${playerName}...`,
    'Level 1 hingga 5 sudah kamu taklukkan. Fondasi, Skill, Proyek, Kuis, Latihan — semuanya.',
    'Sekarang, hanya satu rintangan tersisa. Boss Fight.',
    '"Apakah kamu benar-benar siap menghadapinya?"',
    'Aku sudah melihat perjuanganmu. Aku yakin kamu bisa. Buktikan pada dunia. ⚡',
  ];

  const handleStartCourse = () => {
    if (displayNode) {
      onStartCourse(displayNode);
    }
  };

  const playHoverSound = () => {
    try {
      const audio = new Audio('/HoverTombol.ogg');
      audio.volume = 0.3;
      audio.play().catch(() => { });
    } catch (e) { }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && isVisible && displayNode) {
        const canStart = displayNode.status === 'available' || displayNode.status === 'in_progress' || displayNode.status === 'completed';
        if (canStart) {
          e.preventDefault();
          
          // Play click sound since keyboard doesn't trigger GlobalAudio click listener
          try {
            if ((window as any).__lastHoverAudio) {
              (window as any).__lastHoverAudio.pause();
            }
            const clickAudio = new Audio('/ClickTombol.ogg');
            clickAudio.volume = 0.5;
            clickAudio.play().catch(() => {});
          } catch (err) {}

          handleStartCourse();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, displayNode]);

  useEffect(() => {
    if (node) {
      (window as any).__isNodePanelOpen = true;
      // The transition state must update when the selected node changes.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayNode(node);
      setIsVisible(true);
      setBossLineIndex(0);
    } else {
      (window as any).__isNodePanelOpen = false;
      setIsVisible(false);
      const t = setTimeout(() => setDisplayNode(null), 400);
      return () => clearTimeout(t);
    }
  }, [node]);

  // Clean up flag on unmount
  useEffect(() => {
    return () => {
      (window as any).__isNodePanelOpen = false;
    };
  }, []);

  // Auto-advance boss dialogue lines every 4 seconds
  useEffect(() => {
    if (!displayNode) return;
    const isBoss = displayNode.category === 'milestone' || displayNode.title.toLowerCase().includes('boss');
    if (!isBoss) return;
    if (bossLineIndex >= BOSS_DIALOGUE_LINES.length - 1) return;

    const t = setTimeout(() => {
      setBossLineIndex(prev => prev + 1);
    }, 7000);
    return () => clearTimeout(t);
  }, [bossLineIndex, displayNode]);

  if (!displayNode) return null;

  const catMeta = CATEGORY_META[displayNode.category] ?? {
    icon: ASSET_PATHS.OBJ_COMPASS_ROSE,
    label: 'Bonus',
    color: '#ec4899',
  };
  const statusMeta = STATUS_META[displayNode.status];
  const canStart = displayNode.status === 'available' || displayNode.status === 'in_progress';
  const isCompleted = displayNode.status === 'completed';
  const isBoss = displayNode.category === 'milestone' || displayNode.title.toLowerCase().includes('boss');
  const allLinesShown = bossLineIndex >= BOSS_DIALOGUE_LINES.length - 1;

  const NPC_INFO: Record<string, { name: string; image: string }> = {
    'npc-guide-boy': { name: 'Pemandu Petualang', image: '/NPC Guide Boy.png' },
    'npc-high-school': { name: 'Siswa SMA', image: '/NPC High School Student.png' },
    'npc-wizard': { name: 'Grandmaster Wizard', image: '/NPC Wizard.png' },
    'npc-mentor': { name: 'Kak Mentor', image: '/NPC Mentor.png' },
    'npc-ai-engineer': { name: 'AI Engineer', image: '/NPC AI Engineer.png' },
    'npc-professor': { name: 'Profesor PathTrick', image: '/npc-professor.png' },
    'npc-scholarship': { name: 'Petugas Beasiswa', image: '/NPC Scolarship Officer.png' },
    'npc-recruiter': { name: 'HR Recruiter', image: '/NPC Recruiter.png' },
  };

  const npcKey = displayNode.npcKey || 'npc-professor';
  const speakerInfo = NPC_INFO[npcKey] || NPC_INFO['npc-professor'];

  return (
    <div className={`${styles.panel} ${isVisible ? styles.visible : styles.hidden} ${isBoss ? styles.bossMode : ''}`}>
      <div className={styles.inner}>

        {/* Character Portrait */}
        <div className={`${styles.portraitBox} ${isBoss ? styles.bossPortrait : ''}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={speakerInfo.image} 
            alt={speakerInfo.name} 
            style={npcKey !== 'npc-wizard' ? { transform: 'scale(1.35) translateY(4px) translateX(-5px)' } : undefined}
          />
        </div>

        {/* Dialogue Box */}
        <div className={`${styles.dialogueBox} ${isBoss ? styles.bossDialogue : ''}`}>
          <div className={`${styles.speakerName} ${isBoss ? styles.bossSpeakerName : ''}`}>
            {isBoss ? `⚔️ ${speakerInfo.name}` : speakerInfo.name}
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Tutup panel">
            ✖
          </button>

          <div className={styles.dialogueContent}>
            {isBoss ? (
              /* ─── BOSS FIGHT DIALOGUE MODE ─── */
              <>
                <div className={styles.bossLines}>
                  {BOSS_DIALOGUE_LINES.slice(0, bossLineIndex + 1).map((line, i) => (
                    <p
                      key={i}
                      className={`${styles.dialogueText} ${i === bossLineIndex ? styles.dialogueActive : styles.dialogueFaded
                        }`}
                    >
                      {i === bossLineIndex ? <TypewriterText text={line} /> : line}
                    </p>
                  ))}
                </div>

                {/* Dot progress indicator */}
                <div className={styles.dotProgress}>
                  {BOSS_DIALOGUE_LINES.map((_, i) => (
                    <span key={i} className={i <= bossLineIndex ? styles.dotActive : styles.dot} />
                  ))}
                </div>

                {/* Info row */}
                <div className={styles.infoRow}>
                  <span className={`${styles.badge} ${styles[statusMeta.badge]}`}>
                    {statusMeta.icon} {statusMeta.label}
                  </span>
                  <span className={`${styles.xp} ${styles.bossXp}`}>+{displayNode.xp} XP 🔥</span>
                  <span style={{ fontSize: '0.5rem', color: '#fca5a5', letterSpacing: '0.05em' }}>
                    ⚔️ BOSS FIGHT
                  </span>
                </div>

                {/* Boss CTA — only shows after all lines played */}
                <div className={styles.actions}>
                  {canStart && allLinesShown && (
                    <div className={styles.bossCtaGroup}>
                      <p className={styles.bossWarning}>
                        ⚠️ Pastikan kamu sudah siap! Level 1–5 harus dikuasai sebelum ini.
                      </p>
                      <button
                        className={`${styles.actionBtn} ${styles.bossBtn}`}
                        onClick={handleStartCourse}
                        onMouseEnter={playHoverSound}
                      >
                        ⚔️ TERIMA TANTANGAN!
                      </button>
                    </div>
                  )}
                  {canStart && !allLinesShown && (
                    <button
                      className={styles.skipBtn}
                      onClick={() => setBossLineIndex(BOSS_DIALOGUE_LINES.length - 1)}
                      onMouseEnter={playHoverSound}
                    >
                      Lewati ▶▶
                    </button>
                  )}
                  {isCompleted && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                      <button
                        className={`${styles.actionBtn} ${styles.goldBtn}`}
                        onClick={handleStartCourse}
                        onMouseEnter={playHoverSound}
                      >
                        📖 Review Materi
                      </button>
                      <MintSBTButton 
                        courseId={generateCourseId(displayNode.id.replace(/-level-\d+$/, ''))} 
                        customStyle={{ fontSize: '0.8rem', padding: '10px 16px' }}
                      />
                    </div>
                  )}
                  {displayNode.status === 'locked' && (
                    <div className={styles.lockedMsg}>
                      🔒 Selesaikan Level 1–5 terlebih dahulu, {playerName}!
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* ─── NORMAL NODE DIALOGUE ─── */
              <>
                <p className={styles.dialogueText}>
                  <TypewriterText text={`"Ah, ${playerName}! ${displayNode.description} Apakah kamu siap untuk mengambil tantangan ${displayNode.title}?"`} />
                </p>

                <div className={styles.infoRow}>
                  <span className={`${styles.badge} ${styles[statusMeta.badge]}`}>
                    {statusMeta.icon} {statusMeta.label}
                  </span>
                  <span className={styles.xp}>+{displayNode.xp} XP</span>
                  <span style={{ fontSize: '0.55rem', color: '#a78bfa' }}>• {catMeta.label}</span>
                </div>

                <div className={styles.actions}>
                  {canStart && (
                    <>
                      {displayNode.universityMatchId ? (
                        <button className={styles.actionBtn} onClick={handleStartCourse} onMouseEnter={playHoverSound}>
                          See University Details ▶
                        </button>
                      ) : displayNode.jobGapId ? (
                        <button className={styles.actionBtn} onClick={handleStartCourse} onMouseEnter={playHoverSound}>
                          View Job Match ▶
                        </button>
                      ) : (
                        <button className={styles.actionBtn} onClick={handleStartCourse} onMouseEnter={playHoverSound}>
                          {role === 'MAHASISWA'
                            ? 'Train Skill ▶'
                            : displayNode.status === 'in_progress'
                              ? 'Lanjutkan ▶'
                              : 'Mulai Misi ▶'}
                        </button>
                      )}
                    </>
                  )}
                  {isCompleted && (
                    <button
                      className={`${styles.actionBtn} ${styles.goldBtn}`}
                      onClick={handleStartCourse}
                      onMouseEnter={playHoverSound}
                    >
                      📖 Review Materi
                    </button>
                  )}
                  {displayNode.status === 'locked' && (
                    <div className={styles.lockedMsg}>Prasyarat belum terpenuhi...</div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div> {/* .inner */}
    </div>
  );
}
