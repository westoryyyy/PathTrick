 'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminCRUDTable, { Column, Field } from '@/components/admin/AdminCRUDTable';
import { API_BASE_URL } from '@/config/pathtrick';
import { getAuthHeaders } from '@/hooks/useAuthSync';
import { GICS_SECTORS } from '@/data/gicsData';

interface Course { id: string; title: string; description: string; published: string; sections: number; facultyTags: string[]; skillTags?: string[]; houseId?: string; order?: number; }

const FACULTIES = [
  { value: 'all', label: 'Semua Fakultas' },
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

const CHASER_INDUSTRY_OPTIONS = [
  { value: 'all', label: 'Semua Sektor' },
  ...GICS_SECTORS.map(sector => ({ value: sector.code, label: sector.nameID.replace('\n', ' ') })),
];

const makeColumns = (basePath: string, titleLabel: string): Column<Course>[] => [
  { key: 'title', label: titleLabel },
  { key: 'order', label: 'Urutan' },
  { key: 'sections', label: 'Sections' },
  { key: 'published', label: 'Status', render: row => (
    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: "0.8rem", background: row.published === 'true' ? '#065f46' : '#7f1d1d', border: `2px solid ${row.published === 'true' ? '#10b981' : '#ef4444'}`, color: '#fff', padding: '4px 10px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
      <span style={{ fontSize: '10px' }}>{row.published === 'true' ? '●' : '○'}</span>
      {row.published === 'true' ? 'LIVE' : 'DRAFT'}
    </span>
  )},
  { key: 'description', label: 'Deskripsi' },
  { key: 'id', label: 'Editor', render: row => (
    <Link href={`${basePath}/${row.id}`} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.8rem', background: '#7c3aed', border: '2px solid #a78bfa', color: '#fff', padding: '6px 12px', textDecoration: 'none', display: 'inline-block', whiteSpace: 'nowrap', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
      ✏ Edit Konten
    </Link>
  )},
];

const makeFields = (isSkills: boolean): Field[] => [
  { key: 'title', label: isSkills ? 'Judul Skill' : 'Judul Course', type: 'text', placeholder: isSkills ? 'Negosiasi Gaji & Interview' : 'React untuk Pemula', required: true },
  { key: 'description', label: 'Deskripsi', type: 'textarea', placeholder: isSkills ? 'Deskripsi singkat skill...' : 'Deskripsi singkat course...' },
  ...(isSkills ? [] : [{ key: 'houseId', label: 'House', type: 'select', options: [] } as Field]),
  { key: 'facultyTags', label: isSkills ? 'Sektor Industri / Tag' : 'Fakultas / Tag', type: 'multiselect', options: isSkills ? CHASER_INDUSTRY_OPTIONS.filter(f => f.value !== 'all') : FACULTIES.filter(f => f.value !== 'all'), helpText: isSkills ? 'Klik untuk memilih sektor industri yang relevan (bisa lebih dari 1)' : 'Klik untuk memilih (bisa lebih dari 1)', required: true },
  ...(isSkills ? [{ key: 'skillTags', label: 'Skill Tags', type: 'tags', placeholder: 'React, TypeScript', helpText: 'Nama skill yang diajarkan. Harus sama dengan nama skill di lowongan (Career Hub) agar terdeteksi sebagai missing skill.' } as Field] : []),
  { key: 'order', label: 'Urutan (Order)', type: 'number', placeholder: '0', helpText: 'Angka lebih kecil tampil lebih awal' },
  { key: 'published', label: 'Status', type: 'select', options: [
    { value: 'false', label: '○ Draft (Belum Dipublikasikan)' }, { value: 'true', label: '● Live (Aktif)' },
  ]},
];

export default function CourseManager({ audience }: { audience: 'dreamer' | 'chaser' }) {
  const isSkills = audience === 'chaser';
  const basePath = isSkills ? '/admin/skills' : '/admin/courses';
  const columns = makeColumns(basePath, isSkills ? 'Judul Skill' : 'Judul Course');
  const [data, setData] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const storageKey = isSkills ? 'adminSkillFilter' : 'adminCourseFilter';
  
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPage(parseInt(sessionStorage.getItem(storageKey + '_page') || '1', 10));
    }
  }, [storageKey]);
  
  const handlePageChange = (val: number | ((p: number) => number)) => {
    setPage(p => {
      const next = typeof val === 'function' ? val(p) : val;
      if (typeof window !== 'undefined') sessionStorage.setItem(storageKey + '_page', next.toString());
      return next;
    });
  };

  const [limit, setLimit] = useState(50);
  const [total, setTotal] = useState(0);
  const [fields, setFields] = useState<Field[]>(() => makeFields(isSkills));
  const router = useRouter();

  const load = useCallback(() => {
    setLoading(true);
    // Use pagination and lightweight response to avoid pulling all sections
    fetch(`${API_BASE_URL}/api/admin/courses?audience=${audience}&limit=${limit}&page=${page}`, { headers: getAuthHeaders() })
      .then(r => r.json())
      .then((resp: any) => {
        const arr: Course[] = Array.isArray(resp?.data) ? resp.data : [];
        setData(arr);
        setTotal(resp?.meta?.total ?? 0);
        setLimit(resp?.meta?.limit ?? limit);
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));

    if (isSkills) return;
    fetch(`${API_BASE_URL}/api/houses`, { headers: getAuthHeaders() })
      .then(r => r.json())
      .then(data => {
        if (data.houses) {
          const houseOptions: { value: string; label: string }[] = [];
          data.houses.forEach((h: any) => {
            houseOptions.push({ value: h.id, label: h.title });
          });
          setFields(prev => prev.map(f => f.key === 'houseId' ? { ...f, options: houseOptions } : f));
        }
      })
      .catch(console.error);
  }, [audience, isSkills, limit, page]);

  useEffect(() => { load(); }, [load]);

  const add = async (d: Partial<Course> & { published?: string }) => {
    const payload = { ...d, isPublished: d.published === 'true', facultyTags: Array.isArray(d.facultyTags) ? d.facultyTags : [], skillTags: Array.isArray(d.skillTags) ? d.skillTags : [], order: Number(d.order) || 0 };
    if (isSkills) delete payload.houseId;
    else if (!payload.houseId) { alert('House wajib dipilih untuk Course Dreamer'); return; }
    const res = await fetch(`${API_BASE_URL}/api/admin/courses`, {
      method: 'POST', headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const created = await res.json().catch(() => ({}));
    // If creating a Skill (chaser), redirect to its editor so admin can add levels (sections)
    if (isSkills && res.ok && created?.id) {
      router.push(`${basePath}/${created.id}`);
      return;
    }
    load();
  };

  const edit = async (id: string, d: Partial<Course> & { published?: string }) => {
    const payload = { ...d, isPublished: d.published === 'true', facultyTags: Array.isArray(d.facultyTags) ? d.facultyTags : [], skillTags: Array.isArray(d.skillTags) ? d.skillTags : [], order: Number(d.order) || 0 };
    if (isSkills || !payload.houseId) payload.houseId = null as any;
    await fetch(`${API_BASE_URL}/api/admin/courses/${id}`, {
      method: 'PUT', headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    load();
  };

  const del = async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/api/admin/courses/${id}`, {
      method: 'DELETE', headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err.message || 'Gagal menghapus');
      return;
    }
    load();
  };

  const [activeFacultyTab, setActiveFacultyTab] = useState('all');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setActiveFacultyTab(sessionStorage.getItem(storageKey) || 'all');
    }
  }, [storageKey]);

  const handleFilterChange = (val: string) => {
    setActiveFacultyTab(val);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(storageKey, val);
    }
    handlePageChange(1); // Reset page on filter change
  };

  const filteredData = data.filter(c => {
    if (activeFacultyTab === 'all') return true;
    return c.facultyTags && c.facultyTags.includes(activeFacultyTab);
  });

  const filterOptions = isSkills ? CHASER_INDUSTRY_OPTIONS : FACULTIES;
  const filterLabel = isSkills ? 'Sektor Industri:' : 'Fakultas:';
  const px = { fontFamily: 'Inter, sans-serif' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <AdminCRUDTable 
        title={isSkills ? "MANAJEMEN SKILLS (CHASER)" : "MANAJEMEN COURSES (DREAMER)"} 
        icon={isSkills ? "🎯" : "📚"} 
        data={filteredData} 
        columns={columns} 
        fields={fields}
        normalizeForEdit={(row) => ({
          ...row,
          facultyTags: row.facultyTags || [],
          skillTags: row.skillTags || [],
          published: row.published === 'true' ? 'true' : 'false',
          order: row.order ?? 0
        })}
        onAdd={add as any} 
        onEdit={edit as any} 
        onDelete={del} 
        searchKeys={['title']} 
        addButtonLabel={isSkills ? "Tambah Skill" : "Tambah Course Manual"} 
        isLoading={loading}
        customFilter={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ ...px, fontSize: '0.85rem', color: '#fbbf24', fontWeight: 'bold' }}>{filterLabel}</span>
            <select 
              value={activeFacultyTab}
              onChange={(e) => handleFilterChange(e.target.value)}
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
              {filterOptions.map(fac => (
                <option key={fac.value} value={fac.value}>{fac.label}</option>
              ))}
            </select>
          </div>
        }
      />
      {/* Pagination controls */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
        <button onClick={() => handlePageChange(p => Math.max(1, p - 1))} disabled={page <= 1} style={{ ...px, padding: '6px 10px', cursor: page <= 1 ? 'not-allowed' : 'pointer', background: page <= 1 ? '#111' : '#1a0d05', border: '1px solid #444', color: '#fff' }}>← Prev</button>
        <div style={{ color: '#fff' }}>{page} / {Math.max(1, Math.ceil(total / limit))} ({total})</div>
        <button onClick={() => handlePageChange(p => p + 1)} disabled={page * limit >= total} style={{ ...px, padding: '6px 10px', cursor: page * limit >= total ? 'not-allowed' : 'pointer', background: page * limit >= total ? '#111' : '#1a0d05', border: '1px solid #444', color: '#fff' }}>Next →</button>
      </div>
    </div>
  );
}
