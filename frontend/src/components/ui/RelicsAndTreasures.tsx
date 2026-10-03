import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ASSET_PATHS } from '@/phaser/config';
import { useTranslation } from '@/hooks/useTranslation';
import styles from '@/components/ui/Dashboard.module.css';
import { useMapStore } from '@/store/useMapStore';
import { PixelSkeletonTileGrid } from '@/components/ui/PixelSkeleton';

type Props = {
  hideHeader?: boolean;
  statsLabel?: string;
};

const BADGE_ASSET_MAP = {
  mission_completer: ASSET_PATHS.BADGE_MISSION_COMPLETE,
  early_bird: ASSET_PATHS.BADGE_EARLY_BIRD,
  streak_warrior: ASSET_PATHS.BADGE_STREAK_WARRIOR,
  quiz_master: ASSET_PATHS.BADGE_QUIZ_MASTER,
  quick_learner: ASSET_PATHS.BADGE_QUICK_LEARNER,
  course_master: ASSET_PATHS.BADGE_COURSE_MASTER,
  first_step: ASSET_PATHS.BADGE_FIRST_STEP,
  night_owl: ASSET_PATHS.BADGE_NIGHT_OWL,
} as const;

export default function RelicsAndTreasures({ hideHeader = false, statsLabel = 'BADGES UNLOCKED' }: Props = {}) {
  const { t } = useTranslation();
  const completedDynamicNodes = useMapStore(state => state.completedDynamicNodes);
  const badgeCount = useMapStore(state => state.badgeCount);
  const fetchAchievements = useMapStore(state => state.fetchAchievements);
  const [unlockedKeys, setUnlockedKeys] = useState<string[]>([]);
  const [loadingBadges, setLoadingBadges] = useState(true);

  useEffect(() => {
    // Use centralized fetch so multiple components share cached value
    (async () => {
      try {
        const keys = await fetchAchievements();
        setUnlockedKeys(keys);
      } finally {
        setLoadingBadges(false);
      }
    })();
  }, [fetchAchievements]);
  
  const VAULT_SBTS = [
    { id: 1, name: 'Mission Completer', desc: t('badges.missionCompleter'), earned: unlockedKeys.includes('mission_completer'), icon: BADGE_ASSET_MAP.mission_completer },
    { id: 2, name: 'Early Bird', desc: t('badges.earlyBird'), earned: unlockedKeys.includes('early_bird'), icon: BADGE_ASSET_MAP.early_bird },
    { id: 3, name: 'Streak Warrior', desc: t('badges.streakWarrior'), earned: unlockedKeys.includes('streak_warrior'), icon: BADGE_ASSET_MAP.streak_warrior },
    { id: 4, name: 'Quiz Master', desc: t('badges.quizMaster'), earned: unlockedKeys.includes('quiz_master'), icon: BADGE_ASSET_MAP.quiz_master },
    { id: 5, name: 'Quick Learner', desc: t('badges.quickLearner'), earned: unlockedKeys.includes('quick_learner'), icon: BADGE_ASSET_MAP.quick_learner },
    { id: 6, name: 'Course Master', desc: t('badges.courseMaster'), earned: unlockedKeys.includes('course_master'), icon: BADGE_ASSET_MAP.course_master },
    { id: 8, name: 'First Step', desc: t('badges.firstStep'), earned: unlockedKeys.includes('first_step'), icon: BADGE_ASSET_MAP.first_step },
    { id: 9, name: 'Night Owl', desc: t('badges.nightOwl'), earned: unlockedKeys.includes('night_owl'), icon: BADGE_ASSET_MAP.night_owl },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>
      {!hideHeader && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontFamily: '"Press Start 2P"', fontSize: '1.5rem', color: '#fff', textShadow: '2px 2px 0 #3b261b' }}>
            BADGES
          </h2>
          <p style={{ fontFamily: '"Pixelify Sans", sans-serif', fontSize: '1.2rem', color: '#d4d4d8', lineHeight: '1.6', maxWidth: '800px' }}>
            {t('common.achievementsDesc')}
          </p>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#fbbf24' }}>
        <span>{statsLabel}</span>
        <span style={{ color: '#fff' }}>{badgeCount}</span>
      </div>

      {loadingBadges ? <PixelSkeletonTileGrid count={8} /> : (
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
              background: 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              position: 'relative'
            }}>
              <Image 
                src={sbt.icon} 
                alt={sbt.name} 
                fill 
                style={{ 
                  objectFit: 'contain', 
                  filter: sbt.earned ? 'drop-shadow(0 0 16px rgba(251, 191, 36, 0.4))' : 'brightness(0) invert(0.3) opacity(0.5)',
                  transition: 'filter 0.3s'
                }} 
              />
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
              {sbt.earned ? 'UNLOCKED' : 'LOCKED'}
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
