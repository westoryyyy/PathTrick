'use client';
import { useState } from 'react';
import AdminCRUDTable, { Column, Field } from '@/components/admin/AdminCRUDTable';

interface Scholarship { id: string; name: string; provider: string; deadline: string; amount: string; requirements: string; coverImage: string; }

const INITIAL: Scholarship[] = [
  { id: '1', name: 'LPDP Reguler 2026', provider: 'Kemenkeu RI', deadline: '2026-03-31', amount: 'Full Funding', requirements: 'IPK ≥ 3.0, Toefl ≥ 500', coverImage: '' },
  { id: '2', name: 'Beasiswa Unggulan Kemendikbud', provider: 'Kemendikbud', deadline: '2026-05-15', amount: 'Partial', requirements: 'IPK ≥ 3.25, Aktif berorganisasi', coverImage: '' },
  { id: '3', name: 'Beasiswa APERTI BUMN', provider: 'BUMN', deadline: '2026-02-28', amount: 'Full Funding', requirements: 'Maks 23 tahun, IPK ≥ 3.0', coverImage: '' },
];

const COLUMNS: Column<Scholarship>[] = [
  { key: 'coverImage', label: 'Cover', width: '80px', render: row => row.coverImage ? <img src={row.coverImage} alt="" style={{ width: '60px', height: '34px', objectFit: 'cover', border: '1px solid #5a3a29' }} /> : <span style={{ color: '#5a3a29' }}>-</span> },
  { key: 'name', label: 'Nama Beasiswa' },
  { key: 'provider', label: 'Penyelenggara' },
  { key: 'deadline', label: 'Deadline', render: row => {
    const d = new Date(row.deadline);
    const isPast = d < new Date();
    return <span style={{ fontFamily: '"Pixelify Sans"', fontSize: "0.9rem", color: isPast ? '#ef4444' : '#10b981' }}>{row.deadline}</span>;
  }},
  { key: 'amount', label: 'Coverage', render: row => (
    <span style={{ fontFamily: '"Pixelify Sans"', fontSize: "0.9rem", background: '#065f46', border: '2px solid #10b981', color: '#fff', padding: '3px 8px' }}>{row.amount}</span>
  )},
];

const FIELDS: Field[] = [
  { key: 'coverImage', label: 'Cover Image', type: 'image' },
  { key: 'name', label: 'Nama Beasiswa', type: 'text', placeholder: 'LPDP Reguler 2026', required: true },
  { key: 'provider', label: 'Penyelenggara', type: 'text', placeholder: 'Lembaga / Instansi', required: true },
  { key: 'deadline', label: 'Deadline Pendaftaran', type: 'date', required: true },
  { key: 'amount', label: 'Coverage / Jumlah', type: 'select', options: [
    { value: 'Full Funding', label: 'Full Funding' }, { value: 'Partial', label: 'Partial' }, { value: 'Uang Saku', label: 'Uang Saku Saja' },
  ]},
  { key: 'requirements', label: 'Persyaratan', type: 'textarea', placeholder: 'IPK, usia, dll...' },
];

export default function ScholarshipsPage() {
  const [data, setData] = useState(INITIAL);
  const add = (d: Partial<Scholarship>) => setData(p => [...p, { ...d, id: Date.now().toString() } as Scholarship]);
  const edit = (id: string, d: Partial<Scholarship>) => setData(p => p.map(r => r.id === id ? { ...r, ...d } : r));
  const del = (id: string) => setData(p => p.filter(r => r.id !== id));
  return (
    <AdminCRUDTable title="MANAJEMEN BEASISWA" icon="💰" data={data} columns={COLUMNS} fields={FIELDS}
      onAdd={add} onEdit={edit} onDelete={del} searchKeys={['name', 'provider']} addButtonLabel="Tambah Beasiswa" />
  );
}
