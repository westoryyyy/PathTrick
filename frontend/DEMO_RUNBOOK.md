# PathTrick Demo Runbook

Dokumen ini menyiapkan demo lokal dan video demo untuk Indonesia Web3 Hackathon.

## 1. Tujuan Demo

Demo harus menyampaikan satu cerita:

> PathTrick mengubah kebingungan pelajar menjadi langkah belajar yang personal, perjalanan yang terasa seperti game, dan bukti skill yang dapat diverifikasi.

Jangan membuka semua fitur. Tunjukkan satu perjalanan user yang utuh dari role sampai bukti pencapaian.

## 2. Mode Demo Lokal

Salin `.env.demo.example` menjadi `.env.local`, lalu jalankan:

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

Mode ini memakai:

- local mock roles
- local role persistence route
- local assessment and dashboard data
- local learning mission and quiz flow
- local profile and avatar persistence

Mode ini tidak memalsukan transaksi blockchain. Mint certificate hanya dianggap berhasil jika wallet, contract, receipt, event, dan backend confirmation benar-benar tersedia.

## 3. Persiapan Sebelum Live Demo

1. Hapus state demo lama dari browser atau gunakan private window.
2. Pastikan `.env.local` memakai flag demo.
3. Pastikan `npm run build` berhasil sebelum presentasi.
4. Buka tab cadangan:
   - landing page
   - docs
   - BscScan contract
5. Siapkan satu screenshot atau recording certificate sebagai fallback.
6. Jika memakai login Privy, siapkan akun demo yang tidak berisi data pribadi.
7. Jika menampilkan mint, siapkan wallet BNB Testnet dengan tBNB dan backend mint yang aktif.

## 4. Skenario Live Demo, 4 Menit

### 0:00 - 0:25, Masalah

Mulai dari landing page.

Narasi:

> Banyak pelajar tahu bahwa mereka harus menyiapkan masa depan, tetapi tidak tahu harus mulai dari mana. Assessment sering berhenti sebagai hasil, course berdiri sendiri, dan sertifikat belum tentu membuktikan skill yang benar-benar dikerjakan.

### 0:25 - 0:55, Pilih Role

Masuk ke role selection dan pilih **The Dreamer**.

Tunjukkan:

- role diambil secara dinamis
- description dan perks
- login tidak memaksa user memahami crypto
- avatar atau nickname tetap menjadi identitas yang dipakai di platform

Narasi:

> PathTrick memulai perjalanan dari konteks user, bukan dari katalog course yang generik.

### 0:55 - 1:20, Assessment

Selesaikan beberapa pertanyaan assessment. Jangan membaca semua pilihan.

Tunjukkan:

- pertanyaan minat
- rekomendasi yang dipersonalisasi
- roadmap atau hasil assessment

Narasi:

> AI mengubah jawaban user menjadi starting point personal. Hasilnya bukan sekadar label, tetapi arahan untuk menentukan langkah belajar berikutnya.

### 1:20 - 1:55, Dashboard

Masuk ke dashboard SMA.

Tunjukkan:

- avatar yang sama
- XP dan readiness
- recommended track
- scholarship atau university direction

Narasi:

> Semua hasil assessment masuk ke dashboard yang dapat ditindaklanjuti. User melihat apa yang harus dipelajari, bukan hanya siapa dirinya.

### 1:55 - 2:35, Learning Journey

Buka map atau learning progress, pilih satu House, lalu buka mission.

Tunjukkan:

- world map
- House atau module
- materi
- quiz
- feedback dan XP

Narasi:

> Setiap House mewakili kompetensi. User membaca teori, mengerjakan quiz, mencoba project, lalu melihat progress sebagai perjalanan yang nyata.

### 2:35 - 3:00, Failure dan Recovery

Jika aman untuk demo, jawab satu quiz dengan salah lalu ulangi dengan benar.

Narasi:

> Belajar tidak berhenti ketika user salah. Sistem memberi feedback, menjaga rasa bermain, dan mengarahkan user untuk mencoba lagi.

### 3:00 - 3:35, Web3 Proof

Buka docs atau certificate screen.

Jalur A, jika backend dan wallet siap:

1. Hubungkan wallet.
2. Pastikan BNB Smart Chain Testnet, Chain ID 97.
3. Tunjukkan mint price yang dibaca langsung dari contract.
4. Mint certificate.
5. Tunggu receipt.
6. Tunjukkan event `CertificateMinted(to, courseId)`.
7. Tunjukkan backend confirmation dan link BscScan.

Jalur B, jika hanya mode lokal:

> Untuk demo lokal, kami tidak memalsukan transaksi. Integrasi live menggunakan BNB Smart Chain Testnet, signature authorization dari backend, receipt verification, event verification, dan confirmation `txHash`.

Lalu buka contract di BscScan sebagai bukti deployment.

### 3:35 - 4:00, Closing

Narasi:

> PathTrick menjembatani “Saya tidak tahu harus mulai dari mana” menjadi “Saya tahu langkah berikutnya, saya sudah mengerjakannya, dan saya punya bukti untuk menunjukkannya.”

Tutup dengan:

- dashboard
- certificate atau contract explorer
- satu kalimat business value

> Untuk sekolah dan kampus, PathTrick menyediakan journey yang lebih engaging. Untuk partner dan employer, PathTrick membangun evidence layer yang lebih mudah diverifikasi.

## 5. Skenario Video Demo, 90 Detik

### Scene 1, 0:00 - 0:10

Visual: landing page dan problem statement.

Voice-over:

> Pelajar Indonesia punya banyak pilihan, tetapi sering tidak punya peta untuk menentukan langkah pertama.

### Scene 2, 0:10 - 0:22

Visual: pilih The Dreamer.

Voice-over:

> PathTrick memulai dari profil setiap user, lalu mengubahnya menjadi arah belajar yang personal.

### Scene 3, 0:22 - 0:38

Visual: assessment dan hasil recommendation.

Voice-over:

> Assessment RIASEC dan AI membantu user memahami starting point, skill gap, dan roadmap yang harus dijalani.

### Scene 4, 0:38 - 0:58

Visual: dashboard, map, House, mission, quiz.

Voice-over:

> Roadmap itu berubah menjadi dunia RPG. User membaca materi, mengerjakan quiz, menyelesaikan project, dan melihat progress sebagai quest.

### Scene 5, 0:58 - 1:15

Visual: wallet, contract detail, certificate screen, atau BscScan.

Voice-over:

> Setelah lulus, pencapaian dapat diterbitkan sebagai Soulbound Token di BNB Smart Chain Testnet. Backend memberi authorization, contract membaca mint price, frontend memverifikasi receipt dan event, lalu transaksi dikonfirmasi kembali ke backend.

### Scene 6, 1:15 - 1:30

Visual: final dashboard dan certificate.

Voice-over:

> PathTrick mengubah kebingungan menjadi perjalanan, dan perjalanan menjadi bukti skill yang dapat dibawa ke langkah berikutnya.

## 6. Backup Jika Demo Bermasalah

### Privy tidak bisa login

- Gunakan screenshot atau recording yang sudah disiapkan.
- Jelaskan bahwa flow live memakai Privy social login dan embedded wallet.

### Backend tidak tersedia

- Jalankan mode lokal dengan `.env.demo.example`.
- Tunjukkan onboarding, assessment, dashboard, map, dan mission.
- Jangan mengklaim certificate sudah minted.

### Wallet salah network

- Jangan mencoba berkali-kali di panggung.
- Tunjukkan docs Smart Contract dan sebutkan Chain ID 97.
- Lanjutkan dengan screenshot receipt atau BscScan.

### RPC atau transaksi lambat

- Tampilkan loading state.
- Jelaskan bahwa frontend menunggu receipt sebelum menampilkan sukses.
- Gunakan backup recording bila timeout berlanjut.

## 7. Checklist Presenter

- [ ] Browser private window siap.
- [ ] `.env.local` demo sudah benar.
- [ ] Build terakhir berhasil.
- [ ] Akun demo tersedia.
- [ ] Wallet testnet dan tBNB tersedia bila mint ditampilkan.
- [ ] Backend mint tersedia bila flow certificate live ditampilkan.
- [ ] Screenshot atau recording fallback tersedia.
- [ ] BscScan contract sudah terbuka di tab cadangan.
- [ ] Narasi tidak lebih dari 4 menit untuk live demo.
- [ ] Video tidak lebih dari 90 detik.
