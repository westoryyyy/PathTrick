'use client';
import { useState, useEffect, useCallback } from 'react';
import AdminCRUDTable, { Column, Field } from '@/components/admin/AdminCRUDTable';
import { API_BASE_URL } from '@/config/pathtrick';
import { getAuthHeaders } from '@/hooks/useAuthSync';

interface Scholarship {
  id: string;
  title: string;
  provider: string;
  deadline: string;   // ISO string dari backend, diformat ke YYYY-MM-DD untuk input[type=date]
  coverage: string;
  scope?: string;
  country?: string;
  requirements: string[];
  url: string;
  coverImage?: string;
}

/** Konversi ISO/DateTime string → "YYYY-MM-DD" untuk input[type=date] */
function isoToDateInput(iso: string | null | undefined): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    // Format: YYYY-MM-DD dalam waktu lokal
    const yyyy = d.getFullYear();
    const mm   = String(d.getMonth() + 1).padStart(2, '0');
    const dd   = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  } catch {
    return '';
  }
}

/** Format tanggal menjadi "18 Jul 2026" untuk ditampilkan di tabel */
function formatDeadlineDisplay(iso: string | null | undefined): string {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}

const COLUMNS: Column<Scholarship>[] = [
  {
    key: 'coverImage', label: 'Cover', width: '80px',
    render: row => row.coverImage
      ? <img src={row.coverImage} alt="" style={{ width: '60px', height: '34px', objectFit: 'cover', border: '1px solid #5a3a29' }} />
      : <span style={{ color: '#5a3a29' }}>-</span>
  },
  { key: 'title', label: 'Nama Beasiswa' },
  { key: 'provider', label: 'Penyelenggara' },
  { key: 'country', label: 'Negara', render: row => row.country || '-' },
  {
    key: 'deadline', label: 'Deadline',
    render: row => (
      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#fbbf24', whiteSpace: 'nowrap' }}>
        {formatDeadlineDisplay(row.deadline)}
      </span>
    )
  },
  {
    key: 'coverage', label: 'Coverage',
    render: row => (
      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', background: '#065f46', border: '2px solid #10b981', color: '#fff', padding: '3px 8px', whiteSpace: 'nowrap' }}>
        {row.coverage || '-'}
      </span>
    )
  },
  {
    key: 'url', label: 'Link Official',
    render: row => row.url
      ? <a href={row.url} target="_blank" rel="noreferrer" style={{ color: '#60a5fa', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', wordBreak: 'break-all' }}>🔗 Buka Link</a>
      : <span style={{ color: '#5a3a29' }}>-</span>
  },
];

const FIELDS: Field[] = [
  { key: 'coverImage', label: 'Cover Image', type: 'image' },
  { key: 'title', label: 'Nama Beasiswa', type: 'text', placeholder: 'Djarum Beasiswa Plus', required: true },
  { key: 'provider', label: 'Penyelenggara', type: 'text', placeholder: 'Lembaga / Instansi', required: true },
  {
    key: 'deadline',
    label: 'Deadline Pendaftaran',
    type: 'date',
    required: true,
    placeholder: 'Pilih tanggal deadline',
    helpText: 'Gunakan date picker — format YYYY-MM-DD',
  },
  {
    key: 'coverage', label: 'Coverage / Jumlah', type: 'select', options: [
      { value: 'Full Funding', label: 'Full Funding' },
      { value: 'Partial', label: 'Partial' },
      { value: 'Biaya Kuliah + Uang Saku', label: 'Biaya Kuliah + Uang Saku' },
      { value: 'Full Funding + Akomodasi', label: 'Full Funding + Akomodasi' },
    ]
  },
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
  {
    key: 'scope', label: 'Scope', type: 'select', options: [
      { value: 'dalam_negeri', label: 'Dalam Negeri' },
      { value: 'luar_negeri', label: 'Luar Negeri' },
      { value: 'keduanya', label: 'Keduanya' },
    ]
  },
  { key: 'requirements', label: 'Persyaratan', type: 'tags', placeholder: 'Ketik lalu tekan Enter...' },
  { key: 'url', label: 'Link Official (URL)', type: 'text', placeholder: 'https://beasiswa.example.com' },
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

  /** Normalisasi data sebelum dikirim ke backend: tanggal tetap sebagai string YYYY-MM-DD */
  const normalizeForApi = (d: Partial<Scholarship>) => ({
    ...d,
    // Kirim deadline apa adanya (YYYY-MM-DD dari date picker) — backend parseDeadline() sudah handle ini
    deadline: d.deadline || '',
  });

  const add = async (d: Partial<Scholarship>) => {
    await fetch(`${API_BASE_URL}/api/admin/scholarships`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizeForApi(d)),
    });
    load();
  };

  const edit = async (id: string, d: Partial<Scholarship>) => {
    await fetch(`${API_BASE_URL}/api/admin/scholarships/${id}`, {
      method: 'PUT',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizeForApi(d)),
    });
    load();
  };

  const del = async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/api/admin/scholarships/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err.message || 'Gagal menghapus');
      return;
    }
    load();
  };

  /**
   * Normalisasi row data sebelum masuk ke form edit.
   * Konversi ISO deadline → YYYY-MM-DD agar input[type=date] terbaca.
   */
  const normalizeForEdit = (row: Scholarship): Partial<Scholarship> => ({
    ...row,
    deadline: isoToDateInput(row.deadline),
  });

  return (
    <AdminCRUDTable
      title="MANAJEMEN BEASISWA"
      icon="💰"
      data={data}
      columns={COLUMNS}
      fields={FIELDS}
      onAdd={add}
      onEdit={edit}
      onDelete={del}
      normalizeForEdit={normalizeForEdit}
      searchKeys={['title', 'provider']}
      addButtonLabel="Tambah Beasiswa"
      isLoading={loading}
    />
  );
}
