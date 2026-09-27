'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { AnimatePresence, motion } from 'framer-motion';

export default function LevelUpModal() {
  const { level, hasJustLeveledUp, clearLevelUpFlag } = useUserStore();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (hasJustLeveledUp) {
      setShow(true);
      // Play a sound if available (optional)
      try {
        const audio = new Audio('/level up badge.ogg');
        audio.volume = 0.5;
        audio.play().catch(() => {});
      } catch (e) {
        // ignore
      }
    }
  }, [hasJustLeveledUp]);

  const handleClose = () => {
    setShow(false);
    clearLevelUpFlag();
  };

  return (
    <AnimatePresence>
      {show && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(60, 30, 10, 0.4)',
          backdropFilter: 'blur(6px)',
          zIndex: 99999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px'
        }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -20 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            style={{
              width: '100%', 
              maxWidth: '600px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '24px', 
              background: '#fdf6e3', 
              border: '4px dashed #059669', 
              padding: '48px 32px', 
              borderRadius: '16px', 
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }}
          >
            <h2 style={{ 
              color: '#059669', 
              textAlign: 'center', 
              fontFamily: '"Pixelify Sans", sans-serif', 
              fontSize: '1.4rem', 
              lineHeight: '1.6',
              margin: 0
            }}>
              LEVEL UP!
            </h2>
            
            <p style={{ 
              textAlign: 'center', 
              fontFamily: '"Pixelify Sans", sans-serif', 
              fontSize: '1.1rem', 
              lineHeight: '1.6',
              color: '#3b261b',
              margin: 0
            }}>
              Luar biasa, Ksatria! Kamu telah berhasil mencapai Level {level}.
            </p>

            <img 
              src="/levelup new.gif" 
              alt="Level Up Animation" 
              style={{ 
                width: '180px', 
                height: '180px', 
                objectFit: 'contain',
                pointerEvents: 'none',
              }} 
            />

            <p style={{ 
              fontFamily: '"Press Start 2P"',
              marginTop: '12px', 
              fontSize: '0.65rem', 
              color: '#92400e',
              textAlign: 'center',
              lineHeight: '1.6',
              margin: 0
            }}>
              Kekuatanmu semakin bertambah!
            </p>

            <button 
              onClick={handleClose}
              style={{
                marginTop: '16px',
                width: '100%',
                maxWidth: '400px',
                padding: '18px 28px',
                fontSize: '1.2rem',
                fontFamily: '"Pixelify Sans", sans-serif',
                backgroundColor: '#4ade80',
                border: '4px solid #166534',
                color: '#064e3b',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: 'inset -4px -4px 0px 0px rgba(0,0,0,0.2)',
                textShadow: '1px 1px 0px rgba(255,255,255,0.4)',
                transition: 'transform 0.1s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#22c55e';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#4ade80';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.95)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              LANJUTKAN PETUALANGAN
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
