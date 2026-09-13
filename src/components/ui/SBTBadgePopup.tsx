'use client';

import { useEffect, useRef } from 'react';
import styles from './SBTBadgePopup.module.css';

interface SBTBadgePopupProps {
  badgeName: string;
  badgeEmoji: string;
  /** Optional pixel art badge image path (from /assets/Object/Badges/) */
  badgeImage?: string;
  xpEarned: number;
  explorerUrl?: string;
  onClose: () => void;
}

export default function SBTBadgePopup({
  badgeName,
  badgeEmoji,
  badgeImage,
  xpEarned,
  explorerUrl,
  onClose,
}: SBTBadgePopupProps) {
  const confettiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate confetti pieces
    const container = confettiRef.current;
    if (!container) return;
    const colors = ['#7c3aed', '#14b8a6', '#f59e0b', '#10b981', '#c084fc', '#fbbf24'];
    const pieces: HTMLSpanElement[] = [];
    for (let i = 0; i < 50; i++) {
      const el = document.createElement('span');
      el.style.cssText = `
        position: fixed;
        top: -20px;
        left: ${Math.random() * 100}vw;
        width: ${Math.random() * 8 + 4}px;
        height: ${Math.random() * 8 + 4}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        opacity: 0.9;
        animation: confettiFall ${1.5 + Math.random() * 2}s linear ${Math.random() * 1}s both;
        pointer-events: none;
        z-index: 999;
      `;
      document.body.appendChild(el);
      pieces.push(el);
    }
    return () => pieces.forEach(p => p.remove());
  }, []);

  return (
    <div className={styles.overlay} id="sbt-badge-overlay" onClick={onClose}>
      <div className={styles.popup} onClick={e => e.stopPropagation()} id="sbt-badge-popup">
        <div ref={confettiRef} />

        {/* Glow ring */}
        <div className={styles.glowRing} />

        {/* Badge display */}
        <div className={styles.badgeContainer}>
          <div className={styles.badgeOuter}>
            <div className={styles.badgeInner}>
              {badgeImage ? (
                <img
                  src={badgeImage}
                  alt={badgeName}
                  className={styles.badgeImg}
                />
              ) : (
                <span className={styles.badgeEmoji}>{badgeEmoji}</span>
              )}
            </div>
          </div>
          <div className={styles.pulseRing1} />
          <div className={styles.pulseRing2} />
        </div>

        {/* Content */}
        <div className={styles.content}>
          <p className={styles.mintLabel}>🎉 Sertifikat Berhasil Dicetak!</p>
          <h2 className={styles.badgeName}>{badgeName}</h2>
          <p className={styles.subtitle}>
            Keahlianmu kini tersimpan permanen on-chain dan bisa diverifikasi siapa saja.
          </p>

          <div className={styles.xpBurst}>
            <span>+{xpEarned} XP</span>
          </div>

          <div className={styles.onChainNote}>
            <span className={styles.chainIcon}>⛓️</span>
            <span>Tersimpan di BNB Chain — tidak bisa dipalsukan</span>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {explorerUrl && (
            <a
              id="sbt-explorer-link"
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              🔍 Lihat di Explorer
            </a>
          )}
          <button
            id="sbt-close-btn"
            className="btn btn-gold btn-lg"
            onClick={onClose}
          >
            🚀 Lanjutkan Petualangan
          </button>
        </div>
      </div>
    </div>
  );
}
