'use client';

import styles from './PlayerHUD.module.css';
import { ASSET_PATHS } from '@/phaser/config';

interface PlayerHUDProps {
  playerName: string;
  xp: number;
  xpToNext: number;
  level: number;
  sbtCount: number;
  nearbyNodeTitle?: string | null;
}

export default function PlayerHUD({
  playerName,
  xp,
  xpToNext,
  level,
  sbtCount,
  nearbyNodeTitle,
}: PlayerHUDProps) {
  const xpPercent = Math.min((xp / xpToNext) * 100, 100);

  return (
    <>
      {/* ── Top-right: HUD Container (Player Info + Stats) ── */}
      <div className={styles.hudContainer} id="player-hud-container">
        {/* Stats Card */}
        <div className={styles.statsCard} id="player-hud-stats">
          <div className={styles.statItem}>
            <img
              src={ASSET_PATHS.BADGE_FIRST_STEP}
              alt="Badge"
              className={styles.statIconImg}
            />
            <div>
              <p className={styles.statValue}>{sbtCount}</p>
              <p className={styles.statLabel}>Badges</p>
            </div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <img
              src={ASSET_PATHS.OBJ_COIN}
              alt="XP"
              className={styles.statIconImg}
            />
            <div>
              <p className={styles.statValue}>{xp}</p>
              <p className={styles.statLabel}>XP Total</p>
            </div>
          </div>
        </div>

        {/* Player Card */}
        <div className={styles.playerCard} id="player-hud-card">
          <div className={styles.avatar}>
            <img
              src={ASSET_PATHS.CHAR_IDLE}
              alt="Avatar"
              className={styles.avatarImg}
            />
            <span className={styles.levelBadge}>Lv.{level}</span>
          </div>
          <div className={styles.info}>
            <p className={styles.playerName}>{playerName}</p>
            <div className={styles.xpRow}>
              <div className={styles.xpBarWrap}>
                <div
                  className={styles.xpBarFill}
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <span className={styles.xpLabel}>{xp}/{xpToNext} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom-center: Controls hint ── */}
      <div className={styles.controlsHint} id="player-hud-controls">
        <span className={styles.controlHintKey}>WASD</span>
        <span className={styles.controlHintKey}>↑↓←→</span>
        <span style={{ color: 'rgba(200,170,255,0.5)' }}>Gerak</span>
        <span className={styles.dot}>·</span>
        <span>Klik map untuk jalan</span>
        <span className={styles.dot}>·</span>
        <span>Klik bangunan untuk Quest</span>
      </div>

      {/* ── Nearby Node Tooltip ── */}
      {nearbyNodeTitle && (
        <div className={styles.nearbyToast} id="player-hud-nearby">
          <span className={styles.nearbyIcon}>👆</span>
          <span>Dekat: <strong>{nearbyNodeTitle}</strong></span>
        </div>
      )}
    </>
  );
}
