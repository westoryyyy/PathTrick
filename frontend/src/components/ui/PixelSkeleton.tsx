'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Skeleton loaders that mirror the loading style of THE VAULT card
 * (Learning Progress): pulsing dark-wood blocks with pixel borders.
 */

const pulse = (delay = 0) => ({
  animate: { opacity: [0.5, 1, 0.5] },
  transition: { duration: 1.5, repeat: Infinity, delay },
});

const bar = (width: string, height = '14px'): React.CSSProperties => ({
  height,
  width,
  background: '#3b261b',
  borderRadius: '2px',
});

/** Single pulsing block (header strip, big panel, etc). */
export function PixelSkeletonBlock({
  height = '24px',
  delay = 0,
  inset = false,
  style,
}: {
  height?: string;
  delay?: number;
  inset?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      {...pulse(delay)}
      aria-hidden="true"
      style={{
        height,
        background: inset ? '#3b261b' : '#2a1f1a',
        border: '2px solid #5a3a29',
        borderRadius: '4px',
        boxShadow: inset ? 'inset 2px 2px 4px rgba(0,0,0,0.5)' : undefined,
        ...style,
      }}
    />
  );
}

/** Vault-style list rows: icon square + two text bars. */
export function PixelSkeletonRows({ count = 3, delay = 0 }: { count?: number; delay?: number }) {
  return (
    <div role="status" aria-label="Loading" style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
      {Array.from({ length: count }, (_, i) => (
        <motion.div
          key={i}
          {...pulse(delay + (i + 1) * 0.1)}
          style={{
            background: 'rgba(0,0,0,0.2)',
            border: '2px solid #5a3a29',
            padding: '12px',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
          }}
        >
          <div style={{ width: '48px', height: '48px', flexShrink: 0, background: '#3b261b', border: '2px solid #5a3a29', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={bar('80%')} />
            <div style={bar('60%', '10px')} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/** Vault-style card body: header strip + rows + inset panel. Fits any retroCard. */
export function PixelSkeletonCardBody({ rows = 3, panelHeight = '120px' }: { rows?: number; panelHeight?: string }) {
  return (
    <div role="status" aria-label="Loading" style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
      <PixelSkeletonBlock height="24px" />
      <PixelSkeletonRows count={rows} />
      <PixelSkeletonBlock height={panelHeight} inset delay={0.3} />
    </div>
  );
}

/** Grid of hub cards (University / Scholarship hubs). */
export function PixelSkeletonCardGrid({ count = 6 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', width: '100%' }}
    >
      {Array.from({ length: count }, (_, i) => (
        <motion.div
          key={i}
          {...pulse(i * 0.1)}
          style={{
            background: '#2a1f1a',
            border: '4px solid #5a3a29',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '4px 4px 0 rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ width: '100%', aspectRatio: '16/9', background: '#3b261b', border: '3px solid #5a3a29', boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.5)' }} />
          <div style={bar('70%', '16px')} />
          <div style={bar('50%', '12px')} />
          <div style={{ background: 'rgba(0,0,0,0.2)', border: '2px solid #5a3a29', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={bar('90%', '12px')} />
            <div style={bar('75%', '12px')} />
            <div style={bar('60%', '12px')} />
          </div>
          <div style={{ height: '48px', background: '#3b261b', border: '2px solid #5a3a29' }} />
        </motion.div>
      ))}
    </div>
  );
}

/** Grid of relic/badge tiles (Relics & Treasures). */
export function PixelSkeletonTileGrid({ count = 8 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px', width: '100%', marginTop: '8px' }}
    >
      {Array.from({ length: count }, (_, i) => (
        <motion.div
          key={i}
          {...pulse(i * 0.08)}
          style={{
            background: '#2a1f1a',
            border: '4px solid #5a3a29',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '4px 4px 0 rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ width: '64px', height: '64px', background: '#3b261b', border: '2px solid #5a3a29', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }} />
          <div style={bar('70%')} />
          <div style={bar('50%', '10px')} />
        </motion.div>
      ))}
    </div>
  );
}
