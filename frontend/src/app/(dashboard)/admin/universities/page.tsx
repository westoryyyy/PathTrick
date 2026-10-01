'use client';
import { useState, useEffect, useCallback } from 'react';
import AdminCRUDTable, { Column, Field } from '@/components/admin/AdminCRUDTable';
import { API_BASE_URL } from '@/config/pathtrick';
import { getAuthHeaders } from '@/hooks/useAuthSync';

interface University { id: string; name: string; location: string; riasecCode: string; accreditation: string; description: string; coverImage: string; facultyTags?: string[]; }


const COLUMNS: Column<University>[] = [
  { key: 'coverImage', label: 'Cover', width: '80px', render: row => row.coverImage ? <img src={row.coverImage} alt="" style={{ width: '60px', height: '34px', objectFit: 'cover', border: '1px solid #5a3a29' }} /> : <span style={{ color: '#5a3a29' }}>-</span> },
  { key: 'name', label: 'Nama Jurusan / Kampus' },
  { key: 'location', label: 'Lokasi' },
  { key: 'facultyTags', label: 'Tag Minat / Fakultas', render: row => (
    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
      {row.facultyTags?.map((tag, i) => (
        <span key={i} style={{ background: '#7c2d12', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', border: '1px solid #b45309' }}>
          #{tag}
        </span>
      ))}
    </div>
  )},
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
  { key: 'facultyTags', label: 'Tag Minat / Skill / Fakultas', type: 'tags', placeholder: 'Ketikan minat, misal: teknologi, coding, desain (tekan Enter)', helpText: 'AI akan menggunakan tag ini untuk mencocokkan profil minat Dreamer dengan jurusan ini.' },
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
  const [data, setData] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/admin/universities`, { headers: getAuthHeaders() })
      .then(r => r.json())
      .then((d: University[]) => setData(Array.isArray(d) ? d : []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const add = async (d: Partial<University>) => {
    await fetch(`${API_BASE_URL}/api/admin/universities`, {
      method: 'POST', headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(d),
    });
    load();
  };

  const edit = async (id: string, d: Partial<University>) => {
    await fetch(`${API_BASE_URL}/api/admin/universities/${id}`, {
      method: 'PUT', headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(d),
    });
    load();
  };

  const del = async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/api/admin/universities/${id}`, {
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
    <AdminCRUDTable title="MANAJEMEN UNIVERSITAS" icon="🎓" data={data} columns={COLUMNS} fields={FIELDS}
      onAdd={add} onEdit={edit} onDelete={del} searchKeys={['name', 'location']} addButtonLabel="Tambah Jurusan" isLoading={loading} />
  );
}
