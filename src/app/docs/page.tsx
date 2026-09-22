'use client';

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
  | 'ai_cv';

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
                  Bayangkan sebuah dunia di mana sistem edukasi dan rekrutmen tidak lagi kaku, membosankan, atau terputus dari kenyataan industri. Selama bertahun-tahun, proses pencarian jati diri bagi para pelajar, baik itu saat mempersiapkan diri masuk universitas maupun langkah awal merintis karir profesional, selalu diwarnai dengan tekanan sosial dan kebingungan. Kami di PathTrick hadir dengan sebuah misi berani: <strong>mengubah narasi usang tersebut</strong>. Kami menolak anggapan bahwa belajar dan mengejar mimpi harus selalu terasa seperti beban berat di pundak Anda.
                </p>
                <p className={styles.text} style={{ marginBottom: '36px', textAlign: 'justify' }}>
                  Untuk mewujudkannya, kami merombak total pengalaman edukasi tradisional dan mengemas seluruh perjalanan pembelajaran Anda dalam balutan mekanik permainan <strong>RPG Pixel-Art Klasik</strong>. Di dunia PathTrick, Anda bukanlah sekadar murid yang duduk pasif di kelas atau pelamar kerja yang putus asa mengirim CV. Anda adalah seorang <strong>Petualang</strong> sejati. Anda akan bertualang menaklukkan berbagai <strong>"Houses"</strong>, menyelesaikan misi harian yang menantang di <strong>Quest Log</strong>, dan mengalahkan <strong>Boss</strong> ujian untuk membuktikan kelayakan Anda, hingga akhirnya Anda membawa pulang <strong>sertifikat abadi</strong> yang tercatat selamanya di jaringan <strong>blockchain</strong>!
                </p>
                <div className={styles.callout} style={{ textAlign: 'justify' }}>
                  "Kami meracik elemen Game untuk membuat Anda betah berlama-lama belajar, menyuntikkan kecerdasan buatan (AI) untuk memastikan Anda mempelajari hal yang tepat sasaran, dan memanfaatkan Web3 agar Anda bisa membuktikan keahlian tersebut kepada dunia tanpa keraguan sedikit pun."
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
                <p className={styles.text} style={{ textAlign: 'justify' }}>
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
                      Sertifikat digital kelulusan Anda dicetak sebagai <strong>Soulbound Token (SBT)</strong>. Ini adalah bukti pencapaian permanen yang <strong>mengikat jiwa</strong> karakternya; sekali diterbitkan, sertifikat ini tidak akan pernah bisa <strong>dipindahtangankan</strong> atau dijual ke orang lain.
                    </div>
                  </div>
                  <div className={styles.featureCard}>
                    <div className={styles.cardHeader}>
                      <Image src="/gas_fee_logo.jpg" alt="Gas Fee" width={32} height={32} style={{ borderRadius: '6px', marginRight: '12px', objectFit: 'contain' }} />
                      <div className={styles.cardTitle}>Gas Fee Model</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Pencetakan sertifikat mengusung sistem <strong>User-Paid & AI Signed</strong>. Pengguna akan menanggung sedikit <strong>biaya gas</strong> secara mandiri sebagai bentuk <strong>komitmen</strong> atas portofolio mereka. Namun, sertifikat ini hanya bisa dicetak jika pengguna telah mendapatkan <strong>segel persetujuan kriptografi (Signature)</strong> mutlak dari dewan <strong>AI</strong> kami.
                    </div>
                  </div>
                </div>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Arsitektur Koneksi (Privy + Wagmi)</h3>
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
                        Setelah pengguna memiliki dompet dari Privy, Wagmi mengambil alih tugas berat. Kumpulan <strong>React Hooks</strong> canggih ini bertugas mengantarkan instruksi dari layar PathTrick langsung menuju <strong>Smart Contract</strong> di BNB Chain. Mulai dari membaca data sertifikat hingga mengeksekusi pencetakan Soulbound Token.
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
                    <div className={styles.cardTitle} style={{ marginBottom: '8px' }}>⚙️ EVM Compatible</div>
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
                      <p style={{ color: '#ffb300', fontWeight: 'bold' }}>BNB Testnet (BSC Testnet)</p>
                    </div>
                    <div>
                      <p style={{ color: '#d7ccc8', fontSize: '0.7rem', marginBottom: '8px', fontFamily: '"Press Start 2P"' }}>TOKEN TYPE</p>
                      <p style={{ color: '#fff', fontWeight: 'bold' }}>Soulbound Token (Non-transferable BEP-1155)</p>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <p style={{ color: '#d7ccc8', fontSize: '0.7rem', marginBottom: '8px', fontFamily: '"Press Start 2P"' }}>SBT CONTRACT ADDRESS</p>
                      <code style={{ background: '#1d120d', padding: '10px 14px', borderRadius: '4px', color: '#fdfaf6', fontSize: '0.9rem', wordBreak: 'break-all', display: 'block', border: '1px solid #5d4037' }}>
                        0x... (Cek file run-latest.json di repo Smart Contract)
                      </code>
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
                      <strong>Pembuktian Akhir:</strong> Semuanya bermula saat pengguna berhasil menaklukkan tantangan Mini-Project dan diakui kelayakannya oleh wasit kecerdasan buatan kita.
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>2</div>
                    <div className={styles.timelineContent}>
                      <strong>Stempel Persetujuan AI:</strong> Secara diam-diam di balik layar, sistem kita menggunakan otoritas rahasianya (Backend AI) untuk memberikan tanda tangan kriptografi (ECDSA Signature). Ini adalah bukti mutlak tak terbantahkan bahwa sang petualang telah lulus ujian secara sah.
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>3</div>
                    <div className={styles.timelineContent}>
                      <strong>Prosesi Penempaan Mandiri:</strong> Dengan berbekal stempel persetujuan dari AI, pengguna kini bisa memanggil ritual penempaan. Pengguna akan membayar sedikit koin energi (gas fee) dari kantong mereka sendiri untuk mengukir sejarah keberhasilan mereka di atas jaringan blockchain.
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>4</div>
                    <div className={styles.timelineContent}>
                      <strong>Prasasti Abadi:</strong> Pada detik itu juga, mesin kontrak pintar di ekosistem <strong>BNB Testnet</strong> secara resmi mengukir dan mengirimkan sertifikat tersebut langsung ke dalam dompet pengguna untuk selamanya.
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>5</div>
                    <div className={styles.timelineContent}>
                      <strong>Validasi Dunia:</strong> Sang petualang akan disambut dengan sorak sorai notifikasi keberhasilan, lengkap dengan sebuah tautan sakti menuju blok penjelajah. Di sanalah seluruh dunia bisa menjadi saksi nyata atas keaslian prestasi mereka.
                    </div>
                  </div>
                </div>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Kekuatan Soulbound Token</h3>
                <p className={styles.text} style={{ textAlign: 'justify' }}>
                  Medali yang kita berikan ini bukanlah piagam sembarangan. Ia mengemban kekuatan <strong>Soulbound</strong>, yang artinya jiwa sertifikat ini terikat mati dengan sang pemilik dan sama sekali tidak bisa dipindahtangankan, dipinjamkan, apalagi dijual ke orang lain. Begitu diukir, datanya akan terpatri secara permanen di dalam luasnya jaringan blockchain, melindunginya dari segala bentuk manipulasi tangan jahil atau penghapusan paksa. Lebih menakjubkan lagi, rekruter manapun dari ujung dunia bisa melacak dan memvalidasi keaslian medali ini secara instan hanya dengan melihat alamat dompet sang petualang.
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
                      <strong>Penempaan Kurikulum Baru:</strong> Hasil temuan kelemahan itu akhirnya ditempa menjadi sebuah urutan Misi Belajar (Learning Mission) tingkat lanjut. Alhasil, pengguna tidak perlu lagi meraba-raba dalam gelap; mereka tahu persis skill apa yang harus ditaklukkan selanjutnya.
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
                  Yang terpenting, gulungan rahasia (file CV) milik Anda tidak akan pernah kami simpan. Begitu isinya berhasil disalin, file aslinya akan langsung dilebur tak bersisa menjadi debu. Hanya catatan analisis akhirnya yang kami simpan di brankas database. Dan yang lebih menyenangkan lagi, Anda bebas menyerahkan CV baru kapan saja Anda merasa sudah bertambah kuat; AI kami akan dengan senang hati menganalisis ulang semuanya dari awal dan merestorasi peta perjalanan karir Anda detik itu juga.
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
