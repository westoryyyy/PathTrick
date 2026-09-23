'use client';

import { useEffect, useState } from 'react';
import styles from './NodeInfoPanel.module.css';
import type { CourseNodeData } from '@/phaser/config';
import { ASSET_PATHS } from '@/phaser/config';
import { useMapStore } from '@/store/useMapStore';

interface NodeInfoPanelProps {
  node: CourseNodeData | null;
  isNearby: boolean;
  onStartCourse: (node: CourseNodeData) => void;
  onClose: () => void;
}

const CATEGORY_META = {
  foundation: { icon: ASSET_PATHS.OBJ_COMPASS_ROSE, label: 'Fondasi',  color: '#7c3aed' },
  skill:      { icon: ASSET_PATHS.OBJ_SWORD,        label: 'Skill',     color: '#14b8a6' },
  project:    { icon: ASSET_PATHS.OBJ_SCROLL,       label: 'Proyek',    color: '#f59e0b' },
  milestone:  { icon: ASSET_PATHS.BADGE_COURSE_MASTER, label: 'Milestone', color: '#10b981' },
};

const STATUS_META = {
  locked:      { label: 'Terkunci',        badge: 'badge-purple', icon: '🔒' },
  available:   { label: 'Tersedia',        badge: 'badge-teal',   icon: '✨' },
  in_progress: { label: 'Sedang Berjalan', badge: 'badge-gold',   icon: '📖' },
  completed:   { label: 'Selesai',         badge: 'badge-green',  icon: '✅' },
};

// Sequential boss dialogue — Professor speaks one line at a time
const BOSS_DIALOGUE_LINES = [
  '⚔️  Ini bukan quest biasa, Petualang...',
  'Level 1 hingga 5 sudah kamu taklukkan. Fondasi, Skill, Proyek, Kuis, Latihan — semuanya.',
  'Sekarang, hanya satu rintangan tersisa. Boss Fight.',
  '"Apakah kamu benar-benar siap menghadapinya?"',
  'Aku sudah melihat perjuanganmu. Aku yakin kamu bisa. Buktikan pada dunia. ⚡',
];

export default function NodeInfoPanel({
  node,
  isNearby,
  onStartCourse,
  onClose,
}: NodeInfoPanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [displayNode, setDisplayNode] = useState<CourseNodeData | null>(null);
  const [bossLineIndex, setBossLineIndex] = useState(0);
  const [bossConfirmed, setBossConfirmed] = useState(false);
  const role = useMapStore(state => state.role);

  useEffect(() => {
    if (node) {
      setDisplayNode(node);
      setIsVisible(true);
      setBossLineIndex(0);
      setBossConfirmed(false);
    } else {
      setIsVisible(false);
      const t = setTimeout(() => setDisplayNode(null), 400);
      return () => clearTimeout(t);
    }
  }, [node]);

  // Auto-advance boss dialogue lines every 2.2 seconds
  useEffect(() => {
    if (!displayNode) return;
    const isBoss = displayNode.category === 'milestone' || displayNode.title.toLowerCase().includes('boss');
    if (!isBoss) return;
    if (bossLineIndex >= BOSS_DIALOGUE_LINES.length - 1) return;

    const t = setTimeout(() => {
      setBossLineIndex(prev => prev + 1);
    }, 2200);
    return () => clearTimeout(t);
  }, [bossLineIndex, displayNode]);

  if (!displayNode) return null;

  const catMeta       = CATEGORY_META[displayNode.category];
  const statusMeta    = STATUS_META[displayNode.status];
  const canStart      = displayNode.status === 'available' || displayNode.status === 'in_progress';
  const isBoss        = displayNode.category === 'milestone' || displayNode.title.toLowerCase().includes('boss');
  const allLinesShown = bossLineIndex >= BOSS_DIALOGUE_LINES.length - 1;

  return (
    <div className={`${styles.panel} ${isVisible ? styles.visible : styles.hidden} ${isBoss ? styles.bossMode : ''}`}>
      <div className={styles.inner}>

      {/* Character Portrait */}
      <div className={`${styles.portraitBox} ${isBoss ? styles.bossPortrait : ''}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/npc-professor.png" alt="Professor" />
      </div>

      {/* Dialogue Box */}
      <div className={`${styles.dialogueBox} ${isBoss ? styles.bossDialogue : ''}`}>
        <div className={`${styles.speakerName} ${isBoss ? styles.bossSpeakerName : ''}`}>
          {isBoss ? '⚔️ Profesor PathTrick' : 'Profesor PathTrick'}
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
                    className={`${styles.dialogueText} ${
                      i === bossLineIndex ? styles.dialogueActive : styles.dialogueFaded
                    }`}
                  >
                    {line}
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
                      onClick={() => onStartCourse(displayNode)}
                    >
                      ⚔️ TERIMA TANTANGAN!
                    </button>
                  </div>
                )}
                {canStart && !allLinesShown && (
                  <button
                    className={styles.skipBtn}
                    onClick={() => setBossLineIndex(BOSS_DIALOGUE_LINES.length - 1)}
                  >
                    Lewati ▶▶
                  </button>
                )}
                {displayNode.status === 'completed' && (
                  <button
                    className={`${styles.actionBtn} ${styles.goldBtn}`}
                    onClick={() => onStartCourse(displayNode)}
                  >
                    Lihat Badge 🌟
                  </button>
                )}
                {displayNode.status === 'locked' && (
                  <div className={styles.lockedMsg}>
                    🔒 Selesaikan Level 1–5 terlebih dahulu, Petualang!
                  </div>
                )}
              </div>
            </>
          ) : (
            /* ─── NORMAL NODE DIALOGUE ─── */
            <>
              <p className={styles.dialogueText}>
                &quot;Ah, Petualang! {displayNode.description} Apakah kamu siap untuk mengambil tantangan{' '}
                <strong>{displayNode.title}</strong>?&quot;
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
                      <button className={styles.actionBtn} onClick={() => onStartCourse(displayNode)}>
                        See University Details ▶
                      </button>
                    ) : displayNode.jobGapId ? (
                      <button className={styles.actionBtn} onClick={() => onStartCourse(displayNode)}>
                        View Job Match ▶
                      </button>
                    ) : (
                      <button className={styles.actionBtn} onClick={() => onStartCourse(displayNode)}>
                        {role === 'MAHASISWA'
                          ? 'Train Skill ▶'
                          : displayNode.status === 'in_progress'
                          ? 'Lanjutkan ▶'
                          : 'Mulai Misi ▶'}
                      </button>
                    )}
                  </>
                )}
                {displayNode.status === 'completed' && (
                  <button
                    className={`${styles.actionBtn} ${styles.goldBtn}`}
                    onClick={() => onStartCourse(displayNode)}
                  >
                    Lihat Badge 🌟
                  </button>
                )}
                {displayNode.status === 'locked' && (
                  <div className={styles.lockedMsg}>🔒 Prasyarat belum terpenuhi...</div>
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
