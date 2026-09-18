import React from 'react';
import styles from '@/components/ui/Dashboard.module.css';

import { useMapStore } from '@/store/useMapStore';

export default function RelicsAndTreasures() {
  const completedDynamicNodes = useMapStore(state => state.completedDynamicNodes);
  
  const isHtmlEarned = completedDynamicNodes.includes('module-html-css-level-6');

  const VAULT_SBTS = [
    { id: 1, name: 'HTML Basics', desc: 'House of Tech', earned: isHtmlEarned, icon: '🛡️' },
    { id: 2, name: 'Python Logic', desc: 'Algorithm Core', earned: false, icon: '⚔️' },
    { id: 3, name: 'Figma UI/UX', desc: 'Design Fundamentals', earned: false, icon: '💎' },
    { id: 4, name: 'Data Wizard', desc: 'Data Analytics', earned: false, icon: '🔮' },
    { id: 5, name: 'Security Master', desc: 'House of Cyber', earned: false, icon: '🔐' },
    { id: 6, name: 'Smart Contract', desc: 'Web3 Track', earned: false, icon: '📜' },
    { id: 7, name: 'First Milestone', desc: 'Welcome Bounty', earned: true, icon: '🎁' },
    { id: 8, name: 'Top 10 Rank', desc: 'Weekly Leaderboard', earned: false, icon: '🏆' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontFamily: '"Press Start 2P"', fontSize: '1.5rem', color: '#fff', textShadow: '2px 2px 0 #3b261b' }}>
          RELICS & TREASURES
        </h2>
        <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#d4d4d8', lineHeight: '1.6' }}>
          Your collection of Soulbound Tokens (SBT) and Achievements. Complete more missions to unlock all relics!
        </p>
      </div>

      {/* Stats Summary */}
      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ background: '#3b261b', border: '2px solid #5a3a29', padding: '16px', flex: 1, textAlign: 'center', boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.5)' }}>
          <p style={{ fontFamily: '"Press Start 2P"', fontSize: '1.2rem', color: '#fbbf24' }}>
            {VAULT_SBTS.filter(s => s.earned).length} / {VAULT_SBTS.length}
          </p>
          <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.5rem', color: '#d4d4d8', marginTop: '12px' }}>RELICS UNLOCKED</p>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px', width: '100%', marginTop: '8px' }}>
        {VAULT_SBTS.map(sbt => (
          <div 
            key={sbt.id} 
            className={styles.retroCard}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '24px',
              gap: '16px',
              opacity: sbt.earned ? 1 : 0.6,
              filter: sbt.earned ? 'none' : 'grayscale(100%)',
              borderStyle: sbt.earned ? 'solid' : 'dashed'
            }}
          >
            <div style={{ 
              width: '64px', height: '64px', 
              background: sbt.earned ? '#d4a373' : 'rgba(0,0,0,0.2)', 
              border: `2px solid ${sbt.earned ? '#fff' : '#5a3a29'}`, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontSize: '2rem', 
              boxShadow: sbt.earned ? '0 0 16px rgba(251, 191, 36, 0.4)' : 'none'
            }}>
              {sbt.icon}
            </div>
            
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h3 style={{ fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: sbt.earned ? '#fbbf24' : '#a3a3a3', lineHeight: '1.4' }}>
                {sbt.name}
              </h3>
              <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.45rem', color: '#d4d4d8', lineHeight: '1.4' }}>
                {sbt.desc}
              </p>
            </div>

            <div style={{ 
              marginTop: '8px',
              padding: '4px 8px', 
              background: sbt.earned ? '#047857' : '#525252', 
              border: `2px solid ${sbt.earned ? '#064e3b' : '#404040'}`,
              fontFamily: '"Press Start 2P"', 
              fontSize: '0.45rem', 
              color: sbt.earned ? '#fff' : '#a3a3a3' 
            }}>
              {sbt.earned ? 'CLAIMED' : 'LOCKED'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
