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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Profile updated! (Simulation)');
  };

  return (
    <div className={styles.layout}>
      <div className={styles.headerContainer}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          ◀ BACK
        </button>
        <h1 className={styles.pageTitle}>EDIT PROFILE</h1>
        <div style={{ width: '80px' }}></div> {/* Spacer for centering */}
      </div>

      <form className={styles.formCard} onSubmit={handleSave}>
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

        <button type="submit" className={styles.saveBtn}>
          SAVE CHANGES
        </button>
      </form>
    </div>
  );
}
