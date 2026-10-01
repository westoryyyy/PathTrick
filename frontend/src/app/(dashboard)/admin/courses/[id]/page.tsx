'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { API_BASE_URL } from '@/config/pathtrick';
import { getAuthHeaders } from '@/hooks/useAuthSync';

const px: React.CSSProperties = { fontFamily: '"Pixelify Sans", sans-serif' };

interface QuizQuestion { id?: string; prompt: string; options: string[]; correctAnswer: string; points: number; order: number; }
interface Quiz { id?: string; title: string; passingScore: number; questions: QuizQuestion[]; }
interface Section { id: string; title: string; order: number; content: string; category: string; xpReward: number; quiz?: Quiz | null; missionId?: string | null; }
interface Chapter { id: string; title: string; order: number; durationLabel: string; sections: Section[]; }
interface Course { id: string; title: string; description: string; isPublished: boolean; isFallback: boolean; chapters: Chapter[]; }

const BTN_BASE: React.CSSProperties = { fontFamily: '"Pixelify Sans", sans-serif', border: '2px solid', cursor: 'pointer', padding: '6px 14px', fontSize: '0.85rem', background: 'none', color: '#fbbf24', borderColor: '#5a3a29' };
const BTN_DANGER: React.CSSProperties = { ...BTN_BASE, color: '#f87171', borderColor: '#7f1d1d' };
const BTN_PRIMARY: React.CSSProperties = { ...BTN_BASE, background: '#7c3aed', borderColor: '#a78bfa', color: '#fff' };

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [addingChapter, setAddingChapter] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [newSectionData, setNewSectionData] = useState<Record<string, { title: string; content: string; xpReward: string; missionId: string }>>({});
  const [editingSections, setEditingSections] = useState<Record<string, { title: string; content: string; xpReward: string; missionId: string }>>({});
  const [editingQuiz, setEditingQuiz] = useState<Record<string, Quiz>>({});
  
  const [editingCourse, setEditingCourse] = useState(false);
  const [editCourseData, setEditCourseData] = useState({ title: '', description: '' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/courses/${id}`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Course tidak ditemukan');
      setCourse(await res.json());
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const toggleChapter = (cid: string) =>
    setExpandedChapters(prev => { const s = new Set(prev); s.has(cid) ? s.delete(cid) : s.add(cid); return s; });

  const toggleSection = (sid: string) =>
    setExpandedSections(prev => { const s = new Set(prev); s.has(sid) ? s.delete(sid) : s.add(sid); return s; });

  // ── Chapter CRUD ──────────────────────────────────────
  const addChapter = async () => {
    if (!newChapterTitle.trim() || !course) return;
    setSaving(true);
    const nextOrder = (course.chapters.length > 0 ? Math.max(...course.chapters.map(c => c.order)) : 0) + 1;
    await fetch(`${API_BASE_URL}/api/admin/courses/${id}/chapters`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newChapterTitle.trim(), order: nextOrder, durationLabel: '6 Levels' }),
    });
    setNewChapterTitle(''); setAddingChapter(false); setSaving(false); load();
  };

  const deleteChapter = async (chapterId: string) => {
    if (!confirm('Hapus chapter ini? Semua section di dalamnya ikut terhapus.')) return;
    setSaving(true);
    await fetch(`${API_BASE_URL}/api/admin/courses/${id}/chapters/${chapterId}`, { method: 'DELETE', headers: getAuthHeaders() });
    setSaving(false); load();
  };

  // ── Section CRUD ──────────────────────────────────────
  const addSection = async (chapterId: string) => {
    const d = newSectionData[chapterId];
    if (!d?.title?.trim() || !course) return;
    const chapter = course.chapters.find(c => c.id === chapterId);
    if (!chapter) return;
    const nextOrder = (chapter.sections.length > 0 ? Math.max(...chapter.sections.map(s => s.order)) : 0) + 1;
    setSaving(true);
    await fetch(`${API_BASE_URL}/api/admin/courses/${id}/chapters/${chapterId}/sections`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: d.title.trim(),
        content: d.content || '# Konten baru\n\nIsi materi di sini.',
        order: nextOrder,
        xpReward: parseInt(d.xpReward || '100', 10),
        category: 'skill',
        missionId: d.missionId?.trim() || null
      }),
    });
    setNewSectionData(prev => ({ ...prev, [chapterId]: { title: '', content: '', xpReward: '100', missionId: '' } }));
    setSaving(false); load();
  };

  const deleteSection = async (chapterId: string, sectionId: string) => {
    if (!confirm('Hapus section ini?')) return;
    setSaving(true);
    await fetch(`${API_BASE_URL}/api/admin/courses/${id}/chapters/${chapterId}/sections/${sectionId}`, { method: 'DELETE', headers: getAuthHeaders() });
    setSaving(false); load();
  };

  const initSectionEdit = (section: Section) => {
    setEditingSections(prev => ({
      ...prev,
      [section.id]: {
        title: section.title,
        content: section.content,
        xpReward: section.xpReward.toString(),
        missionId: section.missionId || ''
      }
    }));
  };

  const saveSection = async (chapterId: string, sectionId: string) => {
    const d = editingSections[sectionId];
    if (!d || !d.title.trim()) return;
    setSaving(true);
    const res = await fetch(`${API_BASE_URL}/api/admin/courses/${id}/chapters/${chapterId}/sections/${sectionId}`, {
      method: 'PUT',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: d.title.trim(),
        content: d.content,
        xpReward: parseInt(d.xpReward || '100', 10),
        missionId: d.missionId.trim() || null
      })
    });
    if (!res.ok) {
      alert('Gagal simpan section');
    } else {
      setEditingSections(prev => {
        const next = { ...prev };
        delete next[sectionId];
        return next;
      });
    }
    setSaving(false); load();
  };

  const initQuiz = (section: Section) => {
    let quiz = section.quiz;
    if (quiz) {
      // Normalisasi options dan correctAnswer jika berasal dari seed database ({ id, text })
      quiz = {
        ...quiz,
        questions: quiz.questions.map(q => {
          const ans: any = q.correctAnswer;
          if (q.type === 'ESSAY') {
            return {
              ...q,
              options: [],
              correctAnswer: typeof ans === 'string' ? { text: ans, keywords: [] } : ans
            };
          }
          return {
            ...q,
            options: (q.options || []).map((opt: any) => 
              typeof opt === 'string' ? opt : (opt?.text || opt?.id || '')
            ),
            correctAnswer: typeof ans === 'string' ? ans : (ans?.text || ans?.id || '')
          };
        })
      };
    }
    setEditingQuiz(prev => ({ ...prev, [section.id]: quiz ?? { title: 'Quiz', passingScore: 75, questions: [] } }));
    if (!expandedSections.has(section.id)) toggleSection(section.id);
  };

  const saveQuiz = async (sectionId: string) => {
    const quiz = editingQuiz[sectionId];
    if (!quiz) return;
    setSaving(true);
    const res = await fetch(`${API_BASE_URL}/api/admin/sections/${sectionId}/quiz`, {
      method: 'PUT', headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' }, body: JSON.stringify(quiz),
    });
    if (!res.ok) alert('Gagal simpan quiz');
    setSaving(false); load();
  };

  const addQuestion = (sectionId: string, type: 'MULTIPLE_CHOICE' | 'ESSAY' = 'MULTIPLE_CHOICE') => {
    setEditingQuiz(prev => {
      const q = prev[sectionId] ?? { title: 'Quiz', passingScore: 75, questions: [] };
      const newQuestion = type === 'ESSAY'
        ? { type: 'ESSAY', prompt: '', options: [], correctAnswer: { text: '', keywords: [] }, points: 1, order: q.questions.length + 1 }
        : { type: 'MULTIPLE_CHOICE', prompt: '', options: ['', '', '', ''], correctAnswer: '', points: 1, order: q.questions.length + 1 };
      return { ...prev, [sectionId]: { ...q, questions: [...q.questions, newQuestion] } };
    });
  };

  // ── Toggle publish ────────────────────────────────────
  const togglePublish = async () => {
    if (!course) return;
    setSaving(true);
    await fetch(`${API_BASE_URL}/api/admin/courses/${id}`, {
      method: 'PUT', headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: course.title, description: course.description, isPublished: !course.isPublished, isFallback: course.isFallback }),
    });
    setSaving(false); load();
  };

  const saveCourseMetadata = async () => {
    if (!course || !editCourseData.title.trim()) return;
    setSaving(true);
    await fetch(`${API_BASE_URL}/api/admin/courses/${id}`, {
      method: 'PUT', headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        title: editCourseData.title, 
        description: editCourseData.description, 
        isPublished: course.isPublished, 
        isFallback: course.isFallback 
      }),
    });
    setEditingCourse(false);
    setSaving(false); 
    load();
  };

  if (loading) return <div style={{ ...px, padding: '32px', color: '#fbbf24' }}>Memuat detail course…</div>;
  if (error || !course) return (
    <div style={{ ...px, padding: '32px', color: '#f87171' }}>
      {error || 'Course tidak ditemukan'}<br />
      <Link href="/admin/courses" style={{ color: '#fbbf24', marginTop: '12px', display: 'inline-block' }}>← Kembali</Link>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ background: 'rgba(139,26,26,0.15)', border: '3px solid #5a3a29', padding: '16px 20px', boxShadow: '4px 4px 0 rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <Link href="/admin/courses" style={{ ...px, fontSize: '0.8rem', color: '#a78bfa', textDecoration: 'none' }}>← Kembali ke Daftar Course</Link>
            
            {editingCourse ? (
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input 
                  value={editCourseData.title} 
                  onChange={e => setEditCourseData({...editCourseData, title: e.target.value})}
                  style={{ ...px, fontSize: '1.2rem', padding: '6px', background: '#1a0d05', color: '#fff', border: '2px solid #5a3a29' }}
                />
                <textarea 
                  value={editCourseData.description}
                  onChange={e => setEditCourseData({...editCourseData, description: e.target.value})}
                  style={{ ...px, fontSize: '0.85rem', padding: '6px', background: '#1a0d05', color: '#fff', border: '2px solid #5a3a29', minHeight: '60px' }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={BTN_PRIMARY} onClick={saveCourseMetadata} disabled={saving}>Simpan</button>
                  <button style={BTN_BASE} onClick={() => setEditingCourse(false)}>Batal</button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <h1 style={{ ...px, fontSize: '1.3rem', color: '#fbbf24', margin: '6px 0 2px', textShadow: '2px 2px 0 #000' }}>📚 {course.title}</h1>
                  <button style={{ ...BTN_BASE, padding: '2px 8px', fontSize: '0.75rem' }} onClick={() => {
                    setEditCourseData({ title: course.title, description: course.description });
                    setEditingCourse(true);
                  }}>✏ Edit</button>
                </div>
                <p style={{ ...px, fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>{course.description}</p>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ ...px, fontSize: '0.85rem', background: course.isPublished ? '#065f46' : '#7f1d1d', border: `2px solid ${course.isPublished ? '#10b981' : '#ef4444'}`, color: '#fff', padding: '4px 12px' }}>
              {course.isPublished ? '● LIVE' : '○ DRAFT'}
            </span>
            <button style={BTN_PRIMARY} onClick={togglePublish} disabled={saving}>{course.isPublished ? 'Pindahkan ke Draft' : 'Publikasikan'}</button>
          </div>
        </div>
      </div>

      {/* Chapters */}
      {course.chapters.map(chapter => (
        <div key={chapter.id} style={{ background: '#2e1608', border: '3px solid #5a3a29', boxShadow: '4px 4px 0 rgba(0,0,0,0.5)' }}>
          {/* Chapter header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', cursor: 'pointer', borderBottom: expandedChapters.has(chapter.id) ? '2px solid #5a3a29' : 'none' }} onClick={() => toggleChapter(chapter.id)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#fbbf24', fontSize: '1rem' }}>{expandedChapters.has(chapter.id) ? '▾' : '▸'}</span>
              <span style={{ ...px, color: '#fbbf24', fontSize: '1rem' }}>Chapter {chapter.order}: {chapter.title}</span>
              <span style={{ ...px, fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{chapter.sections.length} sections</span>
            </div>
            <button style={BTN_DANGER} onClick={e => { e.stopPropagation(); deleteChapter(chapter.id); }} disabled={saving}>Hapus Chapter</button>
          </div>

          {/* Sections */}
          {expandedChapters.has(chapter.id) && (
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {chapter.sections.map(section => (
                <div key={section.id} style={{ background: '#2a140a', border: '2px solid #3a2010', padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ ...px, color: '#e2c08d', fontSize: '0.95rem' }}>Section {section.order}: {section.title}</span>
                      <span style={{ ...px, fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginLeft: '10px' }}>{section.xpReward} XP</span>
                      {section.quiz && <span style={{ ...px, fontSize: '0.75rem', background: '#1d4ed8', border: '1px solid #60a5fa', color: '#fff', padding: '2px 6px', marginLeft: '8px' }}>QUIZ</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={BTN_BASE} onClick={() => {
                        if (editingSections[section.id]) {
                          setEditingSections(prev => { const next = { ...prev }; delete next[section.id]; return next; });
                        } else {
                          initSectionEdit(section);
                        }
                      }}>
                        {editingSections[section.id] ? 'Batal Edit Materi' : 'Edit Materi'}
                      </button>
                      <button style={BTN_BASE} onClick={() => {
                        if (expandedSections.has(section.id)) {
                          toggleSection(section.id);
                        } else {
                          initQuiz(section);
                        }
                      }}>
                        {expandedSections.has(section.id) ? 'Tutup Quiz' : section.quiz ? 'Edit Quiz' : 'Tambah Quiz'}
                      </button>
                      <button style={BTN_DANGER} onClick={() => deleteSection(chapter.id, section.id)} disabled={saving}>Hapus</button>
                    </div>
                  </div>

                  {/* Materi Editor */}
                  {editingSections[section.id] && (
                    <div style={{ marginTop: '12px', background: '#1a0d05', border: '1px solid #4a2610', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 180px' }}>
                          <label style={{ ...px, fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '4px' }}>Judul Level/Section</label>
                          <input style={{ ...px, width: '100%', background: '#2a140a', border: '1px solid #5a3a29', color: '#fff', padding: '6px 10px', fontSize: '0.9rem', boxSizing: 'border-box' as const }}
                            value={editingSections[section.id].title}
                            onChange={e => setEditingSections(prev => ({ ...prev, [section.id]: { ...prev[section.id], title: e.target.value } }))} />
                        </div>
                        <div style={{ width: '120px' }}>
                          <label style={{ ...px, fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '4px' }}>XP Reward</label>
                          <input type="number" style={{ ...px, width: '100%', background: '#2a140a', border: '1px solid #5a3a29', color: '#fff', padding: '6px 10px', fontSize: '0.9rem', boxSizing: 'border-box' as const }}
                            value={editingSections[section.id].xpReward}
                            onChange={e => setEditingSections(prev => ({ ...prev, [section.id]: { ...prev[section.id], xpReward: e.target.value } }))} />
                        </div>
                      </div>
                      <label style={{ ...px, fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '4px' }}>Konten Materi (Markdown/HTML)</label>
                      <textarea rows={6}
                        style={{ ...px, width: '100%', background: '#2a140a', border: '1px solid #5a3a29', color: '#fff', padding: '6px 10px', fontSize: '0.85rem', resize: 'vertical', boxSizing: 'border-box' as const }}
                        value={editingSections[section.id].content}
                        onChange={e => setEditingSections(prev => ({ ...prev, [section.id]: { ...prev[section.id], content: e.target.value } }))} />
                      
                      <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                        <button style={BTN_PRIMARY} onClick={() => saveSection(chapter.id, section.id)} disabled={saving}>{saving ? 'Menyimpan…' : '💾 Simpan Materi'}</button>
                      </div>
                    </div>
                  )}

                  {/* Quiz Editor */}
                  {expandedSections.has(section.id) && editingQuiz[section.id] && (
                    <div style={{ marginTop: '12px', background: '#1a0d05', border: '1px solid #4a2610', padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '180px' }}>
                          <label style={{ ...px, fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '4px' }}>Judul Quiz</label>
                          <input style={{ ...px, width: '100%', background: '#2a140a', border: '1px solid #5a3a29', color: '#fff', padding: '6px 10px', fontSize: '0.9rem', boxSizing: 'border-box' as const }}
                            value={editingQuiz[section.id].title}
                            onChange={e => setEditingQuiz(prev => ({ ...prev, [section.id]: { ...prev[section.id], title: e.target.value } }))} />
                        </div>
                        <div style={{ width: '140px' }}>
                          <label style={{ ...px, fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '4px' }}>Passing Score (%)</label>
                          <input type="number" style={{ ...px, width: '100%', background: '#2a140a', border: '1px solid #5a3a29', color: '#fff', padding: '6px 10px', fontSize: '0.9rem', boxSizing: 'border-box' as const }}
                            value={editingQuiz[section.id].passingScore}
                            onChange={e => setEditingQuiz(prev => ({ ...prev, [section.id]: { ...prev[section.id], passingScore: parseInt(e.target.value, 10) || 75 } }))} />
                        </div>
                      </div>

                      {editingQuiz[section.id].questions.map((q, qi) => (
                        <div key={qi} style={{ background: '#2a140a', border: '1px solid #5a3a29', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ ...px, fontSize: '0.75rem', color: '#a78bfa' }}>Soal #{qi + 1} ({q.type === 'ESSAY' ? 'Essay' : 'Pilihan Ganda'})</span>
                            <button style={{ ...BTN_DANGER, padding: '2px 8px', fontSize: '0.7rem' }} onClick={() => setEditingQuiz(prev => {
                              const qs = [...prev[section.id].questions];
                              qs.splice(qi, 1);
                              return { ...prev, [section.id]: { ...prev[section.id], questions: qs } };
                            })}>Hapus Soal</button>
                          </div>
                          <input placeholder="Pertanyaan..." style={{ ...px, width: '100%', background: '#1a0d05', border: '1px solid #5a3a29', color: '#fff', padding: '6px 10px', fontSize: '0.9rem', boxSizing: 'border-box' as const }}
                            value={q.prompt}
                            onChange={e => setEditingQuiz(prev => { const qs = [...prev[section.id].questions]; qs[qi] = { ...qs[qi], prompt: e.target.value }; return { ...prev, [section.id]: { ...prev[section.id], questions: qs } }; })} />
                          
                          {q.type === 'ESSAY' ? (
                            <>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ ...px, fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Keywords (wajib, pisahkan koma):</label>
                                <input placeholder="Contoh: let, variable, var" style={{ ...px, background: '#1a0d05', border: '1px solid #5a3a29', color: '#fff', padding: '5px 8px', fontSize: '0.85rem' }}
                                  value={q.correctAnswer?.keywords?.join(', ') || ''}
                                  onChange={e => setEditingQuiz(prev => { 
                                    const qs = [...prev[section.id].questions]; 
                                    const ans = qs[qi].correctAnswer;
                                    qs[qi] = { ...qs[qi], correctAnswer: { ...ans, keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean) } }; 
                                    return { ...prev, [section.id]: { ...prev[section.id], questions: qs } }; 
                                  })} />
                              </div>
                            </>
                          ) : (
                            <>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                                {q.options.map((opt: any, oi) => {
                                  const optStr = typeof opt === 'string' ? opt : (opt?.text || opt?.id || '');
                                  return (
                                  <input key={oi} placeholder={`Opsi ${String.fromCharCode(65 + oi)}`}
                                    style={{ ...px, background: '#1a0d05', border: `1px solid ${optStr === q.correctAnswer && optStr ? '#10b981' : '#5a3a29'}`, color: '#fff', padding: '5px 8px', fontSize: '0.85rem' }}
                                    value={optStr}
                                    onChange={e => setEditingQuiz(prev => { const qs = [...prev[section.id].questions]; const opts = [...qs[qi].options]; opts[oi] = e.target.value; qs[qi] = { ...qs[qi], options: opts }; return { ...prev, [section.id]: { ...prev[section.id], questions: qs } }; })} />
                                )})}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <label style={{ ...px, fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Jawaban Benar:</label>
                                <select style={{ ...px, background: '#1a0d05', border: '1px solid #5a3a29', color: '#fff', padding: '4px 8px', fontSize: '0.85rem' }}
                                  value={q.correctAnswer}
                                  onChange={e => setEditingQuiz(prev => { const qs = [...prev[section.id].questions]; qs[qi] = { ...qs[qi], correctAnswer: e.target.value }; return { ...prev, [section.id]: { ...prev[section.id], questions: qs } }; })}>
                                  <option value="">-- Pilih --</option>
                                  {q.options.map((opt: any) => typeof opt === 'string' ? opt : (opt?.text || opt?.id || '')).filter(Boolean).map((optStr, oi) => <option key={oi} value={optStr}>{optStr}</option>)}
                                </select>
                              </div>
                            </>
                          )}
                        </div>
                      ))}

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button style={BTN_BASE} onClick={() => addQuestion(section.id, 'MULTIPLE_CHOICE')}>+ Soal Pilihan Ganda</button>
                        <button style={BTN_BASE} onClick={() => addQuestion(section.id, 'ESSAY')}>+ Soal Essay</button>
                        <button style={BTN_PRIMARY} onClick={() => saveQuiz(section.id)} disabled={saving}>{saving ? 'Menyimpan…' : '💾 Simpan Quiz'}</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Add Section Form */}
              <div style={{ background: '#1a0d05', border: '1px dashed #5a3a29', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ ...px, fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>+ Tambah Section (Level) Baru</span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <input placeholder="Judul section..." style={{ ...px, flex: '1 1 180px', background: '#2a140a', border: '1px solid #5a3a29', color: '#fff', padding: '6px 10px', fontSize: '0.9rem' }}
                    value={newSectionData[chapter.id]?.title ?? ''}
                    onChange={e => setNewSectionData(prev => ({ ...prev, [chapter.id]: { ...prev[chapter.id], title: e.target.value, content: prev[chapter.id]?.content ?? '', xpReward: prev[chapter.id]?.xpReward ?? '100', missionId: prev[chapter.id]?.missionId ?? '' } }))} />
                  <input placeholder="XP" type="number" style={{ ...px, width: '80px', background: '#2a140a', border: '1px solid #5a3a29', color: '#fff', padding: '6px 10px', fontSize: '0.9rem' }}
                    value={newSectionData[chapter.id]?.xpReward ?? '100'}
                    onChange={e => setNewSectionData(prev => ({ ...prev, [chapter.id]: { ...prev[chapter.id], xpReward: e.target.value, title: prev[chapter.id]?.title ?? '', content: prev[chapter.id]?.content ?? '', missionId: prev[chapter.id]?.missionId ?? '' } }))} />
                  <button style={BTN_PRIMARY} onClick={() => addSection(chapter.id)} disabled={saving || !newSectionData[chapter.id]?.title?.trim()}>Tambah Section</button>
                </div>
                <textarea placeholder="Konten materi (Markdown/HTML)..." rows={3}
                  style={{ ...px, width: '100%', background: '#2a140a', border: '1px solid #5a3a29', color: '#fff', padding: '6px 10px', fontSize: '0.85rem', resize: 'vertical', boxSizing: 'border-box' as const }}
                  value={newSectionData[chapter.id]?.content ?? ''}
                  onChange={e => setNewSectionData(prev => ({ ...prev, [chapter.id]: { ...prev[chapter.id], content: e.target.value, title: prev[chapter.id]?.title ?? '', xpReward: prev[chapter.id]?.xpReward ?? '100', missionId: prev[chapter.id]?.missionId ?? '' } }))} />
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add Chapter */}
      <div style={{ background: '#1a0d05', border: '2px dashed #5a3a29', padding: '16px' }}>
        {addingChapter ? (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input autoFocus placeholder="Judul chapter baru..." style={{ ...px, flex: '1 1 200px', background: '#2a140a', border: '1px solid #5a3a29', color: '#fff', padding: '8px 12px', fontSize: '0.95rem' }}
              value={newChapterTitle} onChange={e => setNewChapterTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && addChapter()} />
            <button style={BTN_PRIMARY} onClick={addChapter} disabled={saving || !newChapterTitle.trim()}>{saving ? 'Menyimpan…' : 'Buat Chapter'}</button>
            <button style={BTN_BASE} onClick={() => { setAddingChapter(false); setNewChapterTitle(''); }}>Batal</button>
          </div>
        ) : (
          <button style={{ ...BTN_PRIMARY, width: '100%', padding: '12px', fontSize: '0.95rem' }} onClick={() => setAddingChapter(true)}>+ Tambah Chapter Baru</button>
        )}
      </div>
    </div>
  );
}
