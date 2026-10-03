'use client';

import React, { useState } from 'react';
import { PATHTRICK_SBT_ADDRESS } from '@/config/pathtrick';
import { openCertificatePdf, type CertificatePdfData } from '@/lib/certificatePdf';

interface CertificateActionsProps {
  certificate: CertificatePdfData;
  /** Full wallet address of the holder, used for the BscScan link. */
  holderAddress?: string;
  /** Mint transaction hash, if known. Takes priority for the BscScan link. */
  txHash?: string;
  style?: React.CSSProperties;
}

const baseBtn: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  padding: '14px 12px',
  fontFamily: '"Pixelify Sans", sans-serif',
  fontSize: '1.05rem',
  fontWeight: 700,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  borderRadius: '4px',
  cursor: 'pointer',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
};

export function getCertificateExplorerUrl(holderAddress?: string, txHash?: string) {
  if (txHash) return `https://testnet.bscscan.com/tx/${txHash}`;
  if (holderAddress) return `https://testnet.bscscan.com/token/${PATHTRICK_SBT_ADDRESS}?a=${holderAddress}`;
  return `https://testnet.bscscan.com/token/${PATHTRICK_SBT_ADDRESS}`;
}

/** Actions shown once a certificate is already recorded on-chain: view PDF or verify on BscScan. */
export default function CertificateActions({ certificate, holderAddress, txHash, style }: CertificateActionsProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handlePdf = async () => {
    if (isGenerating) return;
    setError('');
    setIsGenerating(true);
    try {
      await openCertificatePdf(certificate);
    } catch (e) {
      console.error('Certificate PDF failed:', e);
      setError('PDF gagal dibuat. Coba lagi.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', ...style }}>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={handlePdf}
          disabled={isGenerating}
          style={{
            ...baseBtn,
            color: '#451a03',
            background: '#fbbf24',
            border: '3px solid #b45309',
            boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.4), 0 5px 0 #78350f',
            opacity: isGenerating ? 0.75 : 1,
            cursor: isGenerating ? 'wait' : 'pointer',
          }}
        >
          {isGenerating ? 'MEMBUAT PDF...' : '📄 LIHAT PDF'}
        </button>
        <a
          href={getCertificateExplorerUrl(holderAddress, txHash)}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ...baseBtn,
            color: '#dcfce7',
            background: '#16a34a',
            border: '3px solid #14532d',
            boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.25), 0 5px 0 #14532d',
          }}
        >
          🔍 LIHAT DI BSCSCAN
        </a>
      </div>
      {error && (
        <p style={{ margin: 0, color: '#fca5a5', fontFamily: '"Pixelify Sans", sans-serif', fontSize: '0.9rem', textAlign: 'center' }}>
          {error}
        </p>
      )}
    </div>
  );
}
