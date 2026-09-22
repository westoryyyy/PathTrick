'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import styles from './page.module.css';

export default function ProfilePage() {
  const router = useRouter();
  const { user } = usePrivy();
  
  const [name, setName] = useState('Tukiman');
  const [email, setEmail] = useState(user?.email?.address || 'D.Tukiman@gmail.com');
  const [password, setPassword] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    
    setIsSaving(true);
    // Simulate network request
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      
      // Reset saved state after 2 seconds
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
            <label className={styles.label}>EMAIL ADDRESS</label>
            <input 
              type="email" 
              className={styles.input} 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>NEW PASSWORD</label>
            <input 
              type="password" 
              className={styles.input} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password (optional)"
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
