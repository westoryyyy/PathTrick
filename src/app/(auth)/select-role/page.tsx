'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useOnboardingStore, type UserRole } from '@/store/useOnboardingStore';
import styles from './page.module.css';

const ROLES = [
  { id: 'sma',       role: 'The Dreamer', title: 'Siswa SMA',              img: '/NPC High School Student.png', color: '#a855f7', glow: 'rgba(168,85,247,0.5)', desc: 'Masih SMA & bingung mau kuliah apa? Temukan jurusan & karier sesuai bakatmu.',              perks: ['Asesmen Minat & Bakat', 'Tes RIASEC', 'Rekomendasi Jurusan', 'Info Beasiswa'],         tag: 'POPULER' },
  { id: 'mahasiswa', role: 'The Chaser',  title: 'Mahasiswa / Fresh Grad', img: '/NPC University Student.png',   color: '#f59e0b', glow: 'rgba(245,158,11,0.5)', desc: 'Mahasiswa atau baru lulus? Upload CV-mu dan biarkan AI membuatkan roadmap kariermu.',       perks: ['Asesmen Karier AI', 'CV Analysis', 'Job Matching', 'Career Roadmap'],                  tag: null      },
];

export default function SelectRolePage() {
  const router = useRouter();
  const setRole = useOnboardingStore((s) => s.setRole);
  const [selected, setSelected] = useState<string | null>(null);
  const [entering, setEntering] = useState(false);

  const handleContinue = () => {
    if (!selected) return;
    setEntering(true);
    setRole(selected as UserRole);
    setTimeout(() => router.push('/assessment'), 1200);
  };

  return (
    <div className={styles.page}>


      <div className={styles.boardContainer}>
        {/* Wooden Board Header */}
        <div className={styles.boardHeader}>
          <h1 className={styles.boardTitle}>Pilih Role Anda</h1>
        </div>

        {/* Board Content (The Two Panels) */}
        <div className={styles.boardContent}>
          {ROLES.map((role) => {
            const isSelected = selected === role.id;

            return (
              <div key={role.id} className={styles.panelWrapper}>
                {/* Inner Wooden Panel */}
                <button
                  id={`role-${role.id}`}
                  className={`${styles.innerPanel} ${isSelected ? styles.innerPanelSelected : ''}`}
                  onClick={() => setSelected(role.id)}
                >
                  <div className={styles.panelHeader}>
                    Peran: {role.title}
                  </div>
                  
                  <div className={styles.panelBody}>
                    <Image
                      src={role.img}
                      alt={role.role}
                      width={160}
                      height={160}
                      className={styles.charImg}
                      draggable={false}
                    />
                  </div>

                  <div className={styles.panelFooter}>
                    {role.desc}
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <button
          id="role-continue-btn"
          className={`${styles.continueBtn} ${selected ? styles.continueBtnActive : ''}`}
          onClick={handleContinue}
          disabled={!selected || entering}
        >
          {entering ? (
            <><span className={styles.spinner} /> Memulai Petualangan...</>
          ) : selected ? (
            <>⚔️ Mulai sebagai {ROLES.find(r => r.id === selected)?.role}</>
          ) : (
            'Pilih karaktermu dulu →'
          )}
        </button>


      </div>
    </div>
  );
}
