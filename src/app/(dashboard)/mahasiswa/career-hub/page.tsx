'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useScholarStore } from '@/store/useScholarStore';
import { GICS_SECTORS, GICSSectorCode, getGICSSector } from '@/data/gicsData';
import styles from '@/components/ui/Dashboard.module.css';

interface JobWithGaps {
  id: string;
  title: string;
  company: string;
  gicsSector: GICSSectorCode;
  matchPercentage: number;
  requiredSkills: string[];
  missing: string[];
  possessed: string[];
}

export default function CareerHubPage() {
  const { matchedJobs, earnedSBTs, fetchProfileData, isLoading, clearSkills } = useScholarStore();
  const [analyzedJobs, setAnalyzedJobs] = useState<JobWithGaps[]>([]);
  const [activeFilter, setActiveFilter] = useState<GICSSectorCode | null>(null);

  useEffect(() => {
    fetchProfileData().then(() => {
      // Analyze gaps for all matched jobs
      const jobsWithGaps = matchedJobs.map(job => {
        const missing = job.requiredSkills.filter(skill => !earnedSBTs.includes(skill));
        const possessed = job.requiredSkills.filter(skill => earnedSBTs.includes(skill));
        const matchPercentage = Math.round((possessed.length / job.requiredSkills.length) * 100);
        return { ...job, missing, possessed, matchPercentage };
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
            <span className={styles.cardTitle}>SKILL LEVEL TOO LOW</span>
          </div>
          <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', textAlign: 'center' }}>
            <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#d4d4d8', lineHeight: '1.8' }}>
              Your Web3 wallet has no earned Skill Badges (SBTs). The AI cannot accurately match you with verified job positions until you complete fundamental training.
            </p>
            <Link href="/mahasiswa/learning-mission" style={{
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', paddingBottom: '64px' }}>
      
      {/* ── Header ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h1 style={{ fontFamily: '"Press Start 2P"', fontSize: '1.5rem', color: '#fff', textShadow: '2px 2px 0 #3b261b' }}>
          AI CAREER HUB
        </h1>
        <p style={{ fontFamily: '"Pixelify Sans", sans-serif', fontSize: '1.2rem', color: '#d4d4d8', lineHeight: '1.6', maxWidth: '800px' }}>
          Sistem AI membandingkan portofolio SBT on-chain kamu dengan kualifikasi industri secara real-time. Berikut adalah persentase kecocokan dan skill gap kamu.
        </p>
      </div>

      {/* ── GICS Sector Filter Bar ── */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          onClick={() => setActiveFilter(null)}
          style={{
            fontFamily: '"Press Start 2P"', fontSize: '0.55rem',
            padding: '10px 16px', cursor: 'pointer',
            background: activeFilter === null ? '#fbbf24' : 'rgba(255,255,255,0.1)',
            color: activeFilter === null ? '#3b261b' : '#e2c99a',
            border: `2px solid ${activeFilter === null ? '#b45309' : '#8a6040'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '36px'
          }}
        >
          ALL
        </button>
        {GICS_SECTORS.map(sector => (
          <button
            key={sector.code}
            onClick={() => setActiveFilter(activeFilter === sector.code ? null : sector.code)}
            style={{
              fontFamily: '"Press Start 2P"', fontSize: '0.55rem',
              padding: '10px 16px', cursor: 'pointer',
              background: activeFilter === sector.code ? sector.accentColor + '44' : 'rgba(255,255,255,0.08)',
              color: activeFilter === sector.code ? sector.accentColor : '#e2c99a',
              border: `2px solid ${activeFilter === sector.code ? sector.accentColor : '#8a6040'}`,
              display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center',
              height: '36px'
            }}
          >
            <span style={{ fontSize: '0.8rem' }}>{sector.icon}</span> 
            <span>{sector.nameID}</span>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
        {analyzedJobs
          .filter(job => activeFilter === null || job.gicsSector === activeFilter)
          .map((job) => {
          const isPerfectMatch = job.missing.length === 0;
          const sector = getGICSSector(job.gicsSector);

          return (
            <div key={job.id} className={styles.retroCard} style={{ 
              display: 'flex', flexDirection: 'column',
              borderColor: isPerfectMatch ? '#fbbf24' : undefined,
              boxShadow: isPerfectMatch ? '0 0 20px rgba(251,191,36,0.2)' : undefined,
              height: '100%',
              position: 'relative'
            }}>
              <div className={styles.cardHeader} style={{ background: isPerfectMatch ? '#b45309' : undefined }}>
                <span className={styles.cardTitle}>{job.company}</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flexGrow: 1, marginTop: '16px' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h2 style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#fff', textShadow: '2px 2px 0 #5a3a29', lineHeight: '1.6', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.title}</h2>
                  
                  {/* Right-aligned Ribbon Flag */}
                  <div style={{ position: 'absolute', top: '16px', right: '-12px', zIndex: 10 }}>
                    <div style={{ 
                      background: isPerfectMatch ? '#fbbf24' : '#047857', 
                      border: `2px solid ${isPerfectMatch ? '#b45309' : '#064e3b'}`, 
                      color: isPerfectMatch ? '#3b261b' : '#fff', 
                      fontSize: '0.65rem', fontFamily: '"Press Start 2P"', padding: '8px 12px', textAlign: 'center', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)',
                      whiteSpace: 'nowrap', position: 'relative', zIndex: 2
                    }}>
                      {job.matchPercentage}% MATCH
                    </div>
                    {/* 3D Fold under the right ribbon */}
                    <div style={{ 
                      position: 'absolute', top: '100%', right: '0', width: 0, height: 0, 
                      borderTop: `12px solid ${isPerfectMatch ? '#78350f' : '#022c22'}`, 
                      borderRight: '12px solid transparent', zIndex: 1 
                    }} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(0,0,0,0.2)', padding: '16px', border: `2px solid ${isPerfectMatch ? '#fbbf24' : '#5a3a29'}`, flexGrow: 1 }}>
                  <h4 style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: isPerfectMatch ? '#fbbf24' : '#fff' }}>
                    {isPerfectMatch ? 'All Requirements Met! 🌟' : 'Requirement Analysis:'}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {job.possessed.map((skill: string) => (
                      <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '1rem' }}>✅</span>
                        <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#6ee7b7', lineHeight: '1.4', textShadow: '1px 1px 0 rgba(0,0,0,0.5)' }}>{skill}</span>
                      </div>
                    ))}
                    {job.missing.map((skill: string) => (
                      <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '1rem' }}>❌</span>
                        <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#fca5a5', lineHeight: '1.4', textShadow: '1px 1px 0 rgba(0,0,0,0.5)' }}>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: 'auto' }}>
                  {!isPerfectMatch ? (
                    <Link href={`/mahasiswa/learning-mission?jobId=${job.id}`} style={{
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
                    <Link href="/mahasiswa/applications" style={{
                      display: 'block',
                      width: '100%',
                      padding: '16px',
                      fontFamily: '"Press Start 2P"',
                      fontSize: '0.8rem',
                      color: '#3b261b',
                      background: '#fbbf24',
                      border: '2px solid #b45309',
                      boxShadow: '4px 4px 0 #b45309',
                      cursor: 'pointer',
                      textAlign: 'center',
                      textDecoration: 'none'
                    }}>
                      ONE-CLICK APPLY ⚡
                    </Link>
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
