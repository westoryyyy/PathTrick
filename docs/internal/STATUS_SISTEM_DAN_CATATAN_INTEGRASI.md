# Dokumentasi Internal PathTrick

> Dipindahkan dari route publik `/docs` (sebelumnya item sidebar "Status Sistem Saat Ini" dan "Catatan Integrasi"). Isi tidak diubah.

---

## STATUS SISTEM SAAT INI

> Sistem PathTrick saat ini sudah berjalan **end-to-end** dengan backend Fastify terhubung ke database PostgreSQL (via Prisma), AI Agents aktif (Groq API), dan smart contract live di BNB Testnet.

### Yang Sudah Berjalan

1. **Onboarding & Auth**  -  Login via Privy (Google/Email), role selection (The Dreamer / The Chaser) disimpan di backend via `POST /api/users/me/role`, dengan fallback lokal untuk demo.
2. **Learning Game**  -  Dashboard, houses, mission, quiz, lives, retry, game over, reward, dan certificate entry tersedia dalam alur pixel-RPG dengan Phaser.js engine.
3. **Backend Server**  -  Fastify 5 dengan 14 modules aktif: auth, roles, users, courses, houses, assessment, ai-agent, gamification, quests, jobs, scholarships, universities, notifications, dan admin.
4. **3 AI Agents**  -  Agent 1 (Dreamer  -  RIASEC), Agent 2 (Chaser  -  CV Analyzer), dan Agent 3 (Essay Evaluator) berjalan via Groq API dengan guardrail dan fallback.
5. **Bilingual (EN/ID)**  -  Language Toggle pixel-art tersedia di seluruh dashboard, mendukung switching antara Bahasa Indonesia dan English secara real-time via Zustand Persisted Store.
6. **Profile & Pixel UI**  -  Nickname, avatar, dan state disimpan melalui Zustand persistence. Tampilan pixel-art konsisten di profile, dashboard, header, dan game HUD.
7. **SBT Certificate**  -  Mint flow end-to-end: prepare-mint → EIP-712 signature → wallet mint → receipt verification → backend confirm. Live di BNB Testnet Chain ID 97.
8. **Knowledge RAG**  -  Cohere embed-multilingual-v3.0 untuk embedding knowledge base. Cosine similarity search in-memory untuk RAG pipeline Agent AI.

### Batasan Saat Ini

Deployment saat ini berada di testnet. Nilai tBNB tidak memiliki nilai ekonomi nyata, RPC dapat mengalami keterlambatan. Untuk produksi, dibutuhkan monitoring transaksi, retry yang aman, indexing certificate, pengelolaan consent, dan kebijakan wallet recovery.

Transaksi certificate membutuhkan wallet yang memiliki tBNB di BNB Smart Chain Testnet. Frontend memiliki fallback mock state (`NEXT_PUBLIC_USE_MOCK_BACKEND=true`) untuk demo tanpa backend.

---

## CATATAN INTEGRASI

### Variabel Lingkungan Frontend

| Variabel | Tujuan |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL backend Fastify (default: `http://localhost:8080`). |
| `NEXT_PUBLIC_PRIVY_APP_ID` | Public application ID untuk login dan embedded wallet Privy. |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Alamat smart contract untuk operasi frontend. |
| `NEXT_PUBLIC_PATHTRICK_SBT_ADDRESS` | Alamat SBT contract publik di BNB Testnet. |
| `NEXT_PUBLIC_BNB_TESTNET_RPC_URL` | RPC Chain ID 97 untuk membaca contract dan mengirim transaksi. |
| `NEXT_PUBLIC_CHAIN_ID` | Chain ID untuk BNB Smart Chain Testnet (97). |
| `NEXT_PUBLIC_MINT_PRICE` | Harga mint untuk referensi UI (default: 0.005 BNB). |
| `NEXT_PUBLIC_USE_MOCK_BACKEND` | Memaksa request memakai mock route lokal Next.js. |
| `NEXT_PUBLIC_ALLOW_LOCAL_ROLE_FALLBACK` | Mengizinkan role lokal hanya sebagai fallback demo. |

### Variabel Lingkungan Backend

| Variabel | Tujuan |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Prisma ORM). |
| `REDIS_URL` | Redis connection untuk BullMQ job queue. |
| `PRIVY_APP_ID` | Privy App ID untuk server-side token verification. |
| `PRIVY_VERIFICATION_KEY` | Public key (PEM) untuk verifikasi Privy access token. |
| `APP_JWT_SECRET` | Secret untuk app-issued session JWT setelah Privy verification. |
| `GROQ_API_KEY` | API key Groq untuk AI Agent 1, 2, dan 3. |
| `COHERE_API_KEY` | API key Cohere untuk embedding knowledge base (RAG). |
| `SIGNER_PRIVATE_KEY` | Private key untuk generate EIP-712 mint signature. |
| `CONTRACT_ADDRESS` | Smart contract address di BNB Testnet. |
| `CHAIN_ID` | Chain ID (97 untuk BNB Testnet). |

### Modul API Backend

Backend Fastify menjalankan **14 modules** aktif: `auth` (Privy verification + JWT session), `roles`, `users`, `courses`, `houses`, `assessment` (AI-powered), `ai-agent` (3 agents), `gamification`, `quests`, `jobs`, `scholarships`, `universities`, `notifications`, dan `admin`.

Frontend mengharapkan `GET /api/roles` untuk metadata role dan `POST /api/users/me/role` dengan body `{ roleId }`. Untuk certificate, frontend memanggil `POST /api/certificates/prepare-mint`, membaca `courseId`, `nonce`, `deadline`, dan `signature`, lalu mengirim `POST /api/certificates/confirm-mint` dengan `courseId` dan `txHash`.

### Checklist Transaksi Sertifikat

> Wallet harus berada di Chain ID 97, memiliki saldo tBNB untuk mint price dan gas, membaca `mintPrice()` dari contract, menunggu receipt, memeriksa event `CertificateMinted(to, courseId)`, lalu menunggu backend menerima konfirmasi txHash sebelum UI menampilkan status berhasil.

Error yang perlu ditampilkan dengan jelas meliputi wrong network, insufficient funds, user rejected transaction, `IncorrectMintFee`, `AlreadyCertified`, `InvalidSignature`, dan `SignatureExpired`.
