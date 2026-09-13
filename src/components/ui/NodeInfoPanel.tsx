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

export default function NodeInfoPanel({
  node,
  isNearby,
  onStartCourse,
  onClose,
}: NodeInfoPanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [displayNode, setDisplayNode] = useState<CourseNodeData | null>(null);
  const role = useMapStore(state => state.role);

  useEffect(() => {
    if (node) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayNode(node);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(false);
      const t = setTimeout(() => setDisplayNode(null), 400);
      return () => clearTimeout(t);
    }
  }, [node]);

  if (!displayNode) return null;

  const catMeta    = CATEGORY_META[displayNode.category];
  const statusMeta = STATUS_META[displayNode.status];
  const canStart   = displayNode.status === 'available' || displayNode.status === 'in_progress';

  return (
    <div className={`${styles.panel} ${isVisible ? styles.visible : styles.hidden}`}>
      {/* Header */}
      <div className={styles.header} style={{ borderColor: catMeta.color }}>
        <div className={styles.headerLeft}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={catMeta.icon} alt={catMeta.label} className={styles.categoryIconImg} />
          <div>
            <p className={styles.categoryLabel} style={{ color: catMeta.color }}>
              {catMeta.label}
            </p>
            <h2 className={styles.nodeTitle}>{displayNode.title}</h2>
          </div>
        </div>
        <button
          id="node-panel-close"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Tutup panel"
        />

      </div>

      {/* Status badge */}
      <div className={styles.statusRow}>
        <span className={`${styles.badge} ${styles[statusMeta.badge]}`}>
          {statusMeta.icon} {statusMeta.label}
        </span>
        <span className={styles.xp}>+{displayNode.xp} XP</span>
      </div>

      {/* Description */}
      <p className={styles.description}>{displayNode.description}</p>

      {/* AI Recommendation */}
      {displayNode.aiRecommendation && (
        <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(20, 184, 166, 0.1)', border: '2px solid rgba(20, 184, 166, 0.4)', borderRadius: '4px' }}>
          <p style={{ margin: 0, fontFamily: '"Press Start 2P", monospace', fontSize: '0.45rem', color: '#2dd4bf', marginBottom: '8px', lineHeight: '1.4' }}>
            🤖 AI INSIGHT
          </p>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#ccfbf1', lineHeight: '1.4' }}>
            {displayNode.aiRecommendation}
          </p>
        </div>
      )}

      {/* Proximity hint */}
      {isNearby && canStart && (
        <p className={styles.proximityHint}>
          💡 Kamu dekat dengan node ini!
        </p>
      )}

      {/* Prerequisites */}
      {displayNode.prerequisites.length > 0 && displayNode.status === 'locked' && (
        <div className={styles.prereqSection}>
          <p className={styles.prereqTitle}>Prasyarat:</p>
          <div className={styles.prereqList}>
            {displayNode.prerequisites.map(id => (
              <span key={id} className={`${styles.badge} ${styles['badge-purple']}`}>🔗 {id}</span>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className={styles.actions}>
        {canStart && (
          <>
            {displayNode.universityMatchId ? (
              <button
                className={`${styles.actionBtn} ${styles.primaryBtn}`}
                onClick={() => onStartCourse(displayNode)}
              >
                See University Details
              </button>
            ) : displayNode.jobGapId ? (
              <button
                className={`${styles.actionBtn} ${styles.primaryBtn}`}
                onClick={() => onStartCourse(displayNode)}
              >
                View Job Match
              </button>
            ) : (
              <button
                id="node-start-course-btn"
                className={`${styles.actionBtn} ${styles.primaryBtn}`}
                onClick={() => onStartCourse(displayNode)}
              >
                {role === 'MAHASISWA' ? 'Train Skill' : (displayNode.status === 'in_progress' ? 'Lanjutkan' : 'Mulai Misi')}
              </button>
            )}
          </>
        )}
        
        {displayNode.status === 'completed' && (
          <button
            id="node-view-badge-btn"
            className={`${styles.actionBtn} ${styles.goldBtn}`}
            onClick={() => onStartCourse(displayNode)}
          >
            Lihat Badge
          </button>
        )}
        {displayNode.status === 'locked' && (
          <div className={styles.lockedMsg}>
            🔒 Selesaikan prasyarat untuk membuka node ini
          </div>
        )}
      </div>
    </div>
  );
}
