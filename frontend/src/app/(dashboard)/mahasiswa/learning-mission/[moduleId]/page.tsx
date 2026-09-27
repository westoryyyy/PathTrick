'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PixelIcon from '@/components/ui/PixelIcon';
import styles from '@/components/ui/Dashboard.module.css';

// Mock course/module details
const MODULE_DATA: Record<string, { title: string; desc: string; icon: string }> = {
  'react': { title: 'React Mastery', desc: 'Advanced component architecture and hooks.', icon: '⚛️' },
  'typescript': { title: 'TypeScript Pro', desc: 'Strict typing for robust frontend apps.', icon: '🟦' },
  'framer': { title: 'Motion Design', desc: 'Fluid animations with Framer Motion.', icon: '✨' },
  'next': { title: 'Next.js App Router', desc: 'Server components and full-stack React.', icon: '▲' },
};

// Mock chapters per module
const MOCK_CHAPTERS = [
  { id: '1', title: 'Bab 1: Konsep Dasar', desc: 'Pahami pondasi utama dari modul ini.', levelCount: 3 },
  { id: '2', title: 'Bab 2: Implementasi Lanjut', desc: 'Penerapan pada studi kasus nyata.', levelCount: 3 },
  { id: '3', title: 'Bab 3: Proyek Akhir', desc: 'Selesaikan tantangan untuk meraih SBT.', levelCount: 1 },
];

export default function ModuleChaptersPage({ params }: { params: Promise<{ moduleId: string }> }) {
  const router = useRouter();
  
  // Use React.use to unwrap params
  const { moduleId } = use(params);
  
  const [isClient, setIsClient] = useState(false);
  // This client gate prevents browser-only map state from rendering during SSR.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setIsClient(true); }, []);

  if (!isClient) return null;

  const moduleInfo = MODULE_DATA[moduleId] || { title: moduleId, desc: 'Detail modul.', icon: '📚' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* ── Header ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <button 
          onClick={() => router.push('/mahasiswa/learning-mission')}
          style={{ 
            fontFamily: '"Press Start 2P"', 
            fontSize: '0.6rem', 
            color: '#fbbf24', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            alignSelf: 'flex-start',
            textDecoration: 'underline'
          }}
        >
          ← KEMBALI KE MODULES
        </button>

        <h1 style={{ fontFamily: '"Press Start 2P"', fontSize: '1.5rem', color: '#fff', textShadow: '2px 2px 0 #3b261b', marginTop: '8px' }}>
          <PixelIcon icon={moduleInfo.icon} size={32} /> {moduleInfo.title.toUpperCase()}
        </h1>
        <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#d4d4d8', lineHeight: '1.6' }}>
          Pilih Bab (Chapter) untuk memulai petualangan belajarmu. Setiap Bab memiliki beberapa level (Sub-bab) yang harus diselesaikan.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', maxWidth: '800px' }}>
        {MOCK_CHAPTERS.map((chapter) => (
          <div key={chapter.id} className={styles.retroCard} style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch' }}>
            
            {/* Chapter Info */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
              <div style={{ display: 'inline-block', background: '#3b261b', border: '2px solid #5a3a29', color: '#fbbf24', fontSize: '0.6rem', fontFamily: '"Press Start 2P"', padding: '8px 12px', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)', alignSelf: 'flex-start' }}>
                {chapter.levelCount} LEVEL (SUB-BAB)
              </div>
              <h2 style={{ fontFamily: '"Press Start 2P"', fontSize: '1rem', color: '#fff', marginTop: '8px' }}>{chapter.title}</h2>
              <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#d4d4d8', lineHeight: '1.6' }}>
                {chapter.desc}
              </p>
            </div>

            {/* Start Action */}
            <div style={{ background: '#92400e', width: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderLeft: '4px solid #5a3a29' }}>
              <Link href={`/map?module=${moduleId}&chapter=${chapter.id}`} style={{
                padding: '16px',
                fontFamily: '"Press Start 2P"',
                fontSize: '0.8rem',
                color: '#3b261b',
                background: '#fbbf24',
                border: '2px solid #3b261b',
                boxShadow: '4px 4px 0 #3b261b',
                cursor: 'pointer',
                textAlign: 'center',
                textDecoration: 'none'
              }}>
                PLAY BAB {chapter.id}
              </Link>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
