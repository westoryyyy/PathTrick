'use client';
import { useState } from 'react';
import AdminCRUDTable, { Column, Field } from '@/components/admin/AdminCRUDTable';

interface Job { id: string; title: string; company: string; location: string; type: string; salaryRange: string; skills: string[]; coverImage: string; }

const INITIAL: Job[] = [
  { id: '1', title: 'Backend Developer', company: 'Tokopedia', location: 'Jakarta', type: 'On-site', salaryRange: '8-15 juta', skills: ['Node.js', 'PostgreSQL', 'Docker'], coverImage: '' },
  { id: '2', title: 'Frontend Engineer', company: 'Gojek', location: 'Remote', type: 'Remote', salaryRange: '10-18 juta', skills: ['React', 'TypeScript', 'Next.js'], coverImage: '' },
  { id: '3', title: 'AI/ML Engineer', company: 'Traveloka', location: 'Jakarta', type: 'Hybrid', salaryRange: '15-25 juta', skills: ['Python', 'TensorFlow', 'MLOps'], coverImage: '' },
];

const COLUMNS: Column<Job>[] = [
  { key: 'coverImage', label: 'Cover', width: '80px', render: row => row.coverImage ? <img src={row.coverImage} alt="" style={{ width: '60px', height: '34px', objectFit: 'cover', border: '1px solid #5a3a29' }} /> : <span style={{ color: '#5a3a29' }}>-</span> },
  { key: 'title', label: 'Posisi' },
  { key: 'company', label: 'Perusahaan' },
  { key: 'location', label: 'Lokasi' },
  { key: 'type', label: 'Tipe', render: row => {
    const colors: Record<string, string> = { Remote: '#1d4ed8', 'On-site': '#065f46', Hybrid: '#7c3aed' };
    return <span style={{ fontFamily: '"Pixelify Sans"', fontSize: "0.9rem", background: colors[row.type] ?? '#374151', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '3px 8px' }}>{row.type}</span>;
  }},
  { key: 'skills', label: 'Skills', render: row => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
      {row.skills.slice(0, 3).map(s => <span key={s} style={{ fontFamily: '"Pixelify Sans"', fontSize: "0.9rem", background: '#8b1a1a', border: '1px solid #ef4444', color: '#fff', padding: '2px 6px' }}>{s}</span>)}
      {row.skills.length > 3 && <span style={{ fontFamily: '"Pixelify Sans"', fontSize: "0.9rem", color: 'rgba(255,255,255,0.4)' }}>+{row.skills.length - 3}</span>}
    </div>
  )},
];

const FIELDS: Field[] = [
  { key: 'coverImage', label: 'Cover Image', type: 'image' },
  { key: 'title', label: 'Posisi / Jabatan', type: 'text', placeholder: 'Backend Developer', required: true },
  { key: 'company', label: 'Nama Perusahaan', type: 'text', placeholder: 'Tokopedia', required: true },
  { key: 'location', label: 'Lokasi', type: 'text', placeholder: 'Jakarta / Remote' },
  { key: 'type', label: 'Tipe Pekerjaan', type: 'select', options: [
    { value: 'Remote', label: 'Remote' }, { value: 'On-site', label: 'On-site' }, { value: 'Hybrid', label: 'Hybrid' },
  ]},
  { key: 'salaryRange', label: 'Kisaran Gaji', type: 'text', placeholder: '8-15 juta / bulan' },
  { key: 'skills', label: 'Skills yang Dibutuhkan (Enter untuk tambah)', type: 'tags', placeholder: 'React, TypeScript...' },
];

export default function JobsPage() {
  const [data, setData] = useState(INITIAL);
  const add = (d: Partial<Job>) => setData(p => [...p, { ...d, id: Date.now().toString(), skills: (d.skills ?? []) as string[] } as Job]);
  const edit = (id: string, d: Partial<Job>) => setData(p => p.map(r => r.id === id ? { ...r, ...d } : r));
  const del = (id: string) => setData(p => p.filter(r => r.id !== id));
  return (
    <AdminCRUDTable title="MANAJEMEN LOWONGAN KERJA" icon="💼" data={data} columns={COLUMNS} fields={FIELDS}
      onAdd={add} onEdit={edit} onDelete={del} searchKeys={['title', 'company', 'location']} addButtonLabel="Tambah Lowongan" />
  );
}
