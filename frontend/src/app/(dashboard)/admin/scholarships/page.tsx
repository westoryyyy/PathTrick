'use client';
import { useState, useEffect, useCallback } from 'react';
import AdminCRUDTable, { Column, Field } from '@/components/admin/AdminCRUDTable';
import { API_BASE_URL } from '@/config/pathtrick';
import { getAuthHeaders } from '@/hooks/useAuthSync';

interface Scholarship { id: string; title: string; provider: string; matchScore: number; deadline: string; coverage: string; requirements: string[]; url: string; coverImage?: string; }

const MOCK_SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'djarum-plus',
    title: 'Djarum Beasiswa Plus',
    provider: 'Djarum Foundation',
    matchScore: 92,
    deadline: '15 Okt 2026',
    coverage: 'Biaya Kuliah + Uang Saku',
    requirements: ['Leadership SBT', 'Min. Rapor 8.0'],
    url: 'https://djarumbeasiswaplus.org/',
    coverImage: '/djarum_logo.png',
  },
  {
    id: 'bpi-kemdikbud',
    title: 'Beasiswa Pendidikan Indonesia',
    provider: 'Kemdikbud Ristek',
    matchScore: 88,
    deadline: '30 Nov 2026',
    coverage: 'Full Funding',
    requirements: ['Prestasi Akademik', 'Esai Kontribusi'],
    url: 'https://beasiswa.kemdikbud.go.id/',
    coverImage: '/Gold Ticket.png',
  },
  {
    id: 'lpdp-s1',
    title: 'Beasiswa S1 Prestasi',
    provider: 'LPDP',
    matchScore: 85,
    deadline: 'TBA 2027',
    coverage: 'Full Funding + Akomodasi',
    requirements: ['Medali Olimpiade', 'Bahasa Inggris'],
    url: 'https://lpdp.kemenkeu.go.id/',
    coverImage: '/Gold Ticket.png',
  }
];

const COLUMNS: Column<Scholarship>[] = [
  { key: 'coverImage', label: 'Cover', width: '80px', render: row => row.coverImage ? <img src={row.coverImage} alt="" style={{ width: '60px', height: '34px', objectFit: 'cover', border: '1px solid #5a3a29' }} /> : <span style={{ color: '#5a3a29' }}>-</span> },
  { key: 'title', label: 'Nama Beasiswa' },
  { key: 'provider', label: 'Penyelenggara' },
  { key: 'deadline', label: 'Deadline', render: row => {
    return <span style={{ fontFamily: '"Pixelify Sans"', fontSize: "0.9rem", color: '#fbbf24' }}>{row.deadline}</span>;
  }},
  { key: 'coverage', label: 'Coverage', render: row => (
    <span style={{ fontFamily: '"Pixelify Sans"', fontSize: "0.9rem", background: '#065f46', border: '2px solid #10b981', color: '#fff', padding: '3px 8px' }}>{row.coverage}</span>
  )},
];

const FIELDS: Field[] = [
  { key: 'coverImage', label: 'Cover Image', type: 'image' },
  { key: 'title', label: 'Nama Beasiswa', type: 'text', placeholder: 'Djarum Beasiswa Plus', required: true },
  { key: 'provider', label: 'Penyelenggara', type: 'text', placeholder: 'Lembaga / Instansi', required: true },
  { key: 'deadline', label: 'Deadline Pendaftaran', type: 'text', required: true },
  { key: 'matchScore', label: 'Match Score (%)', type: 'number', required: true },
  { key: 'coverage', label: 'Coverage / Jumlah', type: 'select', options: [
    { value: 'Full Funding', label: 'Full Funding' }, { value: 'Partial', label: 'Partial' }, { value: 'Biaya Kuliah + Uang Saku', label: 'Biaya Kuliah + Uang Saku' }, { value: 'Full Funding + Akomodasi', label: 'Full Funding + Akomodasi' }
  ]},
  { key: 'requirements', label: 'Persyaratan', type: 'tags', placeholder: 'Tekan enter...' },
  { key: 'url', label: 'Link Official', type: 'text', placeholder: 'https://...' },
];

export default function ScholarshipsPage() {
  const [data, setData] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/admin/scholarships`, { headers: getAuthHeaders() })
      .then(r => r.json())
      .then((d: Scholarship[]) => setData(Array.isArray(d) ? d : []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const add = async (d: Partial<Scholarship>) => {
    await fetch(`${API_BASE_URL}/api/admin/scholarships`, {
      method: 'POST', headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(d),
    });
    load();
  };

  const edit = async (id: string, d: Partial<Scholarship>) => {
    await fetch(`${API_BASE_URL}/api/admin/scholarships/${id}`, {
      method: 'PUT', headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(d),
    });
    load();
  };

  const del = async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/api/admin/scholarships/${id}`, {
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
    <AdminCRUDTable title="MANAJEMEN BEASISWA" icon="💰" data={data} columns={COLUMNS} fields={FIELDS}
      onAdd={add} onEdit={edit} onDelete={del} searchKeys={['title', 'provider']} addButtonLabel="Tambah Beasiswa" />
  );
}
