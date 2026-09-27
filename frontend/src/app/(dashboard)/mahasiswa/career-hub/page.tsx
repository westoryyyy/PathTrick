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
  coverImage?: string;
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
            height: '36px',
            boxSizing: 'border-box'
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
              height: '36px',
              boxSizing: 'border-box'
            }}
          >
            <span style={{ fontSize: '0.8rem' }}>{sector.icon}</span>
            <span>{sector.nameID}</span>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '32px', minHeight: '600px', alignContent: 'start' }}>
        {analyzedJobs
          .filter(job => activeFilter === null || job.gicsSector === activeFilter)
          .map((job) => {
            const isPerfectMatch = job.missing.length === 0;
            const sector = getGICSSector(job.gicsSector);

            return (
              <div key={job.id} className={styles.retroCard} style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px',
                borderColor: isPerfectMatch ? '#fbbf24' : undefined,
                boxShadow: isPerfectMatch ? '0 0 20px rgba(251,191,36,0.2)' : undefined,
                height: '100%',
                position: 'relative'
              }}>
                {/* Right-aligned Ribbon Flag */}
                <div style={{ position: 'absolute', top: '-16px', right: '-12px', zIndex: 10 }}>
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

                <div>
                  {job.coverImage && (
                    <div style={{ width: '100%', aspectRatio: '16/9', border: `3px solid ${isPerfectMatch ? '#fbbf24' : '#5a3a29'}`, background: '#2c1810', marginBottom: '16px', overflow: 'hidden', boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.5)' }}>
                      <img src={job.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', imageRendering: 'pixelated' }} />
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '24px', marginTop: job.coverImage ? '0' : '16px', position: 'relative' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                      <h3 style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#fbbf24', lineHeight: '1.6', textShadow: '1px 1px 0 #3b261b', margin: 0 }}>
                        {job.title}
                      </h3>
                      <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', color: '#e4e4e7', lineHeight: '1.6', margin: 0 }}>
                        {job.company}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(0,0,0,0.2)', padding: '16px', border: `2px solid ${isPerfectMatch ? '#fbbf24' : '#5a3a29'}` }}>
                    <h4 style={{ fontFamily: 'system-ui, sans-serif', fontSize: '1.1rem', color: isPerfectMatch ? '#fbbf24' : '#fff', margin: 0, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {isPerfectMatch && <img src="/Gold Ticket.png" alt="" style={{ width: '18px', height: '18px', imageRendering: 'pixelated' }} />}
                      {isPerfectMatch ? 'All Requirements Met!' : 'Requirement Analysis:'}
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 12px' }}>
                      {job.possessed.map((skill: string) => (
                        <div key={skill} style={{ 
                          display: 'flex', alignItems: 'center', gap: '6px', 
                          background: '#064e3b', padding: '6px 10px',
                          clipPath: 'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
                        }}>
                          <img src="/Shield.png" alt="" style={{ width: '14px', height: '14px', imageRendering: 'pixelated', flexShrink: 0 }} />
                          <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: '#a7f3d0', lineHeight: '1', textShadow: '1px 1px 0 rgba(0,0,0,0.8)', whiteSpace: 'nowrap' }}>{skill}</span>
                        </div>
                      ))}
                      {job.missing.map((skill: string) => (
                        <div key={skill} style={{ 
                          display: 'flex', alignItems: 'center', gap: '6px', 
                          background: '#7f1d1d', padding: '6px 10px',
                          clipPath: 'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
                        }}>
                          <img src="/Sword.png" alt="" style={{ width: '14px', height: '14px', imageRendering: 'pixelated', flexShrink: 0 }} />
                          <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: '#fecaca', lineHeight: '1', textShadow: '1px 1px 0 rgba(0,0,0,0.8)', whiteSpace: 'nowrap' }}>{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '24px' }}>
                  {!isPerfectMatch ? (
                    <Link href={`/mahasiswa/learning-mission?jobId=${job.id}`} style={{
                      display: 'block',
                      width: '100%',
                      padding: '16px',
                      fontFamily: '"Press Start 2P"',
                      fontSize: '0.65rem',
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
                      fontSize: '0.65rem',
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
