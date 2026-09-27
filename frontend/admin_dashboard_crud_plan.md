# 📋 Rencana Pengembangan Admin Dashboard: CRUD Universitas, Beasiswa & Pekerjaan

Karena PathTrick bukan hanya aplikasi pembelajaran, melainkan **Platform Navigasi Karir & Akademik**, manajemen data eksternal seperti Universitas (untuk role SMA), Beasiswa, dan Pekerjaan (untuk role Mahasiswa) sangatlah penting. 

Dokumen ini merangkum rencana arsitektur REST API dan UI/UX Dashboard untuk ketiga entitas tersebut.

---

## 1. Analisis Kebutuhan Data (Berdasarkan Prisma Schema)

Ketiga entitas ini berfungsi sebagai "Rekomendasi" (Matched Output) hasil dari Assessment AI (RIASEC atau Scholar Profile). Oleh karena itu, data yang dimasukkan admin harus kaya akan metadada (tags) agar AI bisa mencocokkannya dengan profil *user*.

### A. University (Universitas / Jurusan)
**Target User:** SMA (CHASER)
*   **Tujuan:** Memberikan rekomendasi jurusan/kampus berdasarkan skor RIASEC.
*   **Atribut Kunci:**
    *   `name` (Nama Kampus/Jurusan)
    *   `location` (Lokasi)
    *   `riasecCode` (Kode dominan, misal: "IRE", "SEC" — **Sangat Penting untuk AI**)
    *   `description`
    *   `accreditation` (Opsional)

### B. Scholarship (Beasiswa)
**Target User:** Mahasiswa (SCHOLAR)
*   **Tujuan:** Rekomendasi pendanaan berdasarkan CV dan profil akademik.
*   **Atribut Kunci:**
    *   `name` (Nama Beasiswa)
    *   `provider` (Penyelenggara, misal: LPDP)
    *   `description` & `requirements` (Syarat IPK, dll)
    *   `deadline` (Tenggat waktu penutupan)
    *   `amount` / `coverage` (Opsional)

### C. Job (Pekerjaan / Loker)
**Target User:** Mahasiswa (SCHOLAR)
*   **Tujuan:** Rekomendasi karir pasca-kampus berdasarkan skill dan minat (GICS).
*   **Atribut Kunci:**
    *   `title` (Posisi: "Backend Developer")
    *   `company` (Perusahaan)
    *   `location` & `type` (Remote/On-site)
    *   `description` & `requirements` (Daftar skill yang wajib dikuasai)
    *   `salaryRange` (Opsional)

---

## 2. Rencana Arsitektur Endpoint (Backend API)

Kita akan mengelompokkan API ini di bawah sub-route `/api/admin/...`. Semua endpoint di bawah ini WAJIB dilindungi oleh *middleware* `[fastify.authenticate, requireAdminRole]`.

| Modul | Endpoint | HTTP Method | Deskripsi |
| :--- | :--- | :---: | :--- |
| **University** | `/api/admin/universities` | `GET`, `POST` | List semua kampus & Tambah kampus baru. |
| | `/api/admin/universities/:id` | `PUT`, `DELETE` | Edit & Hapus kampus tertentu. |
| **Scholarship**| `/api/admin/scholarships` | `GET`, `POST` | List beasiswa (bisa difilter by deadline) & Tambah baru. |
| | `/api/admin/scholarships/:id` | `PUT`, `DELETE` | Edit & Hapus beasiswa. |
| **Job** | `/api/admin/jobs` | `GET`, `POST` | List lowongan kerja & Tambah lowongan baru. |
| | `/api/admin/jobs/:id` | `PUT`, `DELETE` | Edit & Hapus lowongan kerja. |

---

## 3. Rencana UI/UX Frontend (Admin Dashboard)

Untuk mempercepat pengembangan di Frontend, UI/UX disarankan menggunakan pola yang sama (Reusable Components) untuk ketiga modul ini.

### 🧩 Komponen yang Dibutuhkan Frontend:
1.  **Tabel Data (Data Grid):**
    *   Menampilkan daftar singkat.
    *   Kolom standar: Nama/Judul, Status/Deadline, dan Action (Edit | Hapus).
    *   Fitur *Search bar* sederhana sangat direkomendasikan.
2.  **Form Modal (Dialog) atau Halaman Terpisah:**
    *   **University Form:** Harus memiliki *Dropdown* atau *Input Text* khusus untuk **RIASEC Code** (karena ini jantung dari algoritma rekomendasi SMA).
    *   **Scholarship Form:** Harus memiliki kalender/DatePicker untuk `deadline`.
    *   **Job Form:** Harus memiliki input *Tags* (seperti memasukkan tag di YouTube) untuk `requirements` / *skill*.

### 💡 Konsep Tampilan Sederhana (Wireframe Text):
```text
[ Sidebar Kiri ]               [ Area Konten Utama ]
- Dashboard                    =========================================
- 📚 Courses (Materi)           🎓 Manajemen Universitas / Jurusan
- 📝 Quizzes                    =========================================
- 🎓 Universitas                + [ Tambah Jurusan Baru ]  🔍 (Cari...)
- 💰 Beasiswa                  
- 💼 Lowongan Kerja            | Nama Jurusan | RIASEC | Action      |
- 👥 Users                     |--------------|--------|-------------|
                               | Ilmu Komp.   | IRE    | [Edit][Del] |
                               | DKV          | AE     | [Edit][Del] |
```

---

## 4. Prioritas & Langkah Eksekusi Berikutnya

Jika tim setuju dengan rencana di atas, inilah *step-by-step* eksekusinya:

1.  **Langkah 1 (Backend):** Saya akan membuat *middleware* `requireAdmin` dan seluruh endpoint CRUD (GET, POST, PUT, DELETE) untuk University, Scholarship, dan Job terlebih dahulu.
2.  **Langkah 2 (Frontend):** Tim Frontend menyiapkan komponen Tabel Data dan Form (bisa disatukan dalam 1 komponen dinamis jika memungkinkan).
3.  **Langkah 3 (Integrasi):** Melakukan integrasi *fetch* API dengan *bearer token* Privy milik Admin.
4.  **Langkah 4 (AI Integration - *Future Scope*):** Memastikan bahwa prompt LLM di modul Assessment bisa membaca data-data baru yang dimasukkan Admin ini sebagai referensi *Match*.
