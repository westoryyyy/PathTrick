'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import Image from 'next/image';

interface WalletPanelProps {
  walletAddress?: string;
  onClose: () => void;
}

export default function WalletPanel({ walletAddress, onClose }: WalletPanelProps) {
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const fetchBalance = useCallback(async () => {
    if (!walletAddress) return;
    setIsLoadingBalance(true);
    setIsSpinning(true);
    try {
      const res = await fetch('https://bsc-testnet-rpc.publicnode.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_getBalance', params: [walletAddress, 'latest'], id: 1 }),
      });
      const data = await res.json();
      if (data?.result) {
        const weiStr = data.result;
        // Gunakan BigInt untuk menghindari kehilangan presisi (MAX_SAFE_INTEGER)
        const wei = BigInt(weiStr);
        // Konversi ke BNB: bagi dengan 10^14 untuk dapatkan nilai dengan 4 angka desimal, lalu ubah ke float
        const bnbVal = Number(wei / 100000000000000n) / 10000;
        setBalance(bnbVal.toFixed(4));
      } else {
        console.error("RPC Error:", data);
        setBalance('0.0000');
      }
    } catch (e) {
      console.error("Fetch Error:", e);
      setBalance('0.0000');
    } finally {
      setIsLoadingBalance(false);
      setTimeout(() => setIsSpinning(false), 500);
    }
  }, [walletAddress]);

  useEffect(() => { fetchBalance(); }, [fetchBalance]);

  const handleCopy = () => {
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isEmpty = !balance || balance === '0.0000';

  if (!isMounted) return null;

  const modalContent = (
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          backdropFilter: isVisible ? 'blur(8px) brightness(0.45)' : 'blur(0px) brightness(1)',
          WebkitBackdropFilter: isVisible ? 'blur(8px) brightness(0.45)' : 'blur(0px) brightness(1)',
          background: isVisible ? 'rgba(10,5,2,0.55)' : 'transparent',
          transition: 'backdrop-filter 0.35s ease, background 0.35s ease',
        }}
      />

      {/* MODAL */}
      <div
        style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: isVisible ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -48%) scale(0.9)',
          opacity: isVisible ? 1 : 0,
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease',
          zIndex: 201, width: '460px',
          maxWidth: 'calc(100vw - 32px)',
          maxHeight: 'calc(100vh - 64px)',
          overflowY: 'auto',
          background: 'linear-gradient(160deg, #1a0f0a 0%, #2d1a10 55%, #1e1008 100%)',
          border: '4px solid #8b5a2b', borderRadius: '16px',
          boxShadow: '0 0 0 2px #c8a96e, 0 0 0 6px rgba(139,90,43,0.25), 0 32px 80px rgba(0,0,0,0.85)',
        }}
      >
        {/* HEADER */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px 14px', borderBottom: '2px solid #3d2214',
          background: 'linear-gradient(90deg, #2d1a10, #3d2214, #2d1a10)',
          position: 'sticky', top: 0, zIndex: 1,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#3d2214', border: '2px solid #8b5a2b', borderRadius: '8px', padding: '6px', display: 'flex' }}>
              <Image src="/Open Wallet.png" alt="Wallet" width={32} height={32} style={{ imageRendering: 'pixelated' }} />
            </div>
            <div>
              <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.9rem', color: '#fbbf24', margin: 0 }}>WALLET</p>
              <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.5rem', color: '#a0845c', margin: '6px 0 0' }}>BSC Testnet · tBNB</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={fetchBalance} disabled={isLoadingBalance} title="Refresh"
              style={{ background: '#3d2214', border: '2px solid #5a3520', borderRadius: '8px', color: '#c8a96e', cursor: 'pointer', padding: '8px 10px', fontSize: '1rem', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#5a3520'; }} onMouseLeave={e => { e.currentTarget.style.background = '#3d2214'; }}>
              <span style={{ display: 'inline-block', animation: isSpinning ? 'spinAnim 0.6s linear' : 'none' }}>↻</span>
            </button>
            <button onClick={onClose} title="Tutup (ESC)"
              style={{ background: '#3d2214', border: '2px solid #5a3520', borderRadius: '8px', color: '#c8a96e', cursor: 'pointer', padding: '8px 11px', fontSize: '1rem', lineHeight: 1, transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#7f1d1d'; e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#fca5a5'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#3d2214'; e.currentTarget.style.borderColor = '#5a3520'; e.currentTarget.style.color = '#c8a96e'; }}>✕</button>
          </div>
        </div>

        {/* BALANCE */}
        <div style={{ padding: '20px 20px 14px' }}>
          <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.55rem', color: '#78563a', margin: '0 0 12px', letterSpacing: '0.08em' }}>tBNB BALANCE</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <p style={{ fontFamily: '"Press Start 2P"', fontSize: '2.8rem', color: isLoadingBalance ? '#78563a' : '#fbbf24', margin: 0, letterSpacing: '-2px', textShadow: '0 0 30px rgba(251,191,36,0.4)', transition: 'color 0.3s' }}>
              {isLoadingBalance ? '···' : (balance ?? '0')}
            </p>
            <div style={{ background: 'linear-gradient(135deg, #3d2214, #5a3520)', border: '2px solid #78350f', borderRadius: '8px', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'radial-gradient(circle, #fbbf24, #f59e0b)', boxShadow: '0 0 8px #f59e0b' }} />
              <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.55rem', color: '#fbbf24' }}>tBNB</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
            <span style={{ fontSize: '0.9rem' }}>⛽</span>
            <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.45rem', color: '#6b7280', margin: 0 }}>Also pays network fees</p>
          </div>
        </div>

        <div style={{ margin: '0 20px', height: '1px', background: 'linear-gradient(90deg, transparent, #3d2214 30%, #3d2214 70%, transparent)' }} />

        {/* CONNECTED WALLET */}
        <div style={{ padding: '16px 20px' }}>
          <div style={{ background: '#0d0702', border: '2px solid #3d2214', borderRadius: '10px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.45rem', color: '#6b7280', margin: '0 0 10px' }}>CONNECTED WALLET</p>
              <p style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#d1d5db', margin: 0, wordBreak: 'break-all', lineHeight: 1.6 }}>{walletAddress || '—'}</p>
            </div>
            {walletAddress && (
              <button onClick={handleCopy} title={copied ? 'Tersalin!' : 'Salin'}
                style={{ flexShrink: 0, background: copied ? 'linear-gradient(135deg, #14532d, #166534)' : 'linear-gradient(135deg, #3d2214, #5a3520)', border: `2px solid ${copied ? '#22c55e' : '#78350f'}`, borderRadius: '8px', padding: '12px 14px', cursor: 'pointer', fontSize: '1.2rem', transition: 'all 0.25s', color: copied ? '#22c55e' : '#c8a96e', boxShadow: copied ? '0 0 12px rgba(34,197,94,0.3)' : 'none' }}>
                {copied ? '✓' : '⧉'}
              </button>
            )}
          </div>
        </div>



        {/* CLAIM FREE tBNB */}
        <div style={{ margin: '0 20px 16px', background: 'linear-gradient(135deg, #1a0f0a, #2d1a10)', border: '2px dashed #8b5a2b', borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ fontSize: '1.4rem' }}>🪙</span>
            <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.55rem', color: '#fbbf24', margin: 0, lineHeight: 1.7 }}>{isEmpty ? 'Wallet kosong — klaim tBNB gratis' : 'Dapatkan lebih banyak tBNB gratis'}</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <a href="https://t.me/bnbchain_official_bot" target="_blank" rel="noopener noreferrer"
              style={{ flex: 1, background: 'linear-gradient(135deg, #3d2214, #5a3520)', border: '2px solid #78350f', borderRadius: '8px', padding: '14px 10px', color: '#c8a96e', fontFamily: '"Press Start 2P"', fontSize: '0.5rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s', lineHeight: 1.7 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#fbbf24'; e.currentTarget.style.color = '#fbbf24'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#78350f'; e.currentTarget.style.color = '#c8a96e'; }}>
              🚰 BNB Faucet ↗
            </a>
            <a href="https://t.me/faucet_trade_bot" target="_blank" rel="noopener noreferrer"
              style={{ flex: 1, background: 'linear-gradient(135deg, #3d2214, #5a3520)', border: '2px solid #78350f', borderRadius: '8px', padding: '14px 10px', color: '#c8a96e', fontFamily: '"Press Start 2P"', fontSize: '0.5rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s', lineHeight: 1.7 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#fbbf24'; e.currentTarget.style.color = '#fbbf24'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#78350f'; e.currentTarget.style.color = '#c8a96e'; }}>
              ✈ Telegram Bot ↗
            </a>
          </div>
          <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.45rem', color: '#a0845c', margin: '14px 0 0', lineHeight: 1.9, textAlign: 'center' }}>
            Paste alamat walletmu untuk klaim. Butuh ~1 menit.
          </p>
        </div>

        {/* FOOTER */}
        {walletAddress && (
          <div style={{ borderTop: '2px solid #3d2214', padding: '16px 20px', display: 'flex', justifyContent: 'center' }}>
            <a href={`https://testnet.bscscan.com/address/${walletAddress}`} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: '"Press Start 2P"', fontSize: '0.45rem', color: '#a0845c', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', transition: 'color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fbbf24'; }} onMouseLeave={e => { e.currentTarget.style.color = '#a0845c'; }}>
              🔍 Lihat di BSCScan Testnet ↗
            </a>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spinAnim { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}} />
    </>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
