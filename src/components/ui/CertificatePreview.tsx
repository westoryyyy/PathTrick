'use client';

import React from 'react';
import Image from 'next/image';

interface CertificatePreviewProps {
  userName: string;
  moduleName: string;
  walletAddress: string;
  date: string;
  isMinted?: boolean;
}

export default function CertificatePreview({
  userName,
  moduleName,
  walletAddress,
  date,
  isMinted = true
}: CertificatePreviewProps) {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      aspectRatio: '6250 / 4419',
      overflow: 'hidden',
      border: '4px solid #e8c98a',
      boxShadow: '0 0 0 4px #3b1f0e',
      backgroundColor: '#f5f5f5',
      filter: isMinted ? 'none' : 'grayscale(100%) brightness(0.7)',
      transition: 'filter 0.5s ease',
      containerType: 'inline-size'
    }}>
      <Image
        src="/pathtrick-certificate-blank.png"
        alt="PathTrick Certificate"
        fill
        style={{ objectFit: 'cover' }}
      />
      
      {/* Name Overlay - Centered exactly in the top gap */}
      <div style={{
        position: 'absolute', top: '44%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%', textAlign: 'center', zIndex: 2
      }}>
        <h1 style={{ 
          fontFamily: '"Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande", "Lucida Sans", Arial, sans-serif', 
          fontWeight: 700,
          fontSize: '4.1cqw', 
          color: '#1f2937', 
          letterSpacing: '0.02em',
          margin: 0
        }}>
          {userName}
        </h1>
      </div>

      {/* Module Name Overlay - Centered exactly in the middle gap */}
      <div style={{
        position: 'absolute', top: '55.5%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%', textAlign: 'center', zIndex: 2
      }}>
        <h2 style={{ 
          fontFamily: '"Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande", "Lucida Sans", Arial, sans-serif', 
          fontWeight: 700,
          fontSize: '3cqw', 
          color: '#1f2937',
          margin: 0,
          letterSpacing: '0.05em'
        }}>
          {moduleName.toUpperCase()}
        </h2>
      </div>
      
      {/* Footer Details - Individually positioned to align with baked-in labels */}
      <div style={{
        position: 'absolute', top: '70.5%', left: '42.5%',
        transform: 'translateY(-50%)', zIndex: 2
      }}>
        <p style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '600', fontSize: '1.5cqw', color: '#1f2937', margin: 0, letterSpacing: '0.05em' }}>
          {walletAddress}
        </p>
      </div>

      <div style={{
        position: 'absolute', top: '75%', left: '42.5%',
        transform: 'translateY(-50%)', zIndex: 2
      }}>
        <p style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '600', fontSize: '1.5cqw', color: '#1f2937', margin: 0, letterSpacing: '0.05em' }}>
          {date}
        </p>
      </div>

      <div style={{
        position: 'absolute', top: '79.5%', left: '42.5%',
        transform: 'translateY(-50%)', zIndex: 2
      }}>
        <p style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '600', fontSize: '1.5cqw', color: '#1f2937', margin: 0, letterSpacing: '0.05em' }}>
          {isMinted ? 'MINTED' : 'PENDING'}
        </p>
      </div>
      
      {/* Lock overlay if not minted */}
      {!isMinted && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 3, fontSize: 'clamp(2rem, 10vw, 5rem)',
          textShadow: '0px 0px 10px rgba(0,0,0,0.8)'
        }}>
          🔒
        </div>
      )}
    </div>
  );
}
