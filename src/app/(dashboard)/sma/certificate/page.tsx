'use client';

import React from 'react';
import styles from './page.module.css';

const MOCK_CERTIFICATES = [
  { id: 1, title: 'HTML Basics', issuer: 'House of Tech', date: '10 Sep 2026', type: 'SBT On-Chain' },
  { id: 2, title: 'Python Logic', issuer: 'Algorithm Core', date: '12 Sep 2026', type: 'SBT On-Chain' }
];

import { useMapStore } from '@/store/useMapStore';

export default function CertificateHubPage() {
  const completedDynamicNodes = useMapStore(state => state.completedDynamicNodes);

  // Generate earned certificates dynamically based on completed Boss levels
  const earnedCertificates = [];
  
  if (completedDynamicNodes.includes('module-html-css-level-6')) {
    earnedCertificates.push({
      id: 'html-css',
      title: 'HTML & CSS Mastery',
      issuer: 'House of Tech',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      type: 'SBT On-Chain'
    });
  }

  // Add more dynamic checks here for other modules as they are created
  if (completedDynamicNodes.includes('module-javascript-level-6')) {
    earnedCertificates.push({
      id: 'javascript',
      title: 'Javascript Mastery',
      issuer: 'House of Logic',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      type: 'SBT On-Chain'
    });
  }

  const handleExplorerClick = (title: string) => {
    alert(`[Simulasi Web3] Membuka Blockchain Explorer untuk memverifikasi keaslian Sertifikat On-Chain (SBT): ${title}...`);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div>
        <h2 className={styles.headerTitle}>RELICS & TREASURES (WEB3 VAULT)</h2>
        <p className={styles.headerDesc}>
          Lihat dan verifikasi sertifikat On-Chain (SBT) yang berhasil kamu dapatkan setelah menaklukkan Boss Modul.
        </p>
      </div>

      <div className={styles.grid}>
        {earnedCertificates.length > 0 ? (
          earnedCertificates.map(cert => (
            <div key={cert.id} className={styles.certCard}>
              <div className={styles.certHeader}>
                <div className={styles.certIcon}>🏆</div>
                <div className={styles.certInfo}>
                  <h3 className={styles.certTitle}>{cert.title}</h3>
                  <p className={styles.certIssuer}>{cert.issuer}</p>
                </div>
              </div>
              
              <div className={styles.certMeta}>
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>DATE ISSUED</span>
                  <span className={styles.metaValue}>{cert.date}</span>
                </div>
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>ASSET TYPE</span>
                  <span className={styles.metaBadge}>{cert.type}</span>
                </div>
              </div>

              <button 
                className={styles.explorerBtn}
                onClick={() => handleExplorerClick(cert.title)}
              >
                VIEW ON EXPLORER
              </button>
            </div>
          ))
        ) : (
          <div style={{ color: '#a8a29e', fontFamily: '"Press Start 2P"', fontSize: '0.7rem', gridColumn: '1 / -1', textAlign: 'center', marginTop: '48px', lineHeight: '1.6' }}>
            Kamu belum mendapatkan relic apapun. <br/><br/>Kalahkan Boss Modul untuk mencetak (minting) Sertifikat pertamamu!
          </div>
        )}
      </div>
    </div>
  );
}
