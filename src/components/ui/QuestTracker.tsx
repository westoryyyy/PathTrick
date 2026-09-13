'use client';

import styles from './QuestTracker.module.css';
import type { CourseNodeData } from '@/phaser/config';

interface QuestTrackerProps {
  nodes: CourseNodeData[];
  onSelectNode?: (node: CourseNodeData) => void;
}

const CATEGORY_ICON: Record<string, string> = {
  foundation: '🏛️',
  skill: '⚡',
  project: '🔨',
  milestone: '🏆',
};

export default function QuestTracker({ nodes, onSelectNode }: QuestTrackerProps) {
  const completed  = nodes.filter(n => n.status === 'completed');
  const inProgress = nodes.filter(n => n.status === 'in_progress');
  const available  = nodes.filter(n => n.status === 'available');
  const locked     = nodes.filter(n => n.status === 'locked');

  // "Next up": in_progress first, then available, then first locked
  const nextNodes = [...inProgress, ...available].slice(0, 2);
  const upcoming  = locked.slice(0, 2);

  const totalNodes = nodes.length;
  const doneCount  = completed.length;
  const progress   = Math.round((doneCount / totalNodes) * 100);

  return (
    <div className={styles.tracker} id="quest-tracker">
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.headerIcon}>🗺️</span>
        <span className={styles.headerTitle}>Roadmap</span>
        <span className={styles.progressPct}>{progress}%</span>
      </div>

      {/* Overall progress bar */}
      <div className={styles.mainBarWrap}>
        <div className={styles.mainBarFill} style={{ width: `${progress}%` }} />
        <span className={styles.mainBarLabel}>{doneCount}/{totalNodes} Misi</span>
      </div>

      <div className={styles.divider} />

      {/* Next up */}
      {nextNodes.length > 0 && (
        <div className={styles.section}>
          <p className={styles.sectionTitle}>▶ Sekarang</p>
          {nextNodes.map(n => (
            <button
              key={n.id}
              className={`${styles.questRow} ${styles.active} ${styles.clickable}`}
              onClick={() => onSelectNode?.(n)}
              title={`Klik untuk lihat detail: ${n.title}`}
            >
              <span className={styles.questIcon}>{CATEGORY_ICON[n.category]}</span>
              <div className={styles.questInfo}>
                <p className={styles.questName}>{n.title}</p>
                <p className={styles.questXp}>+{n.xp} XP</p>
              </div>
              <span className={styles.questStatus}>
                {n.status === 'in_progress' ? '📖' : '✨'}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div className={styles.section}>
          <p className={styles.sectionTitle}>🔒 Selanjutnya</p>
          {upcoming.map(n => (
            <button
              key={n.id}
              className={`${styles.questRow} ${styles.locked} ${styles.clickable}`}
              onClick={() => onSelectNode?.(n)}
              title={`Lihat syarat: ${n.title}`}
            >
              <span className={styles.questIcon} style={{ opacity: 0.4 }}>{CATEGORY_ICON[n.category]}</span>
              <div className={styles.questInfo}>
                <p className={styles.questName} style={{ opacity: 0.5 }}>{n.title}</p>
                <p className={styles.questXp} style={{ opacity: 0.4 }}>+{n.xp} XP</p>
              </div>
              <span className={styles.questStatus} style={{ opacity: 0.4 }}>🔒</span>
            </button>
          ))}
        </div>
      )}

      {/* Completed count */}
      {completed.length > 0 && (
        <>
          <div className={styles.divider} />
          <div className={styles.completedRow}>
            <span>✅ {completed.length} misi selesai</span>
          </div>
        </>
      )}
    </div>
  );
}
