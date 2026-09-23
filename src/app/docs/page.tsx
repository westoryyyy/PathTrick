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
  | 'eight_houses'
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
    { key: 'overview', label: '1. Overview', group: 'GENERAL' },
    { key: 'background', label: '2. Background', group: '' },
    { key: 'web3_infra', label: '3. Web3 Infrastructure', group: '' },
    { key: 'feature_sma', label: '4. Feature: SMA', group: 'FEATURES' },
    { key: 'feature_mahasiswa', label: '5. Feature: Mahasiswa', group: '' },
    { key: 'eight_houses', label: '6. The 8 Houses', group: '' },
    { key: 'smart_contract', label: '7. Smart Contract', group: 'BLOCKCHAIN' },
    { key: 'ai_riasec', label: '8. AI: RIASEC Engine', group: 'AI ENGINE' },
    { key: 'ai_cv', label: '9. AI: CV Analyzer', group: '' },
    { key: 'system_status', label: '10. Current System Status', group: 'OPERATIONS' },
    { key: 'integration_notes', label: '11. Integration Notes', group: '' },
    { key: 'business_scaling', label: '12. Business Scaling', group: 'BUSINESS' },
    { key: 'market_strategy', label: '13. Market & GTM', group: '' },
    { key: 'competitive_edge', label: '14. Competitive Edge', group: '' },
    { key: 'hackathon_case', label: '15. Hackathon Case', group: 'INVESTOR READINESS' },
  ];

  return (
    <div className={styles.page}>

      {/* Top Nav */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <button onClick={handleBack} className={styles.backBtn}>◀ BACK</button>
          <span className={styles.topBarTitle}>SYSTEM DOCS</span>
        </div>
        <div className={styles.topBarLogo}>
          <Image src="/PathTrick.png" alt="PathTrick Logo" width={140} height={35} style={{ objectFit: 'contain' }} />
        </div>
      </div>

      {/* Body */}
      <div className={styles.body}>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarTitle}>Contents</div>
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
              <h2 className={styles.docTitle}>WELCOME TO PATHTRICK</h2>
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
                <h3 className={styles.sectionTitle}>System Architecture Diagram</h3>
                <Image src="/system-arch.png" alt="System Architecture Diagram" width={1024} height={576} className={styles.pixelImage} />
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Tech Stack</h3>
                <table className={styles.techTable}>
                  <thead>
                    <tr>
                      <th>Kategori</th>
                      <th>Teknologi Utama</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Frontend Framework</strong></td>
                      <td>Next.js (App Router), React, TypeScript</td>
                    </tr>
                    <tr>
                      <td><strong>Styling & UI</strong></td>
                      <td>Tailwind CSS, CSS Grid, Framer Motion</td>
                    </tr>
                    <tr>
                      <td><strong>Game Engine</strong></td>
                      <td>Phaser.js (Diintegrasikan langsung ke komponen React)</td>
                    </tr>
                    <tr>
                      <td><strong>Backend & State</strong></td>
                      <td>Next.js API Routes (Serverless), Zustand (State Management)</td>
                    </tr>
                    <tr>
                      <td><strong>Web3 Auth</strong></td>
                      <td>Privy (Hybrid Embedded Wallet & Social Login)</td>
                    </tr>
                    <tr>
                      <td><strong>Smart Contracts</strong></td>
                      <td>Solidity (BEP-1155), Foundry, deployed di BNB Smart Chain Testnet</td>
                    </tr>
                    <tr>
                      <td><strong>AI Engine</strong></td>
                      <td>LLM APIs untuk zero-shot classification (RIASEC & CV Parser)</td>
                    </tr>
                  </tbody>
                </table>
              </section>
            </>
          )}

          {/* ── 2. BACKGROUND ── */}
          {activeSection === 'background' && (
            <>
              <h2 className={styles.docTitle}>BACKGROUND</h2>
              <div className={styles.separator} />
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Problem Statement</h3>
                <p className={styles.text} style={{ marginBottom: '16px', textAlign: 'justify' }}>
                  Belakangan ini, timeline X (Twitter) sering diramaikan oleh keluh kesah mahasiswa yang merasa "salah jurusan". Fenomena ini sebetulnya tidak mengejutkan. Di luar negeri, universitas terkemuka justru menyarankan calon mahasiswa untuk mengambil <strong>gap year</strong> demi bereksplorasi dan menemukan minat bakat asli mereka tanpa tekanan. Sayangnya, kultur di Indonesia sangat berbeda. Kita hidup dalam bayang-bayang tuntutan sosial dan dikejar "argo" umur, di mana pada usia 20 harus sudah begini, di usia 25 harus sudah begitu. Akibatnya, lebih dari 50% siswa SMA terpaksa memilih jurusan secara terburu-buru tanpa bimbingan sistematis yang bisa membantu mereka menjawab pertanyaan mendasar: <strong>"Saya ini sebenarnya cocoknya jadi apa?"</strong>
                </p>
                <p className={styles.text} style={{ textAlign: 'justify', marginBottom: '32px' }}>
                  Namun, krisis ini tidak berhenti di gerbang kelulusan kampus. Setelah lulus dan menjadi <strong>fresh graduate</strong>, masalah baru muncul. <strong>Skill gap</strong> antara teori di kampus dan praktik riil di industri makin menganga lebar. Para mahasiswa yang sadar akan hal ini berlomba-lomba mengumpulkan berbagai sertifikat kursus digital (Web2) untuk menghias CV mereka. Ironisnya, sertifikat-sertifikat ini sangat mudah dipalsukan. Di sisi lain, rekruter kehabisan waktu dan tenaga karena tidak memiliki mekanisme verifikasi portofolio dan keahlian kandidat yang bisa dipercaya secara mutlak. Mahasiswa butuh validasi, rekruter butuh kepastian, tetapi keduanya terjebak dalam sistem yang usang.
                </p>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>The Solution</h3>
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
                      <strong>Menjadikan Belajar Seperti Bermain Game:</strong> Pengguna menjelajahi peta 8 Bangunan (The 8 Houses) di mana setiap house adalah modul kompetensi yang harus "ditaklukkan" melalui mini-project.
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
              <h2 className={styles.docTitle}>WEB3 INFRASTRUCTURE</h2>
              <div className={styles.separator} />
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Prinsip Utama: "Crypto Invisible"</h3>
                <div className={styles.callout} style={{ textAlign: 'justify' }}>
                  "Pengguna menikmati seluruh keajaiban Web3 tanpa perlu pusing menyadari bahwa mereka sedang berinteraksi dengan teknologi blockchain."
                </div>
                <p className={styles.text} style={{ marginTop: '16px', textAlign: 'justify' }}>
                  Banyak platform Web3 yang gagal karena terlalu membebani pengguna dengan istilah teknis yang rumit sejak hari pertama. PathTrick mengambil jalan yang sangat berbeda. Mengingat sebagian besar pahlawan petualang kita adalah pelajar SMA dan mahasiswa di Indonesia yang mungkin belum akrab dengan dunia kripto, kami merancang sistem <strong>Crypto Invisible</strong>. Segala kerumitan blockchain sengaja kami sembunyikan rapat-rapat di balik tirai antarmuka pengguna yang sangat ramah, hangat, dan akrab di mata mereka.
                </p>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Komponen Web3</h3>
                <div className={styles.featureGrid}>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}>
                      <Image src="/PrivyLogo.jpeg" alt="Privy" width={32} height={32} style={{ borderRadius: '6px', marginRight: '12px' }} />
                      <div className={styles.cardTitle}>Wallet Layer</div>
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
                      <div className={styles.cardTitle}>Gas Fee Model</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Pencetakan sertifikat mengusung sistem <strong>User-Paid & Backend Authorized</strong>. Pengguna menanggung <strong>mint price</strong> dan sedikit <strong>biaya gas</strong> secara mandiri. Sebelum transaksi dikirim, backend memeriksa kelulusan course lalu menerbitkan <strong>signature berumur terbatas</strong>. AI membantu proses evaluasi, sedangkan otorisasi kriptografi tetap dibuat oleh signer backend yang tidak pernah terekspos ke frontend.
                    </div>
                  </div>
                </div>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Implementasi yang Berjalan</h3>
                <div className={styles.featureGrid}>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}>1</div><div className={styles.cardTitle}>Jaringan dan Contract</div></div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Deployment aktif berada di <strong>BNB Smart Chain Testnet</strong> dengan <strong>Chain ID 97</strong>. Contract certificate menggunakan alamat <code>0x39632892C33435a76043343Ef17Ac03124627ba9</code> dan ABI resmi dari <code>integration/PathtrickSBT.abi.json</code>. Data transaksi dapat diverifikasi melalui BscScan Testnet.
                    </div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}>2</div><div className={styles.cardTitle}>Authorization Flow</div></div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Setelah course selesai, frontend meminta authorization ke <code>POST /api/certificates/prepare-mint</code>. Backend mengembalikan <strong>courseId</strong>, <strong>nonce</strong>, <strong>deadline</strong>, dan <strong>signature</strong>. Frontend tidak membuat, mengubah, atau memakai ulang nonce dan deadline secara manual.
                    </div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}>3</div><div className={styles.cardTitle}>On-chain Verification</div></div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Wallet harus berada di Chain ID 97. Frontend membaca <strong>mintPrice()</strong> secara langsung, menghitung kebutuhan saldo bersama gas, lalu memanggil <code>mintCertificate(courseId, deadline, signature)</code>. Setelah receipt tersedia, frontend memeriksa event <strong>CertificateMinted(to, courseId)</strong>.
                    </div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}>4</div><div className={styles.cardTitle}>Backend Confirmation</div></div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Certificate belum dianggap selesai hanya karena wallet mengirim transaksi. Setelah receipt dan event valid, frontend mengirim <code>txHash</code> ke <code>POST /api/certificates/confirm-mint</code>. Status sukses baru ditampilkan setelah backend menerima dan memvalidasi transaksi tersebut.
                    </div>
                  </div>
                </div>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Batasan dan Arah Produksi</h3>
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
                        Wagmi (Sang Kurir Transaksi)
                      </h4>
                      <p className={styles.text} style={{ textAlign: 'justify', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>
                        Setelah pengguna memiliki dompet dari Privy, frontend memakai provider wallet dan <strong>ethers</strong> untuk membaca contract serta mengirim transaksi ke BNB Smart Chain Testnet. Alur mint saat ini memeriksa network, saldo, mint price, receipt, dan event contract sebelum certificate dikonfirmasi ke backend.
                      </p>
                    </div>
                  </div>

                </div>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Mengapa BNB Chain?</h3>
                <div className={styles.featureGrid}>
                  <div className={styles.featureCard} style={{ padding: '20px' }}>
                    <div className={styles.cardTitle} style={{ marginBottom: '8px' }}>💰 Biaya Rendah</div>
                    <div className={styles.cardText} style={{ fontSize: '0.95rem', textAlign: 'justify' }}>Ini adalah pilihan yang sangat ideal untuk mencetak jutaan <strong>sertifikat pelajar</strong> masa depan tanpa perlu membebani mereka dengan <strong>biaya gas</strong> yang mencekik.</div>
                  </div>
                  <div className={styles.featureCard} style={{ padding: '20px' }}>
                    <div className={styles.cardTitle} style={{ marginBottom: '8px' }}>EVM Compatible</div>
                    <div className={styles.cardText} style={{ fontSize: '0.95rem', textAlign: 'justify' }}>Dunia ini dibangun di atas fondasi <strong>kontrak pintar</strong> yang matang, <strong>super aman</strong>, dan mengikuti standar baku sehingga sangat <strong>transparan</strong> untuk diaudit oleh siapapun.</div>
                  </div>
                  <div className={styles.featureCard} style={{ padding: '20px' }}>
                    <div className={styles.cardTitle} style={{ marginBottom: '8px' }}>🌏 Adopsi Lokal</div>
                    <div className={styles.cardText} style={{ fontSize: '0.95rem', textAlign: 'justify' }}>Ekosistem ini sudah berhasil memenangkan hati <strong>komunitas lokal</strong>, menjadikannya rumah yang paling tepat dengan tingkat <strong>adopsi yang luar biasa tinggi</strong> di pasar <strong>Indonesia</strong>.</div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* ── 4. FEATURE SMA ── */}
          {activeSection === 'feature_sma' && (
            <>
              <h2 className={styles.docTitle}>FEATURE: SISWA SMA</h2>
              <div className={styles.separator} />
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Persona: "The Dreamer"</h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Mari kita berkenalan dengan <strong>The Dreamer</strong>. Mereka adalah jiwa-jiwa muda di bangku kelas 10 hingga 12 yang matanya masih berbinar menatap masa depan, namun batinnya seringkali diliputi keraguan. Di persimpangan jalan akademis ini, mereka tidak lagi membutuhkan tumpukan brosur tebal atau janji manis kampus belaka. Mereka sangat membutuhkan panduan yang jernih, peta jalan konkret yang bisa langsung dieksekusi, dan sebuah percikan motivasi yang menyenangkan untuk terus melangkah tanpa takut salah arah.
                </p>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>User Flow SMA</h3>
                <Image src="/user-flow-sma-v2.png" alt="User Flow SMA" width={1024} height={576} className={styles.pixelImage} />
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Fitur Utama Dashboard SMA</h3>
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
                      <Image src="/readiness_logo.jpg" alt="Readiness" width={32} height={32} style={{ borderRadius: '6px', marginRight: '12px', objectFit: 'contain' }} />
                      <div className={styles.cardTitle}>Readiness Meter</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Ini adalah kompas penunjuk arah mereka. Indikator kesiapan ini akan terus merangkak naik setiap kali mereka berhasil menuntaskan quest. Saksikan bagaimana mereka berevolusi dari seorang Explorer pemula hingga menjelma menjadi Future Maba yang siap bertempur.
                    </div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}>
                      <Image src="/radar_logo.jpg" alt="Radar" width={32} height={32} style={{ borderRadius: '6px', marginRight: '12px', objectFit: 'contain' }} />
                      <div className={styles.cardTitle}>Scholarship Radar</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Tidak ada mimpi yang boleh padam hanya karena biaya. Sistem radar kita secara aktif mencocokkan profil sang petualang dengan lautan database beasiswa secara real-time. Mereka akan merangkak dari seorang Scholarship Hunter hingga bersinar sebagai Awardee Material.
                    </div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}>
                      <Image src="/bounty_logo.jpg" alt="Bounty" width={32} height={32} style={{ borderRadius: '6px', marginRight: '12px', objectFit: 'contain' }} />
                      <div className={styles.cardTitle}>Bounty & Boss</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Konsistensi adalah kunci kemenangan. Melalui daftar quest harian dan tantangan mingguan yang epik, mereka akan berburu bonus XP tambahan. Sistem mekanik ini sengaja dirancang untuk menjaga api semangat belajar agar tidak pernah padam di tengah petualangan.
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* ── 5. FEATURE MAHASISWA ── */}
          {activeSection === 'feature_mahasiswa' && (
            <>
              <h2 className={styles.docTitle}>FEATURE: MAHASISWA</h2>
              <div className={styles.separator} />
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Persona: "The Chaser"</h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Berbeda dengan The Dreamer, mari kita sapa <strong>The Chaser</strong>. Mereka adalah barisan pahlawan di tingkat akhir perkuliahan atau fresh graduate yang sedang berlari kencang mengejar karir pertama mereka di dunia nyata. Di tahap ini, mereka tidak lagi punya waktu untuk menebak-nebak materi pelajaran. Mereka sangat membutuhkan arena pembuktian di mana skill mereka bisa diasah tajam, diuji keras, dan diverifikasi keasliannya secara absolut oleh para rekruter industri.
                </p>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>User Flow Mahasiswa</h3>
                <Image src="/docs-flow-mahasiswa-v2.jpg" alt="User Flow Mahasiswa" width={900} height={394} className={styles.gameImage} />
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Fitur Utama Dashboard Mahasiswa</h3>
                <div className={styles.featureGrid}>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}>
                      <Image src="/skillgap_logo.jpg" alt="Skill Gap Analysis" width={32} height={32} style={{ borderRadius: '6px', marginRight: '12px', objectFit: 'contain' }} />
                      <div className={styles.cardTitle}>AI Skill Gap Analysis</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Pertempuran mereka dimulai dengan selembar CV. Begitu diunggah, sistem AI cerdas kita akan membedah CV tersebut lapis demi lapis, menemukan jurang kesenjangan antara kemampuan mereka saat ini dengan kejamnya standar industri, dan menyusun peta jalan presisi untuk mengejar ketertinggalan.
                    </div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}>
                      <Image src="/careerhub_logo.jpg" alt="Career Hub" width={32} height={32} style={{ borderRadius: '6px', marginRight: '12px', objectFit: 'contain' }} />
                      <div className={styles.cardTitle}>Career Hub</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Ini adalah pusat komando utama mereka. Sebuah dashboard terpusat yang dengan bangga memamerkan Career Score mereka, melacak secara akurat progres belajar pada setiap kompetensi, dan memajang gemerlap koleksi token sertifikat yang telah mereka menangkan.
                    </div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}>
                      <Image src="/learningmission_logo.jpg" alt="Learning Mission" width={32} height={32} style={{ borderRadius: '6px', marginRight: '12px', objectFit: 'contain' }} />
                      <div className={styles.cardTitle}>Learning Mission</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Meninggalkan dunia dongeng, mereka memasuki misi belajar tingkat tinggi yang sepenuhnya diadaptasi dari silabus dunia industri sungguhan. Setiap misi dirancang secara taktis untuk menutup celah gap skill yang sebelumnya telah diendus oleh kecerdasan buatan kita.
                    </div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}>
                      <Image src="/vault_logo.jpg" alt="The Vault" width={32} height={32} style={{ borderRadius: '6px', marginRight: '12px', objectFit: 'contain' }} />
                      <div className={styles.cardTitle}>The Vault (Treasures)</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Inilah ruang harta karun kebanggaan sang petualang. Sebuah galeri tempat menyimpan seluruh sertifikat berharga yang kapan saja bisa dibagikan sebagai tautan publik kepada rekruter. Tautan ini membuktikan langsung di atas jaringan blockchain bahwa kemampuan mereka adalah nyata.
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* ── 6. THE 8 HOUSES ── */}
          {activeSection === 'eight_houses' && (
            <>
              <h2 className={styles.docTitle}>THE 8 HOUSES</h2>
              <div className={styles.separator} />
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>World Map Engine</h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Pusat petualangan PathTrick dibangun di atas fondasi <strong>Phaser.js</strong>, sebuah mesin game 2D tangguh yang hidup langsung di dalam browser Anda. Di dalam dunia ini, terbentang <strong>8 Bangunan Kuno (The 8 Houses)</strong> yang masing-masing menyimpan rahasia sebuah modul kompetensi krusial. Saat pertama kali menjejakkan kaki, hanya House pertama yang membuka pintunya untuk Anda. House-house berikutnya dijaga ketat oleh sistem dan hanya akan terbuka setelah Anda berhasil membuktikan kelayakan di bangunan sebelumnya.
                </p>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Siklus Quest di Dalam Setiap House</h3>
                <div className={styles.timeline}>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>1</div>
                    <div className={styles.timelineContent}>
                      <strong>Membaca Gulungan Teori:</strong> Petualangan di setiap house selalu dimulai dengan mempelajari materi naratif. Kami menggunakan analogi sederhana dunia nyata agar konsep teknis sekalipun mudah dicerna oleh para pemula.
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>2</div>
                    <div className={styles.timelineContent}>
                      <strong>Ujian Pemahaman Cepat:</strong> Sebuah kuis singkat akan muncul secara otomatis. Jika tebakan Anda meleset, penjaga house akan ramah mengarahkan Anda kembali ke ruang baca sebelum mengizinkan Anda mencoba lagi.
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
                      <strong>Pertarungan Melawan Boss:</strong> Ini adalah ujian akhir. Mini project Anda akan dievaluasi dengan ketat oleh wasit AI. Jika berhasil meraih skor kelulusan, sistem akan langsung menempakan medali abadi (SBT) ke dalam dompet Anda.
                    </div>
                  </div>
                </div>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Mesin Di Balik Layar</h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Agar seluruh petualangan ini terasa hidup tanpa ada jeda, kami menggunakan arsitektur <strong>State Machine</strong> yang mulus. Rekam jejak Anda di setiap house dijaga ketat oleh brankas memori <strong>Zustand</strong>. Ketika karakter Anda berinteraksi di dalam dunia game, mesin game akan langsung berbisik kepada antarmuka melalui gelombang komunikasi khusus. Di saat yang sama, setiap tetes keringat alias poin pengalaman yang Anda kumpulkan akan dihitung secara instan dan dipancarkan ke layar utama Anda detik itu juga.
                </p>
              </section>
            </>
          )}

          {/* ── 7. SMART CONTRACT ── */}
          {activeSection === 'smart_contract' && (
            <>
              <h2 className={styles.docTitle}>SMART CONTRACT</h2>
              <div className={styles.separator} />
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Contract Details</h3>
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
                        View contract on BscScan Testnet
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
              <h2 className={styles.docTitle}>AI: RIASEC ENGINE</h2>
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
                      <strong>Penciptaan Peta Jalan:</strong> Wangsit dari AI tadi tidak dibiarkan berbentuk teks kaku. Sistem kita dengan cepat menyulapnya menjadi sebuah struktur peta jalan interaktif di Dashboard, menentukan gerbang House mana yang harus pertama kali mereka ketuk.
                    </div>
                  </div>
                </div>
              </section>

              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Harta Karun yang Dihasilkan AI</h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Pada akhir ritual panjang ini, AI mempersembahkan sekotak harta karun berupa profil karir naratif yang menceritakan siapa diri Anda sebenarnya. Di dalamnya terdapat daftar lima rekomendasi jurusan kuliah paling menjanjikan, lengkap dengan alasan mengapa jurusan itu memanggil Anda. Tidak hanya itu, kotak ini juga berisi daftar universitas incaran beserta jalur masuknya, peta beasiswa yang siap mendanai perjalanan Anda, hingga sebuah urutan petualangan di 8 Houses yang telah dikustomisasi khusus untuk menutupi kelemahan Anda.
                </p>
              </section>

              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Sihir Optimasi di Balik Layar</h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Meskipun sangat pintar, memanggil kekuatan otak AI secara langsung terus-menerus bisa memakan waktu dan biaya besar. Oleh karena itu, kita menggunakan sihir <strong>Pre-generated JSON</strong>, di mana ribuan kombinasi hasil AI yang paling umum telah kita sediakan sebelumnya. Pengguna seolah mendapatkan jawaban instan tanpa harus menunggu mesin berpikir. Namun, ketika ada seorang petualang dengan kepribadian yang sangat langka muncul, sistem kita memiliki reflek <strong>Dynamic Fallback</strong> yang akan segera memanggil AI secara langsung dan kemudian mencatat hasilnya untuk dipelajari di masa depan. Seluruh dialog dengan AI ini dikunci erat dengan mantra <strong>Structured Output Prompting</strong>, memastikan bahwa AI tidak akan pernah berhalusinasi atau memberikan format data yang cacat.
                </p>
              </section>
            </>
          )}

          {/* ── 9. AI CV ANALYZER ── */}
          {activeSection === 'ai_cv' && (
            <>
              <h2 className={styles.docTitle}>AI: CV ANALYZER</h2>
              <div className={styles.separator} />

              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Tujuan Analisis Dokumen</h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Bagi para petualang yang telah mencapai level Mahasiswa dan Fresh Graduate, metode kompas RIASEC sudah tidak lagi relevan. Mereka butuh senjata yang lebih mematikan. Sebagai gantinya, AI kita turun langsung ke medan perang dengan menganalisis senjata utama mereka: Curriculum Vitae (CV). Dengan mata elangnya, AI membedah seluruh dokumen tersebut untuk mendeteksi amunisi skill apa saja yang sudah dimiliki, menemukan di mana celah kelemahan mereka terhadap standar keras industri, dan akhirnya merakit ulang sebuah peta jalan belajar yang paling presisi dan efisien.
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
                      <div className={styles.cardTitle}>Career Score</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Sebuah rapot kebanggaan (atau tamparan keras) yang menampilkan persentase kesiapan karir Anda pada berbagai domain menantang di dunia nyata.
                    </div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}>
                      <div className={`${styles.cardIcon} ${styles.cardIconGreen}`}>2</div>
                      <div className={styles.cardTitle}>Skill Inventory</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Inventaris lengkap layaknya daftar senjata Anda, memperlihatkan kemampuan apa saja yang terdeteksi beserta estimasi kekuatan penguasaannya.
                    </div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}>
                      <div className={`${styles.cardIcon} ${styles.cardIconOrange}`}>3</div>
                      <div className={styles.cardTitle}>Skill Gap Report</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Ini adalah daftar merah. Sebuah rangkuman kelemahan kritis yang selama ini menjadi alasan mengapa CV Anda belum pernah dipanggil wawancara.
                    </div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}>
                      <div className={styles.cardIcon}>4</div>
                      <div className={styles.cardTitle}>Job Match</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Prediksi akurat layaknya bola kristal, merekomendasikan tiga kursi pekerjaan teratas yang saat ini paling selaras dengan persentase kekuatan CV Anda.
                    </div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}>
                      <div className={`${styles.cardIcon} ${styles.cardIconBlue}`}>5</div>
                      <div className={styles.cardTitle}>Learning Roadmap</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Gulungan taktik pertempuran selanjutnya. Mengarahkan Anda pada urutan misi belajar yang dirancang khusus untuk memusnahkan setiap kelemahan tadi.
                    </div>
                  </div>
                </div>
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
              <h2 className={styles.docTitle}>CURRENT SYSTEM STATUS</h2>
              <div className={styles.separator} />
              <section className={styles.section}>
                <div className={styles.callout}>
                  Frontend saat ini sudah dapat didemokan end-to-end dengan data lokal. Saat backend asli tersedia, endpoint API dan persistence dapat diaktifkan melalui environment tanpa mengubah struktur halaman utama.
                </div>
                <h3 className={styles.sectionTitle}>Yang Sudah Berjalan</h3>
                <div className={styles.featureGrid}>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}>1</div><div className={styles.cardTitle}>Onboarding</div></div>
                    <div className={styles.cardText}>Role diambil dari API roles, memiliki fallback lokal untuk demo, dan pilihan role disimpan bersama identitas Privy.</div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}>2</div><div className={styles.cardTitle}>Learning Game</div></div>
                    <div className={styles.cardText}>Dashboard, houses, mission, quiz, lives, retry, game over, reward, dan certificate entry tersedia dalam alur pixel-RPG.</div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}>3</div><div className={styles.cardTitle}>Profile State</div></div>
                    <div className={styles.cardText}>Nickname dan avatar pilihan disimpan melalui Zustand persistence dan digunakan konsisten di profile, dashboard, header, serta game HUD.</div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}>4</div><div className={styles.cardTitle}>Pixel UI</div></div>
                    <div className={styles.cardText}>Tampilan utama menggunakan font pixel, panel kayu, border tebal, asset karakter, dan icon pixel-art tanpa placeholder visual generik.</div>
                  </div>
                </div>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Yang Masih Membutuhkan Environment Asli</h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Data role, progress, assessment, scholarship, dan career match masih dapat memakai mock/local state ketika backend belum terhubung. Persistence lintas perangkat, autentikasi server, indexing certificate, serta data AI produksi membutuhkan backend dan database yang sebenarnya.
                </p>
                <p className={styles.text} style={{ marginTop: '16px', textAlign: 'justify' }}>
                  Transaksi certificate membutuhkan wallet yang memiliki tBNB di BNB Smart Chain Testnet. Mode demo tidak boleh dianggap sebagai bukti bahwa transaksi blockchain atau konfirmasi backend produksi telah berhasil.
                </p>
              </section>
            </>
          )}

          {/* ── 11. INTEGRATION NOTES ── */}
          {activeSection === 'integration_notes' && (
            <>
              <h2 className={styles.docTitle}>INTEGRATION NOTES</h2>
              <div className={styles.separator} />
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Environment Variables</h3>
                <table className={styles.techTable}>
                  <thead><tr><th>Variable</th><th>Purpose</th></tr></thead>
                  <tbody>
                    <tr><td><code>NEXT_PUBLIC_API_URL</code></td><td>Base URL backend asli. Suffix <code>/api</code> akan dinormalisasi oleh frontend.</td></tr>
                    <tr><td><code>NEXT_PUBLIC_PRIVY_APP_ID</code></td><td>Public application ID untuk login dan embedded wallet Privy.</td></tr>
                    <tr><td><code>NEXT_PUBLIC_PATHTRICK_SBT_ADDRESS</code></td><td>Alamat contract publik. Default diarahkan ke deployment BNB Testnet terbaru.</td></tr>
                    <tr><td><code>NEXT_PUBLIC_BNB_TESTNET_RPC_URL</code></td><td>RPC Chain ID 97 untuk membaca contract dan mengirim transaksi.</td></tr>
                    <tr><td><code>NEXT_PUBLIC_USE_MOCK_BACKEND</code></td><td>Memaksa request memakai mock route lokal Next.js.</td></tr>
                    <tr><td><code>NEXT_PUBLIC_ALLOW_LOCAL_ROLE_FALLBACK</code></td><td>Mengizinkan role lokal hanya sebagai fallback demo. Set <code>false</code> di production.</td></tr>
                  </tbody>
                </table>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Backend Contract yang Diharapkan</h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Frontend mengharapkan <code>GET /api/roles</code> untuk metadata role dan <code>POST /api/users/me/role</code> dengan body <code>{`{ roleId }`}</code>. Untuk certificate, frontend memanggil <code>POST /api/certificates/prepare-mint</code>, membaca <code>courseId</code>, <code>nonce</code>, <code>deadline</code>, dan <code>signature</code>, lalu mengirim <code>POST /api/certificates/confirm-mint</code> dengan <code>courseId</code> dan <code>txHash</code>.
                </p>
                <p className={styles.text} style={{ marginTop: '16px', textAlign: 'justify' }}>
                  Backend harus menyelesaikan user dari session/authenticated wallet. Frontend tidak mengirim private key, admin signer key, owner key, atau BscScan API key. Signature mint harus dibuat ulang oleh backend jika signature invalid atau expired. Frontend tidak mengubah nonce maupun deadline secara manual.
                </p>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Certificate Transaction Checklist</h3>
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
              <h2 className={styles.docTitle}>BUSINESS SCALING</h2>
              <div className={styles.separator} />
              <section className={styles.section}>
                <div className={styles.callout}>
                  <strong>PathTrick</strong> dirancang sebagai <strong>career-learning platform</strong> yang menggabungkan assessment, learning game, career matching, dan <strong>bukti skill on-chain</strong>. Scaling tidak hanya berarti menambah user, tetapi juga meningkatkan <strong>kualitas rekomendasi</strong>, completion rate, partner outcome, dan <strong>recurring revenue</strong> tanpa mengorbankan pengalaman pixel-RPG.
                </div>
                <h3 className={styles.sectionTitle}>Target Customer</h3>
                <div className={styles.featureGrid}>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}>1</div><div className={styles.cardTitle}>B2C Student</div></div>
                    <div className={styles.cardText}>Siswa SMA dan mahasiswa yang membutuhkan <strong>validasi minat</strong>, roadmap belajar, portfolio, serta bukti kompetensi.</div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}>2</div><div className={styles.cardTitle}>Schools & Campus</div></div>
                    <div className={styles.cardText}>Sekolah, kampus, dan career center yang membutuhkan assessment, <strong>dashboard cohort</strong>, dan monitoring kesiapan siswa.</div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}>3</div><div className={styles.cardTitle}>Employers</div></div>
                    <div className={styles.cardText}>Perusahaan dan recruiter yang ingin menemukan kandidat berdasarkan <strong>skill evidence</strong>, bukan hanya CV.</div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}>4</div><div className={styles.cardTitle}>Content Partners</div></div>
                    <div className={styles.cardText}>Bootcamp, mentor, dan penyedia course yang ingin mendistribusikan materi melalui quest dan certificate.</div>
                  </div>
                </div>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Revenue Model</h3>
                <table className={styles.techTable}>
                  <thead><tr><th>Model</th><th>Value</th><th>Catatan Eksekusi</th></tr></thead>
                  <tbody>
                    <tr><td><strong>Freemium</strong></td><td>Assessment dasar, dashboard, dan sebagian quest gratis</td><td>Menjaga acquisition tetap rendah friksi</td></tr>
                    <tr><td><strong>Premium Learning</strong></td><td>Roadmap lanjutan, project review, mentor, dan analytics</td><td>Subscription bulanan atau paket course</td></tr>
                    <tr><td><strong>Institutional SaaS</strong></td><td>Dashboard sekolah/kampus, cohort analytics, dan admin tools</td><td>Kontrak tahunan per institution atau per cohort</td></tr>
                    <tr><td><strong>Recruiter Access</strong></td><td>Talent search berbasis verified skill evidence</td><td>Memerlukan consent, privacy control, dan anti-discrimination review</td></tr>
                    <tr><td><strong>Certificate Fee</strong></td><td>Mint certificate dengan harga contract saat ini plus gas</td><td>Frontend membaca <code>mintPrice()</code>. Harga tidak boleh di-hardcode</td></tr>
                  </tbody>
                </table>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Growth Loop</h3>
                <div className={styles.timeline}>
                  <div className={styles.timelineItem}><div className={styles.timelinePoint}>1</div><div className={styles.timelineContent}><strong>Discover:</strong> User masuk dari referral, sekolah, content partner, atau career campaign.</div></div>
                  <div className={styles.timelineItem}><div className={styles.timelinePoint}>2</div><div className={styles.timelineContent}><strong>Assess:</strong> Role dan assessment menghasilkan personal starting point.</div></div>
                  <div className={styles.timelineItem}><div className={styles.timelinePoint}>3</div><div className={styles.timelineContent}><strong>Progress:</strong> Quest, XP, streak, dan visual map mendorong completion.</div></div>
                  <div className={styles.timelineItem}><div className={styles.timelinePoint}>4</div><div className={styles.timelineContent}><strong>Prove:</strong> Project dan certificate menjadi skill evidence yang dapat dibagikan.</div></div>
                  <div className={styles.timelineItem}><div className={styles.timelinePoint}>5</div><div className={styles.timelineContent}><strong>Refer:</strong> Achievement, leaderboard, dan outcome karier mengundang user serta partner baru.</div></div>
                </div>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>North Star Metrics</h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Fokus awal bukan jumlah wallet, melainkan <strong>verified learning outcomes</strong>: jumlah user yang menyelesaikan assessment, menyelesaikan quest, lulus project, memperoleh certificate, dan mendapatkan outcome berikutnya seperti internship, university match, atau job interview.
                </p>
                <div className={styles.featureGrid} style={{ marginTop: '24px' }}>
                  <div className={styles.featureCard}><div className={styles.cardTitle}><strong>Activation</strong></div><div className={styles.cardText}>Role selected, assessment started, dan first quest completed.</div></div>
                  <div className={styles.featureCard}><div className={styles.cardTitle}><strong>Retention</strong></div><div className={styles.cardText}>D7/D30 return, weekly quest completion, dan learning streak.</div></div>
                  <div className={styles.featureCard}><div className={styles.cardTitle}><strong>Conversion</strong></div><div className={styles.cardText}>Premium upgrade, certificate mint, atau institutional seat usage.</div></div>
                  <div className={styles.featureCard}><div className={styles.cardTitle}><strong>Outcome</strong></div><div className={styles.cardText}>Course completion, verified skill, partner satisfaction, dan placement signal.</div></div>
                </div>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Scale Roadmap</h3>
                <table className={styles.techTable}>
                  <thead><tr><th>Stage</th><th>Prioritas</th></tr></thead>
                  <tbody>
                    <tr><td><strong>Stage 1: Validate</strong></td><td>Stabilkan onboarding, learning completion, wallet flow, mock-to-real backend, dan 1-2 pilot institution.</td></tr>
                    <tr><td><strong>Stage 2: Repeat</strong></td><td>Bangun admin dashboard, analytics cohort, content pipeline, referral, dan subscription billing.</td></tr>
                    <tr><td><strong>Stage 3: Expand</strong></td><td>Tambah partner course, recruiter portal, multi-language, multi-chain strategy, dan regional distribution.</td></tr>
                    <tr><td><strong>Stage 4: Platform</strong></td><td>Buka API/SDK untuk institution dan content partner dengan permission, audit, serta SLA yang jelas.</td></tr>
                  </tbody>
                </table>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Founder and Investor Mindset</h3>
                <div className={styles.callout}>
                  Prinsip utama PathTrick: <strong>jangan scale vanity metrics, scale outcomes.</strong> Wallet connect, sign-up, dan page views penting untuk funnel, tetapi nilai bisnis muncul ketika pengguna benar-benar menyelesaikan learning journey dan partner melihat outcome yang lebih baik.
                </div>
                <div className={styles.featureGrid}>
                  <div className={styles.featureCard}><div className={styles.cardTitle}>Solve Pain First</div><div className={styles.cardText}>Validasi bahwa user membayar atau partner memperpanjang kontrak karena masalah career uncertainty benar-benar terselesaikan.</div></div>
                  <div className={styles.featureCard}><div className={styles.cardTitle}>Evidence Over Hype</div><div className={styles.cardText}>Pisahkan data actual, target, dan assumption. Jangan menjual blockchain sebagai tujuan. Gunakan blockchain sebagai trust layer untuk skill evidence.</div></div>
                  <div className={styles.featureCard}><div className={styles.cardTitle}>Distribution Is Product</div><div className={styles.cardText}>Bangun jalur distribusi melalui sekolah, kampus, komunitas, mentor, dan recruiter sejak awal, bukan setelah produk selesai.</div></div>
                  <div className={styles.featureCard}><div className={styles.cardTitle}>Capital Discipline</div><div className={styles.cardText}>Setiap dana harus membeli learning velocity: product quality, partner acquisition, content supply, atau measurable user outcome.</div></div>
                </div>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}><strong>Q1: Prove the Wedge</strong></h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Fokus Q1 adalah membuktikan bahwa pengalaman PathTrick membuat user memulai dan menyelesaikan learning journey. Jangan mengejar terlalu banyak persona sekaligus. Pilih satu wedge utama, misalnya siswa SMA yang sedang mencari jurusan dan roadmap persiapan.
                </p>
                <table className={styles.techTable}>
                  <thead><tr><th><strong>Workstream</strong></th><th><strong>Target Investor-Ready</strong></th></tr></thead>
                  <tbody>
                    <tr><td>Product</td><td>Onboarding, assessment, first quest, progress, dan certificate flow stabil tanpa critical bug.</td></tr>
                    <tr><td>Validation</td><td>Interview terstruktur dan pilot kecil. Ukur activation, first quest completion, serta alasan user berhenti.</td></tr>
                    <tr><td>Backend</td><td>Auth, role persistence, progress persistence, dan audit log sudah memakai backend asli.</td></tr>
                    <tr><td>Trust</td><td>Jelaskan data privacy, consent, certificate verification, dan batasan AI secara transparan.</td></tr>
                    <tr><td><strong>Gate</strong></td><td>Lanjut ke Q2 hanya jika ada <strong>repeat usage</strong> dan bukti bahwa user meminta lebih banyak content atau guidance.</td></tr>
                  </tbody>
                </table>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}><strong>Q2: Prove Repeatability</strong></h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Fokus Q2 adalah mengubah keberhasilan pilot menjadi playbook yang dapat diulang. Satu sekolah atau komunitas yang berhasil belum menjadi bisnis scalable. Kita perlu tahu channel mana yang menghasilkan user berkualitas dan berapa biaya untuk melayani mereka.
                </p>
                <table className={styles.techTable}>
                  <thead><tr><th><strong>Workstream</strong></th><th><strong>Target Investor-Ready</strong></th></tr></thead>
                  <tbody>
                    <tr><td>Distribution</td><td>Playbook partnership sekolah/kampus, referral, ambassador, dan content campaign.</td></tr>
                    <tr><td>Monetization</td><td>Uji willingness-to-pay untuk premium learning, certificate, dan institutional package.</td></tr>
                    <tr><td>Operations</td><td>Admin dashboard, support workflow, content QA, dan partner onboarding checklist.</td></tr>
                    <tr><td>Metrics</td><td>Bandingkan activation, retention, completion, conversion, CAC, dan support cost per channel.</td></tr>
                    <tr><td><strong>Gate</strong></td><td>Masuk Q3 setelah ada channel yang <strong>repeatable</strong> dan cohort yang menunjukkan retention lebih baik.</td></tr>
                  </tbody>
                </table>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}><strong>Q3: Build the Growth Engine</strong></h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Fokus Q3 adalah memperbesar supply dan demand secara seimbang. User membutuhkan course dan mentor yang berkualitas. Partner membutuhkan audience dan outcome. Marketplace effect hanya boleh dikejar setelah quality control dan consent sudah kuat.
                </p>
                <table className={styles.techTable}>
                  <thead><tr><th><strong>Workstream</strong></th><th><strong>Target Investor-Ready</strong></th></tr></thead>
                  <tbody>
                    <tr><td>Content Supply</td><td>Partner course dan project dengan rubric, learning objective, reviewer, serta certificate policy yang konsisten.</td></tr>
                    <tr><td>Career Network</td><td>Employer pilot untuk skill evidence dan feedback loop dari recruiter.</td></tr>
                    <tr><td>Product Loops</td><td>Shareable achievement, referral, cohort challenge, dan re-engagement yang tidak bergantung pada gimmick.</td></tr>
                    <tr><td>Infrastructure</td><td>Observability, queue untuk AI jobs, caching, rate limit, analytics events, dan cost monitoring.</td></tr>
                    <tr><td><strong>Gate</strong></td><td>Scale paid acquisition hanya jika retention dan <strong>gross margin per cohort</strong> sudah dipahami.</td></tr>
                  </tbody>
                </table>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}><strong>Q4: Prepare for Institutional Scale</strong></h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Fokus Q4 adalah kesiapan menjual dan melayani institusi secara serius. Investor perlu melihat bahwa pertumbuhan tidak menambah chaos operasional, debt keamanan, atau ketergantungan pada satu orang.
                </p>
                <table className={styles.techTable}>
                  <thead><tr><th><strong>Workstream</strong></th><th><strong>Target Investor-Ready</strong></th></tr></thead>
                  <tbody>
                    <tr><td>Enterprise Product</td><td>Role-based admin, cohort reporting, export, permission, SSO plan, dan SLA support.</td></tr>
                    <tr><td>Revenue Quality</td><td>Renewal signal, annual contract, expansion revenue, gross margin, dan pipeline yang dapat diprediksi.</td></tr>
                    <tr><td>Governance</td><td>Security review, incident response, privacy policy, data retention, vendor review, dan financial reporting.</td></tr>
                    <tr><td>Fundraising</td><td>Investor data room berisi traction, cohort data, product demo, roadmap, cap table, legal readiness, dan use of funds.</td></tr>
                    <tr><td><strong>Gate</strong></td><td>Fundraise berdasarkan bukti repeatability dan <strong>capital-efficient growth</strong>, bukan sekadar jumlah fitur.</td></tr>
                  </tbody>
                </table>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Investor Scorecard</h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Untuk konteks <strong>PathTrick</strong> dan <strong>Indonesia Web3 Hackathon</strong>, scorecard ini bukan sekadar laporan bisnis. Ini adalah cara mengikuti perjalanan user dari rasa ragu menuju bukti nyata: menemukan arah, menyelesaikan misi, membangun skill, dan membawa <strong>skill evidence yang dapat diverifikasi</strong> ke pendidikan atau dunia kerja. Setiap kuartal, kami bertanya: apakah PathTrick membuat langkah berikutnya terasa lebih jelas, lebih mudah dilakukan, dan lebih bernilai?
                </p>
                <div className={styles.featureGrid} style={{ marginTop: '24px' }}>
                  <div className={styles.featureCard}>
                    <div className={styles.cardTitle}><strong>Traction: Apakah Perjalanan Dimulai dan Diselesaikan?</strong></div>
                    <div className={styles.cardText}>Kami mengikuti jejak user dari memilih role, menyelesaikan assessment RIASEC atau CV, memulai quest pertama, kembali di minggu berikutnya, hingga menuntaskan course. Untuk demo hackathon, bukti terpenting bukan jumlah wallet yang tersambung, tetapi alur utuh: <strong>assessment → learning mission → project → verified certificate</strong>.</div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardTitle}><strong>Efficiency: Apakah Jalan Ini Bisa Dibuka untuk Cohort Berikutnya?</strong></div>
                    <div className={styles.cardText}>Kami mengukur biaya untuk membawa satu learner dari sekolah, komunitas, atau referral sampai aktif, termasuk AI, support, dan onboarding cohort. PathTrick harus menunjukkan bahwa semakin banyak pelajar yang dibantu tidak berarti biaya tumbuh tanpa kendali, sementara certificate tetap memakai <strong>mintPrice</strong> contract dan gas fee terlihat transparan bagi user.</div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardTitle}><strong>Moat: Mengapa Bukti Ini Lebih Dipercaya?</strong></div>
                    <div className={styles.cardText}>Keunggulan PathTrick bukan sekadar pixel-art atau blockchain. Ia tumbuh dari kombinasi <strong>outcome dataset yang memiliki consent</strong>, learning journey yang mendorong completion, partner sekolah dan content, kualitas rekomendasi RIASEC/CV, serta <strong>on-chain proof</strong> yang dapat diverifikasi di luar klaim internal platform.</div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardTitle}><strong>Execution: Apakah Visi Ini Bisa Menjadi Kebiasaan User?</strong></div>
                    <div className={styles.cardText}>Kami membuktikannya melalui release yang cepat, frontend yang tetap stabil saat backend dan wallet masuk, pilot sekolah atau kampus, dan playbook yang dapat diulang. Untuk hackathon, execution terlihat dari demo end-to-end yang mulus, integrasi BNB Testnet yang benar, UX yang ramah non-crypto, dan roadmap yang berpijak pada kenyataan.</div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* ── 13. MARKET AND GO-TO-MARKET ── */}
          {activeSection === 'market_strategy' && (
            <>
              <h2 className={styles.docTitle}>MARKET &amp; GO-TO-MARKET</h2>
              <div className={styles.separator} />
              <section className={styles.section}>
                <div className={styles.callout}>
                  PathTrick dimulai dari satu momen yang sangat manusiawi: seorang pelajar membuka banyak tab, mendengar terlalu banyak nasihat, tetapi tetap tidak tahu langkah berikutnya. Kami masuk melalui <strong>career discovery</strong>, membantu user menemukan arah yang terasa personal, lalu membawa mereka ke learning infrastructure dan verified skill network.
                </div>
                <h3 className={styles.sectionTitle}>Beachhead Market</h3>
                <p className={styles.text} style={{ textAlign: 'justify', marginBottom: '36px' }}>
                  Beachhead awal adalah siswa SMA dan mahasiswa yang sedang memilih jurusan, mencari beasiswa, atau menyiapkan skill kerja digital. Segmen ini cukup fokus untuk divalidasi, tetapi cukup besar untuk membuka jalur ekspansi ke sekolah, kampus, bootcamp, career center, dan employer.
                </p>
                <div className={styles.marketExpansion}>
                  <h3 className={styles.sectionTitle}>Market Expansion Logic</h3>
                  <div className={styles.tableScroll}>
                    <table className={styles.techTable}>
                      <thead><tr><th><strong>Layer</strong></th><th><strong>Customer</strong></th><th><strong>Value</strong></th></tr></thead>
                      <tbody>
                        <tr><td><strong>Entry</strong></td><td>Student</td><td>Assessment, roadmap, quest, dan progress yang personal.</td></tr>
                        <tr><td><strong>Distribution</strong></td><td>School, campus, community</td><td>Cohort dashboard, readiness insight, dan engagement program.</td></tr>
                        <tr><td><strong>Supply</strong></td><td>Mentor, bootcamp, course partner</td><td>Content distribution, project rubric, dan certificate issuance.</td></tr>
                        <tr><td><strong>Outcome</strong></td><td>Employer, recruiter</td><td>Verified skill evidence dan talent discovery yang lebih relevan.</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Go-to-Market Wedge</h3>
                <div className={styles.timeline}>
                  <div className={styles.timelineItem}><div className={styles.timelinePoint}>1</div><div className={styles.timelineContent}><strong>Community-led:</strong> Masuk melalui student community, mentor, dan ambassador yang sudah dipercaya.</div></div>
                  <div className={styles.timelineItem}><div className={styles.timelinePoint}>2</div><div className={styles.timelineContent}><strong>Institution pilot:</strong> Jalankan cohort kecil dengan sekolah atau career center dan ukur outcome sebelum menjual kontrak besar.</div></div>
                  <div className={styles.timelineItem}><div className={styles.timelinePoint}>3</div><div className={styles.timelineContent}><strong>Content partnership:</strong> Gunakan course dan project partner untuk memperkaya learning map tanpa membangun semua konten sendiri.</div></div>
                  <div className={styles.timelineItem}><div className={styles.timelinePoint}>4</div><div className={styles.timelineContent}><strong>Outcome distribution:</strong> Tampilkan certificate dan portfolio yang dapat diverifikasi agar user menjadi channel pertumbuhan berikutnya.</div></div>
                </div>
              </section>
            </>
          )}

          {/* ── 14. COMPETITIVE EDGE ── */}
          {activeSection === 'competitive_edge' && (
            <>
              <h2 className={styles.docTitle}>COMPETITIVE EDGE</h2>
              <div className={styles.separator} />
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Positioning</h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  PathTrick bukan hanya platform course, bukan hanya tes minat bakat, dan bukan hanya wallet certificate. PathTrick menyatukan <strong>discovery, learning, proof, dan outcome</strong> dalam satu perjalanan yang terasa seperti game tetapi menghasilkan data dan credential yang serius.
                </p>
                <table className={styles.techTable}>
                  <thead><tr><th><strong>Alternatif</strong></th><th><strong>Keterbatasan</strong></th><th><strong>Perbedaan PathTrick</strong></th></tr></thead>
                  <tbody>
                    <tr><td>Course platform</td><td>Konten tersedia, tetapi user tidak selalu tahu harus mulai dari mana.</td><td>RIASEC/CV membantu menentukan entry point dan roadmap.</td></tr>
                    <tr><td>Career test</td><td>Insight berhenti di rekomendasi dan tidak selalu menjadi aksi.</td><td>Insight langsung diteruskan ke quest dan learning mission.</td></tr>
                    <tr><td>Game edukasi</td><td>Engagement ada, tetapi bukti skill dan outcome karier belum kuat.</td><td>Progress berujung pada project dan certificate yang dapat diverifikasi.</td></tr>
                    <tr><td>Web3 certificate</td><td>Credential bisa diterbitkan tanpa learning journey yang bermakna.</td><td>Mint mengikuti completion, authorization backend, dan event contract.</td></tr>
                  </tbody>
                </table>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>What We Must Defend</h3>
                <div className={styles.featureGrid}>
                  <div className={styles.featureCard}><div className={styles.cardTitle}><strong>Completion Loop</strong></div><div className={styles.cardText}>Pixel-RPG progression membuat user terus bergerak dari rekomendasi ke aksi, bukan berhenti di hasil assessment.</div></div>
                  <div className={styles.featureCard}><div className={styles.cardTitle}><strong>Local Relevance</strong></div><div className={styles.cardText}>Bahasa, konteks jurusan, beasiswa, dan career path dirancang untuk realitas siswa Indonesia.</div></div>
                  <div className={styles.featureCard}><div className={styles.cardTitle}><strong>Trust Layer</strong></div><div className={styles.cardText}>BNB Testnet dan Soulbound certificate memberi bukti publik tanpa menjadikan crypto sebagai hambatan utama.</div></div>
                  <div className={styles.featureCard}><div className={styles.cardTitle}><strong>Partner Network</strong></div><div className={styles.cardText}>Semakin banyak institution, mentor, course, dan employer yang terhubung, semakin bernilai outcome network.</div></div>
                </div>
              </section>
            </>
          )}

          {/* ── 15. HACKATHON CASE ── */}
          {activeSection === 'hackathon_case' && (
            <>
              <h2 className={styles.docTitle}>WHY PATHTRICK SHOULD WIN</h2>
              <div className={styles.separator} />
              <section className={styles.section}>
                <div className={styles.callout}>
                  <strong>PathTrick menunjukkan bahwa Web3 dapat menjadi infrastructure of trust untuk pendidikan dan karier.</strong> User datang karena ingin menemukan arah, bertahan karena learning game, lalu pulang membawa bukti skill yang dapat diverifikasi, bukan sekadar collectible digital.
                </div>
                <h3 className={styles.sectionTitle}>Judging Narrative</h3>
                <table className={styles.techTable}>
                  <thead><tr><th><strong>Yang Dinilai</strong></th><th><strong>Bukti PathTrick</strong></th></tr></thead>
                  <tbody>
                    <tr><td><strong>Problem</strong></td><td>Seorang pelajar dapat memiliki banyak pilihan, tetapi tidak memiliki peta. PathTrick menjawab career uncertainty, salah jurusan, dan jarak antara belajar dengan bukti skill.</td></tr>
                    <tr><td><strong>Innovation</strong></td><td>Insight RIASEC/CV tidak berhenti sebagai laporan. Insight itu berubah menjadi <strong>learning journey</strong> yang bisa dimainkan, diukur, dan diselesaikan.</td></tr>
                    <tr><td><strong>Web3 Relevance</strong></td><td>Certificate memakai signature authorization, live mint price, receipt verification, dan event <code>CertificateMinted(to, courseId)</code> di BNB Testnet untuk menciptakan bukti yang dapat dipercaya.</td></tr>
                    <tr><td><strong>Usability</strong></td><td>Privy embedded wallet dan pixel-RPG UX menyembunyikan kompleksitas crypto, sehingga user dapat fokus pada perjalanan belajar, bukan konfigurasi teknis.</td></tr>
                    <tr><td><strong>Impact</strong></td><td>PathTrick membantu user bergerak dari “saya bingung” menjadi “saya tahu langkah berikutnya, saya sudah mengerjakannya, dan saya bisa membuktikannya.”</td></tr>
                    <tr><td><strong>Scalability</strong></td><td>Perjalanan individual ini dapat berkembang menjadi infrastructure untuk cohort, institution, content partner, dan recruiter network.</td></tr>
                  </tbody>
                </table>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>The 90-Second Demo Story</h3>
                <div className={styles.timeline}>
                  <div className={styles.timelineItem}><div className={styles.timelinePoint}>1</div><div className={styles.timelineContent}>Semuanya dimulai dari seorang user yang memilih persona <strong>The Dreamer</strong> atau <strong>The Chaser</strong> tanpa form panjang dan tanpa harus mengerti crypto.</div></div>
                  <div className={styles.timelineItem}><div className={styles.timelinePoint}>2</div><div className={styles.timelineContent}>Assessment mengubah kebingungan menjadi arah personal, lalu membuka dashboard RPG sebagai peta perjalanan.</div></div>
                  <div className={styles.timelineItem}><div className={styles.timelinePoint}>3</div><div className={styles.timelineContent}>Di dalam House, user menyelesaikan mission, quiz, dan project. Setiap langkah memberi feedback dan progress yang bisa dilihat.</div></div>
                  <div className={styles.timelineItem}><div className={styles.timelinePoint}>4</div><div className={styles.timelineContent}>Setelah berhasil, wallet berpindah ke BNB Testnet. Frontend membaca harga contract secara live dan user melakukan mint certificate.</div></div>
                  <div className={styles.timelineItem}><div className={styles.timelinePoint}>5</div><div className={styles.timelineContent}>Receipt, event, dan backend confirmation selesai. Yang tersisa bukan hanya layar kemenangan, tetapi <strong>bukti skill yang dapat dibawa ke langkah berikutnya</strong>.</div></div>
                </div>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>What We Need to Prove Next</h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Setelah hackathon, prioritas PathTrick adalah mengganti mock persistence dengan backend produksi, menjalankan pilot dengan cohort nyata, mengukur completion dan retention, menguji willingness-to-pay, serta mengumpulkan feedback dari mentor, sekolah, kampus, dan recruiter. Dengan begitu, demo yang kuat dapat berubah menjadi bukti product-market fit yang dapat dipertanggungjawabkan.
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
