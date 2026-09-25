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
          backgroundColor: 'rgba(0,0,0,0.85)',
          zIndex: 99999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }} onClick={handleClose}>
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -20 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
              style={{ textAlign: 'center', marginBottom: '20px' }}
            >
              <h1 style={{ 
                fontFamily: '"Pixelify Sans", sans-serif', 
                fontSize: '5rem', 
                color: '#fbbf24', 
                margin: 0,
                WebkitTextStroke: '3px #b45309',
                textShadow: '0 8px 16px rgba(0,0,0,0.8)'
              }}>
                LEVEL {level}
              </h1>
            </motion.div>

            <img 
              src="/Level Up.gif" 
              alt="Level Up Animation" 
              style={{ 
                width: '400px', 
                height: '400px', 
                objectFit: 'contain',
                pointerEvents: 'none',
                filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.3))'
              }} 
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.5, 1] }}
              transition={{ delay: 2.5, duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ marginTop: '20px' }}
            >
              <p style={{ 
                fontFamily: '"Pixelify Sans", sans-serif', 
                color: '#fbbf24', 
                fontSize: '1.2rem', 
                margin: 0,
                letterSpacing: '0.1em',
                textShadow: '0 2px 4px rgba(0,0,0,0.8)'
              }}>
                - KLIK UNTUK MELANJUTKAN -
              </p>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
