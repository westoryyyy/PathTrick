'use client';
import { useState, useEffect, useCallback } from 'react';
import AdminCRUDTable, { Column, Field } from '@/components/admin/AdminCRUDTable';
import { API_BASE_URL } from '@/config/pathtrick';
import { getAuthHeaders } from '@/hooks/useAuthSync';
interface University { id: string; name: string; title?: string; location: string; country?: string; riasecCode: string; accreditation: string; description: string; coverImage: string; facultyTags?: string[]; website?: string; admissionRequirements?: string; estimatedCostMin?: number; estimatedCostMax?: number; }

const FACULTIES = [
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
];

const COLUMNS: Column<University>[] = [
  { key: 'coverImage', label: 'Cover', width: '80px', render: row => row.coverImage ? <img src={row.coverImage} alt="" style={{ width: '60px', height: '34px', objectFit: 'cover', border: '1px solid #5a3a29' }} /> : <span style={{ color: '#5a3a29' }}>-</span> },
  { key: 'title', label: 'Fakultas / Program' },
  { key: 'name', label: 'Nama Kampus' },
  { key: 'location', label: 'Lokasi' },
  { key: 'facultyTags', label: 'Fakultas / Jurusan', render: row => (
    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
      {row.facultyTags?.map((tag, i) => {
        const matched = FACULTIES.find(f => f.value === tag);
        return (
          <span key={i} style={{ background: '#7c2d12', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', border: '1px solid #b45309' }}>
            #{matched ? matched.label : tag}
          </span>
        );
      })}
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
  { key: 'coverImage', label: 'Cover Image URL / Upload', type: 'image' },
  { key: 'title', label: 'Nama Program / Fakultas', type: 'text', placeholder: 'Fasilkom - Ilmu Komputer' },
  { key: 'name', label: 'Nama Kampus', type: 'text', placeholder: 'Universitas Indonesia', required: true },
  { key: 'location', label: 'Lokasi', type: 'text', placeholder: 'Kota, Provinsi' },
  { key: 'country', label: 'Negara', type: 'select', options: [
    { value: 'australia', label: 'Australia' },
    { value: 'belanda', label: 'Belanda' },
    { value: 'indonesia', label: 'Indonesia' },
    { value: 'inggris', label: 'Inggris' },
    { value: 'jepang', label: 'Jepang' },
    { value: 'jerman', label: 'Jerman' },
    { value: 'korea', label: 'Korea' },
    { value: 'malaysia', label: 'Malaysia' },
    { value: 'singapura', label: 'Singapura' },
    { value: 'usa', label: 'USA' },
  ] },
  { key: 'website', label: 'Official Website', type: 'text', placeholder: 'https://ui.ac.id' },
  { key: 'admissionRequirements', label: 'Jalur Masuk (Reqs)', type: 'text', placeholder: 'SNBT, Mandiri SIMAK UI, dll' },
  { key: 'estimatedCostMin', label: 'Estimasi Biaya Min (Rp/Smtr)', type: 'number', placeholder: 'Misal: 500000 (tanpa titik)' },
  { key: 'estimatedCostMax', label: 'Estimasi Biaya Max (Rp/Smtr)', type: 'number', placeholder: 'Misal: 25000000 (tanpa titik)' },
  { key: 'facultyTags', label: 'Fakultas / Kategori Jurusan', type: 'multiselect', options: FACULTIES, helpText: 'Pilih kategori yang paling sesuai agar AI bisa mencocokkan dengan hasil assessment Dreamer.', required: true },
  { key: 'riasecCode', label: 'Kode RIASEC', type: 'text', placeholder: 'Bisa diisi lebih dari satu, misal: IRE, IES, SEC', helpText: 'Ketik manual kode RIASEC, pisahkan dengan koma jika lebih dari satu.' },
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
      onAdd={add} onEdit={edit} onDelete={del} searchKeys={['name', 'location']} addButtonLabel="Tambah Kampus" isLoading={loading} />
  );
}
