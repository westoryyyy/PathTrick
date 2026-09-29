'use client';
import { useState, useEffect, useCallback } from 'react';
import AdminCRUDTable, { Column, Field } from '@/components/admin/AdminCRUDTable';
import { API_BASE_URL } from '@/config/pathtrick';
import { getAuthHeaders } from '@/hooks/useAuthSync';

interface Knowledge { id: string; facultyTag: string; title: string; content: string; }

const COLUMNS: Column<Knowledge>[] = [
  { key: 'facultyTag', label: 'Faculty Tag', render: row => (
    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: "0.8rem", background: '#4c1d95', border: '2px solid #8b5cf6', color: '#fff', padding: '4px 10px', borderRadius: '4px', display: 'inline-block', whiteSpace: 'nowrap' }}>
      {row.facultyTag}
    </span>
  )},
  { key: 'title', label: 'Judul Topik' },
  { key: 'content', label: 'Konten / Teks', render: row => (
    <span style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
      {row.content}
    </span>
  )},
];

const FIELDS: Field[] = [
  { key: 'facultyTag', label: 'Faculty Tag (contoh: teknologi, feb, psikologi)', type: 'text', placeholder: 'teknologi', required: true },
  { key: 'title', label: 'Judul Topik', type: 'text', placeholder: 'Dasar Python untuk Pemula', required: true },
  { key: 'content', label: 'Konten (Markdown diizinkan)', type: 'textarea', placeholder: 'Isi pengetahuan di sini...', required: true, allowFileUpload: true },
];

export default function KnowledgeBasePage() {
  const [data, setData] = useState<Knowledge[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <AdminCRUDTable title="KNOWLEDGE BASE CMS (RAG)" icon="🧠" data={data} columns={COLUMNS} fields={FIELDS}
      onAdd={add} onEdit={edit} onDelete={del} searchKeys={['title', 'facultyTag', 'content']} addButtonLabel="Tambah Materi" isLoading={loading} />
  );
}
