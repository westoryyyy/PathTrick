'use client';
/* eslint-disable react/no-unescaped-entities */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Image from 'next/image';

type DocSection =
  | 'overview'
  | 'background'
  | 'web3_infra'
  | 'feature_sma'
  | 'feature_mahasiswa'
  | 'ten_houses'
  | 'smart_contract'
  | 'ai_riasec'
  | 'ai_cv'
  | 'system_status'
  | 'integration_notes'
  | 'business_scaling'
  | 'market_strategy'
  | 'competitive_edge'
  | 'hackathon_case';

export default function DocsPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<DocSection>('overview');

  const handleBack = () => {
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const navItems: { key: DocSection; label: string; group?: string }[] = [
    { key: 'overview', label: '1. Gambaran Umum', group: 'UMUM' },
    { key: 'background', label: '2. Latar Belakang', group: '' },
    { key: 'web3_infra', label: '3. Infrastruktur Web3', group: '' },
    { key: 'feature_sma', label: '4. Fitur: The Dreamer', group: 'FITUR' },
    { key: 'feature_mahasiswa', label: '5. Fitur: The Chaser', group: '' },
    { key: 'ten_houses', label: '6. 10 Houses', group: '' },
    { key: 'smart_contract', label: '7. Smart Contract', group: 'BLOCKCHAIN' },
    { key: 'ai_riasec', label: '8. AI: Mesin RIASEC', group: 'MESIN AI' },
    { key: 'ai_cv', label: '9. AI: Analisis CV', group: '' },
    { key: 'system_status', label: '10. Status Sistem Saat Ini', group: 'OPERASIONAL' },
    { key: 'integration_notes', label: '11. Catatan Integrasi', group: '' },
    { key: 'business_scaling', label: '12. Skalabilitas Bisnis', group: 'BISNIS' },
    { key: 'market_strategy', label: '13. Pasar & GTM', group: '' },
    { key: 'competitive_edge', label: '14. Keunggulan Kompetitif', group: '' },
    { key: 'hackathon_case', label: '15. Kasus Hackathon', group: 'KESIAPAN INVESTOR' },
  ];

  return (
    <div className={styles.page}>

      {/* Top Nav */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <button onClick={handleBack} className={styles.backBtn}>◀ KEMBALI</button>
          <span className={styles.topBarTitle}>DOKUMENTASI SISTEM</span>
        </div>
        <div className={styles.topBarLogo}>
          <Image src="/PathTrick.png" alt="PathTrick Logo" width={140} height={35} style={{ objectFit: 'contain' }} />
        </div>
      </div>

      {/* Body */}
      <div className={styles.body}>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarTitle}>Daftar Isi</div>
          {navItems.map((item, i) => (
            <React.Fragment key={item.key}>
              {item.group && i !== 0 && (
                <div className={styles.sidebarGroup}>{item.group}</div>
              )}
              <button
                className={`${styles.sidebarTab} ${activeSection === item.key ? styles.sidebarTabActive : ''}`}
                onClick={() => setActiveSection(item.key)}
              >
                {item.label}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Main Content */}
        <div className={styles.content}>


          {/* ── 1. OVERVIEW ── */}
          {activeSection === 'overview' && (
            <>
              <h2 className={styles.docTitle}>SELAMAT DATANG DI PATHTRICK</h2>
              <div className={styles.separator} />
              <section className={styles.section}>
                <p className={styles.text} style={{ marginBottom: '16px', textAlign: 'justify' }}>
                  Selamat datang di pusat dokumentasi resmi <strong>PathTrick</strong>!
                </p>
                <p className={styles.text} style={{ marginBottom: '24px', textAlign: 'justify' }}>
                  Setiap tahun, jutaan pelajar Indonesia diminta mengambil keputusan besar seperti memilih jurusan, mengejar beasiswa, atau menyiapkan karier jauh sebelum mereka benar-benar memahami kekuatan dan arah dirinya. Informasi tersedia di mana-mana, tetapi jalannya tetap terasa kabur. Assessment berhenti sebagai hasil, course berdiri sendiri, dan CV belum tentu mampu membuktikan apa yang benar-benar bisa dikerjakan.
                </p>
                <p className={styles.text} style={{ marginBottom: '36px', textAlign: 'justify' }}>
                  <strong>PathTrick mengubah kebingungan itu menjadi perjalanan yang bisa dijalani.</strong> Kami menggabungkan assessment RIASEC dan CV dengan roadmap belajar, mission, project, dan credential yang dapat diverifikasi. Semuanya dikemas dalam dunia <strong>RPG Pixel-Art</strong> agar langkah pertama terasa ringan, progress terlihat nyata, dan belajar tidak berhenti di rekomendasi. Di sini, setiap quest membawa user lebih dekat pada skill yang bisa dibuktikan, bukan sekadar angka di dashboard.
                </p>
                <div className={styles.callout} style={{ textAlign: 'justify' }}>
                  <strong>PathTrick adalah jembatan dari “Saya tidak tahu harus mulai dari mana” menjadi “Saya tahu langkah berikutnya, saya sudah mengerjakannya, dan saya punya bukti untuk menunjukkannya.”</strong>
                </div>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Diagram Arsitektur Sistem</h3>
                <Image src="/system-arch.png" alt="System Architecture Diagram" width={1024} height={576} className={styles.pixelImage} />
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Tech Stack</h3>
                <table className={styles.techTable}>
                  <thead>
                    <tr>
                      <th>Kategori</th>
                      <th>Teknologi yang Digunakan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Frontend Framework</strong></td>
                      <td>Next.js 16 (App Router), React 19, TypeScript 5</td>
                    </tr>
                    <tr>
                      <td><strong>Styling & UI</strong></td>
                      <td>Tailwind CSS 4, CSS Modules, Framer Motion, Lucide React Icons</td>
                    </tr>
                    <tr>
                      <td><strong>Game Engine</strong></td>
                      <td>Phaser.js 3.88 (Diintegrasikan langsung ke komponen React)</td>
                    </tr>
                    <tr>
                      <td><strong>Backend Server</strong></td>
                      <td>Fastify 5 (Node.js), Prisma ORM (PostgreSQL), BullMQ (Redis), Zod Validation</td>
                    </tr>
                    <tr>
                      <td><strong>State Management</strong></td>
                      <td>Zustand 5 (Persisted Store), React Query</td>
                    </tr>
                    <tr>
                      <td><strong>Web3 Stack</strong></td>
                      <td>Privy (Embedded Wallet & Social Login), Wagmi 3, Viem 2, Ethers 6</td>
                    </tr>
                    <tr>
                      <td><strong>Smart Contracts</strong></td>
                      <td>Solidity ^0.8.24, OpenZeppelin (ERC-1155, EIP-712, ECDSA), Foundry, BNB Testnet</td>
                    </tr>
                    <tr>
                      <td><strong>AI Engine</strong></td>
                      <td>Groq API (Qwen 3.8-27b) — 3 AI Agents: Dreamer, Chaser, Essay Evaluator</td>
                    </tr>
                    <tr>
                      <td><strong>AI Embedding (RAG)</strong></td>
                      <td>Cohere embed-multilingual-v3.0 (1024 dim) — Knowledge Base Retrieval</td>
                    </tr>
                    <tr>
                      <td><strong>Bilingual</strong></td>
                      <td>Language Toggle EN/ID dengan Translation Store (Zustand Persisted)</td>
                    </tr>
                  </tbody>
                </table>
              </section>
            </>
          )}

          {/* ── 2. BACKGROUND ── */}
          {activeSection === 'background' && (
            <>
              <h2 className={styles.docTitle}>LATAR BELAKANG</h2>
              <div className={styles.separator} />
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Pernyataan Masalah</h3>
                <p className={styles.text} style={{ marginBottom: '16px', textAlign: 'justify' }}>
                  Belakangan ini, timeline X (Twitter) sering diramaikan oleh keluh kesah mahasiswa yang merasa "salah jurusan". Fenomena ini sebetulnya tidak mengejutkan. Di luar negeri, universitas terkemuka justru menyarankan calon mahasiswa untuk mengambil <strong>gap year</strong> demi bereksplorasi dan menemukan minat bakat asli mereka tanpa tekanan. Sayangnya, kultur di Indonesia sangat berbeda. Kita hidup dalam bayang-bayang tuntutan sosial dan dikejar "argo" umur, di mana pada usia 20 harus sudah begini, di usia 25 harus sudah begitu. Akibatnya, lebih dari 50% siswa SMA terpaksa memilih jurusan secara terburu-buru tanpa bimbingan sistematis yang bisa membantu mereka menjawab pertanyaan mendasar: <strong>"Saya ini sebenarnya cocoknya jadi apa?"</strong>
                </p>
                <p className={styles.text} style={{ textAlign: 'justify', marginBottom: '32px' }}>
                  Namun, krisis ini tidak berhenti di gerbang kelulusan kampus. Setelah lulus dan menjadi <strong>fresh graduate</strong>, masalah baru muncul. <strong>Skill gap</strong> antara teori di kampus dan praktik riil di industri makin menganga lebar. Para mahasiswa yang sadar akan hal ini berlomba-lomba mengumpulkan berbagai sertifikat kursus digital (Web2) untuk menghias CV mereka. Ironisnya, sertifikat-sertifikat ini sangat mudah dipalsukan. Di sisi lain, rekruter kehabisan waktu dan tenaga karena tidak memiliki mekanisme verifikasi portofolio dan keahlian kandidat yang bisa dipercaya secara mutlak. Mahasiswa butuh validasi, rekruter butuh kepastian, tetapi keduanya terjebak dalam sistem yang usang.
                </p>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Solusi Kami</h3>
                <p className={styles.text}>
                  <strong>PathTrick</strong> menggabungkan kekuatan <strong>AI</strong> dan <strong>Web3 (BNB Chain)</strong> dalam satu platform gamifikasi yang:
                </p>
                <div className={styles.timeline}>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>1</div>
                    <div className={styles.timelineContent}>
                      <strong>Memetakan Perjalanan Belajar secara Personal:</strong> AI menganalisis profil pengguna (via RIASEC atau CV) dan menghasilkan roadmap belajar yang terpersonalisasi, bukan template generik.
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>2</div>
                    <div className={styles.timelineContent}>
                      <strong>Menjadikan Belajar Seperti Bermain Game:</strong> Dari 10 Houses yang masing-masing merepresentasikan satu bidang ilmu berdasarkan standar UNESCO ISCED-F 2013, AI menganalisis hasil RIASEC pengguna dan merekomendasikan Houses mana saja yang paling cocok sebagai <strong>Learning Path</strong> personal mereka. Setiap House adalah modul kompetensi yang harus "ditaklukkan" melalui mini-project.
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>3</div>
                    <div className={styles.timelineContent}>
                      <strong>Menerbitkan Bukti Keahlian yang Tidak Bisa Dipalsukan:</strong> Kelulusan dari setiap House akan memicu penerbitan <strong>Soulbound Token (SBT)</strong> di BNB Chain berupa sertifikat digital permanen yang on-chain dan tidak bisa dipindahtangankan.
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* ── 3. WEB3 INFRA ── */}
          {activeSection === 'web3_infra' && (
            <>
              <h2 className={styles.docTitle}>INFRASTRUKTUR WEB3</h2>
              <div className={styles.separator} />
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Prinsip Utama: "Kripto Tak Terlihat"</h3>
                <div className={styles.callout} style={{ textAlign: 'justify' }}>
                  "Pengguna menikmati seluruh keajaiban Web3 tanpa perlu pusing menyadari bahwa mereka sedang berinteraksi dengan teknologi blockchain."
                </div>
                <p className={styles.text} style={{ marginTop: '16px', textAlign: 'justify' }}>
                  Banyak platform Web3 yang gagal karena terlalu membebani pengguna dengan istilah teknis yang rumit sejak hari pertama. PathTrick mengambil jalan yang sangat berbeda. Mengingat sebagian besar pahlawan petualang kita adalah pelajar SMA dan mahasiswa di Indonesia yang mungkin belum akrab dengan dunia kripto, kami merancang sistem <strong>Crypto Invisible</strong>. Segala kerumitan blockchain sengaja kami sembunyikan rapat-rapat di balik tirai antarmuka pengguna yang sangat ramah, hangat, dan akrab di mata mereka.
                </p>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Komponen-Komponen Web3</h3>
                <div className={styles.featureGrid}>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}>
                      <Image src="/PrivyLogo.jpeg" alt="Privy" width={32} height={32} style={{ borderRadius: '6px', marginRight: '12px' }} />
                      <div className={styles.cardTitle}>Lapisan Dompet</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Alih-alih memaksa pengguna menghafal kata sandi rumit atau menginstal dompet digital terpisah, kami menggunakan <strong>Privy</strong>. Pengguna cukup masuk dengan <strong>akun Google</strong> mereka, semudah bermain media sosial biasa.
                    </div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}>
                      <Image src="/BNBSmartChainLogo.png" alt="BNB Chain" width={32} height={32} style={{ borderRadius: '6px', marginRight: '12px', objectFit: 'contain' }} />
                      <div className={styles.cardTitle}>Blockchain</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Kami memilih jaringan <strong>BNB Chain</strong> karena <strong>biaya transaksi</strong> yang sangat bersahabat dan ekosistemnya yang begitu besar di Asia Tenggara. Ini menjadikannya fondasi yang sempurna untuk dunia edukasi kita.
                    </div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}>
                      <Image src="/sbt_logo.jpg" alt="Soulbound Token" width={32} height={32} style={{ borderRadius: '6px', marginRight: '12px', objectFit: 'contain' }} />
                      <div className={styles.cardTitle}>Token Standard</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Sertifikat digital kelulusan Anda dicetak sebagai <strong>Soulbound Token (SBT)</strong>. Ini adalah bukti pencapaian permanen yang <strong>mengikat jiwa</strong> karakternya. Sekali diterbitkan, sertifikat ini tidak akan pernah bisa <strong>dipindahtangankan</strong> atau dijual ke orang lain.
                    </div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}>
                      <Image src="/gas_fee_logo.jpg" alt="Gas Fee" width={32} height={32} style={{ borderRadius: '6px', marginRight: '12px', objectFit: 'contain' }} />
                      <div className={styles.cardTitle}>Model Biaya Gas</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Pencetakan sertifikat mengusung sistem <strong>User-Paid & Backend Authorized</strong>. Pengguna menanggung <strong>mint price</strong> dan sedikit <strong>biaya gas</strong> secara mandiri. Sebelum transaksi dikirim, backend memeriksa kelulusan course lalu menerbitkan <strong>signature berumur terbatas</strong>. AI membantu proses evaluasi, sedangkan otorisasi kriptografi tetap dibuat oleh signer backend yang tidak pernah terekspos ke frontend.
                    </div>
                  </div>
                </div>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Implementasi yang Sudah Berjalan</h3>
                <div className={styles.featureGrid}>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}><Image src="/BNBSmartChainLogo.png" alt="" width={28} height={28} className={styles.cardIconImage} /></div><div className={styles.cardTitle}>Jaringan dan Contract</div></div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Deployment aktif berada di <strong>BNB Smart Chain Testnet</strong> dengan <strong>Chain ID 97</strong>. Contract certificate menggunakan alamat <code>0x39632892C33435a76043343Ef17Ac03124627ba9</code> dan ABI resmi dari <code>integration/PathtrickSBT.abi.json</code>. Data transaksi dapat diverifikasi melalui BscScan Testnet.
                    </div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}><Image src="/Security.png" alt="" width={28} height={28} className={styles.cardIconImage} /></div><div className={styles.cardTitle}>Alur Otorisasi</div></div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Setelah course selesai, frontend meminta authorization ke <code>POST /api/certificates/prepare-mint</code>. Backend mengembalikan <strong>courseId</strong>, <strong>nonce</strong>, <strong>deadline</strong>, dan <strong>signature</strong>. Frontend tidak membuat, mengubah, atau memakai ulang nonce dan deadline secara manual.
                    </div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}><Image src="/sbt_logo.jpg" alt="" width={28} height={28} className={styles.cardIconImage} /></div><div className={styles.cardTitle}>Verifikasi On-chain</div></div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Wallet harus berada di Chain ID 97. Frontend membaca <strong>mintPrice()</strong> secara langsung, menghitung kebutuhan saldo bersama gas, lalu memanggil <code>mintCertificate(courseId, deadline, signature)</code>. Setelah receipt tersedia, frontend memeriksa event <strong>CertificateMinted(to, courseId)</strong>.
                    </div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}><Image src="/certificate-template.png" alt="" width={28} height={28} className={styles.cardIconImage} /></div><div className={styles.cardTitle}>Konfirmasi Backend</div></div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Certificate belum dianggap selesai hanya karena wallet mengirim transaksi. Setelah receipt dan event valid, frontend mengirim <code>txHash</code> ke <code>POST /api/certificates/confirm-mint</code>. Status sukses baru ditampilkan setelah backend menerima dan memvalidasi transaksi tersebut.
                    </div>
                  </div>
                </div>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Batasan dan Arah Menuju Produksi</h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Deployment saat ini ditujukan untuk demo dan validasi di testnet. Nilai tBNB tidak memiliki nilai ekonomi nyata, RPC dapat mengalami keterlambatan, dan status certificate tetap bergantung pada ketersediaan backend. Untuk produksi, PathTrick perlu menambahkan monitoring transaksi, retry yang aman, indexing certificate, pengelolaan consent, kebijakan wallet recovery, dan keputusan bisnis apakah biaya gas tetap dibayar user atau disubsidi partner.
                </p>
                <p className={styles.text} style={{ marginTop: '16px', textAlign: 'justify' }}>
                  SBT dirancang sebagai bukti pencapaian yang terikat pada wallet penerima. Karena interface token menggunakan standar ERC-1155, sifat soulbound harus dipahami sebagai kebijakan transfer yang ditegakkan oleh implementasi contract, bukan sekadar label UI. Verifikasi akhir tetap dilakukan melalui contract dan event yang tercatat di chain.
                </p>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Arsitektur Koneksi (Privy + Ethers)</h3>
                <div className={styles.text} style={{ textAlign: 'justify', marginBottom: '24px' }}>
                  Dalam dunia PathTrick, kami menggabungkan dua pusaka teknologi yang saling bekerja sama dengan mulus layaknya sebuah kedai petualang:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#3e2723', border: '3px solid #5d4037', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                      <Image src="/PrivyLogo.jpeg" alt="Privy" width={48} height={48} style={{ objectFit: 'cover' }} />
                    </div>
                    <div>
                      <h4 style={{ fontFamily: '"Press Start 2P"', fontSize: '0.9rem', color: '#3e2723', marginBottom: '8px', lineHeight: '1.4' }}>
                        Privy (Sang Resepsionis)
                      </h4>
                      <p className={styles.text} style={{ textAlign: 'justify', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>
                        Bertugas menyambut petualang baru. Privy menangani proses <strong>Login</strong> (menggunakan Email atau akun Google) dan secara ajaib menciptakan dompet kripto (<strong>Embedded Wallet</strong>) di balik layar tanpa membebani pengguna dengan keharusan menginstal ekstensi dompet atau menyimpan kata sandi rahasia yang rumit.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#3e2723', border: '3px solid #5d4037', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', padding: '4px' }}>
                      <Image src="/WagmiLogo.png" alt="Wagmi" width={40} height={40} style={{ objectFit: 'contain' }} />
                    </div>
                    <div>
                      <h4 style={{ fontFamily: '"Press Start 2P"', fontSize: '0.9rem', color: '#3e2723', marginBottom: '8px', lineHeight: '1.4' }}>
                        Wallet Provider + Ethers (Sang Kurir Transaksi)
                      </h4>
                      <p className={styles.text} style={{ textAlign: 'justify', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>
                        Setelah pengguna memiliki dompet dari Privy, provider wallet dan <strong>ethers</strong> mengambil alih tugas berat. Keduanya mengantarkan instruksi dari layar PathTrick langsung menuju <strong>Smart Contract</strong> di BNB Chain, mulai dari membaca data sertifikat hingga mengeksekusi pencetakan Soulbound Token. Alur mint tetap memeriksa network, saldo, mint price, receipt, dan event contract sebelum certificate dikonfirmasi ke backend.
                      </p>
                    </div>
                  </div>

                </div>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Mengapa BNB Chain?</h3>
                <div className={styles.featureGrid}>
                  <div className={styles.featureCard} style={{ padding: '20px' }}>
                    <div className={styles.cardTitle} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}><Image src="/Coin.png" alt="" width={28} height={28} className={styles.cardInlineIcon} /> Biaya Rendah</div>
                    <div className={styles.cardText} style={{ fontSize: '0.95rem', textAlign: 'justify' }}>Ini adalah pilihan yang sangat ideal untuk mencetak jutaan <strong>sertifikat pelajar</strong> masa depan tanpa perlu membebani mereka dengan <strong>biaya gas</strong> yang mencekik.</div>
                  </div>
                  <div className={styles.featureCard} style={{ padding: '20px' }}>
                    <div className={styles.cardTitle} style={{ marginBottom: '8px' }}>EVM Compatible</div>
                    <div className={styles.cardText} style={{ fontSize: '0.95rem', textAlign: 'justify' }}>Dunia ini dibangun di atas fondasi <strong>kontrak pintar</strong> yang matang, <strong>super aman</strong>, dan mengikuti standar baku sehingga sangat <strong>transparan</strong> untuk diaudit oleh siapapun.</div>
                  </div>
                  <div className={styles.featureCard} style={{ padding: '20px' }}>
                    <div className={styles.cardTitle} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}><Image src="/globe.svg" alt="" width={28} height={28} className={styles.cardInlineIcon} /> Adopsi Lokal</div>
                    <div className={styles.cardText} style={{ fontSize: '0.95rem', textAlign: 'justify' }}>Ekosistem ini sudah berhasil memenangkan hati <strong>komunitas lokal</strong>, menjadikannya rumah yang paling tepat dengan tingkat <strong>adopsi yang luar biasa tinggi</strong> di pasar <strong>Indonesia</strong>.</div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* ── 4. FEATURE SMA ── */}
          {activeSection === 'feature_sma' && (
            <>
              <h2 className={styles.docTitle}>FITUR: THE DREAMER</h2>
              <div className={styles.separator} />
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Persona: "The Dreamer"</h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Mari kita berkenalan dengan <strong>The Dreamer</strong>. Mereka adalah jiwa-jiwa muda di bangku kelas 10 hingga 12 yang matanya masih berbinar menatap masa depan, namun batinnya seringkali diliputi keraguan. Di persimpangan jalan akademis ini, mereka tidak lagi membutuhkan tumpukan brosur tebal atau janji manis kampus belaka. Mereka sangat membutuhkan panduan yang jernih, peta jalan konkret yang bisa langsung dieksekusi, dan sebuah percikan motivasi yang menyenangkan untuk terus melangkah tanpa takut salah arah.
                </p>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Alur Pengguna The Dreamer</h3>
                <Image src="/user-flow-sma-v2.png" alt="User Flow The Dreamer" width={1024} height={576} className={styles.pixelImage} />
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Fitur Utama Dasbor The Dreamer</h3>
                <div className={styles.featureGrid}>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}>
                      <Image src="/riasec_logo.jpg" alt="RIASEC" width={32} height={32} style={{ borderRadius: '6px', marginRight: '12px', objectFit: 'contain' }} />
                      <div className={styles.cardTitle}>Asesmen RIASEC (AI)</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Perjalanan mereka dimulai di sini. Dengan santai, mereka akan menjawab serangkaian pertanyaan personal tentang minat terpendam. Di belakang layar, AI kita bekerja keras merajut jawaban tersebut menjadi sebuah profil utuh, lalu menyajikan rekomendasi jurusan dan kampus impian yang paling akurat untuk dituju.
                    </div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}>
                      <Image src="/bounty_logo.jpg" alt="Learning Progress" width={32} height={32} style={{ borderRadius: '6px', marginRight: '12px', objectFit: 'contain' }} />
                      <div className={styles.cardTitle}>Kemajuan Belajar</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Melalui daftar quest harian dan tantangan mingguan yang epik, The Dreamer dapat melacak indikator kesiapan (Readiness Meter) mereka. Sistem mekanik ini sengaja dirancang untuk menjaga api semangat belajar agar tidak pernah padam di tengah petualangan.
                    </div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}>
                      <Image src="/readiness_logo.jpg" alt="University Hub" width={32} height={32} style={{ borderRadius: '6px', marginRight: '12px', objectFit: 'contain' }} />
                      <div className={styles.cardTitle}>Pusat Universitas</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Ruang khusus bagi The Dreamer untuk mengeksplorasi informasi detail kampus dan program studi. Di sini mereka bisa memetakan dan menentukan target masa depan dengan lebih konkret sesuai dengan hasil asesmen mereka.
                    </div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}>
                      <Image src="/radar_logo.jpg" alt="Scholarship Hub" width={32} height={32} style={{ borderRadius: '6px', marginRight: '12px', objectFit: 'contain' }} />
                      <div className={styles.cardTitle}>Pusat Beasiswa</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Tidak ada mimpi yang boleh padam hanya karena biaya. Sistem ini secara aktif mencocokkan profil sang petualang dengan lautan database beasiswa secara real-time, mengubah mereka dari Scholarship Hunter menjadi Awardee Material.
                    </div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}>
                      <Image src="/vault_logo.jpg" alt="Relics & Treasures" width={32} height={32} style={{ borderRadius: '6px', marginRight: '12px', objectFit: 'contain' }} />
                      <div className={styles.cardTitle}>Relik & Harta Karun</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Sebuah ruang harta karun untuk menyimpan setiap sertifikat atau pencapaian on-chain yang berhasil didapatkan. Ini menjadi bukti langkah-langkah nyata mereka dalam mempersiapkan masa depan.
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* ── 5. FEATURE MAHASISWA ── */}
          {activeSection === 'feature_mahasiswa' && (
            <>
              <h2 className={styles.docTitle}>FITUR: THE CHASER</h2>
              <div className={styles.separator} />
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Persona: "The Chaser"</h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Berbeda dengan The Dreamer, mari kita sapa <strong>The Chaser</strong>. Mereka adalah barisan pahlawan di tingkat akhir perkuliahan atau fresh graduate yang sedang berlari kencang mengejar karir pertama mereka di dunia nyata. Di tahap ini, mereka tidak lagi punya waktu untuk menebak-nebak materi pelajaran. Mereka sangat membutuhkan arena pembuktian di mana skill mereka bisa diasah tajam, diuji keras, dan diverifikasi keasliannya secara absolut oleh para rekruter industri.
                </p>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Alur Pengguna The Chaser</h3>
                <Image src="/docs-flow-mahasiswa-v2.jpg" alt="User Flow The Chaser" width={900} height={394} className={styles.gameImage} />
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Fitur Utama Dasbor The Chaser</h3>
                <div className={styles.featureGrid}>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}>
                      <Image src="/skillgap_logo.jpg" alt="Skill Gap Analysis" width={32} height={32} style={{ borderRadius: '6px', marginRight: '12px', objectFit: 'contain' }} />
                      <div className={styles.cardTitle}>Analisis Skill Gap AI</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Pertempuran mereka dimulai dengan selembar CV. Begitu diunggah, sistem AI cerdas kita akan membedah CV tersebut lapis demi lapis, menemukan jurang kesenjangan antara kemampuan mereka saat ini dengan kejamnya standar industri, dan menyusun peta jalan presisi untuk mengejar ketertinggalan.
                    </div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}>
                      <Image src="/careerhub_logo.jpg" alt="Career Hub" width={32} height={32} style={{ borderRadius: '6px', marginRight: '12px', objectFit: 'contain' }} />
                      <div className={styles.cardTitle}>Pusat Karir</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Ini adalah pusat komando utama mereka. Sebuah dashboard terpusat yang dengan bangga memamerkan Career Score mereka, melacak secara akurat progres belajar pada setiap kompetensi, dan memajang gemerlap koleksi token sertifikat yang telah mereka menangkan.
                    </div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}>
                      <Image src="/learningmission_logo.jpg" alt="Learning Mission" width={32} height={32} style={{ borderRadius: '6px', marginRight: '12px', objectFit: 'contain' }} />
                      <div className={styles.cardTitle}>Misi Belajar</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Meninggalkan dunia dongeng, mereka memasuki misi belajar tingkat tinggi yang sepenuhnya diadaptasi dari silabus dunia industri sungguhan. Setiap misi dirancang secara taktis untuk menutup celah gap skill yang sebelumnya telah diendus oleh kecerdasan buatan kita.
                    </div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}>
                      <Image src="/vault_logo.jpg" alt="Skill Badges" width={32} height={32} style={{ borderRadius: '6px', marginRight: '12px', objectFit: 'contain' }} />
                      <div className={styles.cardTitle}>Lencana Skill</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Inilah ruang galeri kebanggaan sang petualang. Sebuah tempat memajang Skill Badges dan sertifikat berharga yang telah diraih. Pencapaian ini kapan saja bisa dibagikan sebagai tautan publik kepada rekruter untuk membuktikan langsung di atas jaringan blockchain bahwa kemampuan mereka adalah nyata.
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* ── 6. THE 10 HOUSES ── */}
          {activeSection === 'ten_houses' && (
            <>
              <h2 className={styles.docTitle}>THE 10 HOUSES</h2>
              <div className={styles.separator} />
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Mesin Peta Dunia</h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Pusat petualangan PathTrick dibangun di atas fondasi <strong>Phaser.js</strong>, sebuah mesin game 2D tangguh yang hidup langsung di dalam browser Anda. Di dalam dunia ini, terbentang <strong>10 Dunia (The 10 Worlds)</strong> yang pembagiannya mengacu pada standar klasifikasi bidang pendidikan global <strong>UNESCO ISCED-F 2013</strong> (International Standard Classification of Education: Fields of Education and Training). Setiap World merepresentasikan satu bidang ilmu utama dan menyimpan modul kompetensi krusial di dalamnya. Saat pertama kali menjejakkan kaki, hanya World pertama yang membuka pintunya untuk Anda. World-world berikutnya dijaga ketat oleh sistem dan hanya akan terbuka setelah Anda berhasil membuktikan kelayakan di dunia sebelumnya.
                </p>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>10 Bidang Ilmu (UNESCO ISCED-F 2013)</h3>
                <div className={styles.featureGrid}>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}>01</div><div className={styles.cardTitle}>Education</div></div>
                    <div className={styles.cardText}>Ilmu pendidikan dan pelatihan keguruan. World ini menempa petualang menjadi pendidik masa depan yang memahami metode pengajaran modern.</div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}>02</div><div className={styles.cardTitle}>Arts & Humanities</div></div>
                    <div className={styles.cardText}>Seni dan humaniora, termasuk bahasa, sejarah, filsafat, dan seni rupa. Tempat menempa kreativitas dan pemahaman budaya.</div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}>03</div><div className={styles.cardTitle}>Social Sciences & Journalism</div></div>
                    <div className={styles.cardText}>Ilmu sosial, jurnalistik, informasi, dan perpustakaan. World bagi mereka yang ingin memahami dan membentuk masyarakat.</div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}>04</div><div className={styles.cardTitle}>Business, Admin & Law</div></div>
                    <div className={styles.cardText}>Bisnis, administrasi, manajemen, dan hukum. Arena bagi calon pemimpin dan penggerak ekonomi.</div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}>05</div><div className={styles.cardTitle}>Natural Sciences & Math</div></div>
                    <div className={styles.cardText}>Ilmu pengetahuan alam, matematika, dan statistika. Fondasi sains yang kokoh untuk inovasi dan riset.</div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}>06</div><div className={styles.cardTitle}>ICT</div></div>
                    <div className={styles.cardText}>Teknologi Informasi dan Komunikasi. World digital tempat petualang menguasai senjata teknologi masa depan.</div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}>07</div><div className={styles.cardTitle}>Engineering & Construction</div></div>
                    <div className={styles.cardText}>Teknik, manufaktur, dan konstruksi. Bengkel tempat membangun dunia fisik dari blueprint menjadi kenyataan.</div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}>08</div><div className={styles.cardTitle}>Agriculture & Veterinary</div></div>
                    <div className={styles.cardText}>Pertanian, kehutanan, perikanan, dan kedokteran hewan. World bagi penjaga bumi dan ketahanan pangan.</div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}>09</div><div className={styles.cardTitle}>Health & Welfare</div></div>
                    <div className={styles.cardText}>Kesehatan dan kesejahteraan sosial, termasuk kedokteran dan keperawatan. Tempat menempa pahlawan kesehatan.</div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}>10</div><div className={styles.cardTitle}>Services</div></div>
                    <div className={styles.cardText}>Layanan jasa seperti pariwisata, perhotelan, transportasi, dan keamanan kerja. World penghubung dunia dengan pengalaman.</div>
                  </div>
                </div>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Siklus Quest di Setiap World</h3>
                <div className={styles.timeline}>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>1</div>
                    <div className={styles.timelineContent}>
                      <strong>Membaca Gulungan Teori:</strong> Petualangan di setiap world selalu dimulai dengan mempelajari materi naratif. Kami menggunakan analogi sederhana dunia nyata agar konsep teknis sekalipun mudah dicerna oleh para pemula.
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>2</div>
                    <div className={styles.timelineContent}>
                      <strong>Ujian Pemahaman Cepat:</strong> Sebuah kuis singkat akan muncul secara otomatis. Jika tebakan Anda meleset, penjaga world akan ramah mengarahkan Anda kembali ke ruang baca sebelum mengizinkan Anda mencoba lagi.
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>3</div>
                    <div className={styles.timelineContent}>
                      <strong>Menempa Senjata di Lab:</strong> Menggunakan editor kode pintar yang menyatu dengan browser, Anda bisa langsung bereksperimen mengetik kode dan melihat hasilnya muncul seketika di depan mata.
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>4</div>
                    <div className={styles.timelineContent}>
                      <strong>Pertarungan Melawan Boss:</strong> Ini adalah ujian akhir. Mini project Anda akan dievaluasi dengan ketat oleh wasit AI (Agent 3 — Essay Evaluator). Jika berhasil meraih skor kelulusan, sistem akan langsung menempakan medali abadi (SBT) ke dalam dompet Anda.
                    </div>
                  </div>
                </div>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Mesin di Balik Layar</h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Agar seluruh petualangan ini terasa hidup tanpa ada jeda, kami menggunakan arsitektur <strong>State Machine</strong> yang mulus. Rekam jejak Anda di setiap world dijaga ketat oleh brankas memori <strong>Zustand</strong>. Ketika karakter Anda berinteraksi di dalam dunia game, mesin game akan langsung berbisik kepada antarmuka melalui gelombang komunikasi khusus. Di saat yang sama, setiap tetes keringat alias poin pengalaman yang Anda kumpulkan akan dihitung secara instan dan dipancarkan ke layar utama Anda detik itu juga.
                </p>
              </section>
            </>
          )}

          {/* ── 7. SMART CONTRACT ── */}
          {activeSection === 'smart_contract' && (
            <>
              <h2 className={styles.docTitle}>KONTRAK PINTAR</h2>
              <div className={styles.separator} />
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Detail Kontrak</h3>
                <div style={{ background: '#3e2723', padding: '20px', borderRadius: '8px', border: '2px solid #5d4037' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <p style={{ color: '#d7ccc8', fontSize: '0.7rem', marginBottom: '8px', fontFamily: '"Press Start 2P"' }}>NETWORK</p>
                      <p style={{ color: '#ffb300', fontWeight: 'bold' }}>BNB Smart Chain Testnet, Chain ID 97</p>
                    </div>
                    <div>
                      <p style={{ color: '#d7ccc8', fontSize: '0.7rem', marginBottom: '8px', fontFamily: '"Press Start 2P"' }}>TOKEN TYPE</p>
                      <p style={{ color: '#fff', fontWeight: 'bold' }}>Soulbound Token (Non-transferable BEP-1155)</p>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <p style={{ color: '#d7ccc8', fontSize: '0.7rem', marginBottom: '8px', fontFamily: '"Press Start 2P"' }}>SBT CONTRACT ADDRESS</p>
                      <code style={{ background: '#1d120d', padding: '10px 14px', borderRadius: '4px', color: '#fdfaf6', fontSize: '0.9rem', wordBreak: 'break-all', display: 'block', border: '1px solid #5d4037' }}>
                        0x39632892C33435a76043343Ef17Ac03124627ba9
                      </code>
                      <a href="https://testnet.bscscan.com/address/0x39632892C33435a76043343Ef17Ac03124627ba9" target="_blank" rel="noreferrer" style={{ color: '#ffb300', display: 'inline-block', marginTop: '10px', fontSize: '0.8rem' }}>
                        Lihat kontrak di BscScan Testnet
                      </a>
                    </div>
                  </div>
                </div>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Alur Penempaan Sertifikat</h3>
                <div className={styles.timeline}>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>1</div>
                    <div className={styles.timelineContent}>
                      <strong>Course selesai:</strong> Pengguna menyelesaikan course dan memenuhi syarat kelulusan yang ditentukan sistem.
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>2</div>
                    <div className={styles.timelineContent}>
                      <strong>Authorization backend:</strong> Frontend meminta <code>courseId</code>, <code>nonce</code>, <code>deadline</code>, dan <code>signature</code> melalui <code>POST /api/certificates/prepare-mint</code>. Signature dibuat oleh signer backend, bukan oleh frontend.
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>3</div>
                    <div className={styles.timelineContent}>
                      <strong>Mint oleh wallet:</strong> Frontend memastikan wallet berada di Chain ID 97, membaca <code>mintPrice()</code>, memeriksa saldo untuk mint price dan gas, lalu memanggil <code>mintCertificate(courseId, deadline, signature)</code>.
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>4</div>
                    <div className={styles.timelineContent}>
                      <strong>Receipt dan event:</strong> Setelah transaksi confirmed, frontend memeriksa receipt dan event <code>CertificateMinted(to, courseId)</code>. Error seperti signature expired, insufficient funds, wrong network, dan user rejection ditampilkan dengan jelas.
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>5</div>
                    <div className={styles.timelineContent}>
                      <strong>Konfirmasi backend:</strong> Frontend mengirim <code>courseId</code> dan <code>txHash</code> ke <code>POST /api/certificates/confirm-mint</code>. UI hanya menampilkan sukses setelah backend menerima transaksi.
                    </div>
                  </div>
                </div>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Kekuatan Soulbound Token</h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Certificate dirancang sebagai <strong>Soulbound Token</strong> berbasis BEP-1155. Credential terikat pada wallet penerima dan dapat diverifikasi melalui contract, transaction receipt, event <code>CertificateMinted</code>, serta explorer BNB Testnet. Sifat non-transferable ditegakkan oleh implementasi contract, bukan hanya oleh tampilan frontend.
                </p>
              </section>
            </>
          )}

          {/* ── 8. AI RIASEC ENGINE ── */}
          {activeSection === 'ai_riasec' && (
            <>
              <h2 className={styles.docTitle}>AI: MESIN RIASEC</h2>
              <div className={styles.separator} />

              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Mengenal Kompas RIASEC</h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  RIASEC bukanlah sekadar teori psikologi usang, melainkan sebuah kompas karir tangguh ciptaan Holland (1959). Kompas ajaib ini membelah kepribadian manusia ke dalam enam penjuru utama: Realistic, Investigative, Artistic, Social, Enterprising, dan Conventional. Di PathTrick, kami memanfaatkan kompas ini sebagai fondasi paling kokoh untuk membaca arah angin potensi sejati seorang Siswa SMA, sebelum mereka tersesat di rimba perkuliahan.
                </p>
              </section>

              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Alur Kerja AI RIASEC</h3>
                <div className={styles.timeline}>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>1</div>
                    <div className={styles.timelineContent}>
                      <strong>Pengumpulan Jejak:</strong> Pengguna tidak akan merasa sedang diuji. Mereka hanya diajak menjawab puluhan skenario santai yang memancing preferensi aktivitas sehari-hari, bukan menguji kecerdasan mereka. Di sini, murni tidak ada jawaban yang salah.
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>2</div>
                    <div className={styles.timelineContent}>
                      <strong>Mesin Penilai Otomatis:</strong> Di kedalaman sistem, setiap jawaban ditimbang secara presisi. AI bertindak layaknya alkemis yang mengakumulasi skor dan menghasilkan kristal Holland Code unik, menampilkan tiga kepribadian paling dominan dalam diri sang petualang.
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>3</div>
                    <div className={styles.timelineContent}>
                      <strong>Sintesis Ramuan AI:</strong> Kode tersebut lalu diramu bersama dengan impian personal pengguna, seperti kota incaran atau kebutuhan beasiswa. Ramuan ini dikirim ke dalam otak besar AI Language Model yang akan membalasnya dengan wangsit berupa daftar jurusan, kampus, dan beasiswa paling cocok.
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>4</div>
                    <div className={styles.timelineContent}>
                      <strong>Penciptaan Peta Jalan:</strong> Wangsit dari AI tadi tidak dibiarkan berbentuk teks kaku. Sistem kita dengan cepat menyulapnya menjadi sebuah struktur peta jalan interaktif di Dashboard, menentukan <strong>Houses (Learning Path)</strong> mana saja yang paling cocok dan harus pertama kali mereka taklukkan.
                    </div>
                  </div>
                </div>
              </section>

              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Harta Karun yang Dihasilkan AI</h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Pada akhir ritual panjang ini, AI mempersembahkan sekotak harta karun berupa profil karir naratif yang menceritakan siapa diri Anda sebenarnya. Di dalamnya terdapat daftar lima rekomendasi jurusan kuliah paling menjanjikan, lengkap dengan alasan mengapa jurusan itu memanggil Anda. Tidak hanya itu, kotak ini juga berisi daftar universitas incaran beserta jalur masuknya, peta beasiswa yang siap mendanai perjalanan Anda, hingga rekomendasi <strong>Houses (Learning Path)</strong> mana saja dari 10 Houses yang paling cocok untuk menutupi kelemahan dan mengasah potensi Anda.
                </p>
              </section>

              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Agent 1 — The Dreamer Engine</h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Di balik layar, seluruh proses assessment ini dijalankan oleh <strong>Agent 1 (AGENT_1_DREAMER)</strong>. Agent ini berkomunikasi dengan <strong>Groq API</strong> menggunakan model <strong>Qwen 3.8-27b</strong> dengan temperature rendah (0.4) karena ini adalah tugas terstruktur, bukan tugas kreatif. Output AI divalidasi ketat menggunakan <strong>Zod Schema</strong> dan sistem <strong>Guardrail</strong> yang memastikan setiap referensi ID universitas, jurusan, dan beasiswa benar-benar ada di database. Jika AI gagal atau mengembalikan data yang tidak valid, sistem akan jatuh ke <strong>fallback deterministik</strong> yang tetap memberikan rekomendasi bermakna berdasarkan data yang tersedia.
                </p>
              </section>
            </>
          )}

          {/* ── 9. AI CV ANALYZER ── */}
          {activeSection === 'ai_cv' && (
            <>
              <h2 className={styles.docTitle}>AI: ANALISIS CV</h2>
              <div className={styles.separator} />

              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Tujuan Analisis Dokumen</h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Bagi para petualang yang telah mencapai level Mahasiswa dan Fresh Graduate (persona <strong>The Chaser</strong>), metode kompas RIASEC sudah tidak lagi relevan. Mereka butuh senjata yang lebih mematikan. Sebagai gantinya, <strong>Agent 2 (AGENT_2_CHASER)</strong> turun langsung ke medan perang dengan menganalisis senjata utama mereka: Curriculum Vitae (CV). Dengan mata elangnya, AI membedah seluruh dokumen tersebut untuk mendeteksi amunisi skill apa saja yang sudah dimiliki, menemukan di mana celah kelemahan mereka terhadap standar keras industri, dan akhirnya merakit ulang sebuah peta jalan belajar yang paling presisi dan efisien.
                </p>
              </section>

              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Ritual Analisis CV</h3>
                <div className={styles.timeline}>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>1</div>
                    <div className={styles.timelineContent}>
                      <strong>Penyerahan Dokumen:</strong> Saat pengguna menyerahkan gulungan CV mereka (baik dalam bentuk PDF maupun teks dokumen biasa), sistem di belakang layar segera mengekstrak seluruh teks yang tertulis tanpa merusak makna di dalamnya.
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>2</div>
                    <div className={styles.timelineContent}>
                      <strong>Mata Elang AI:</strong> AI lalu merapal mantra Named Entity Recognition, menyisir setiap kata untuk menemukan harta karun tersembunyi: dari mulai barisan hard skill, bahasa pemrograman, hingga riwayat panjang magang dan sertifikasi masa lalu.
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>3</div>
                    <div className={styles.timelineContent}>
                      <strong>Ujian Standar Industri:</strong> Hasil temuan tersebut tidak dibiarkan begitu saja. AI kita akan langsung menabrakkannya dengan dinding tebal ekspektasi industri (Skill Matrix). Dari benturan ini, lahirlah sebuah nilai skor kesiapan karir yang sangat transparan dan jujur.
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>4</div>
                    <div className={styles.timelineContent}>
                      <strong>Pencarian Titik Lemah:</strong> AI tidak hanya mengkritik, tetapi juga mencari di mana letak kelemahan paling krusial. Sistem mengidentifikasi jurang kemampuan (gap) yang ada, lalu menyusun strategi prioritas: mana skill yang harus dikuasai malam ini juga agar bisa dilirik rekruter besok pagi.
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>5</div>
                    <div className={styles.timelineContent}>
                      <strong>Penempaan Kurikulum Baru:</strong> Hasil temuan kelemahan itu akhirnya ditempa menjadi sebuah urutan Misi Belajar (Learning Mission) tingkat lanjut. Alhasil, pengguna tidak perlu lagi meraba-raba dalam gelap. Mereka tahu persis skill apa yang harus ditaklukkan selanjutnya.
                    </div>
                  </div>
                </div>
              </section>

              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Laporan Akhir Medan Pertempuran</h3>
                <div className={styles.featureGrid}>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}>
                      <div className={`${styles.cardIcon} ${styles.cardIconBlue}`}>1</div>
                      <div className={styles.cardTitle}>Skor Karir</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Sebuah rapot kebanggaan (atau tamparan keras) yang menampilkan persentase kesiapan karir Anda pada berbagai domain menantang di dunia nyata.
                    </div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}>
                      <div className={`${styles.cardIcon} ${styles.cardIconGreen}`}>2</div>
                      <div className={styles.cardTitle}>Inventaris Skill</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Inventaris lengkap layaknya daftar senjata Anda, memperlihatkan kemampuan apa saja yang terdeteksi beserta estimasi kekuatan penguasaannya.
                    </div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}>
                      <div className={`${styles.cardIcon} ${styles.cardIconOrange}`}>3</div>
                      <div className={styles.cardTitle}>Laporan Skill Gap</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Ini adalah daftar merah. Sebuah rangkuman kelemahan kritis yang selama ini menjadi alasan mengapa CV Anda belum pernah dipanggil wawancara.
                    </div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}>
                      <div className={styles.cardIcon}>4</div>
                      <div className={styles.cardTitle}>Kecocokan Kerja</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Prediksi akurat layaknya bola kristal, merekomendasikan tiga kursi pekerjaan teratas yang saat ini paling selaras dengan persentase kekuatan CV Anda.
                    </div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}>
                      <div className={`${styles.cardIcon} ${styles.cardIconBlue}`}>5</div>
                      <div className={styles.cardTitle}>Peta Jalan Belajar</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Gulungan taktik pertempuran selanjutnya. Mengarahkan Anda pada urutan misi belajar yang dirancang khusus untuk memusnahkan setiap kelemahan tadi.
                    </div>
                  </div>
                </div>
              </section>

              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Agent 2 — The Chaser Engine & Knowledge RAG</h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  CV Analyzer dijalankan oleh <strong>Agent 2 (AGENT_2_CHASER)</strong> yang juga berkomunikasi dengan <strong>Groq API (Qwen 3.8-27b)</strong>. Untuk memperkaya analisisnya, sistem memanfaatkan <strong>Cohere embed-multilingual-v3.0</strong> (1024 dimensi) sebagai mesin embedding untuk Knowledge Base. Dokumen-dokumen pengetahuan disimpan di PostgreSQL melalui <strong>Prisma ORM</strong>, dan pencarian similarity dilakukan secara in-memory menggunakan cosine similarity. Teknik <strong>RAG (Retrieval-Augmented Generation)</strong> ini memastikan rekomendasi AI selalu relevan dengan konteks industri terkini.
                </p>
                <p className={styles.text} style={{ marginTop: '16px', textAlign: 'justify' }}>
                  Selain itu, <strong>Agent 3 (Essay Evaluator)</strong> bertugas menilai jawaban project dan essay dari The Chaser. Agent ini menggunakan temperature sangat rendah (0.1) untuk memastikan penilaian yang konsisten dan deterministik. Hasil evaluasi AI ini yang menentukan apakah seorang petualang layak menerima Soulbound Token sebagai bukti kelulusan.
                </p>
              </section>

              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Pertahanan dan Keamanan Data</h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Dalam medan perang ini, privasi adalah perisai paling berharga. Saat Anda menyerahkan dokumen sakti berformat PDF atau teks, prajurit library di server kami akan mengekstrak isinya dengan kehati-hatian tingkat tinggi. Seluruh kata yang berhasil diselamatkan kemudian dibisikkan kepada AI melalui mantra yang sangat ketat, membatasi AI agar tidak membayangkan hal-hal yang tidak tertulis.
                </p>
                <p className={styles.text} style={{ marginTop: '16px', textAlign: 'justify' }}>
                  Yang terpenting, gulungan rahasia (file CV) milik Anda tidak akan pernah kami simpan. Begitu isinya berhasil disalin, file aslinya akan langsung dilebur tak bersisa menjadi debu. Hanya catatan analisis akhirnya yang kami simpan di brankas database. Dan yang lebih menyenangkan lagi, Anda bebas menyerahkan CV baru kapan saja Anda merasa sudah bertambah kuat. AI kami akan dengan senang hati menganalisis ulang semuanya dari awal dan merestorasi peta perjalanan karir Anda detik itu juga.
                </p>
              </section>
            </>
          )}

          {/* ── 10. CURRENT SYSTEM STATUS ── */}
          {activeSection === 'system_status' && (
            <>
              <h2 className={styles.docTitle}>STATUS SISTEM SAAT INI</h2>
              <div className={styles.separator} />
              <section className={styles.section}>
                <div className={styles.callout}>
                  Sistem PathTrick saat ini sudah berjalan <strong>end-to-end</strong> dengan backend Fastify terhubung ke database PostgreSQL (via Prisma), AI Agents aktif (Groq API), dan smart contract live di BNB Testnet.
                </div>
                <h3 className={styles.sectionTitle}>Yang Sudah Berjalan</h3>
                <div className={styles.featureGrid}>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}>1</div><div className={styles.cardTitle}>Onboarding & Auth</div></div>
                    <div className={styles.cardText}>Login via Privy (Google/Email), role selection (The Dreamer / The Chaser) disimpan di backend via <code>POST /api/users/me/role</code>, dengan fallback lokal untuk demo.</div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}>2</div><div className={styles.cardTitle}>Learning Game</div></div>
                    <div className={styles.cardText}>Dashboard, houses, mission, quiz, lives, retry, game over, reward, dan certificate entry tersedia dalam alur pixel-RPG dengan Phaser.js engine.</div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}>3</div><div className={styles.cardTitle}>Backend Server</div></div>
                    <div className={styles.cardText}>Fastify 5 dengan 14 modules aktif: auth, roles, users, courses, houses, assessment, ai-agent, gamification, quests, jobs, scholarships, universities, notifications, dan admin.</div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}>4</div><div className={styles.cardTitle}>3 AI Agents</div></div>
                    <div className={styles.cardText}>Agent 1 (Dreamer — RIASEC), Agent 2 (Chaser — CV Analyzer), dan Agent 3 (Essay Evaluator) berjalan via Groq API dengan guardrail dan fallback.</div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}>5</div><div className={styles.cardTitle}>Bilingual (EN/ID)</div></div>
                    <div className={styles.cardText}>Language Toggle pixel-art tersedia di seluruh dashboard, mendukung switching antara Bahasa Indonesia dan English secara real-time via Zustand Persisted Store.</div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}>6</div><div className={styles.cardTitle}>Profile & Pixel UI</div></div>
                    <div className={styles.cardText}>Nickname, avatar, dan state disimpan melalui Zustand persistence. Tampilan pixel-art konsisten di profile, dashboard, header, dan game HUD.</div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}>7</div><div className={styles.cardTitle}>SBT Certificate</div></div>
                    <div className={styles.cardText}>Mint flow end-to-end: prepare-mint → EIP-712 signature → wallet mint → receipt verification → backend confirm. Live di BNB Testnet Chain ID 97.</div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}>8</div><div className={styles.cardTitle}>Knowledge RAG</div></div>
                    <div className={styles.cardText}>Cohere embed-multilingual-v3.0 untuk embedding knowledge base. Cosine similarity search in-memory untuk RAG pipeline Agent AI.</div>
                  </div>
                </div>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Batasan Saat Ini</h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Deployment saat ini berada di testnet. Nilai tBNB tidak memiliki nilai ekonomi nyata, RPC dapat mengalami keterlambatan. Untuk produksi, dibutuhkan monitoring transaksi, retry yang aman, indexing certificate, pengelolaan consent, dan kebijakan wallet recovery.
                </p>
                <p className={styles.text} style={{ marginTop: '16px', textAlign: 'justify' }}>
                  Transaksi certificate membutuhkan wallet yang memiliki tBNB di BNB Smart Chain Testnet. Frontend memiliki fallback mock state (<code>NEXT_PUBLIC_USE_MOCK_BACKEND=true</code>) untuk demo tanpa backend.
                </p>
              </section>
            </>
          )}

          {/* ── 11. INTEGRATION NOTES ── */}
          {activeSection === 'integration_notes' && (
            <>
              <h2 className={styles.docTitle}>CATATAN INTEGRASI</h2>
              <div className={styles.separator} />
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Variabel Lingkungan Frontend</h3>
                <table className={styles.techTable}>
                  <thead><tr><th>Variabel</th><th>Tujuan</th></tr></thead>
                  <tbody>
                    <tr><td><code>NEXT_PUBLIC_API_URL</code></td><td>Base URL backend Fastify (default: <code>http://localhost:8080</code>).</td></tr>
                    <tr><td><code>NEXT_PUBLIC_PRIVY_APP_ID</code></td><td>Public application ID untuk login dan embedded wallet Privy.</td></tr>
                    <tr><td><code>NEXT_PUBLIC_CONTRACT_ADDRESS</code></td><td>Alamat smart contract untuk operasi frontend.</td></tr>
                    <tr><td><code>NEXT_PUBLIC_PATHTRICK_SBT_ADDRESS</code></td><td>Alamat SBT contract publik di BNB Testnet.</td></tr>
                    <tr><td><code>NEXT_PUBLIC_BNB_TESTNET_RPC_URL</code></td><td>RPC Chain ID 97 untuk membaca contract dan mengirim transaksi.</td></tr>
                    <tr><td><code>NEXT_PUBLIC_CHAIN_ID</code></td><td>Chain ID untuk BNB Smart Chain Testnet (97).</td></tr>
                    <tr><td><code>NEXT_PUBLIC_MINT_PRICE</code></td><td>Harga mint untuk referensi UI (default: 0.005 BNB).</td></tr>
                    <tr><td><code>NEXT_PUBLIC_USE_MOCK_BACKEND</code></td><td>Memaksa request memakai mock route lokal Next.js.</td></tr>
                    <tr><td><code>NEXT_PUBLIC_ALLOW_LOCAL_ROLE_FALLBACK</code></td><td>Mengizinkan role lokal hanya sebagai fallback demo.</td></tr>
                  </tbody>
                </table>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Variabel Lingkungan Backend</h3>
                <table className={styles.techTable}>
                  <thead><tr><th>Variabel</th><th>Tujuan</th></tr></thead>
                  <tbody>
                    <tr><td><code>DATABASE_URL</code></td><td>PostgreSQL connection string (Prisma ORM).</td></tr>
                    <tr><td><code>REDIS_URL</code></td><td>Redis connection untuk BullMQ job queue.</td></tr>
                    <tr><td><code>PRIVY_APP_ID</code></td><td>Privy App ID untuk server-side token verification.</td></tr>
                    <tr><td><code>PRIVY_VERIFICATION_KEY</code></td><td>Public key (PEM) untuk verifikasi Privy access token.</td></tr>
                    <tr><td><code>APP_JWT_SECRET</code></td><td>Secret untuk app-issued session JWT setelah Privy verification.</td></tr>
                    <tr><td><code>GROQ_API_KEY</code></td><td>API key Groq untuk AI Agent 1, 2, dan 3.</td></tr>
                    <tr><td><code>COHERE_API_KEY</code></td><td>API key Cohere untuk embedding knowledge base (RAG).</td></tr>
                    <tr><td><code>SIGNER_PRIVATE_KEY</code></td><td>Private key untuk generate EIP-712 mint signature.</td></tr>
                    <tr><td><code>CONTRACT_ADDRESS</code></td><td>Smart contract address di BNB Testnet.</td></tr>
                    <tr><td><code>CHAIN_ID</code></td><td>Chain ID (97 untuk BNB Testnet).</td></tr>
                  </tbody>
                </table>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Modul API Backend</h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Backend Fastify menjalankan <strong>14 modules</strong> aktif: <code>auth</code> (Privy verification + JWT session), <code>roles</code>, <code>users</code>, <code>courses</code>, <code>houses</code>, <code>assessment</code> (AI-powered), <code>ai-agent</code> (3 agents), <code>gamification</code>, <code>quests</code>, <code>jobs</code>, <code>scholarships</code>, <code>universities</code>, <code>notifications</code>, dan <code>admin</code>.
                </p>
                <p className={styles.text} style={{ marginTop: '16px', textAlign: 'justify' }}>
                  Frontend mengharapkan <code>GET /api/roles</code> untuk metadata role dan <code>POST /api/users/me/role</code> dengan body <code>{`{ roleId }`}</code>. Untuk certificate, frontend memanggil <code>POST /api/certificates/prepare-mint</code>, membaca <code>courseId</code>, <code>nonce</code>, <code>deadline</code>, dan <code>signature</code>, lalu mengirim <code>POST /api/certificates/confirm-mint</code> dengan <code>courseId</code> dan <code>txHash</code>.
                </p>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Checklist Transaksi Sertifikat</h3>
                <div className={styles.callout}>
                  Wallet harus berada di Chain ID 97, memiliki saldo tBNB untuk mint price dan gas, membaca <code>mintPrice()</code> dari contract, menunggu receipt, memeriksa event <code>CertificateMinted(to, courseId)</code>, lalu menunggu backend menerima konfirmasi txHash sebelum UI menampilkan status berhasil.
                </div>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Error yang perlu ditampilkan dengan jelas meliputi wrong network, insufficient funds, user rejected transaction, <code>IncorrectMintFee</code>, <code>AlreadyCertified</code>, <code>InvalidSignature</code>, dan <code>SignatureExpired</code>.
                </p>
              </section>
            </>
          )}

          {/* ── 12. BUSINESS SCALING ── */}
          {activeSection === 'business_scaling' && (
            <>
              <h2 className={styles.docTitle}>SKALABILITAS BISNIS</h2>
              <div className={styles.separator} />
              <section className={styles.section}>
                <div className={styles.callout}>
                  <strong>PathTrick</strong> dirancang sebagai <strong>platform karir-belajar</strong> yang menggabungkan asesmen, learning game, career matching, dan <strong>bukti skill on-chain</strong>. Skalabilitas bukan hanya berarti menambah user, tetapi juga meningkatkan <strong>kualitas rekomendasi</strong>, tingkat penyelesaian, outcome partner, dan <strong>pendapatan berulang</strong> tanpa mengorbankan pengalaman Pixel-RPG.
                </div>
                <h3 className={styles.sectionTitle}>Target Pelanggan</h3>
                <div className={styles.featureGrid}>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}>1</div><div className={styles.cardTitle}>Pelajar B2C</div></div>
                    <div className={styles.cardText}>Siswa SMA (The Dreamer) dan mahasiswa (The Chaser) yang membutuhkan <strong>validasi minat</strong>, roadmap belajar, portfolio terpersonalisasi, serta bukti kompetensi SBT.</div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}>2</div><div className={styles.cardTitle}>Sekolah & Kampus</div></div>
                    <div className={styles.cardText}>Sekolah, kampus, dan career center yang membutuhkan asesmen massal, <strong>dashboard cohort</strong>, monitoring kesiapan siswa, dan laporan AI.</div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}>3</div><div className={styles.cardTitle}>Perusahaan</div></div>
                    <div className={styles.cardText}>Perusahaan dan recruiter yang ingin menemukan kandidat berdasarkan <strong>skill evidence terverifikasi on-chain</strong>, bukan hanya klaim CV.</div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}>4</div><div className={styles.cardTitle}>Mitra Konten</div></div>
                    <div className={styles.cardText}>Bootcamp, mentor, dan penyedia course yang ingin mendistribusikan materi melalui 10 Houses dan menerbitkan sertifikat SBT.</div>
                  </div>
                </div>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Model Pendapatan</h3>
                <table className={styles.techTable}>
                  <thead><tr><th>Model</th><th>Nilai</th><th>Catatan Eksekusi</th></tr></thead>
                  <tbody>
                    <tr><td><strong>Freemium</strong></td><td>Asesmen dasar, dashboard Pixel-RPG, dan sebagian quest gratis</td><td>Menjaga acquisition tetap rendah friksi</td></tr>
                    <tr><td><strong>Premium Learning</strong></td><td>Roadmap lanjutan di 10 Houses, review project AI Agent, dan analytics</td><td>Subscription bulanan atau paket course</td></tr>
                    <tr><td><strong>Institutional SaaS</strong></td><td>Dashboard sekolah/kampus, cohort analytics, dan admin tools backend</td><td>Kontrak tahunan per institution atau per cohort</td></tr>
                    <tr><td><strong>Recruiter Access</strong></td><td>Talent search berbasis verified skill evidence di BscScan</td><td>Memerlukan consent, privacy control, dan anti-discrimination review</td></tr>
                    <tr><td><strong>Certificate Fee</strong></td><td>Mint certificate dengan harga contract saat ini plus gas</td><td>Frontend membaca <code>mintPrice()</code> live via Privy. Harga tidak di-hardcode</td></tr>
                  </tbody>
                </table>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Siklus Pertumbuhan</h3>
                <div className={styles.timeline}>
                  <div className={styles.timelineItem}><div className={styles.timelinePoint}>1</div><div className={styles.timelineContent}><strong>Temukan:</strong> User masuk dari referral, sekolah, mitra konten, atau kampanye karir.</div></div>
                  <div className={styles.timelineItem}><div className={styles.timelinePoint}>2</div><div className={styles.timelineContent}><strong>Asesmen:</strong> Pemilihan role dan asesmen AI (RIASEC/CV) menghasilkan titik awal personal.</div></div>
                  <div className={styles.timelineItem}><div className={styles.timelinePoint}>3</div><div className={styles.timelineContent}><strong>Progres:</strong> Quest Phaser.js, evaluasi AI Agent, XP, streak, dan peta visual mendorong penyelesaian.</div></div>
                  <div className={styles.timelineItem}><div className={styles.timelinePoint}>4</div><div className={styles.timelineContent}><strong>Buktikan:</strong> Project dinilai AI dan dicetak sebagai SBT di BNB Testnet sebagai bukti on-chain.</div></div>
                  <div className={styles.timelineItem}><div className={styles.timelinePoint}>5</div><div className={styles.timelineContent}><strong>Referensi:</strong> Achievement, WalletPanel, dan outcome karier mengundang user serta partner baru.</div></div>
                </div>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Metrik Utama</h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Fokus awal bukan jumlah wallet, melainkan <strong>hasil belajar yang terverifikasi</strong>: jumlah user yang menyelesaikan asesmen, menyelesaikan quest, lulus project, memperoleh SBT certificate, dan mendapatkan outcome berikutnya (internship, university match, job interview).
                </p>
                <div className={styles.featureGrid} style={{ marginTop: '24px' }}>
                  <div className={styles.featureCard}><div className={styles.cardTitle}><strong>Aktivasi</strong></div><div className={styles.cardText}>Role dipilih, asesmen AI dimulai, rekomendasi Houses muncul, dan quest pertama diselesaikan.</div></div>
                  <div className={styles.featureCard}><div className={styles.cardTitle}><strong>Retensi</strong></div><div className={styles.cardText}>Return D7/D30, penyelesaian quest mingguan, interaksi Daily Mantra, dan learning streak.</div></div>
                  <div className={styles.featureCard}><div className={styles.cardTitle}><strong>Konversi</strong></div><div className={styles.cardText}>Upgrade premium, mint SBT certificate, atau penggunaan seat institutional via backend.</div></div>
                  <div className={styles.featureCard}><div className={styles.cardTitle}><strong>Outcome</strong></div><div className={styles.cardText}>Penyelesaian course 10 Houses, verified skill on-chain, kepuasan partner, dan sinyal penempatan.</div></div>
                </div>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Peta Jalan Skalabilitas</h3>
                <table className={styles.techTable}>
                  <thead><tr><th>Tahapan</th><th>Prioritas</th></tr></thead>
                  <tbody>
                    <tr><td><strong>Tahap 1: Validasi</strong></td><td>Stabilkan onboarding Privy, penyelesaian learning, wallet flow SBT, transisi ke 14 modul backend produksi, dan pilot institution.</td></tr>
                    <tr><td><strong>Tahap 2: Pengulangan</strong></td><td>Bangun admin dashboard penuh, analytics cohort, pipeline konten AI, referral, dan subscription billing.</td></tr>
                    <tr><td><strong>Tahap 3: Ekspansi</strong></td><td>Tambah partner course, portal recruiter, multi-bahasa penuh, strategi multi-chain, dan distribusi regional.</td></tr>
                    <tr><td><strong>Tahap 4: Platform</strong></td><td>Buka API/SDK terpusat untuk institution dan content partner dengan permission, audit log, serta SLA yang jelas.</td></tr>
                  </tbody>
                </table>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Pola Pikir Pendiri dan Investor</h3>
                <div className={styles.callout}>
                  Prinsip utama PathTrick: <strong>jangan scale vanity metrics, scale outcomes.</strong> Koneksi wallet dan sign-up penting untuk funnel, tetapi nilai bisnis nyata muncul ketika AI Agent kami benar-benar membantu user menyelesaikan journey dan partner melihat outcome yang lebih baik.
                </div>
                <div className={styles.featureGrid}>
                  <div className={styles.featureCard}><div className={styles.cardTitle}>Selesaikan Masalah Dulu</div><div className={styles.cardText}>Validasi bahwa user membayar atau partner memperpanjang kontrak karena masalah career uncertainty benar-benar terselesaikan.</div></div>
                  <div className={styles.featureCard}><div className={styles.cardTitle}>Bukti di Atas Hype</div><div className={styles.cardText}>Pisahkan data aktual, target, dan asumsi. Jangan menjual blockchain sebagai tujuan, gunakan sebagai trust layer untuk skill evidence (SBT).</div></div>
                  <div className={styles.featureCard}><div className={styles.cardTitle}>Distribusi Adalah Produk</div><div className={styles.cardText}>Bangun jalur distribusi melalui sekolah, kampus, komunitas, mentor, dan recruiter sejak awal, bukan setelah produk selesai.</div></div>
                  <div className={styles.featureCard}><div className={styles.cardTitle}>Disiplin Modal</div><div className={styles.cardText}>Setiap dana harus membeli kecepatan belajar: kualitas AI, akuisisi partner, suplai konten 10 Houses, atau outcome user yang terukur.</div></div>
                </div>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}><strong>Q1: Buktikan Titik Masuk</strong></h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Fokus Q1 adalah membuktikan bahwa pengalaman PathTrick membuat user memulai dan menyelesaikan learning journey. Pilih satu titik masuk utama, misalnya The Dreamer yang sedang mencari jurusan dan roadmap persiapan.
                </p>
                <table className={styles.techTable}>
                  <thead><tr><th><strong>Alur Kerja</strong></th><th><strong>Target Siap Investor</strong></th></tr></thead>
                  <tbody>
                    <tr><td>Produk</td><td>Onboarding Privy, asesmen RIASEC, quest pertama, AI evaluasi, dan SBT flow stabil tanpa bug kritis.</td></tr>
                    <tr><td>Validasi</td><td>Interview terstruktur dan pilot kecil. Ukur aktivasi, penyelesaian quest pertama, dan interaksi WalletPanel.</td></tr>
                    <tr><td>Backend</td><td>Auth, role persistence, progress, dan 14 modul Fastify sudah berjalan sempurna di production.</td></tr>
                    <tr><td>Kepercayaan</td><td>Jelaskan data privacy, consent Privy, verifikasi SBT on-chain, dan batasan AI secara transparan.</td></tr>
                    <tr><td><strong>Gerbang</strong></td><td>Lanjut ke Q2 hanya jika ada <strong>penggunaan berulang</strong> dan bukti user meminta lebih banyak konten.</td></tr>
                  </tbody>
                </table>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}><strong>Q2: Buktikan Pengulangan</strong></h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Fokus Q2 adalah mengubah keberhasilan pilot menjadi playbook yang dapat diulang. Kita perlu tahu channel mana yang menghasilkan user berkualitas dan berapa biaya (termasuk API Groq/Cohere) untuk melayani mereka.
                </p>
                <table className={styles.techTable}>
                  <thead><tr><th><strong>Alur Kerja</strong></th><th><strong>Target Siap Investor</strong></th></tr></thead>
                  <tbody>
                    <tr><td>Distribusi</td><td>Playbook partnership sekolah/kampus, referral, ambassador, dan kampanye konten.</td></tr>
                    <tr><td>Monetisasi</td><td>Uji kesediaan membayar untuk premium learning, mint SBT, dan paket institutional SaaS.</td></tr>
                    <tr><td>Operasional</td><td>Admin dashboard backend, alur dukungan, QA AI Agent, dan checklist onboarding partner.</td></tr>
                    <tr><td>Metrik</td><td>Bandingkan aktivasi, retensi, penyelesaian, konversi, CAC, dan biaya AI/support per channel.</td></tr>
                    <tr><td><strong>Gerbang</strong></td><td>Masuk Q3 setelah ada channel yang <strong>dapat diulang</strong> dan cohort menunjukkan retensi kuat.</td></tr>
                  </tbody>
                </table>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}><strong>Q3: Bangun Mesin Pertumbuhan</strong></h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Fokus Q3 adalah memperbesar supply dan demand secara seimbang. User membutuhkan course dan mentor di 10 Houses. Partner membutuhkan audience. Efek marketplace dikejar setelah quality control kuat.
                </p>
                <table className={styles.techTable}>
                  <thead><tr><th><strong>Alur Kerja</strong></th><th><strong>Target Siap Investor</strong></th></tr></thead>
                  <tbody>
                    <tr><td>Suplai Konten</td><td>Partner course dan project dengan rubrik, tujuan belajar, AI reviewer, serta kebijakan SBT konsisten.</td></tr>
                    <tr><td>Jaringan Karir</td><td>Pilot employer untuk skill evidence verification dan feedback loop langsung dari recruiter.</td></tr>
                    <tr><td>Loop Produk</td><td>Achievement shareable, referral, tantangan cohort, dan re-engagement via Daily Mantra yang relevan.</td></tr>
                    <tr><td>Infrastruktur</td><td>Observability, BullMQ queue untuk AI, caching Redis, rate limit, dan cost monitoring API.</td></tr>
                    <tr><td><strong>Gerbang</strong></td><td>Scale paid acquisition hanya jika retensi dan <strong>gross margin per cohort</strong> (pasca biaya AI/Gas) sehat.</td></tr>
                  </tbody>
                </table>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}><strong>Q4: Persiapan Skala Institusional</strong></h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Fokus Q4 adalah kesiapan menjual dan melayani institusi secara serius. Pertumbuhan tidak boleh menambah chaos operasional, hutang keamanan arsitektur, atau ketergantungan individu.
                </p>
                <table className={styles.techTable}>
                  <thead><tr><th><strong>Alur Kerja</strong></th><th><strong>Target Siap Investor</strong></th></tr></thead>
                  <tbody>
                    <tr><td>Produk Enterprise</td><td>Admin berbasis role di Fastify, laporan cohort, export data, permission Privy, dan dukungan SLA.</td></tr>
                    <tr><td>Kualitas Pendapatan</td><td>Sinyal perpanjangan kontrak tahunan institusi, expansion revenue, dan pipeline yang dapat diprediksi.</td></tr>
                    <tr><td>Tata Kelola</td><td>Review keamanan backend, incident response, kebijakan privasi RAG, retensi data, dan pelaporan.</td></tr>
                    <tr><td>Penggalangan Dana</td><td>Data room investor: traksi pengguna, data cohort 10 Houses, demo SBT, roadmap, cap table, legal.</td></tr>
                    <tr><td><strong>Gerbang</strong></td><td>Fundraise berdasarkan bukti repeatability dan <strong>pertumbuhan hemat modal</strong>, bukan sekadar janji fitur.</td></tr>
                  </tbody>
                </table>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Kartu Skor Investor</h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Untuk konteks <strong>PathTrick</strong> dan <strong>Indonesia Web3 Hackathon</strong>, scorecard ini mengukur alur dari rasa ragu menuju bukti nyata: menemukan arah via AI, menyelesaikan misi di 10 Houses, dan membawa <strong>bukti skill terverifikasi on-chain</strong> ke dunia nyata.
                </p>
                <div className={styles.featureGrid} style={{ marginTop: '24px' }}>
                  <div className={styles.featureCard}>
                    <div className={styles.cardTitle}><strong>Traksi: Apakah Perjalanan Dimulai dan Diselesaikan?</strong></div>
                    <div className={styles.cardText}>Kami melacak user dari pemilihan role, asesmen RIASEC/CV, quest perdana di Phaser.js, evaluasi AI Agent 3, hingga menuntaskan course. Bukti hackathon terpenting adalah alur utuh: <strong>asesmen AI → misi belajar → project → SBT on-chain</strong>, bukan sekadar jumlah wallet.</div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardTitle}><strong>Efisiensi: Apakah Jalan Ini Bisa Dibuka untuk Cohort Berikutnya?</strong></div>
                    <div className={styles.cardText}>Mengukur CAC plus biaya operasional (API Groq/Cohere RAG). PathTrick membuktikan skala edukasi massal tidak membuat biaya AI/backend meledak. Biaya sertifikat dikelola secara transparan via <code>mintPrice()</code> contract yang dibayar langsung oleh user.</div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardTitle}><strong>Keunggulan: Mengapa Bukti Ini Lebih Dipercaya?</strong></div>
                    <div className={styles.cardText}>Kekuatan PathTrick adalah sinergi: 3 AI Agent untuk personalisasi & evaluasi obyektif, ditambah <strong>Soulbound Token di BNB Chain</strong> yang diverifikasi on-chain. Bukti skill bukan sekadar klaim PDF internal, melainkan immutable asset yang tidak dapat dipalsukan.</div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardTitle}><strong>Eksekusi: Apakah Visi Ini Bisa Menjadi Kebiasaan User?</strong></div>
                    <div className={styles.cardText}>Dibuktikan dengan 14 modul backend Fastify yang robust, integrasi Privy mulus tanpa gesekan seed phrase, gamifikasi Pixel-RPG yang adiktif, dan demo SBT Testnet yang sukses end-to-end dengan dukungan bilingual penuh.</div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* ── 13. PASAR DAN STRATEGI PEMASARAN ── */}
          {activeSection === 'market_strategy' && (
            <>
              <h2 className={styles.docTitle}>PASAR &amp; STRATEGI PEMASARAN</h2>
              <div className={styles.separator} />
              <section className={styles.section}>
                <div className={styles.callout}>
                  PathTrick dimulai dari masalah nyata: pelajar kebanjiran pilihan tanpa peta arah yang jelas. Kami masuk melalui <strong>penemuan karir</strong> via AI (Agent 1 & 2), memberikan Roadmap 10 Houses yang terasa personal, lalu mengonversinya menjadi skill dan bukti SBT di blockchain.
                </div>
                <h3 className={styles.sectionTitle}>Pasar Awal</h3>
                <p className={styles.text} style={{ textAlign: 'justify', marginBottom: '36px' }}>
                  Pasar awal (beachhead) adalah siswa SMA dan fresh graduate di Indonesia yang mencari jurusan, beasiswa, atau pekerjaan pertama. Segmen ini besar dan membutuhkan validasi, cocok diekspansi menjadi B2B untuk sekolah, kampus, dan corporate career center.
                </p>
                <div className={styles.marketExpansion}>
                  <h3 className={styles.sectionTitle}>Logika Ekspansi Pasar</h3>
                  <div className={styles.tableScroll}>
                    <table className={styles.techTable}>
                      <thead><tr><th><strong>Lapisan</strong></th><th><strong>Pelanggan</strong></th><th><strong>Nilai</strong></th></tr></thead>
                      <tbody>
                        <tr><td><strong>Pintu Masuk</strong></td><td>Pelajar (B2C)</td><td>Asesmen AI, rekomendasi Houses, quest gamifikasi Pixel-RPG yang interaktif.</td></tr>
                        <tr><td><strong>Distribusi</strong></td><td>Sekolah, Kampus, BEM</td><td>Dashboard cohort, analitik kesiapan karir siswa, API terintegrasi via Fastify.</td></tr>
                        <tr><td><strong>Suplai</strong></td><td>Mentor, Bootcamp</td><td>Distribusi materi, review otomatis AI Agent 3, penerbitan SBT tanpa repot mengurus blockchain.</td></tr>
                        <tr><td><strong>Outcome</strong></td><td>Perusahaan, Recruiter</td><td>Pencarian talenta berbasis SBT yang anti-fraud dan mudah diverifikasi di BscScan.</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Strategi Masuk Pasar</h3>
                <div className={styles.timeline}>
                  <div className={styles.timelineItem}><div className={styles.timelinePoint}>1</div><div className={styles.timelineContent}><strong>Dipimpin Komunitas:</strong> User acquisition via duta kampus, BEM, dan influencer edukasi dengan hook Pixel-Art + AI.</div></div>
                  <div className={styles.timelineItem}><div className={styles.timelinePoint}>2</div><div className={styles.timelineContent}><strong>Pilot Institusi:</strong> Penawaran gratis untuk cohort kecil di sekolah guna menunjukkan peningkatan outcome siswa.</div></div>
                  <div className={styles.timelineItem}><div className={styles.timelinePoint}>3</div><div className={styles.timelineContent}><strong>Mitra Konten:</strong> Berkolaborasi dengan lembaga kursus IT/Bisnis untuk memuat konten mereka di 10 Houses.</div></div>
                  <div className={styles.timelineItem}><div className={styles.timelinePoint}>4</div><div className={styles.timelineContent}><strong>Distribusi Organik:</strong> WalletPanel & SBT yang dipamerkan di LinkedIn/X menjadi growth engine loop organik.</div></div>
                </div>
              </section>
            </>
          )}

          {/* ── 14. KEUNGGULAN KOMPETITIF ── */}
          {activeSection === 'competitive_edge' && (
            <>
              <h2 className={styles.docTitle}>KEUNGGULAN KOMPETITIF</h2>
              <div className={styles.separator} />
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Posisi Pasar</h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  PathTrick adalah hibrida: <strong>EdTech + Web3 + AI + Gaming</strong>. Ini bukan sekadar tes psikologi, bukan juga sekadar sertifikat digital. Kami mengemas proses berat (asesmen, evaluasi, sertifikasi) menjadi petualangan visual (Phaser.js) yang divalidasi oleh AI (Groq + RAG) dan dibuktikan secara permanen (BNB Testnet).
                </p>
                <table className={styles.techTable}>
                  <thead><tr><th><strong>Alternatif</strong></th><th><strong>Keterbatasan</strong></th><th><strong>Perbedaan PathTrick</strong></th></tr></thead>
                  <tbody>
                    <tr><td>Platform Kursus (Coursera/Udemy)</td><td>Drop-out rate tinggi, user bingung memilih course.</td><td>AI RIASEC merekomendasikan roadmap 10 Houses yang spesifik; Daily Mantra menekan drop-out.</td></tr>
                    <tr><td>Tes Psikologi Karir Tradisional</td><td>Berakhir pada PDF laporan pasif.</td><td>Hasil AI langsung dikonversi menjadi misi harian (Quest Tracker) interaktif.</td></tr>
                    <tr><td>Game Edukasi Anak-anak</td><td>Kredibilitas skill rendah di mata institusi/perekrut.</td><td>Evaluasi dinilai oleh AI Agent 3 secara objektif dan disertifikasi di blockchain sebagai SBT.</td></tr>
                    <tr><td>Penerbit Sertifikat Web3</td><td>Pengalaman onboarding crypto yang rumit (seed phrase).</td><td>Privy embedded wallet, WalletPanel responsif, gas/mint price transparan bagi Web2 user.</td></tr>
                  </tbody>
                </table>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Yang Harus Kita Pertahankan</h3>
                <div className={styles.featureGrid}>
                  <div className={styles.featureCard}><div className={styles.cardTitle}><strong>Loop Penyelesaian (Phaser.js)</strong></div><div className={styles.cardText}>Gamifikasi Pixel-RPG memastikan user bergerak dari rekomendasi AI hingga mencetak SBT tanpa kebosanan.</div></div>
                  <div className={styles.featureCard}><div className={styles.cardTitle}><strong>Personalisasi (3 AI Agent)</strong></div><div className={styles.cardText}>Agent 1 (RIASEC), Agent 2 (CV), Agent 3 (Evaluator) memastikan tiap langkah spesifik, dinamis, bilingual EN/ID.</div></div>
                  <div className={styles.featureCard}><div className={styles.cardTitle}><strong>Lapisan Kepercayaan (BNB Chain)</strong></div><div className={styles.cardText}>SBT dengan verifikasi signature EIP-712 dari backend Fastify kami mustahil dipalsukan, membuktikan kepemilikan skill.</div></div>
                  <div className={styles.featureCard}><div className={styles.cardTitle}><strong>Skalabilitas (14 Modul Backend)</strong></div><div className={styles.cardText}>Arsitektur modular, database PostgreSQL + Prisma, BullMQ, siap melayani lonjakan B2C dan B2B SaaS.</div></div>
                </div>
              </section>
            </>
          )}

          {/* ── 15. KASUS HACKATHON ── */}
          {activeSection === 'hackathon_case' && (
            <>
              <h2 className={styles.docTitle}>MENGAPA PATHTRICK HARUS MENANG</h2>
              <div className={styles.separator} />
              <section className={styles.section}>
                <div className={styles.callout}>
                  <strong>PathTrick membuktikan bahwa AI dan Web3 bisa memecahkan masalah riil pendidikan Indonesia.</strong> Aplikasi kami berjalan utuh: integrasi Privy, 14 Modul Backend Fastify, Phaser.js game engine, 3 AI Agent dinamis, UI Pixel Art responsif, WalletPanel, hingga minting SBT di BNB Testnet. Kami tidak menjual konsep, kami menampilkan <strong>produk jadi</strong>.
                </div>
                <h3 className={styles.sectionTitle}>Narasi Penilaian</h3>
                <table className={styles.techTable}>
                  <thead><tr><th><strong>Kriteria</strong></th><th><strong>Bukti di PathTrick</strong></th></tr></thead>
                  <tbody>
                    <tr><td><strong>Masalah & Solusi</strong></td><td>Mengatasi "salah jurusan" dan "skill gap" dengan 3 AI Agent (RIASEC, CV, Evaluator) yang membimbing user secara personal.</td></tr>
                    <tr><td><strong>Inovasi (EdTech/Web3)</strong></td><td>Memadukan UI/UX Pixel RPG retro dengan teknologi frontier (Cohere RAG, Groq LLM, Smart Contract EIP-712).</td></tr>
                    <tr><td><strong>Relevansi Web3</strong></td><td>Certificate bukan sebatas JPEG. SBT di BNB Testnet dicetak lewat alur: Otorisasi Backend -&gt; Wallet Mint Price -&gt; Validasi <code>CertificateMinted</code> Event. Anti-Fraud.</td></tr>
                    <tr><td><strong>User Experience</strong></td><td>User Web2 bisa langsung main (Privy login, Google Auth). Ada WalletPanel interaktif, dukungan bilingual (ID/EN), BGM, Daily Mantra.</td></tr>
                    <tr><td><strong>Dampak Sosial</strong></td><td>Menyiapkan jutaan pelajar (Dreamer) dan mahasiswa (Chaser) di Indonesia untuk memasuki dunia kerja yang terus berubah.</td></tr>
                    <tr><td><strong>Skalabilitas Teknis</strong></td><td>Siap meluncur: Next.js frontend dipadukan backend Fastify, PostgreSQL/Prisma, BullMQ untuk asinkronus AI, siap di-deploy massal.</td></tr>
                  </tbody>
                </table>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Cerita Demo 90 Detik</h3>
                <div className={styles.timeline}>
                  <div className={styles.timelineItem}><div className={styles.timelinePoint}>1</div><div className={styles.timelineContent}>Login hitungan detik via Privy. Pilih role (Dreamer/Chaser) dan biarkan AI Agent 1/2 membedah potensi/CV mu (Bilingual ON).</div></div>
                  <div className={styles.timelineItem}><div className={styles.timelinePoint}>2</div><div className={styles.timelineContent}>Tiba di Dashboard Pixel-RPG. Peta "10 Houses" merekomendasikan roadmap misi sesuai minat bakatmu. BGM diputar, petualangan dimulai.</div></div>
                  <div className={styles.timelineItem}><div className={styles.timelinePoint}>3</div><div className={styles.timelineContent}>Masuk ke dalam Game Engine (Phaser.js). Selesaikan quiz/project, Agent 3 menilainya instan, dan status progress tersimpan ke database backend.</div></div>
                  <div className={styles.timelineItem}><div className={styles.timelinePoint}>4</div><div className={styles.timelineContent}>Misi tamat! Buka WalletPanel, cek saldo tBNB, klik "Mint SBT". Transaksi diverifikasi smart contract di BNB Testnet.</div></div>
                  <div className={styles.timelineItem}><div className={styles.timelinePoint}>5</div><div className={styles.timelineContent}>Sertifikat Soulbound muncul di inventaris "Relics". Bukti permanen yang siap dilampirkan ke perekrut tanpa bisa dimanipulasi!</div></div>
                </div>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Yang Harus Kita Buktikan Selanjutnya</h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Usai hackathon, PathTrick siap masuk ke fase validasi pasar. Backend sudah siap production (14 modul), AI Agent RAG sudah berjalan. Prioritas berikutnya adalah uji coba closed-beta ke 3 sekolah menengah dan 2 komunitas kampus, validasi model "Certificate Fee" tBNB dengan mainnet, serta menarik mitra konten (edutech/bootcamp) untuk mengisi kurikulum di seluruh 10 Houses. Visi kami: <strong>Setiap lulusan di Indonesia punya SBT PathTrick di dompet Web3 mereka.</strong>
                </p>
              </section>
            </>
          )}

          <div className={styles.footerSignature}>
            <span>PathTrick © Team KETUPAT | Indonesia Web3 Hackathon</span>
          </div>

        </div>
      </div>
    </div>
  );
}
