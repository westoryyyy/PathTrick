import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from '@/components/ui/Dashboard.module.css';
import { API_BASE_URL } from '@/config/pathtrick';
import { getAuthHeaders } from '@/hooks/useAuthSync';
import { PixelSkeletonCardGrid } from '@/components/ui/PixelSkeleton';

interface Scholarship {
  id: string;
  name: string;
  provider?: string | null;
  deadline: string;
  coverage?: string | null;        // from `amount` field
  requirements?: string | null;    // comma-separated string
  officialUrl?: string | null;
  coverImageUrl?: string | null;
  matchScore?: number;             // injected by AI/assessment result
  scope?: string;
}

/** Format backend ISO date → readable "15 Okt 2026" */
function fmtDeadline(iso: string | null | undefined): string {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return iso; }
}

/** Parse requirements — backend sends comma-separated string OR array */
function parseReqs(r: string | string[] | null | undefined): string[] {
  if (!r) return [];
  if (Array.isArray(r)) return r.filter(Boolean);
  return r.split(',').map(s => s.trim()).filter(Boolean);
}

const MOCK_SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'djarum-plus',
    name: 'Djarum Beasiswa Plus',
    provider: 'Djarum Foundation',
    matchScore: 92,
    deadline: new Date('2026-10-15').toISOString(),
    coverage: 'Biaya Kuliah + Uang Saku',
    requirements: 'Leadership SBT, Min. Rapor 8.0',
    officialUrl: 'https://djarumbeasiswaplus.org/',
    coverImageUrl: '/djarum_logo.png',
  },
  {
    id: 'bpi-kemdikbud',
    name: 'Beasiswa Pendidikan Indonesia',
    provider: 'Kemdikbud Ristek',
    matchScore: 88,
    deadline: new Date('2026-11-30').toISOString(),
    coverage: 'Full Funding',
    requirements: 'Prestasi Akademik, Esai Kontribusi',
    officialUrl: 'https://beasiswa.kemdikbud.go.id/',
    coverImageUrl: '/Gold Ticket.png',
  },
  {
    id: 'lpdp-s1',
    name: 'Beasiswa S1 Prestasi',
    provider: 'LPDP',
    matchScore: 85,
    deadline: new Date('2027-01-01').toISOString(),
    coverage: 'Full Funding + Akomodasi',
    requirements: 'Medali Olimpiade, Bahasa Inggris',
    officialUrl: 'https://lpdp.kemenkeu.go.id/',
    coverImageUrl: '/Gold Ticket.png',
  },
];

export default function ScholarshipHub() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(`${API_BASE_URL}/api/scholarships`, { headers: getAuthHeaders() })
      .then(res => res.ok ? res.json() : null)
      .then((data: { scholarships?: Scholarship[] } | null) => {
        if (cancelled) return;
        const list = Array.isArray(data?.scholarships)
          ? [...data.scholarships].sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
          : [];
        if (Array.isArray(list) && list.length > 0) {
          setScholarships(list);
        } else {
          setScholarships([]);
        }
      })
      .catch(() => {
        if (!cancelled) setScholarships([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontFamily: '"Press Start 2P"', fontSize: '1.5rem', color: '#fff', textShadow: '2px 2px 0 #3b261b' }}>
          SCHOLARSHIP HUB
        </h2>
        <p style={{ fontFamily: '"Pixelify Sans", sans-serif', fontSize: '1.2rem', color: '#d4d4d8', lineHeight: '1.6', maxWidth: '900px' }}>
          Berdasarkan profil RIASEC dan misi yang telah kamu selesaikan, AI kami telah menemukan peluang beasiswa terbaik untuk perjalanan kuliahmu.
        </p>
      </div>

      {loading && <PixelSkeletonCardGrid count={6} />}

      {/* Grid */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', width: '100%' }}>
          {scholarships.map(scholarship => (
            <div
              key={scholarship.id}
              className={styles.retroCard}
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px', height: '100%', position: 'relative' }}
            >
              {/* Match Score ribbon — hanya tampil jika AI sudah inject matchScore */}
              {typeof scholarship.matchScore === 'number' && (
                <div style={{ position: 'absolute', top: '-16px', right: '-12px', zIndex: 10 }}>
                  <div style={{
                    background: '#047857', border: '2px solid #064e3b', color: '#fff',
                    fontSize: '0.65rem', fontFamily: '"Press Start 2P"', padding: '8px 12px', textAlign: 'center', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)',
                    whiteSpace: 'nowrap', position: 'relative', zIndex: 2
                  }}>
                    {scholarship.matchScore}% MATCH
                  </div>
                  <div style={{
                    position: 'absolute', top: '100%', right: '0', width: 0, height: 0,
                    borderTop: '12px solid #022c22', borderRight: '12px solid transparent', zIndex: 1
                  }} />
                </div>
              )}

              <div>
                {scholarship.coverImageUrl && (
                  <div style={{ width: '100%', aspectRatio: '16/9', border: '3px solid #5a3a29', background: '#2c1810', marginBottom: '16px', overflow: 'hidden', boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.5)' }}>
                    <img src={scholarship.coverImageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', imageRendering: 'pixelated' }} />
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '24px', marginTop: scholarship.coverImageUrl ? '0' : '16px', position: 'relative' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                    <h3 style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#fbbf24', lineHeight: '1.6', textShadow: '1px 1px 0 #3b261b', margin: 0 }}>
                      {scholarship.name}
                    </h3>
                    {scholarship.provider && (
                      <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', color: '#e4e4e7', lineHeight: '1.6', margin: 0 }}>
                        {scholarship.provider}
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(0,0,0,0.2)', padding: '16px', border: '2px solid #5a3a29' }}>
                  {scholarship.coverage && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img src="/Coin.png" alt="" style={{ width: '18px', height: '18px', imageRendering: 'pixelated', flexShrink: 0 }} />
                      <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', color: '#d4d4d8', lineHeight: '1.6' }}>{scholarship.coverage}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img src="/Hourglass.png" alt="" style={{ width: '18px', height: '18px', imageRendering: 'pixelated', flexShrink: 0 }} />
                    <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', color: '#d4d4d8', lineHeight: '1.6' }}>
                      Deadline: {fmtDeadline(scholarship.deadline)}
                    </span>
                  </div>
                  {parseReqs(scholarship.requirements).length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                      <img src="/Scroll.png" alt="" style={{ width: '18px', height: '18px', imageRendering: 'pixelated', flexShrink: 0, marginTop: '4px' }} />
                      <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', color: '#d4d4d8', lineHeight: '1.6' }}>
                        Reqs: {parseReqs(scholarship.requirements).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <button
                style={{
                  marginTop: '24px',
                  width: '100%',
                  padding: '24px',
                  fontFamily: '"Press Start 2P"',
                  fontSize: '0.8rem',
                  color: '#3b261b',
                  background: '#fbbf24',
                  border: '2px solid #3b261b',
                  boxShadow: '4px 4px 0 #3b261b',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.1s'
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translate(2px, 2px)';
                  e.currentTarget.style.boxShadow = '2px 2px 0 #3b261b';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '4px 4px 0 #3b261b';
                }}
                onClick={() => setSelectedScholarship(scholarship)}
              >
                VIEW DETAILS
              </button>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedScholarship && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedScholarship.name} details`}
            onClick={() => setSelectedScholarship(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              background: 'rgba(35, 17, 8, 0.82)',
            }}
          >
            <motion.div
              onClick={(event) => event.stopPropagation()}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              style={{
                width: 'min(620px, 100%)',
                maxHeight: '85vh',
                overflowY: 'auto',
                padding: '28px',
                background: '#d4a373',
                border: '5px solid #3b261b',
                boxShadow: '8px 8px 0 #1f120a, inset 0 0 0 4px #e8c98a',
                color: '#3b261b',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start', borderBottom: '3px dashed #5a3a29', paddingBottom: '18px' }}>
                <div>
                  <h2 style={{ margin: 0, fontFamily: '"Press Start 2P"', fontSize: '1rem', lineHeight: 1.6 }}>
                    {selectedScholarship.name}
                  </h2>
                  {selectedScholarship.provider && (
                    <p style={{ margin: '8px 0 0', fontFamily: 'system-ui, sans-serif', fontSize: '1rem', color: '#5a3a29', fontWeight: 'bold' }}>
                      {selectedScholarship.provider}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedScholarship(null)}
                  aria-label="Close scholarship details"
                  style={{ background: '#b91c1c', border: '3px solid #450a0a', color: '#fff', padding: '8px 12px', fontFamily: '"Press Start 2P"', cursor: 'pointer', boxShadow: '3px 3px 0 #3b261b' }}
                >
                  X
                </button>
              </div>
              <div style={{ display: 'grid', gap: '14px', marginTop: '22px', fontFamily: 'system-ui, sans-serif', fontSize: '0.95rem', lineHeight: 1.7, color: '#3b261b' }}>
                {selectedScholarship.coverage && (
                  <div style={{ padding: '14px', background: 'rgba(255,255,255,0.22)', border: '2px solid #8c5d41', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src="/Coin.png" alt="" style={{ width: '18px', height: '18px', imageRendering: 'pixelated', flexShrink: 0 }} />
                    <span>COVERAGE: {selectedScholarship.coverage}</span>
                  </div>
                )}
                <div style={{ padding: '14px', background: 'rgba(255,255,255,0.22)', border: '2px solid #8c5d41', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src="/Hourglass.png" alt="" style={{ width: '18px', height: '18px', imageRendering: 'pixelated', flexShrink: 0 }} />
                  <span>DEADLINE: {fmtDeadline(selectedScholarship.deadline)}</span>
                </div>
                {parseReqs(selectedScholarship.requirements).length > 0 && (
                  <div style={{ padding: '14px', background: 'rgba(255,255,255,0.22)', border: '2px solid #8c5d41', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src="/Scroll.png" alt="" style={{ width: '18px', height: '18px', imageRendering: 'pixelated', flexShrink: 0 }} />
                    <span>REQUIREMENTS: {parseReqs(selectedScholarship.requirements).join(' • ')}</span>
                  </div>
                )}
              </div>

              {/* Tombol Daftar — hanya tampil jika officialUrl ada */}
              {selectedScholarship.officialUrl ? (
                <a
                  href={selectedScholarship.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    width: '100%',
                    marginTop: '24px',
                    padding: '16px',
                    background: '#fbbf24',
                    border: '3px solid #3b261b',
                    boxShadow: '4px 4px 0 #3b261b',
                    color: '#3b261b',
                    fontFamily: '"Press Start 2P"',
                    fontSize: '0.7rem',
                    cursor: 'pointer',
                    textAlign: 'center',
                    textDecoration: 'none',
                  }}
                >
                  OPEN OFFICIAL QUEST ↗
                </a>
              ) : (
                <div style={{
                  marginTop: '24px',
                  padding: '14px',
                  background: 'rgba(0,0,0,0.1)',
                  border: '2px dashed #8c5d41',
                  textAlign: 'center',
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '0.85rem',
                  color: '#5a3a29',
                }}>
                  Link pendaftaran belum tersedia
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
