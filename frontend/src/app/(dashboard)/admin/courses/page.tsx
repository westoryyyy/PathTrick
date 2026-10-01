'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AdminCRUDTable, { Column, Field } from '@/components/admin/AdminCRUDTable';
import { API_BASE_URL } from '@/config/pathtrick';
import { getAuthHeaders } from '@/hooks/useAuthSync';

interface Course { id: string; title: string; description: string; published: string; sections: number; facultyTags: string[]; houseId?: string; order?: number; }

const FACULTIES = [
  { value: 'all', label: 'Semua Fakultas' },
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

const COLUMNS: Column<Course>[] = [
  { key: 'title', label: 'Judul Course' },
  { key: 'order', label: 'Urutan' },
  { key: 'sections', label: 'Sections' },
  { key: 'published', label: 'Status', render: row => (
    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: "0.8rem", background: row.published === 'true' ? '#065f46' : '#7f1d1d', border: `2px solid ${row.published === 'true' ? '#10b981' : '#ef4444'}`, color: '#fff', padding: '4px 10px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
      <span style={{ fontSize: '10px' }}>{row.published === 'true' ? '●' : '○'}</span>
      {row.published === 'true' ? 'LIVE' : 'DRAFT'}
    </span>
  )},
  { key: 'description', label: 'Deskripsi' },
  { key: 'id', label: 'Editor', render: row => (
    <Link href={`/admin/courses/${row.id}`} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.8rem', background: '#7c3aed', border: '2px solid #a78bfa', color: '#fff', padding: '6px 12px', textDecoration: 'none', display: 'inline-block', whiteSpace: 'nowrap', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
      ✏ Edit Konten
    </Link>
  )},
];

const FIELDS: Field[] = [
  { key: 'title', label: 'Judul Course', type: 'text', placeholder: 'React untuk Pemula', required: true },
  { key: 'description', label: 'Deskripsi', type: 'textarea', placeholder: 'Deskripsi singkat course...' },
  { key: 'houseId', label: 'House ID', type: 'text', placeholder: 'Kosongkan jika untuk Chaser. Cth: house-health' },
  { key: 'facultyTags', label: 'Fakultas / Tag', type: 'multiselect', options: FACULTIES.filter(f => f.value !== 'all'), helpText: 'Klik untuk memilih (bisa lebih dari 1)', required: true },
  { key: 'order', label: 'Urutan (Order)', type: 'number', placeholder: '0', helpText: 'Angka lebih kecil tampil lebih awal' },
  { key: 'published', label: 'Status', type: 'select', options: [
    { value: 'false', label: '○ Draft (Belum Dipublikasikan)' }, { value: 'true', label: '● Live (Aktif)' },
  ]},
];

export default function CoursesPage() {
  const [data, setData] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/admin/courses`, { headers: getAuthHeaders() })
      .then(r => r.json())
      .then((d: Course[]) => setData(Array.isArray(d) ? d : []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  // Note: Full course editor (chapters/sections/quiz) is not yet implemented.
  // Add/Edit here only updates top-level course metadata.
  const add = async (d: Partial<Course> & { published?: string }) => {
    const payload = { ...d, isPublished: d.published === 'true', facultyTags: Array.isArray(d.facultyTags) ? d.facultyTags : [], order: Number(d.order) || 0 };
    if (!payload.houseId) delete payload.houseId;
    await fetch(`${API_BASE_URL}/api/admin/courses`, {
      method: 'POST', headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    load();
  };

  const edit = async (id: string, d: Partial<Course> & { published?: string }) => {
    const payload = { ...d, isPublished: d.published === 'true', facultyTags: Array.isArray(d.facultyTags) ? d.facultyTags : [], order: Number(d.order) || 0 };
    if (!payload.houseId) payload.houseId = null as any;
    await fetch(`${API_BASE_URL}/api/admin/courses/${id}`, {
      method: 'PUT', headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    load();
  };

  const del = async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/api/admin/courses/${id}`, {
      method: 'DELETE', headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err.message || 'Gagal menghapus');
      return;
    }
    load();
  };

  const [activeFacultyTab, setActiveFacultyTab] = useState('all');

  const filteredData = data.filter(c => {
    if (activeFacultyTab === 'all') return true;
    return c.facultyTags && c.facultyTags.includes(activeFacultyTab);
  });

  const px = { fontFamily: 'Inter, sans-serif' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      <AdminCRUDTable 
        title="MANAJEMEN COURSES" 
        icon="📚" 
        data={filteredData} 
        columns={COLUMNS} 
        fields={FIELDS}
        normalizeForEdit={(row) => ({
          ...row,
          facultyTags: row.facultyTags || [],
          published: row.published === 'true' ? 'true' : 'false',
          order: row.order ?? 0
        })}
        onAdd={add as any} 
        onEdit={edit as any} 
        onDelete={del} 
        searchKeys={['title']} 
        addButtonLabel="Tambah Course Manual" 
        isLoading={loading}
        customFilter={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ ...px, fontSize: '0.85rem', color: '#fbbf24', fontWeight: 'bold' }}>Fakultas:</span>
            <select 
              value={activeFacultyTab}
              onChange={(e) => setActiveFacultyTab(e.target.value)}
              style={{
                ...px,
                background: '#1a0d05',
                color: '#fff',
                border: '2px solid #a78bfa',
                padding: '6px 12px',
                fontSize: '0.85rem',
                cursor: 'pointer',
                outline: 'none',
                minWidth: '200px'
              }}
            >
              {FACULTIES.map(fac => (
                <option key={fac.value} value={fac.value}>{fac.label}</option>
              ))}
            </select>
          </div>
        }
      />
    </div>
  );
}
