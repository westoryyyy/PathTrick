'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AdminCRUDTable, { Column, Field } from '@/components/admin/AdminCRUDTable';
import { API_BASE_URL } from '@/config/pathtrick';
import { getAuthHeaders } from '@/hooks/useAuthSync';

interface Course { id: string; title: string; description: string; published: string; sections: number; }


const COLUMNS: Column<Course>[] = [
  { key: 'title', label: 'Judul Course' },
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
  const add = async (d: Partial<Course>) => {
    await fetch(`${API_BASE_URL}/api/admin/courses`, {
      method: 'POST', headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...d, isPublished: d.published === 'true' }),
    });
    load();
  };

  const edit = async (id: string, d: Partial<Course>) => {
    await fetch(`${API_BASE_URL}/api/admin/courses/${id}`, {
      method: 'PUT', headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...d, isPublished: d.published === 'true' }),
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

  return (
    <AdminCRUDTable title="MANAJEMEN COURSES" icon="📚" data={data} columns={COLUMNS} fields={FIELDS}
      onAdd={add} onEdit={edit} onDelete={del} searchKeys={['title']} addButtonLabel="Tambah Course" isLoading={loading} />
  );
}
