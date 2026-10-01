'use client';
import { useState, useEffect, useCallback } from 'react';
import AdminCRUDTable, { Column, Field } from '@/components/admin/AdminCRUDTable';
import { API_BASE_URL } from '@/config/pathtrick';
import { getAuthHeaders } from '@/hooks/useAuthSync';

interface Knowledge { id: string; facultyTag: string; title: string; content: string; }

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
  { value: 'edu_tech', label: 'Teknologi Pendidikan' },
];

const COLUMNS: Column<Knowledge>[] = [
  { key: 'facultyTag', label: 'Faculty Tag', render: row => {
    const label = FACULTIES.find(f => f.value === row.facultyTag)?.label || row.facultyTag;
    return (
      <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: "0.8rem", background: '#4c1d95', border: '2px solid #8b5cf6', color: '#fff', padding: '4px 10px', borderRadius: '4px', display: 'inline-block', whiteSpace: 'nowrap' }}>
        {label}
      </span>
    );
  }},
  { key: 'title', label: 'Judul Topik' },
  { key: 'content', label: 'Konten / Teks', render: row => (
    <span style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
      {row.content}
    </span>
  )},
];

const FIELDS: Field[] = [
  { key: 'facultyTag', label: 'Fakultas / Tag', type: 'select', options: FACULTIES, required: true },
  { key: 'title', label: 'Judul Topik', type: 'text', placeholder: 'Dasar Python untuk Pemula', required: true },
  { key: 'content', label: 'Konten (Markdown diizinkan)', type: 'textarea', placeholder: 'Isi pengetahuan di sini...', required: true, allowFileUpload: true },
];

export default function KnowledgeBasePage() {
  const [data, setData] = useState<Knowledge[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFacultyTab, setActiveFacultyTab] = useState('all');

  const filteredData = data.filter(c => {
    if (activeFacultyTab === 'all') return true;
    return c.facultyTag === activeFacultyTab;
  });

  const load = useCallback(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/admin/knowledge`, { headers: getAuthHeaders() })
      .then(r => r.json())
      .then((d: any) => setData(Array.isArray(d.data) ? d.data : []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const add = async (d: Partial<Knowledge>) => {
    await fetch(`${API_BASE_URL}/api/admin/knowledge`, {
      method: 'POST', headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(d),
    });
    load();
  };

  const edit = async (id: string, d: Partial<Knowledge>) => {
    await fetch(`${API_BASE_URL}/api/admin/knowledge/${id}`, {
      method: 'PUT', headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(d),
    });
    load();
  };

  const del = async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/api/admin/knowledge/${id}`, {
      method: 'DELETE', headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err.message || 'Gagal menghapus');
      return;
    }
    load();
  };

  const px = { fontFamily: 'Inter, sans-serif' };

  return (
    <AdminCRUDTable title="KNOWLEDGE BASE CMS (RAG)" icon="🧠" data={filteredData} columns={COLUMNS} fields={FIELDS}
      onAdd={add} onEdit={edit} onDelete={del} searchKeys={['title', 'content']} addButtonLabel="Tambah Materi" isLoading={loading} customFilter={
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
            <option value="all">Semua Fakultas</option>
            {FACULTIES.map(fac => (
              <option key={fac.value} value={fac.value}>{fac.label}</option>
            ))}
          </select>
        </div>
      } />
  );
}
