'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useScholarStore } from '@/store/useScholarStore';
import styles from '@/components/ui/Dashboard.module.css';

interface JobWithGaps {
  id: string;
  title: string;
  company: string;
  matchPercentage: number;
  requiredSkills: string[];
  missing: string[];
  possessed: string[];
}

export default function CareerHubPage() {
  const { matchedJobs, earnedSBTs, fetchProfileData, isLoading, clearSkills } = useScholarStore();
  const [analyzedJobs, setAnalyzedJobs] = useState<JobWithGaps[]>([]);

  useEffect(() => {
    fetchProfileData().then(() => {
      // Analyze gaps for all matched jobs
      const jobsWithGaps = matchedJobs.map(job => {
        const missing = job.requiredSkills.filter(skill => !earnedSBTs.includes(skill));
        const possessed = job.requiredSkills.filter(skill => earnedSBTs.includes(skill));
        return { ...job, missing, possessed };
      });
      setAnalyzedJobs(jobsWithGaps);
    });
  }, [fetchProfileData, matchedJobs, earnedSBTs]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', fontFamily: '"Press Start 2P"', color: '#fbbf24' }}>
        LOADING AI INSIGHTS...
      </div>
    );
  }

  // Exception Path: Empty Profile / No Skills
  if (earnedSBTs.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'center', marginTop: '64px' }}>
        <div className={styles.retroCard} style={{ maxWidth: '600px', width: '100%' }}>
          <div className={styles.cardHeader} style={{ background: '#7f1d1d' }}>
            <span className={styles.cardTitle}>🪫 SKILL LEVEL TOO LOW</span>
          </div>
          <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', textAlign: 'center' }}>
            <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#d4d4d8', lineHeight: '1.8' }}>
              Your Web3 wallet has no earned Skill Badges (SBTs). The AI cannot accurately match you with verified job positions until you complete fundamental training.
            </p>
            <Link href="/mahasiswa/learning" style={{
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
              textDecoration: 'none'
            }}>
              GO TO LEARNING MISSION
            </Link>

            <button onClick={() => window.location.reload()} style={{ marginTop: '16px', background: 'none', border: 'none', color: '#a3a3a3', fontFamily: '"Press Start 2P"', fontSize: '0.6rem', cursor: 'pointer', textDecoration: 'underline' }}>
              [Reset Demo State]
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* ── Header ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h1 style={{ fontFamily: '"Press Start 2P"', fontSize: '1.5rem', color: '#fff', textShadow: '2px 2px 0 #3b261b' }}>
          AI CAREER HUB
        </h1>
        <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#d4d4d8', lineHeight: '1.6' }}>
          We compared your verified on-chain SBTs with live industry requirements. Here are your matches and skill gaps.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        {analyzedJobs.map((job) => {
          const isPerfectMatch = job.missing.length === 0;

          return (
            <div key={job.id} className={styles.retroCard} style={{ display: 'flex', flexDirection: 'column' }}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>💼 {job.company}</span>
              </div>
              
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h2 style={{ fontFamily: '"Press Start 2P"', fontSize: '0.9rem', color: '#fbbf24', lineHeight: '1.6' }}>{job.title}</h2>
                  <div style={{ background: '#047857', border: '2px solid #064e3b', color: '#fff', fontSize: '0.7rem', fontFamily: '"Press Start 2P"', padding: '8px 12px', textAlign: 'center', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
                    {job.matchPercentage}% MATCH
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(0,0,0,0.2)', padding: '16px', border: '2px solid #5a3a29', flex: 1 }}>
                  <h4 style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#fff' }}>Requirement Analysis:</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {job.possessed.map((skill: string) => (
                      <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '1rem' }}>✅</span>
                        <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#34d399', lineHeight: '1.4' }}>{skill}</span>
                      </div>
                    ))}
                    {job.missing.map((skill: string) => (
                      <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '1rem' }}>❌</span>
                        <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#f87171', lineHeight: '1.4' }}>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: 'auto' }}>
                  {!isPerfectMatch ? (
                    <Link href="/mahasiswa/learning" style={{
                      display: 'block',
                      width: '100%',
                      padding: '16px',
                      fontFamily: '"Press Start 2P"',
                      fontSize: '0.8rem',
                      color: '#fff',
                      background: '#b91c1c',
                      border: '2px solid #7f1d1d',
                      boxShadow: '4px 4px 0 #7f1d1d',
                      cursor: 'pointer',
                      textAlign: 'center',
                      textDecoration: 'none'
                    }}>
                      TRAIN MISSING SKILLS
                    </Link>
                  ) : (
                    <button style={{
                      display: 'block',
                      width: '100%',
                      padding: '16px',
                      fontFamily: '"Press Start 2P"',
                      fontSize: '0.7rem',
                      color: '#fff',
                      background: '#047857',
                      border: '2px solid #064e3b',
                      boxShadow: '4px 4px 0 #064e3b',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }} onClick={() => alert('Resume sent via Web3 Vault!')}>
                      MINT VERIFIED RESUME & APPLY
                    </button>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Developer tool to test empty state */}
      <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', border: '2px dashed #5a3a29' }}>
        <span style={{ fontSize: '1.2rem' }}>🛠️</span>
        <button onClick={clearSkills} style={{ background: 'none', color: '#d4a373', border: 'none', cursor: 'pointer', fontFamily: '"Press Start 2P"', fontSize: '0.6rem', textDecoration: 'underline' }}>
          Simulate Empty Profile (Zero SBTs)
        </button>
      </div>
    </div>
  );
}
