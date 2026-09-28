# Knowledge Base: Teknologi — Web Development Modern

## Ekosistem Web Development

Web development dibagi menjadi dua area utama:

### Frontend (sisi pengguna)
Teknologi yang dijalankan di browser pengguna:
- **HTML**: struktur halaman web
- **CSS**: tampilan/desain (warna, layout, animasi)
- **JavaScript**: interaktivitas
- **Framework modern**: React, Vue.js, Next.js

### Backend (sisi server)
Teknologi yang dijalankan di server:
- **Node.js (JavaScript)** — populer untuk real-time app
- **Python (Django/FastAPI)** — populer untuk ML integration
- **Database**: PostgreSQL, MongoDB, Redis

## Konsep Penting Web Development

### HTTP & API
```
Client (Browser/App)  ←→  Server (Backend)
     GET /api/users → { users: [...] }
     POST /api/login → { token: "..." }
```

REST API adalah standar komunikasi antara frontend dan backend menggunakan HTTP methods:
- **GET**: mengambil data
- **POST**: mengirim/membuat data baru
- **PUT/PATCH**: mengupdate data
- **DELETE**: menghapus data

### Konsep Database
```sql
-- Contoh tabel users di PostgreSQL
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Query ambil semua user
SELECT * FROM users;

-- Query filter
SELECT name, email FROM users WHERE created_at > '2024-01-01';
```

### Authentication (Login System)
Cara kerja login modern:
1. User kirim email + password ke server
2. Server verifikasi → buat JWT token
3. Client simpan token
4. Setiap request berikutnya kirim token di header: `Authorization: Bearer <token>`

## Skill yang Dibutuhkan Web Developer

| Level | Frontend | Backend |
|-------|----------|---------|
| Junior | HTML/CSS, JavaScript dasar | 1 bahasa backend, SQL dasar |
| Mid | React/Vue, REST API integration | Framework (Express/Django), ORM |
| Senior | Performance optimization, testing | System design, cloud deployment |

## Karir Web Developer di Indonesia

- **Junior**: Rp 5-8 juta/bulan
- **Mid-level**: Rp 10-20 juta/bulan
- **Senior**: Rp 25-50 juta/bulan
- **Remote internasional**: USD 3000-8000/bulan

Perusahaan yang aktif rekrut: Gojek, Tokopedia, Traveloka, startup-startup Y Combinator.
