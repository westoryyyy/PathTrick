'use client';

import React from 'react';
import styles from './OnChainCertificates.module.css';
import { useMapStore } from '@/store/useMapStore';

type Props = {
  hideHeader?: boolean;
};

export default function OnChainCertificates({ hideHeader = false }: Props = {}) {
  const completedDynamicNodes = useMapStore(state => state.completedDynamicNodes);

  // Generate earned certificates dynamically based on completed Boss levels
  const earnedCertificates = [];
  
  if (completedDynamicNodes.includes('module-html-css-level-6') || completedDynamicNodes.includes('module-framer-bab-1-level-1')) {
    earnedCertificates.push({
      id: 'html-css',
      title: 'Tech Basics Mastery',
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%', marginBottom: '32px' }}>
      {!hideHeader && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontFamily: '"Press Start 2P"', fontSize: '1.5rem', color: '#fff', textShadow: '2px 2px 0 #3b261b' }}>
            ON-CHAIN CERTIFICATES
          </h2>
          <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#d4d4d8', lineHeight: '1.6' }}>
            Lihat dan verifikasi sertifikat (SBT) yang berhasil kamu dapatkan setelah menaklukkan Boss Modul.
          </p>
        </div>
      )}

      <div className={styles.grid}>
        {earnedCertificates.length > 0 ? (
          earnedCertificates.map(cert => (
            <div key={cert.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#3b261b', padding: '16px', borderRadius: '16px', border: '4px solid #5a3a29' }}>
              {/* Certificate Image Container */}
              <div style={{ 
                position: 'relative', 
                width: '100%', 
                aspectRatio: '1.414', // Landscape standard ratio
                borderRadius: '8px', 
                overflow: 'hidden',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
                backgroundColor: '#f5f5f5'
              }}>
                <img 
                  src="/certificate-template.png" 
                  alt="Certificate Template" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} 
                />
                
                {/* Text Overlay */}
                <div style={{
                  position: 'absolute', 
                  top: 0, left: 0, width: '100%', height: '100%',
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  padding: '10%',
                  textAlign: 'center',
                  zIndex: 2
                }}>
                  <h3 style={{ 
                    fontFamily: '"Press Start 2P", monospace', 
                    fontSize: 'clamp(0.6rem, 2vw, 1.2rem)', 
                    color: '#1a1a1a', 
                    marginBottom: '8px',
                    textShadow: '1px 1px 0 rgba(255,255,255,0.8)'
                  }}>
                    {cert.title}
                  </h3>
                  <p style={{ 
                    fontFamily: 'sans-serif', 
                    fontSize: 'clamp(0.5rem, 1.5vw, 1rem)', 
                    color: '#333', 
                    fontWeight: 'bold' 
                  }}>
                    Awarded to Scholar
                  </p>
                  
                  <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <p style={{ fontFamily: 'monospace', fontSize: 'clamp(0.4rem, 1vw, 0.7rem)', color: '#444', fontWeight: 'bold' }}>
                      DATE: {cert.date}
                    </p>
                    <p style={{ fontFamily: 'monospace', fontSize: 'clamp(0.4rem, 1vw, 0.7rem)', color: '#444', fontWeight: 'bold' }}>
                      ISSUER: {cert.issuer}
                    </p>
                  </div>
                </div>
              </div>
              
              <button 
                className={styles.explorerBtn}
                onClick={() => handleExplorerClick(cert.title)}
                style={{ width: '100%', padding: '16px', fontFamily: '"Press Start 2P"', fontSize: '0.6rem', background: '#fbbf24', border: '4px solid #b45309', color: '#451a03', cursor: 'pointer' }}
              >
                VIEW ON EXPLORER
              </button>
            </div>
          ))
        ) : (
          <div style={{ color: '#a8a29e', fontFamily: '"Press Start 2P"', fontSize: '0.7rem', gridColumn: '1 / -1', textAlign: 'center', marginTop: '16px', lineHeight: '1.6', background: 'rgba(0,0,0,0.2)', padding: '24px', border: '2px dashed #5a3a29' }}>
            Belum ada sertifikat On-Chain yang tercetak. <br/><br/>Kalahkan Boss Modul untuk melakukan minting (pencetakan) sertifikat pertamamu!
          </div>
        )}
      </div>
    </div>
  );
}
