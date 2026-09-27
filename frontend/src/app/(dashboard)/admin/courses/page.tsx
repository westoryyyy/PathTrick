'use client';
import { useState } from 'react';
import AdminCRUDTable, { Column, Field } from '@/components/admin/AdminCRUDTable';

interface Course { id: string; title: string; description: string; published: string; sections: number; }

const INITIAL: Course[] = [
  { id: '1', title: 'React untuk Pemula', description: 'Dasar-dasar React JS dari nol', published: 'true', sections: 12 },
  { id: '2', title: 'TypeScript Fundamentals', description: 'Pengenalan TypeScript dan type system', published: 'true', sections: 8 },
  { id: '3', title: 'SQL & Database Design', description: 'Desain database relasional dan query SQL', published: 'false', sections: 15 },
];

const COLUMNS: Column<Course>[] = [
  { key: 'title', label: 'Judul Course' },
  { key: 'sections', label: 'Sections' },
  { key: 'published', label: 'Status', render: row => (
    <span style={{ fontFamily: '"Pixelify Sans"', fontSize: "0.9rem", background: row.published === 'true' ? '#065f46' : '#7f1d1d', border: `2px solid ${row.published === 'true' ? '#10b981' : '#ef4444'}`, color: '#fff', padding: '3px 8px' }}>
      {row.published === 'true' ? '● LIVE' : '○ DRAFT'}
    </span>
  )},
  { key: 'description', label: 'Deskripsi' },
];

const FIELDS: Field[] = [
  { key: 'title', label: 'Judul Course', type: 'text', placeholder: 'React untuk Pemula', required: true },
  { key: 'description', label: 'Deskripsi', type: 'textarea', placeholder: 'Deskripsi singkat course...' },
  { key: 'published', label: 'Status', type: 'select', options: [
    { value: 'false', label: '○ Draft (Belum Dipublikasikan)' }, { value: 'true', label: '● Live (Aktif)' },
  ]},
];

export default function CoursesPage() {
  const [data, setData] = useState(INITIAL);
  const add = (d: Partial<Course>) => setData(p => [...p, { ...d, id: Date.now().toString(), sections: 0 } as Course]);
  const edit = (id: string, d: Partial<Course>) => setData(p => p.map(r => r.id === id ? { ...r, ...d } : r));
  const del = (id: string) => setData(p => p.filter(r => r.id !== id));
  return (
    <AdminCRUDTable title="MANAJEMEN COURSES" icon="📚" data={data} columns={COLUMNS} fields={FIELDS}
      onAdd={add} onEdit={edit} onDelete={del} searchKeys={['title']} addButtonLabel="Tambah Course" />
  );
}
