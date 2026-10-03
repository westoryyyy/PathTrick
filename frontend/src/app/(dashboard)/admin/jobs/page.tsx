'use client';
import { useState, useEffect, useCallback } from 'react';
import AdminCRUDTable, { Column, Field } from '@/components/admin/AdminCRUDTable';
import { API_BASE_URL } from '@/config/pathtrick';
import { getAuthHeaders } from '@/hooks/useAuthSync';

interface Job { id: string; title: string; company: string; location: string; type: string; salaryRange: string; skills: string[]; coverImage: string; }


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
  { key: 'coverImage', label: 'Cover Image URL', type: 'text', placeholder: 'https://example.com/image.jpg' },
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
  const [data, setData] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/admin/jobs`, { headers: getAuthHeaders() })
      .then(r => r.json())
      .then((d: Job[]) => setData(Array.isArray(d) ? d : []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const add = async (d: Partial<Job>) => {
    await fetch(`${API_BASE_URL}/api/admin/jobs`, {
      method: 'POST', headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...d, skills: d.skills ?? [] }),
    });
    load();
  };

  const edit = async (id: string, d: Partial<Job>) => {
    await fetch(`${API_BASE_URL}/api/admin/jobs/${id}`, {
      method: 'PUT', headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(d),
    });
    load();
  };

  const del = async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/api/admin/jobs/${id}`, {
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
    <AdminCRUDTable title="MANAJEMEN LOWONGAN KERJA" icon="💼" data={data} columns={COLUMNS} fields={FIELDS}
      onAdd={add} onEdit={edit} onDelete={del} searchKeys={['title', 'company', 'location']} addButtonLabel="Tambah Lowongan" />
  );
}
