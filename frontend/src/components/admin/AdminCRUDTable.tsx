'use client';

import React, { useState } from 'react';
import Image from 'next/image';

// ───────────────────────────
// Types
// ───────────────────────────
export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
}

export interface Field {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'select' | 'tags' | 'number' | 'image' | 'multiselect';
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  /** Teks bantuan kecil di bawah field */
  helpText?: string;
  /** Izinkan upload file teks (.txt, .md) untuk otomatis mengisi textarea */
  allowFileUpload?: boolean;
}

interface AdminCRUDTableProps<T extends { id: string }> {
  title: string;
  icon: string;
  data: T[];
  columns: Column<T>[];
  fields: Field[];
  onAdd: (data: Partial<T>) => void | Promise<void>;
  onEdit: (id: string, data: Partial<T>) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
  searchKeys?: (keyof T)[];
  addButtonLabel?: string;
  /**
   * Opsional: normalisasi row data sebelum dimasukkan ke form edit.
   * Gunakan untuk konversi tipe data (mis. ISO date → YYYY-MM-DD).
   */
  normalizeForEdit?: (row: T) => Partial<T>;
  isLoading?: boolean;
  customFilter?: React.ReactNode;
}

// ───────────────────────────
// Tag Input & MultiSelect sub-components
// ───────────────────────────
function MultiSelect({ value = [], onChange, options = [] }: { value: string[]; onChange: (v: string[]) => void; options: {value: string, label: string}[] }) {
  const toggle = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter(v => v !== val));
    } else {
      onChange([...value, val]);
    }
  };
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '8px', background: '#3b1f0a', border: '2px solid #5a3a29' }}>
      {options.map(o => (
        <label key={o.value} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', background: value.includes(o.value) ? '#065f46' : '#2a1405', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', color: '#fff', border: `1px solid ${value.includes(o.value) ? '#10b981' : '#5a3a29'}`, userSelect: 'none' }}>
          <input type="checkbox" checked={value.includes(o.value)} onChange={() => toggle(o.value)} style={{ display: 'none' }} />
          <span style={{ color: value.includes(o.value) ? '#10b981' : '#a3a3a3', fontWeight: 'bold' }}>{value.includes(o.value) ? '✓' : '+'}</span> 
          <span style={{ fontFamily: 'Inter, sans-serif' }}>{o.label}</span>
        </label>
      ))}
    </div>
  );
}

function TagInput({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState('');
  const add = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      if (!value.includes(input.trim())) onChange([...value, input.trim()]);
      setInput('');
    }
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', minHeight: '28px' }}>
        {value.map((tag) => (
          <span key={tag} style={{ fontFamily: '"Pixelify Sans"', fontSize: "0.9rem", background: '#5a3a29', border: '1px solid #ef4444', color: '#fff', padding: '3px 8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {tag}
            <button onClick={() => onChange(value.filter(t => t !== tag))} style={{ background: 'none', border: 'none', color: '#fbbf24', cursor: 'pointer', padding: 0, fontSize: "0.9rem", lineHeight: 1 }}>✕</button>
          </span>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={add}
        placeholder={placeholder ?? 'Ketik lalu Enter…'}
        style={{ fontFamily: '"Pixelify Sans"', fontSize: "0.9rem", background: '#4a2410', border: '2px solid #5a3a29', color: '#fff', padding: '8px 12px', outline: 'none', width: '100%' }}
      />
    </div>
  );
}

// ───────────────────────────
// Image Input sub-component (with cropper)
// ───────────────────────────
import ImageCropper from './ImageCropper';

function ImageInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsLoading(true);
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result?.toString() || null);
        setIsLoading(false);
      });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {isLoading ? (
        <div style={{ fontFamily: '"Pixelify Sans"', fontSize: '0.9rem', background: '#4a2410', border: '2px dashed #5a3a29', color: '#fbbf24', padding: '16px', textAlign: 'center' }}>
          ⏳ Membaca Gambar...
        </div>
      ) : value ? (
        <div style={{ position: 'relative', width: '160px', height: '90px', border: '2px solid #5a3a29' }}>
          <img src={value} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <button
            onClick={() => onChange('')}
            style={{ position: 'absolute', top: 0, right: 0, background: '#ef4444', color: '#fff', border: 'none', padding: '2px 6px', cursor: 'pointer', fontFamily: '"Pixelify Sans"' }}
          >✕</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontFamily: '"Pixelify Sans"', fontSize: '0.9rem', background: '#4a2410', border: '2px dashed #5a3a29', color: '#fbbf24', padding: '16px', textAlign: 'center', cursor: 'pointer', margin: 0 }}>
            + Upload Gambar
            <input type="file" accept="image/*" onChange={onFileChange} style={{ display: 'none' }} />
          </label>
          <div style={{ textAlign: 'center', color: '#a3a3a3', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif' }}>ATAU</div>
          <input
            type="text"
            placeholder="Tempel URL Gambar..."
            onChange={(e) => {
              if (e.target.value.startsWith('http')) {
                onChange(e.target.value);
              }
            }}
            style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', background: '#4a2410', border: '2px solid #5a3a29', color: '#fff', padding: '8px 12px', outline: 'none' }}
          />
        </div>
      )}

      {imageSrc && (
        <ImageCropper
          imageSrc={imageSrc}
          onCropComplete={(croppedBase64) => {
            onChange(croppedBase64);
            setImageSrc(null);
          }}
          onCancel={() => setImageSrc(null)}
          aspect={16 / 9}
        />
      )}
    </div>
  );
}

// ───────────────────────────
// Main Component
// ───────────────────────────
export default function AdminCRUDTable<T extends { id: string }>({
  title, icon, data, columns, fields, onAdd, onEdit, onDelete, searchKeys = [], addButtonLabel = 'Tambah Baru', normalizeForEdit, isLoading = false, customFilter
}: AdminCRUDTableProps<T>) {
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<null | 'add' | 'edit' | 'delete'>(null);
  const [selected, setSelected] = useState<T | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = data.filter(row =>
    searchKeys.length === 0 || searchKeys.some(key =>
      String(row[key] ?? '').toLowerCase().includes(search.toLowerCase())
    )
  );

  const openAdd = () => { setFormData({}); setModal('add'); };
  const openEdit = (row: T) => {
    // Gunakan normalizeForEdit jika tersedia untuk pre-populate form dengan benar
    const normalized = normalizeForEdit ? normalizeForEdit(row) : { ...row };
    setSelected(row);
    setFormData(normalized as Record<string, unknown>);
    setModal('edit');
  };
  const openDelete = (row: T) => { setSelected(row); setDeleteConfirm(''); setModal('delete'); };
  const closeModal = () => { setModal(null); setSelected(null); };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (modal === 'add') await onAdd(formData as Partial<T>);
      else if (modal === 'edit' && selected) await onEdit(selected.id, formData as Partial<T>);
    } finally {
      setIsSubmitting(false);
      closeModal();
    }
  };

  const handleDelete = async () => { 
    if (selected) {
      setIsSubmitting(true);
      try {
        await onDelete(selected.id);
      } finally {
        setIsSubmitting(false);
        closeModal();
      }
    } else {
      closeModal();
    }
  };

  const setField = (key: string, value: unknown) => setFormData(p => ({ ...p, [key]: value }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ── Table Header ── */}
      <div style={{ background: 'rgba(139,26,26,0.15)', border: '3px solid #5a3a29', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '4px 4px 0 rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.5rem' }}>{icon}</span>
          <div>
            <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#fbbf24', margin: 0, textShadow: '2px 2px 0 #000', letterSpacing: '0.05em' }}>{title}</h1>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', margin: '4px 0 0' }}>{filtered.length} item ditemukan</p>
          </div>
        </div>
        <button
          onClick={openAdd}
          style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.85rem', background: '#78350f', border: '3px solid #fbbf24', color: '#fff', padding: '10px 20px', cursor: 'pointer', boxShadow: '3px 3px 0 #3b261b', display: 'flex', alignItems: 'center', gap: '8px', transition: 'transform 0.1s' }}
          onMouseDown={e => { e.currentTarget.style.transform = 'translate(2px,2px)'; e.currentTarget.style.boxShadow = 'none'; }}
          onMouseUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '3px 3px 0 #3b261b'; }}
        >
          + {addButtonLabel}
        </button>
      </div>

      {/* ── Toolbar (Search + Filters) ── */}
      {(searchKeys.length > 0 || customFilter) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {searchKeys.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1rem' }}>🔍</span>
              <input
                placeholder="Cari data..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', background: '#4a2410', border: '2px solid #5a3a29', color: '#fff', padding: '10px 16px', outline: 'none', width: '300px' }}
              />
            </div>
          )}
          {customFilter}
        </div>
      )}

      {/* ── Data Table ── */}
      <div style={{ background: '#3b1f0a', border: '3px solid #5a3a29', boxShadow: '4px 4px 0 rgba(0,0,0,0.5)', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(139,26,26,0.4)', borderBottom: '3px solid #5a3a29' }}>
              {columns.map(col => (
                <th key={String(col.key)} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.82rem', color: '#fbbf24', padding: '12px 16px', textAlign: 'left', textShadow: '1px 1px 0 #000', whiteSpace: 'nowrap', width: col.width, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  {col.label}
                </th>
              ))}
              <th style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.82rem', color: '#fbbf24', padding: '12px 16px', textAlign: 'center', width: '120px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '40px', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '24px', height: '24px', border: '3px solid #fbbf24', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    Sedang memuat data...
                  </div>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '40px', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: 'rgba(255,255,255,0.3)' }}>
                  Tidak ada data
                </td>
              </tr>
            ) : (
              filtered.map((row, i) => (
                <tr key={row.id} style={{ borderBottom: '1px solid rgba(139,26,26,0.3)', background: i % 2 === 0 ? 'transparent' : 'rgba(139,26,26,0.07)' }}>
                  {columns.map(col => (
                    <td key={String(col.key)} style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#f5f5f5', padding: '12px 16px', lineHeight: '1.6' }}>
                      {col.render ? col.render(row) : String((row as Record<string, unknown>)[String(col.key)] ?? '-')}
                    </td>
                  ))}
                  <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button onClick={() => openEdit(row)} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.8rem', background: '#b45309', border: '2px solid #fbbf24', color: '#fff', padding: '5px 12px', cursor: 'pointer', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>Edit</button>
                      <button onClick={() => openDelete(row)} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.8rem', background: '#3b261b', border: '2px solid #ef4444', color: '#fff', padding: '5px 12px', cursor: 'pointer', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>Hapus</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Modal (Add/Edit) ── */}
      {(modal === 'add' || modal === 'edit') && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={e => e.target === e.currentTarget && closeModal()}>
          <div style={{ background: '#4a2410', border: '4px solid #5a3a29', boxShadow: '6px 6px 0 rgba(0,0,0,0.8), 0 0 40px rgba(139,26,26,0.3)', maxWidth: '560px', width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
            {/* Modal Header */}
            <div style={{ background: 'rgba(139,26,26,0.4)', borderBottom: '4px solid #5a3a29', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: '"Pixelify Sans"', fontSize: "0.9rem", color: '#fbbf24' }}>
                {modal === 'add' ? `+ ${addButtonLabel}` : '✎ EDIT DATA'}
              </span>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', color: '#fbbf24', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}>✕</button>
            </div>
            {/* Modal Body */}
            <div style={{ padding: '20px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {fields.map(field => (
                <div key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.85rem', color: '#fbbf24', letterSpacing: '0.03em' }}>
                      {field.label}{field.required && <span style={{ color: '#f87171', marginLeft: '4px' }}>*</span>}
                    </label>
                    {field.allowFileUpload && field.type === 'textarea' && (
                      <label style={{ cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', background: '#3b261b', color: '#fbbf24', padding: '4px 8px', borderRadius: '4px', border: '1px solid #5a3a29' }}>
                        + Upload .md / .txt
                        <input 
                          type="file" 
                          accept=".md,.txt" 
                          style={{ display: 'none' }} 
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              if (ev.target?.result) {
                                setField(field.key, ev.target.result.toString());
                              }
                            };
                            reader.readAsText(file);
                            // Reset input so the same file can be uploaded again if needed
                            e.target.value = '';
                          }}
                        />
                      </label>
                    )}
                  </div>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={String(formData[field.key] ?? '')}
                      onChange={e => setField(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      rows={5}
                      style={{ fontFamily: 'Inter, sans-serif', fontSize: "0.9rem", background: '#3b1f0a', border: '2px solid #5a3a29', color: '#fff', padding: '10px 12px', outline: 'none', resize: 'vertical', lineHeight: 1.7 }}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={String(formData[field.key] ?? '')}
                      onChange={e => setField(field.key, e.target.value)}
                      style={{ fontFamily: '"Pixelify Sans"', fontSize: "0.9rem", background: '#3b1f0a', border: '2px solid #5a3a29', color: '#fff', padding: '10px 12px', outline: 'none' }}
                    >
                      <option value="">-- Pilih --</option>
                      {field.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  ) : field.type === 'tags' ? (
                    <TagInput value={(formData[field.key] as string[]) ?? []} onChange={v => setField(field.key, v)} placeholder={field.placeholder} />
                  ) : field.type === 'multiselect' ? (
                    <MultiSelect value={(formData[field.key] as string[]) ?? []} onChange={v => setField(field.key, v)} options={field.options ?? []} />
                  ) : field.type === 'image' ? (
                    <ImageInput value={String(formData[field.key] ?? '')} onChange={v => setField(field.key, v)} />
                  ) : (
                    <input
                      type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
                      value={String(formData[field.key] ?? '')}
                      onChange={e => setField(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', background: '#3b1f0a', border: '2px solid #5a3a29', color: '#fff', padding: '10px 12px', outline: 'none', colorScheme: 'dark', width: '100%', boxSizing: 'border-box' }}
                    />
                  )}
                  {/* Help text */}
                  {field.helpText && (
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                      {field.helpText}
                    </p>
                  )}
                </div>
              ))}
            </div>
            {/* Modal Footer */}
            <div style={{ padding: '16px 20px', borderTop: '3px dashed #5a3a29', display: 'flex', gap: '12px', justifyContent: 'flex-end', flexShrink: 0 }}>
              <button onClick={closeModal} disabled={isSubmitting} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.875rem', background: 'transparent', border: '2px solid #5a3a29', color: '#fff', padding: '10px 20px', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.5 : 1 }}>Batal</button>
              <button onClick={handleSubmit} disabled={isSubmitting} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.875rem', background: '#78350f', border: '3px solid #ef4444', color: '#fff', padding: '10px 24px', cursor: isSubmitting ? 'not-allowed' : 'pointer', boxShadow: isSubmitting ? 'none' : '3px 3px 0 rgba(0,0,0,0.5)', opacity: isSubmitting ? 0.7 : 1 }}>
                {isSubmitting ? '⏳ MENYIMPAN...' : (modal === 'add' ? 'SIMPAN' : 'PERBARUI')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal (Delete) ── */}
      {modal === 'delete' && selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={e => e.target === e.currentTarget && closeModal()}>
          <div style={{ background: '#4a2410', border: '4px solid #ef4444', boxShadow: '6px 6px 0 rgba(0,0,0,0.8)', maxWidth: '400px', width: '100%' }}>
            <div style={{ background: 'rgba(239,68,68,0.2)', borderBottom: '4px solid #ef4444', padding: '16px 20px' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#fbbf24' }}>⚠ HAPUS DATA?</span>
            </div>
            <div style={{ padding: '20px', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.8 }}>
              Data yang dihapus <strong>tidak bisa dikembalikan</strong>. Yakin ingin melanjutkan?
            </div>
            <div style={{ padding: '16px 20px', borderTop: '3px dashed #5a3a29', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={closeModal} disabled={isSubmitting} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.875rem', background: 'transparent', border: '2px solid #5a3a29', color: '#fff', padding: '10px 20px', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.5 : 1 }}>Batal</button>
              <button onClick={handleDelete} disabled={isSubmitting} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.875rem', background: '#3b261b', border: '3px solid #ef4444', color: '#fff', padding: '10px 20px', cursor: isSubmitting ? 'not-allowed' : 'pointer', boxShadow: isSubmitting ? 'none' : '3px 3px 0 rgba(0,0,0,0.5)', opacity: isSubmitting ? 0.7 : 1 }}>
                {isSubmitting ? '⏳ MENGHAPUS...' : 'YA, HAPUS'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
