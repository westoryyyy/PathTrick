import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '@/components/ui/Dashboard.module.css';
import { API_BASE_URL } from '@/config/pathtrick';
import { getAuthHeaders } from '@/hooks/useAuthSync';
import { PixelSkeletonCardGrid } from '@/components/ui/PixelSkeleton';
import { useTranslation } from '@/hooks/useTranslation';
import { usePrivy } from '@privy-io/react-auth';

const FACULTIES = [
  { value: 'agr_farm', label: 'Agribisnis & Pertanian' },
  { value: 'biz_acc', label: 'Akuntansi & Keuangan' },
  { value: 'biz_mgmt', label: 'Bisnis & Manajemen' },
  { value: 'data_ai', label: 'Data Science & AI' },
  { value: 'arts_design', label: 'Desain & Seni Rupa' },
  { value: 'sci_natural', label: 'Fisika, Kimia, Biologi' },
  { value: 'soc_ir', label: 'Hubungan Internasional' },
  { value: 'law', label: 'Ilmu Hukum' },
  { value: 'soc_comm', label: 'Ilmu Komunikasi' },
  { value: 'cs_it', label: 'Ilmu Komputer & TI' },
  { value: 'law_public', label: 'Ilmu Politik & Publik' },
  { value: 'med_doctor', label: 'Kedokteran (Umum/Gigi)' },
  { value: 'agr_env', label: 'Kehutanan & Lingkungan' },
  { value: 'med_nurse', label: 'Keperawatan & Farmasi' },
  { value: 'sci_math', label: 'Matematika & Statistika' },
  { value: 'eng_mech', label: 'Mesin & Elektro' },
  { value: 'edu_teacher', label: 'Pendidikan Guru' },
  { value: 'soc_psy', label: 'Psikologi' },
  { value: 'arts_lang', label: 'Sastra & Bahasa' },
  { value: 'eng_civil', label: 'Sipil & Arsitektur' },
  { value: 'edu_tech', label: 'Teknologi Pendidikan' },
];

/**
 * Checklist template shared by all universities. Each university enriches it with its own
 * data (faculty, admissionRequirements, website) so no per-university content is hardcoded.
 */
function buildChecklist(uni: { name: string; facultyTags?: string[]; admissionRequirements?: string | null; website?: string | null }, locale: string) {
  const id = locale === 'id';
  const majorTag = uni.facultyTags?.[0];
  const majorLabel = majorTag ? (FACULTIES.find(f => f.value === majorTag)?.label || majorTag) : null;
  
  return [
    {
      key: 'basics',
      title: id ? 'Taklukkan Ujian Utama' : 'Conquer the Core Trials',
      desc: id
        ? `Kuasai fondasi pengetahuan yang diuji untuk masuk ke ${majorLabel || 'program ini'}.`
        : `Master the foundational knowledge tested for ${majorLabel || 'this program'}.`,
    },
    {
      key: 'documents',
      title: id ? 'Siapkan berkas administrasi' : 'Prepare admission documents',
      desc: uni.admissionRequirements
        ? (id ? 'Persyaratan: ' : 'Requirements: ') + uni.admissionRequirements
        : (id ? 'Rapor, ijazah/SKL, KTP/KK, pas foto, dan dokumen pendukung.' : 'Transcript, diploma, ID, photo, and supporting documents.'),
    },
    {
      key: 'register',
      title: id ? 'Daftar ujian masuk' : 'Register for the entrance exam',
      desc: uni.website
        ? (id ? `Daftar melalui ${uni.website}` : `Register via ${uni.website}`)
        : (id ? `Cek jadwal & portal pendaftaran resmi ${uni.name}.` : `Check the schedule & official portal of ${uni.name}.`),
    },
    {
      key: 'exam',
      title: id ? 'Ikuti ujian masuk' : 'Take the entrance exam',
      desc: id ? 'Hadir tepat waktu dan bawa perlengkapan yang diminta.' : 'Arrive on time and bring the required items.',
    },
  ];
}

interface University {
  id: string;
  name: string;
  country?: string;
  location?: string;
  coverImageUrl?: string | null;
  facultyTags?: string[];
  estimatedCostMin?: number;
  estimatedCostMax?: number;
  admissionRequirements?: string | null;
  description?: string | null;
  accreditation?: string | null;
  title?: string | null;
  website?: string | null;
  
  // Frontend injected fields
  matchScore?: number;
}

// FACULTIES moved to top

const MOCK_UNIVERSITIES: University[] = [
  {
    id: 'ui-cs',
    name: 'Universitas Indonesia',
    facultyTags: ['Computer Science (Fasilkom)'],
    matchScore: 95,
    location: 'Depok, Jawa Barat',
    accreditation: '3.5%', // Simulasi acceptance rate
    admissionRequirements: 'SNBT/SIMAK, Portofolio IT',
    coverImageUrl: '/Compass.png',
  },
  {
    id: 'itb-stei',
    name: 'Institut Teknologi Bandung',
    facultyTags: ['STEI - Komputasi'],
    matchScore: 90,
    location: 'Bandung, Jawa Barat',
    accreditation: '2.8%',
    admissionRequirements: 'SNBT, Nilai Matematika > 85',
    coverImageUrl: '/Compass.png',
  },
  {
    id: 'ugm-cs',
    name: 'Universitas Gadjah Mada',
    facultyTags: ['Ilmu Komputer'],
    matchScore: 88,
    location: 'Yogyakarta',
    accreditation: '4.1%',
    admissionRequirements: 'SNBT/UM UGM',
    coverImageUrl: '/Compass.png',
  }
];

export default function UniversityHub() {
  const { t, locale } = useTranslation();
  const { user } = usePrivy();
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUni, setSelectedUni] = useState<University | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const storageKey = selectedUni ? `pt_uni_checklist_${user?.id ?? 'guest'}_${selectedUni.id}` : null;

  useEffect(() => {
    if (!storageKey || !selectedUni) return;
    let cancelled = false;
    // 1) instant: local cache
    try {
      setChecked(JSON.parse(localStorage.getItem(storageKey) || '{}'));
    } catch { setChecked({}); }
    // 2) source of truth: backend (synced across devices)
    fetch(`${API_BASE_URL}/api/universities/checklist`, { headers: getAuthHeaders() })
      .then(r => (r.ok ? r.json() : null))
      .then((data: { progress?: Record<string, string[]> } | null) => {
        const steps = data?.progress?.[selectedUni.id];
        if (cancelled || !steps) return;
        const remote = Object.fromEntries(steps.map(k => [k, true]));
        setChecked(remote);
        try { localStorage.setItem(storageKey, JSON.stringify(remote)); } catch {}
      })
      .catch(() => {});
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const toggleItem = (key: string) => {
    if (!storageKey || !selectedUni) return;
    const next = { ...checked, [key]: !checked[key] };
    setChecked(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
    fetch(`${API_BASE_URL}/api/universities/${selectedUni.id}/checklist`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ completedSteps: Object.keys(next).filter(k => next[k]) }),
    }).catch(() => {});
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        const headers = getAuthHeaders();
        // First try: use AI roadmap matches from /api/users/me
        const meRes = await fetch(`${API_BASE_URL}/api/users/me`, { headers });
        if (meRes.ok) {
          const me = await meRes.json();
          const activeRoadmap = me.roadmaps?.[0];
          if (activeRoadmap?.universityMatches?.length > 0) {
            // Map roadmap university matches to University interface
              const fromRoadmap: University[] = [...activeRoadmap.universityMatches]
                .sort((a: any, b: any) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
                .map((um: any) => ({
                  ...um.university,
                  matchScore: um.matchScore,
                  reasoning: um.reasoning,
                }));
            if (!cancelled) {
              setUniversities(fromRoadmap);
              setLoading(false);
            }
            return;
          }
        }

        // Fallback: use /api/universities with user's preference filter
        const uniRes = await fetch(`${API_BASE_URL}/api/universities`, { headers });
        if (uniRes.ok) {
          const data = await uniRes.json();
          const list = Array.isArray(data?.universities)
            ? [...data.universities].sort((a: University, b: University) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
            : [];
          if (!cancelled) {
            setUniversities(list);
          }
        } else if (!cancelled) {
          setUniversities([]);
        }
      } catch {
        if (!cancelled) setUniversities([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const playHoverSound = () => {
    try {
      const audio = new Audio('/HoverTombol.ogg');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch(e) {}
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontFamily: '"Press Start 2P"', fontSize: '1.5rem', color: '#fff', textShadow: '2px 2px 0 #3b261b' }}>
          {t('sma.universityHub.title')}
        </h2>
        <p style={{ fontFamily: '"Pixelify Sans", sans-serif', fontSize: '1.2rem', color: '#d4d4d8', lineHeight: '1.6', maxWidth: '900px' }}>
          {t('sma.universityHub.subtitle')}
        </p>
      </div>

      {loading && <PixelSkeletonCardGrid count={6} />}

      {/* Grid */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', width: '100%' }}>
          {universities.map(uni => (
            <div 
              key={uni.id} 
              className={styles.retroCard}
              style={{ display: 'flex', flexDirection: 'column', padding: '24px', height: '100%', position: 'relative' }}
            >
              {/* Right-aligned Ribbon Flag */}
              {typeof uni.matchScore === 'number' && (
                <div style={{ position: 'absolute', top: '-16px', right: '-12px', zIndex: 10 }}>
                  <div style={{ 
                    background: '#047857', border: '2px solid #064e3b', color: '#fff', 
                    fontSize: '0.65rem', fontFamily: '"Press Start 2P"', padding: '8px 12px', textAlign: 'center', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)', 
                    whiteSpace: 'nowrap', position: 'relative', zIndex: 2 
                  }}>
                    {uni.matchScore}{t('sma.universityHub.match')}
                  </div>
                  {/* 3D Fold under the right ribbon */}
                  <div style={{ 
                    position: 'absolute', top: '100%', right: '0', width: 0, height: 0, 
                    borderTop: '12px solid #022c22', borderRight: '12px solid transparent', zIndex: 1 
                  }} />
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                {uni.coverImageUrl && (
                  <div style={{ width: '100%', aspectRatio: '16/9', border: '3px solid #5a3a29', background: '#ffffff', marginBottom: '16px', overflow: 'hidden', boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={uni.coverImageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }} />
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '24px', marginTop: uni.coverImageUrl ? '0' : '16px', position: 'relative' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                    <h3 style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#fbbf24', lineHeight: '1.6', textShadow: '1px 1px 0 #3b261b', margin: 0 }}>
                      {uni.title || (uni.facultyTags && uni.facultyTags.length > 0 
                        ? (FACULTIES.find(f => f.value === uni.facultyTags![0])?.label || uni.facultyTags[0]) 
                        : t('sma.universityHub.generalProgram'))}
                    </h3>
                    <p style={{ fontFamily: 'var(--font-vt323), sans-serif', fontSize: '1.15rem', color: '#e4e4e7', lineHeight: '1.6', margin: 0 }}>
                      {uni.name}
                    </p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(0,0,0,0.2)', padding: '16px', border: '2px solid #5a3a29', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <img src="/Map.png" alt="" style={{ width: '18px', height: '18px', imageRendering: 'pixelated', flexShrink: 0, marginTop: '4px' }} />
                    <span style={{ fontFamily: 'var(--font-vt323), sans-serif', fontSize: '1.15rem', color: '#d4d4d8', lineHeight: '1.6' }}>{uni.location || uni.country || '-'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <img src="/Journall.png" alt="" style={{ width: '18px', height: '18px', imageRendering: 'pixelated', flexShrink: 0, marginTop: '4px' }} />
                    <span style={{ fontFamily: 'var(--font-vt323), sans-serif', fontSize: '1.15rem', color: '#d4d4d8', lineHeight: '1.6', wordBreak: 'break-all' }}>{uni.website ? <a href={uni.website.startsWith('http') ? uni.website : `https://${uni.website}`} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'underline' }}>{uni.website}</a> : (uni.accreditation ? `Akreditasi: ${uni.accreditation}` : 'Website: -')}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>💰</span>
                    <span style={{ fontFamily: 'var(--font-vt323), sans-serif', fontSize: '1.15rem', color: '#d4d4d8', lineHeight: '1.6' }}>{uni.estimatedCostMin && uni.estimatedCostMax ? `Rp ${(uni.estimatedCostMin/1000000).toFixed(0)}Jt - ${(uni.estimatedCostMax/1000000).toFixed(0)}Jt / smtr` : 'Estimasi Biaya: -'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <img src="/Scroll.png" alt="" style={{ width: '18px', height: '18px', imageRendering: 'pixelated', flexShrink: 0, marginTop: '4px' }} />
                    <div style={{ fontFamily: 'var(--font-vt323), sans-serif', fontSize: '1.15rem', color: '#d4d4d8', lineHeight: '1.6' }}>
                      <span style={{ fontWeight: 'bold' }}>Jalur Masuk:</span>
                      <ul style={{ margin: '4px 0 0', paddingLeft: '20px', listStyleType: 'disc' }}>
                        {(uni.admissionRequirements || '-').split(';').slice(0, 1).map((req, idx) => (
                          <li key={idx} style={{ paddingLeft: '4px', marginBottom: '4px' }}>{req.trim()}</li>
                        ))}
                        {(uni.admissionRequirements || '-').split(';').length > 1 && (
                          <li style={{ paddingLeft: '4px', marginBottom: '4px', fontStyle: 'italic', color: '#a1a1aa', listStyleType: 'none', marginLeft: '-20px' }}>
                            + {(uni.admissionRequirements || '-').split(';').length - 1} detail lainnya...
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
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
                onMouseEnter={playHoverSound}
                onClick={() => setSelectedUni(uni)}
              >
                {t('sma.universityHub.viewRoadmap')}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal Roadmap */}
      <AnimatePresence>
        {selectedUni && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              style={{
                background: '#d4a373',
                border: '4px solid #5a3a29',
                padding: '32px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '80vh',
                overflowY: 'auto',
                boxShadow: '8px 8px 0 #3b261b'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px dashed #5a3a29', paddingBottom: '16px', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontFamily: '"Press Start 2P"', fontSize: '1.2rem', color: '#3b261b', marginBottom: '8px', lineHeight: '1.4' }}>
                    {t('sma.universityHub.roadmap')}: {selectedUni.facultyTags && selectedUni.facultyTags.length > 0 ? (FACULTIES.find(f => f.value === selectedUni.facultyTags![0])?.label || selectedUni.facultyTags[0]) : t('sma.universityHub.generalProgram')}
                  </h2>
                  <p style={{ fontFamily: 'var(--font-vt323), sans-serif', fontSize: '1.2rem', color: '#5a3a29', fontWeight: 'bold', margin: '8px 0 0' }}>
                    {selectedUni.name}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedUni(null)}
                  onMouseEnter={playHoverSound}
                  style={{ background: '#ef4444', border: '2px solid #991b1b', color: '#fff', padding: '8px', fontFamily: '"Press Start 2P"', fontSize: '0.8rem', cursor: 'pointer', boxShadow: '2px 2px 0 #7f1d1d' }}
                >
                  X
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <p style={{ fontFamily: 'var(--font-vt323), sans-serif', fontSize: '1.2rem', color: '#3b261b', lineHeight: '1.6' }}>
                  {locale === 'id'
                    ? `Centang tiap langkah setelah kamu selesaikan. Progres ini hanya kamu yang atur untuk ${selectedUni.name}.`
                    : `Tick each step once you complete it. Only you manage this progress for ${selectedUni.name}.`}
                </p>

                {(() => {
                  const items = buildChecklist(selectedUni, locale);
                  const doneCount = items.filter(i => checked[i.key]).length;
                  return (
                    <>
                      <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.65rem', color: '#3b261b', margin: 0 }}>
                        {doneCount}/{items.length} {locale === 'id' ? 'selesai' : 'done'}
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {items.map((item) => {
                          const done = !!checked[item.key];
                          return (
                            <label key={item.key} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', cursor: 'pointer' }}>
                              <input
                                type="checkbox"
                                checked={done}
                                onChange={() => toggleItem(item.key)}
                                style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                              />
                              <div style={{
                                width: '40px', height: '40px', flexShrink: 0,
                                background: done ? '#047857' : '#fbbf24',
                                border: '2px solid #3b261b',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#fff',
                                boxShadow: '2px 2px 0 #3b261b'
                              }}>
                                {done ? '✓' : ''}
                              </div>
                              <div style={{ flex: 1, background: done ? 'rgba(4,120,87,0.15)' : 'rgba(255,255,255,0.5)', padding: '12px', border: '2px solid #5a3a29' }}>
                                <h4 style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#3b261b', marginBottom: '8px', textDecoration: done ? 'line-through' : 'none' }}>
                                  {item.title}
                                </h4>
                                <p style={{ fontFamily: 'var(--font-vt323), sans-serif', fontSize: '1.1rem', color: '#5a3a29', lineHeight: '1.4', margin: 0, marginTop: '4px' }}>
                                  {item.desc}
                                </p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </>
                  );
                })()}

                <button 
                  onClick={() => setSelectedUni(null)}
                  onMouseEnter={playHoverSound}
                  style={{ background: '#10b981', border: '2px solid #064e3b', color: '#fff', padding: '16px', fontFamily: '"Press Start 2P"', fontSize: '0.8rem', cursor: 'pointer', boxShadow: '4px 4px 0 #064e3b', marginTop: '16px' }}
                >
                  {t('sma.universityHub.continueLearning')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
