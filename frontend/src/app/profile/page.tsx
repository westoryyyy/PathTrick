'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useUserStore } from '@/store/useUserStore';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { getAuthHeaders } from '@/hooks/useAuthSync';
import { API_BASE_URL } from '@/config/pathtrick';
import styles from './page.module.css';

export default function ProfilePage() {
  const router = useRouter();
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const { displayName: savedName, avatarUrl, setProfile, setAvatar } = useUserStore();
  const role = useOnboardingStore((s) => s.selectedRole);

  // Priority: 1. Auto-detected from Privy, 2. Saved in Zustand
  const privyName = user?.google?.name || user?.email?.address?.split('@')[0] || '';
  const privyEmail = user?.google?.email || user?.email?.address || '';

  const [name, setName] = useState(savedName || privyName);

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const avatarOptions = ['/char_dreamer.png', '/char_chaser.png', '/char_scholar.png', '/Main Character.png'];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const headers = getAuthHeaders();
      console.log('[Profile] Saving name:', name.trim(), '| has token:', !!headers['Authorization']);

      const body: Record<string, string> = { name: name.trim() };
      // Hanya kirim walletAddress jika ada dan valid; jangan kirim string kosong
      if (wallets[0]?.address && /^0x[a-fA-F0-9]{40}$/.test(wallets[0].address)) body.walletAddress = wallets[0].address;

      const res = await fetch(`${API_BASE_URL}/api/users/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(body),
      });

      const rawText = await res.text();
      let data: any = {};
      try { data = JSON.parse(rawText); } catch(e) {}
      
      console.log('[Profile] API response:', res.status, rawText);

      if (!res.ok) {
        console.error('[Profile] Failed to save:', rawText, data);
        alert(`Failed to save profile (HTTP ${res.status}):\n${data.message || data.error || rawText}`);
      } else {
        setProfile(name.trim(), privyEmail);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      }
    } catch (error) {
      console.error('[Profile] Network error:', error);
    } finally {
      setIsSaving(false);
    }
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
              <Image src={avatarUrl} alt="Current avatar" width={96} height={96} />
            </div>
            <button type="button" className={styles.changeAvatarBtn} onClick={() => setIsAvatarPickerOpen(true)}>
              CHANGE AVATAR
            </button>
          </div>

          {isAvatarPickerOpen && (
            <div className={styles.avatarModalBackdrop} role="presentation" onClick={() => setIsAvatarPickerOpen(false)}>
              <div className={styles.avatarModal} role="dialog" aria-modal="true" aria-labelledby="avatar-picker-title" onClick={(event) => event.stopPropagation()}>
                <h2 id="avatar-picker-title">CHOOSE YOUR AVATAR</h2>
                <div className={styles.avatarGrid}>
                  {avatarOptions.map((avatar) => (
                    <button
                      type="button"
                      key={avatar}
                      className={`${styles.avatarOption} ${avatarUrl === avatar ? styles.avatarOptionSelected : ''}`}
                      onClick={() => {
                        setAvatar(avatar);
                        setIsAvatarPickerOpen(false);
                      }}
                    >
                      <Image src={avatar} alt="" width={72} height={72} />
                    </button>
                  ))}
                </div>
                <button type="button" className={styles.changeAvatarBtn} onClick={() => setIsAvatarPickerOpen(false)}>
                  CLOSE
                </button>
              </div>
            </div>
          )}

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
              value={privyEmail} 
              disabled
              style={{ opacity: 0.7, cursor: 'not-allowed' }}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>WEB3 WALLET ADDRESS</label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input 
                type="text" 
                className={styles.input} 
                value={wallets[0]?.address || 'No wallet detected'} 
                disabled
                style={{ opacity: 0.7, cursor: 'not-allowed', flex: 1 }}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>CURRENT ROLE</label>
            <input 
              type="text" 
              className={styles.input} 
              value={role === 'dreamer' ? 'Siswa SMA (The Dreamer)' : role === 'chaser' ? 'Mahasiswa (The Chaser)' : 'Belum dipilih'}
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
