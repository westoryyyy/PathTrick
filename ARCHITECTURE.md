# 📓 PATHTRICK — Master Project Management & Architecture Guide

Dokumen ini adalah acuan utama bagi seluruh tim (UI/UX, Frontend, Backend, AI, dan Smart Contract) serta agen AI Developer. Berisi dokumentasi inti, arsitektur teknis Web 2.5, rincian UI/UX, mitigasi risiko, alur navigasi aplikasi (*routing*), dan logika evaluasi pengguna.

---

## 1. Dokumentasi Inti Produk

### A. Visi Produk & Problem Statement
**One-liner:** "PATHTRICK — AI Career Coach yang memberikan roadmap personal & bukti keahlian permanen yang tidak bisa dipalsukan, tanpa menuntut siswa mengerti crypto sama sekali."

**Problem Statement:**
*   **Siswa SMA:** Kebingungan memilih jurusan/kampus, tidak ada panduan personal, informasi beasiswa berserakan.
*   **Mahasiswa / Fresh Grad:** *Skill gap* tidak terlihat sampai *apply* kerja, sertifikat *course* tradisional mudah dipalsukan *recruiter*.

### B. Filosofi "Web 2.5" & Anti-Pattern
**Prinsip Utama: "Crypto invisible, value visible."**
Pengguna tidak boleh melihat, memegang, atau dipusingkan oleh kripto. Dompet kripto (Privy) disembunyikan di balik *login* email/sosial. HASIL akhirnya (Skill Badge) tetap tervalidasi *on-chain*.

**Anti-Pattern Log (Dilarang Diulang Tim/AI):**
*   ❌ **DITOLAK:** *Pay-per-use smart contract* (pengguna membayar gas fee).
*   ✅ **DIPAKAI:** *Sponsored / Gasless Minting* (*Treasury platform* yang menanggung biaya gas).

### C. North Star Metric & Bisnis
*   **Target Demo Day:** Jumlah *roadmap* ter-*generate* (<10 detik), *completion rate* tugas, dan 100% *success rate* pencetakan SBT.
*   **Model Bisnis:** B2B Institusi (Kampus/Perusahaan beli lisensi pakai fiat) dan Freemium B2C. *Treasury* disuntik dari *revenue* fiat ini.

---

## 2. Tech Stack & Infrastructure

*   **Frontend Framework:** Next.js (App Router), React, TypeScript.
*   **Styling & UI:** Tailwind CSS, CSS Grid (Bento Box Layout), Framer Motion (animasi *micro-interactions* dan transisi).
*   **Game/Map Engine:** Phaser.js (untuk *rendering* Peta 12 Houses).
*   **State Management:** Zustand (manajemen sesi, *Course Hierarchy*, dan *Evaluation State*).
*   **Authentication:** Privy (Login hibrida Web2/Web3).
*   **Web3 Integration:** Solidity, Foundry (Smart Contracts), integrasi jaringan BNB Testnet (untuk *minting* Soulbound Tokens / SBT).
*   **AI Engine:** Mock Data Pre-generation (MVP) untuk menekan *cost* dan latensi UI, ditambah AI Assessor untuk evaluasi rubrik *mini-project*.

---

## 3. UI/UX & Aesthetic Guidelines

*   **Visual Identity:** *Premium Retro Pixel-Art* dikombinasikan dengan *Chic Minimalist Dark Mode* (Latar `#0a0e17`).
*   **Typography:** `Press Start 2P` untuk *heading* dan UI elemen *gaming*, dipadukan dengan *font* sans-serif/mono modern yang bersih untuk *body text*.
*   **Vibe:** Elegan, futuristik, dan eksklusif ala konsol AI *high-end*. Dilarang keras menggunakan elemen neon mencolok, desain berantakan ala situs judi, atau tata letak tanpa *alignment*.
*   **Key Elements:** Penggunaan *glassmorphism* tipis (`backdrop-blur-md`), garis *progress bar* ultra-tipis, batas pixel tegas, dan *hover states* mulus via Framer Motion.

---

## 4. Arsitektur Teknis Makro & Logika Routing AI

```mermaid
graph TD
    subgraph Web2 ["User Facing (Frictionless UX)"]
        U([User / Pengguna]) -->|Login via Email/Sosial| F[Frontend: Next.js]
        F <-->|Generate Embedded Wallet| P[Privy SDK]
        F -->|Submit Asesmen/CV/Tugas| B[Backend API]
    end
    
    subgraph Logic ["Routing & AI Engine"]
        B --> C{Persona User?}
        C -->|Siswa SMA| A1[AI Agent 1: Roadmap Akademik & Beasiswa]
        C -->|Mahasiswa| A2[AI Agent 2: Skill Gap & Internship]
        B -->|Evaluasi Tugas| A3[AI Assessor: Evaluasi Rubrik]
    end
    
    subgraph Web3 ["Blockchain (Gasless Minting)"]
        A3 -->|Lulus skor >= 75| T{Treasury Wallet PATHTRICK}
        T -->|Bayar Gas & Eksekusi| SC[Smart Contract: BNB Testnet]
        SC -.->|Terbitkan Soulbound Token| P
    end
    
    classDef default fill:#1E293B,stroke:#475569,stroke-width:2px,color:#fff;
    classDef highlight fill:#3B82F6,stroke:#2563EB,color:#fff;
    classDef agent fill:#10B981,stroke:#047857,color:#fff;
    class U highlight
    class A1,A2,A3 agent

    sequenceDiagram
    autonumber
    actor User
    participant Frontend as Frontend
    participant Backend as Backend
    participant DB as Database
    participant AI as AI Engine
    participant Privy as Privy
    participant SC as Smart Contract

    Note over User, SC: FASE 1: ASESMEN & ROADMAP
    User->>Frontend: Submit Asesmen / CV
    Frontend->>Backend: POST /api/assessment
    Backend->>AI: Kirim Prompt Analisis
    AI-->>Backend: Return JSON (Roadmap, Beasiswa/Internship)
    Backend->>DB: Simpan Data Roadmap
    Backend-->>Frontend: 200 OK + Data Roadmap Personal

    Note over User, SC: FASE 2: COURSE & MINI PROJECT
    User->>Frontend: Upload Hasil Tugas
    Frontend->>Backend: POST /api/submit-task
    Backend->>AI: Kirim File & Rubrik
    AI-->>Backend: Return JSON (Skor & Status Lulus)
    Backend->>DB: Update Course & Trigger Badge

    Note over User, SC: FASE 3: KLAIM SBT (GASLESS)
    User->>Frontend: Klik "Klaim Sertifikat"
    Frontend->>Privy: Minta Signature User (Background)
    Privy-->>Frontend: Signature Valid
    Frontend->>Backend: POST /api/claim-sbt
    Backend->>SC: Execute Sponsored Mint (Treasury Pays Gas)
    SC-->>Backend: Event CertificateMinted
    Backend-->>Frontend: 200 OK (Link Explorer)

    ## 6. Core User Flow & UI Architecture (Fokus MVP: Role SMA)

### A. Onboarding & Profiling
* **Privy Auth:** Pengguna melakukan registrasi/login seamless.
* **Role Selection:** Memilih jalur SMA.
* **RIASEC Assessment:** Sistem AI menganalisis minat dan bakat.
* **Preference Input:** Pengguna memasukkan target kampus, jurusan, dan kebutuhan beasiswa.
* **Roadmap Generation:** Sistem mencetak Personalized Learning Roadmap (menggunakan pre-generated JSON untuk MVP agar instan).

### B. Post-RIASEC Dashboard (Bento Grid)
Dashboard asimetris berbasis CSS Grid yang memuat 9 modul utama:
* **Hero Greeting:** Nama pengguna & total XP.
* **Readiness Meter & University Rank:** Lingkaran progres dengan label status tier dinamis:
  * `0%`: Explorer (Baru memilih jurusan)
  * `1-49%`: Target Locked (Mendapat rekomendasi)
  * `50-99%`: Top Applicant (Selesai 50% roadmap)
  * `100%`: Future Maba (Siap ujian)
* **Scholarship Radar:** Tier pencarian beasiswa (Hunter ➔ Nominee ➔ Awardee Material).
* **Daily Bounties & Weekly Boss:** Checklist interaktif untuk tugas harian/mingguan.
* **The Nexus (Skill Tree):** Tombol launcher CTA menuju Peta Dunia (Phaser).
* **The Vault & Leaderboard:** Etalase koleksi Skill Badges (SBT) dan peringkat lokal.

### C. The 12 Houses Map (Duolingo-Style Linear Progression)
* **Visual Map:** Peta 2D interaktif tanpa garis penghubung, menampilkan 12 bangunan (Houses) bernomor 1-12 yang di-render menggunakan Phaser.
* **State Logic:** House 1 (contoh: HTML Basics) terbuka di awal. House 2-12 terkunci secara visual (efek grayscale) sampai status House sebelumnya ditandai completed di Zustand `useMapStore`.

---

## 7. Inside the House: Evaluation State Machine
Saat user masuk ke dalam sebuah House, mereka akan melalui 4 tahap (Conditional Rendering di `HouseModal.tsx` atau dinamis di rute `/quest/[id]`):

### Tahap 1: Materi (Material)
* Teks naratif panjang dengan pendekatan analogi (World-Class Tech Educator Persona). (Misal: HTML sebagai batu bata, CSS sebagai cat).

### Tahap 2: Kuis (Auto-graded)
* 2-3 pertanyaan pilihan ganda.
* **Exception Path:** Jika gagal (skor di bawah passing grade), user dipaksa membaca ulang materi.

### Tahap 3: Live Code Lab
* Editor kode sederhana via `<textarea>` dan `<iframe srcDoc>` untuk langsung mencoba kode (Misal: Latihan format Tags & Elements HTML).

### Tahap 4: Mini Project & AI Rubric Review
* User men-submit kode/file tugas akhir.
* Dikirim ke AI Engine untuk dievaluasi secara ketat berdasarkan Rubric (Misal: Cek keberadaan `<ul>`, hierarki `<h2>`).
* **Exception Path:** Jika gagal, sistem memberikan actionable feedback dan opsi resubmit.

---

## 8. Progression Engine & Web3 Minting
Jika pengguna dinyatakan Pass pada tahap Mini Project:
* **State Update:** Zustand mengubah status `USER_COURSE_PROGRESS` menjadi completed.
* **XP Awarded:** Sistem menambahkan Experience Points.
* **Smart Contract Trigger:** Status sertifikat berubah menjadi `pending_onchain`. API Backend memicu kontrak pintar (membayar gas fee dari treasury) untuk menerbitkan Soulbound Token (SBT) langsung ke dompet Privy user.
* **Map Unlock:** House berikutnya di layar Phaser otomatis terbuka untuk dimainkan.

---

## 9. Next.js App Router Navigation & Folder Structure
Bagian ini adalah Single Source of Truth untuk routing halaman. Tim dan AI Developer WAJIB mengikuti hierarki folder dan alur navigasi ini agar tidak ada komponen yang terputus (dead end).

### A. Publik & Autentikasi
* **Path:** `/`
  * **Tampilan:** Landing Page (Hero, Features, Testimonial).
  * **Aksi:** Klik "Login" ➔ Membuka modal Privy Auth.
  * **Trigger:** Privy sukses autentikasi ➔ Redirect otomatis ke `/onboarding/role`.

### B. Fase Onboarding (Wajib untuk User Baru)
* **Path:** `/onboarding/role`
  * **Tampilan:** Pilihan jalur "Siswa SMA" atau "Mahasiswa/Freshgraduate".
  * **Aksi SMA:** Pilih SMA ➔ Redirect ke `/onboarding/riasec`.
  * **Aksi Mahasiswa:** Pilih Mahasiswa ➔ Redirect ke `/onboarding/cv-upload`.
* **Path:** `/onboarding/riasec` (Khusus SMA)
  * **Tampilan:** Asesmen minat, bakat, preferensi kampus, dan beasiswa.
  * **Aksi:** Submit Form ➔ Generate Roadmap AI ➔ Redirect ke `/dashboard/sma`.
* **Path:** `/onboarding/cv-upload` (Khusus Mahasiswa)
  * **Tampilan:** Unggah CV dan portofolio untuk AI Gap Analysis.
  * **Aksi:** Submit CV ➔ Generate Career Roadmap ➔ Redirect ke `/dashboard/mahasiswa`.

### C. Alur Fitur Utama: Siswa SMA
* **Path:** `/dashboard/sma`
  * **Tampilan:** Bento Grid UI (Readiness Meter, Scholarship Radar, Daily Bounties).
  * **Aksi:** Klik widget "The Nexus / Skill Tree" ➔ Redirect ke `/map`.
* **Path:** `/map`
  * **Tampilan:** Peta visual 12 Houses (Phaser).
  * **Aksi:** Klik "House 1" ➔ Redirect ke `/quest/[id]` (misal: `/quest/html-1`).
* **Path:** `/quest/[id]`
  * **Tampilan:** Dynamic Route untuk Materi, Live Lab, Quiz, dan Mini Project.
  * **Aksi:** Submit Mini Project (Lulus) ➔ Minting SBT ➔ Redirect kembali ke `/map` dengan status House berikutnya terbuka.

### D. Alur Fitur Utama: Mahasiswa & Freshgraduate
* **Path:** `/dashboard/mahasiswa`
  * **Tampilan:** Hasil AI Gap Analysis (Current Skill vs Industry Needs) dan ringkasan Career Roadmap.
  * **Aksi 1:** Klik "Job Matching" ➔ Redirect ke `/career-hub/jobs`.
  * **Aksi 2:** Klik "Lanjut Belajar" ➔ Redirect ke `/learning` (Sistem Peta Kursus Mahasiswa).
* **Path:** `/career-hub/jobs`
  * **Tampilan:** Loker dan internship yang sudah disaring AI sesuai profil pengguna.
* **Path:** `/career-hub/resume`
  * **Tampilan:** AI Resume Builder & Mock Interview Portal.
* **Path:** `/learning`
  * **Tampilan:** Daftar misi/kursus teknis tingkat lanjut (industri).
  * **Aksi:** Menyelesaikan misi ➔ Minting SBT keahlian spesifik.
  