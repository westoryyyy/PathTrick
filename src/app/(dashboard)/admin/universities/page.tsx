'use client';
import { useState } from 'react';
import AdminCRUDTable, { Column, Field } from '@/components/admin/AdminCRUDTable';

interface University { id: string; name: string; location: string; riasecCode: string; accreditation: string; description: string; coverImage: string; }

const INITIAL: University[] = [
  { id: '1', name: 'Ilmu Komputer - UI', location: 'Depok, Jawa Barat', riasecCode: 'IRE', accreditation: 'Unggul', description: 'Program studi terbaik di Indonesia.', coverImage: '' },
  { id: '2', name: 'Desain Komunikasi Visual - ITS', location: 'Surabaya, Jawa Timur', riasecCode: 'AES', accreditation: 'Unggul', description: 'Menggabungkan seni dan teknologi.', coverImage: '' },
  { id: '3', name: 'Teknik Elektro - ITB', location: 'Bandung, Jawa Barat', riasecCode: 'IR', accreditation: 'Unggul', description: 'Fokus pada sistem energi dan elektronika.', coverImage: '' },
  { id: '4', name: 'Psikologi - UGM', location: 'Yogyakarta', riasecCode: 'SEC', accreditation: 'Unggul', description: 'Memahami perilaku dan pikiran manusia.', coverImage: '' },
];

const COLUMNS: Column<University>[] = [
  { key: 'coverImage', label: 'Cover', width: '80px', render: row => row.coverImage ? <img src={row.coverImage} alt="" style={{ width: '60px', height: '34px', objectFit: 'cover', border: '1px solid #5a3a29' }} /> : <span style={{ color: '#5a3a29' }}>-</span> },
  { key: 'name', label: 'Nama Jurusan / Kampus' },
  { key: 'location', label: 'Lokasi' },
  { key: 'riasecCode', label: 'Kode RIASEC', render: row => (
    <span style={{ fontFamily: '"Pixelify Sans"', fontSize: "0.9rem", background: '#1d4ed8', border: '2px solid #60a5fa', color: '#fff', padding: '3px 8px' }}>{row.riasecCode}</span>
  )},
  { key: 'accreditation', label: 'Akreditasi', render: row => (
    <span style={{ fontFamily: '"Pixelify Sans"', fontSize: "0.9rem", background: '#065f46', border: '2px solid #10b981', color: '#fff', padding: '3px 8px' }}>{row.accreditation}</span>
  )},
];

const FIELDS: Field[] = [
  { key: 'coverImage', label: 'Cover Image', type: 'image' },
  { key: 'name', label: 'Nama Jurusan / Kampus', type: 'text', placeholder: 'Ilmu Komputer - UI', required: true },
  { key: 'location', label: 'Lokasi', type: 'text', placeholder: 'Kota, Provinsi' },
  { key: 'riasecCode', label: 'Kode RIASEC', type: 'select', required: true, options: [
    { value: 'R', label: 'R - Realistic' }, { value: 'I', label: 'I - Investigative' },
    { value: 'A', label: 'A - Artistic' }, { value: 'S', label: 'S - Social' },
    { value: 'E', label: 'E - Enterprising' }, { value: 'C', label: 'C - Conventional' },
    { value: 'IR', label: 'IR' }, { value: 'IRE', label: 'IRE' }, { value: 'AES', label: 'AES' },
    { value: 'SEC', label: 'SEC' }, { value: 'RIE', label: 'RIE' }, { value: 'ECS', label: 'ECS' },
  ]},
  { key: 'accreditation', label: 'Akreditasi', type: 'select', options: [
    { value: 'Unggul', label: 'Unggul' }, { value: 'Baik Sekali', label: 'Baik Sekali' }, { value: 'Baik', label: 'Baik' },
  ]},
  { key: 'description', label: 'Deskripsi', type: 'textarea', placeholder: 'Deskripsi singkat...' },
];

export default function UniversitiesPage() {
  const [data, setData] = useState(INITIAL);
  const add = (d: Partial<University>) => setData(p => [...p, { ...d, id: Date.now().toString() } as University]);
  const edit = (id: string, d: Partial<University>) => setData(p => p.map(r => r.id === id ? { ...r, ...d } : r));
  const del = (id: string) => setData(p => p.filter(r => r.id !== id));
  return (
    <AdminCRUDTable title="MANAJEMEN UNIVERSITAS" icon="🎓" data={data} columns={COLUMNS} fields={FIELDS}
      onAdd={add} onEdit={edit} onDelete={del} searchKeys={['name', 'location']} addButtonLabel="Tambah Jurusan" />
  );
}
