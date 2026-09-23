'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useUserStore } from '@/store/useUserStore';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import styles from './page.module.css';

export default function ProfilePage() {
  const router = useRouter();
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const { displayName: savedName, setProfile } = useUserStore();
  const role = useOnboardingStore((s) => s.role);

  // Priority: 1. Auto-detected from Privy, 2. Saved in Zustand
  const privyName = user?.google?.name || user?.email?.address?.split('@')[0] || '';
  const privyEmail = user?.google?.email || user?.email?.address || '';

  const [name, setName] = useState(savedName || privyName);

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    
    setIsSaving(true);
    setTimeout(() => {
      setProfile(name, privyEmail); // Persist to Zustand (localStorage)
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }, 800);
  };

  return (
    <div className={styles.page}>
      <div className={styles.boardContainer}>
        
        {/* Wooden Board Header */}
        <div className={styles.boardHeader}>
          <button onClick={() => router.back()} className={styles.backBtn}>
            ◀ BACK
          </button>
          <h1 className={styles.boardTitle}>EDIT PROFILE</h1>
          <div style={{ width: '100px' }}></div> {/* Spacer for centering */}
        </div>

        <form className={styles.boardContent} onSubmit={handleSave}>
          <div className={styles.profileAvatarSection}>
            <div className={styles.avatar}>
              👨‍🎓
            </div>
            <button type="button" className={styles.changeAvatarBtn} onClick={() => alert('Avatar selection opened!')}>
              CHANGE AVATAR
            </button>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>NICKNAME</label>
            <input 
              type="text" 
              className={styles.input} 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your nickname"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>EMAIL ADDRESS (Verified via {user?.google ? 'Google' : 'OTP'})</label>
            <input 
              type="email" 
              className={styles.input} 
              value={privyEmail} 
              disabled
              style={{ opacity: 0.7, cursor: 'not-allowed' }}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>WEB3 WALLET ADDRESS</label>
            <input 
              type="text" 
              className={styles.input} 
              value={wallets[0]?.address || 'No wallet detected'} 
              disabled
              style={{ opacity: 0.7, cursor: 'not-allowed' }}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>CURRENT ROLE</label>
            <input 
              type="text" 
              className={styles.input} 
              value={role === 'sma' ? 'Siswa SMA (The Dreamer)' : 'Mahasiswa (The Chaser)'} 
              disabled
              style={{ opacity: 0.7, cursor: 'not-allowed' }}
            />
          </div>

          <button 
            type="submit" 
            className={`${styles.saveBtn} ${isSaved ? styles.saved : ''}`}
            disabled={isSaving}
          >
            {isSaving ? 'SAVING...' : isSaved ? 'SAVED!' : 'SAVE CHANGES'}
          </button>
        </form>
      </div>
    </div>
  );
}
