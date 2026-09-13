'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useScholarStore } from '@/store/useScholarStore';
import styles from '@/components/ui/Dashboard.module.css';

export default function LearningMissionPage() {
  const { fetchProfileData, analyzeSkillGap, earnedSBTs, isLoading } = useScholarStore();
  const [missingSkills, setMissingSkills] = useState<string[]>([]);

  useEffect(() => {
    fetchProfileData().then(() => {
      const { missing } = analyzeSkillGap();
      setMissingSkills(missing);
    });
  }, [fetchProfileData, analyzeSkillGap]);

  // Mock course library mapped to skills
  const availableCourses = [
    { id: 'react', title: 'React Mastery', desc: 'Advanced component architecture and hooks.', skill: 'React', icon: '⚛️' },
    { id: 'typescript', title: 'TypeScript Pro', desc: 'Strict typing for robust frontend apps.', skill: 'TypeScript', icon: '🟦' },
    { id: 'framer', title: 'Motion Design', desc: 'Fluid animations with Framer Motion.', skill: 'Framer Motion', icon: '✨' },
    { id: 'next', title: 'Next.js App Router', desc: 'Server components and full-stack React.', skill: 'Next.js', icon: '▲' },
  ];

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', fontFamily: '"Press Start 2P"', color: '#fbbf24' }}>
        LOADING MISSIONS...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h1 style={{ fontFamily: '"Press Start 2P"', fontSize: '1.5rem', color: '#fff', textShadow: '2px 2px 0 #3b261b' }}>
          LEARNING MISSION
        </h1>
        <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#d4d4d8', lineHeight: '1.6' }}>
          Train the skills identified by the AI to fill your career gap. Complete missions to earn verifiable SBTs.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {availableCourses.map(course => {
          const isCompleted = earnedSBTs.includes(course.skill);
          const isRecommended = missingSkills.includes(course.skill);

          return (
            <div key={course.id} className={styles.retroCard} style={{ 
              display: 'flex', flexDirection: 'column', 
              opacity: isCompleted ? 0.7 : 1,
              borderColor: isRecommended ? '#fbbf24' : '#5a3a29'
            }}>
              <div className={styles.cardHeader} style={isRecommended ? { background: '#92400e' } : {}}>
                <span className={styles.cardTitle}>{course.icon} {course.title}</span>
              </div>
              
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                
                {isCompleted ? (
                  <div style={{ display: 'inline-block', background: '#047857', border: '2px solid #064e3b', color: '#fff', fontSize: '0.6rem', fontFamily: '"Press Start 2P"', padding: '8px 12px', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)', alignSelf: 'flex-start' }}>
                    ✅ SBT EARNED
                  </div>
                ) : isRecommended ? (
                  <div style={{ display: 'inline-block', background: '#b91c1c', border: '2px solid #7f1d1d', color: '#fff', fontSize: '0.6rem', fontFamily: '"Press Start 2P"', padding: '8px 12px', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)', alignSelf: 'flex-start' }}>
                    🔥 AI RECOMMENDED
                  </div>
                ) : (
                  <div style={{ display: 'inline-block', background: '#3b261b', border: '2px solid #5a3a29', color: '#fbbf24', fontSize: '0.6rem', fontFamily: '"Press Start 2P"', padding: '8px 12px', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)', alignSelf: 'flex-start' }}>
                    REWARD: {course.skill} SBT
                  </div>
                )}
                
                <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#d4d4d8', lineHeight: '1.6', flex: 1 }}>
                  {course.desc}
                </p>
                
                {!isCompleted ? (
                  <Link href={`/mahasiswa/learning/${course.id}`} style={{
                    display: 'block',
                    width: '100%',
                    padding: '16px',
                    fontFamily: '"Press Start 2P"',
                    fontSize: '0.8rem',
                    color: '#3b261b',
                    background: '#fbbf24',
                    border: '2px solid #3b261b',
                    boxShadow: '4px 4px 0 #3b261b',
                    cursor: 'pointer',
                    textAlign: 'center',
                    textDecoration: 'none',
                    marginTop: 'auto'
                  }}>
                    START MISSION
                  </Link>
                ) : (
                  <div style={{
                    display: 'block',
                    width: '100%',
                    padding: '16px',
                    fontFamily: '"Press Start 2P"',
                    fontSize: '0.8rem',
                    color: '#94a3b8',
                    background: 'transparent',
                    border: '2px dashed #5a3a29',
                    textAlign: 'center',
                    marginTop: 'auto'
                  }}>
                    COMPLETED
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
