'use client';
/* eslint-disable react/no-unescaped-entities */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Image from 'next/image';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { useTranslation } from '@/hooks/useTranslation';

type DocSection =
  | 'overview'
  | 'background'
  | 'solution'
  | 'flow'
  | 'architecture'
  | 'roles'
  | 'feature_sma'
  | 'feature_mahasiswa'
  | 'ten_houses'
  | 'ai_riasec'
  | 'ai_cv'
  | 'web3_infra'
  | 'smart_contract'
  | 'credential_sbt'
  | 'tech_stack'
  | 'api_integration'
  | 'privacy_security';

const linkStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: 0,
  font: 'inherit',
  fontWeight: 'bold',
  color: '#b45309',
  textDecoration: 'underline',
  cursor: 'pointer',
};

export default function DocsPage() {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const [activeSection, setActiveSection] = useState<DocSection>('overview');

  const goTo = (key: DocSection) => {
    setActiveSection(key);
    window.scrollTo({ top: 0 });
  };

  const handleBack = () => {
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push('/');
    }
  };

  // Penomoran sidebar dihitung otomatis dari urutan array (lihat render di bawah).
  const navItems: { key: DocSection; label: string; group?: string }[] = [
    { key: 'overview', label: t('docsMenu.items.overview'), group: t('docsMenu.group.gettingStarted') },
    { key: 'background', label: t('docsMenu.items.background') },
    { key: 'solution', label: t('docsMenu.items.solution') },
    { key: 'flow', label: t('docsMenu.items.flow'), group: t('docsMenu.group.platformOverview') },
    { key: 'architecture', label: t('docsMenu.items.architecture') },
    { key: 'roles', label: t('docsMenu.items.roles') },
    { key: 'feature_sma', label: t('docsMenu.items.feature_sma'), group: t('docsMenu.group.features') },
    { key: 'feature_mahasiswa', label: t('docsMenu.items.feature_mahasiswa') },
    { key: 'ten_houses', label: t('docsMenu.items.ten_houses') },
    { key: 'ai_riasec', label: t('docsMenu.items.ai_riasec') },
    { key: 'ai_cv', label: t('docsMenu.items.ai_cv') },
    { key: 'web3_infra', label: t('docsMenu.items.web3_infra'), group: t('docsMenu.group.blockchain') },
    { key: 'smart_contract', label: t('docsMenu.items.smart_contract') },
    { key: 'credential_sbt', label: t('docsMenu.items.credential_sbt') },
    { key: 'tech_stack', label: t('docsMenu.items.tech_stack'), group: t('docsMenu.group.techGuide') },
    { key: 'api_integration', label: t('docsMenu.items.api_integration') },
    { key: 'privacy_security', label: t('docsMenu.items.privacy_security') },
  ];

  return (
    <div className={styles.page}>

      {/* Top Nav */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <button onClick={handleBack} className={styles.backBtn}>{t('docsMenu.back')}</button>
          <span className={styles.topBarTitle}>{t('docsMenu.title')}</span>
        </div>
        <div className={styles.topBarRight}>
          <LanguageToggle />
          <div className={styles.topBarLogo}>
            <Image src="/PathTrick.png" alt="PathTrick Logo" width={140} height={35} style={{ objectFit: 'contain' }} />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className={styles.body}>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarTitle}>{t('docsMenu.tableOfContents')}</div>
          {navItems.map((item, i) => (
            <React.Fragment key={item.key}>
              {item.group && i !== 0 && (
                <div className={styles.sidebarGroup}>{item.group}</div>
              )}
              <button
                className={`${styles.sidebarTab} ${activeSection === item.key ? styles.sidebarTabActive : ''}`}
                onClick={() => goTo(item.key)}
              >
                {`${i + 1}. ${item.label}`}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Main Content */}
        <div className={styles.content}>


          {activeSection === 'overview' && (
            <>
              <h2 className={styles.docTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h2_1') }} />
              <div className={styles.separator} />
              <section className={styles.section}>
                <p className={styles.text} style={{ marginBottom: '16px', textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: t('docsContent.p_58') }} />
                <p className={styles.text} style={{ marginBottom: '24px', textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: t('docsContent.p_59') }} />
                <p className={styles.text} style={{ marginBottom: '36px', textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: t('docsContent.p_60') }} />
                <div className={styles.callout} style={{ textAlign: 'justify' }}>
                  <strong>
                    {locale === 'en'
                      ? <>\u201cPathTrick is the bridge from \u2018I don\u2019t know where to start\u2019 to \u2018I know my next step, I\u2019ve done it, and I have proof to show for it.\u2019\u201d</>
                      : <>\u201cPathTrick adalah jembatan dari \u2018Saya tidak tahu harus mulai dari mana\u2019 menjadi \u2018Saya tahu langkah berikutnya, saya sudah mengerjakannya, dan saya punya bukti untuk menunjukkannya.\u2019\u201d</>
                    }
                  </strong>
                </div>
                <p className={styles.text} style={{ marginTop: '24px', textAlign: 'justify' }}>
                  {locale === 'en' ? (
                    <>
                      This story has three chapters. Start at <button type="button" onClick={() => goTo('background')} style={linkStyle}>Background</button> to find out why this path was opened, go to <button type="button" onClick={() => goTo('solution')} style={linkStyle}>Our Solution</button> to see how we answered it, then take a peek at <button type="button" onClick={() => goTo('architecture')} style={linkStyle}>System Architecture</button> to see the engine behind the world.
                    </>
                  ) : (
                    <>
                      Kisah ini punya tiga bab. Mulailah dari <button type="button" onClick={() => goTo('background')} style={linkStyle}>Latar Belakang</button> untuk tahu mengapa jalan ini dibuka, lanjutkan ke <button type="button" onClick={() => goTo('solution')} style={linkStyle}>Solusi Kami</button> untuk melihat bagaimana kami menjawabnya, lalu intip <button type="button" onClick={() => goTo('architecture')} style={linkStyle}>Arsitektur Sistem</button> untuk melihat mesin di balik dunianya.
                    </>
                  )}
                </p>
              </section>
            </>
          )}

          {activeSection === 'background' && (
            <>
              <h2 className={styles.docTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h2_2') }} />
              <div className={styles.separator} />

              <section className={styles.section}>
                <p className={styles.text} style={{ marginBottom: '16px', textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: t('docsContent.bg_1') }} />
                <p className={styles.text} style={{ marginBottom: '16px', textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: t('docsContent.bg_2') }} />
                <p className={styles.text} style={{ marginBottom: '32px', textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: t('docsContent.bg_3') }} />
              </section>
            </>
          )}

          {activeSection === 'solution' && (
            <>
              <h2 className={styles.docTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h2_3') }} />
              <div className={styles.separator} />
              <section className={styles.section}>
                <p className={styles.text} style={{ textAlign: 'justify', marginBottom: '32px' }} dangerouslySetInnerHTML={{ __html: t('docsContent.sol_intro') }} />
                <div className={styles.pathGrid}>
                  {([
                    { id: 'dreamer', name: 'The Dreamer', img: '/NPC High School Student.png', variant: styles.pathCardDreamer },
                    { id: 'chaser', name: 'The Chaser', img: '/NPC University Student.png', variant: styles.pathCardChaser },
                  ] as const).map((path) => (
                    <div key={path.id} id={`solution-path-${path.id}`} className={`${styles.pathCard} ${path.variant}`}>
                      <div className={styles.pathCardHeader}>
                        <Image src={path.img} alt={path.name} width={64} height={64} className={styles.pathAvatar} />
                        <div>
                          <div className={styles.pathName}>{path.name}</div>
                          <div className={styles.pathTag}>{t(`docsContent.sol_${path.id}_tag`)}</div>
                        </div>
                      </div>
                      <ol className={styles.pathSteps}>
                        {[1, 2, 3].map((n) => (
                          <li key={n} className={styles.pathStep}>
                            <span className={styles.pathStepNum}>{n}</span>
                            <div>
                              <div className={styles.pathStepTitle}>{t(`docsContent.sol_${path.id}_s${n}_t`)}</div>
                              <p className={styles.pathStepDesc} dangerouslySetInnerHTML={{ __html: t(`docsContent.sol_${path.id}_s${n}_d`) }} />
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
                <p className={styles.text} style={{ textAlign: 'justify', marginTop: '36px' }} dangerouslySetInnerHTML={{ __html: t('docsContent.sol_closing') }} />
              </section>
            </>
          )}

          {activeSection === 'flow' && (
            <>
              <h2 className={styles.docTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h2_4') }} />
              <div className={styles.separator} />
              <section className={styles.section}>
                <h3 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h3_21') }} />
                <Image src="/user-flow-sma-v2.png" alt="User Flow The Dreamer" width={1024} height={576} className={styles.pixelImage} />
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h3_22') }} />
                <Image src="/docs-flow-mahasiswa-v2.jpg" alt="User Flow The Chaser" width={900} height={394} className={styles.gameImage} />
              </section>
            </>
          )}

          {activeSection === 'architecture' && (
            <>
              <h2 className={styles.docTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h2_5') }} />
              <div className={styles.separator} />
              <section className={styles.section}>
                <h3 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h3_23') }} />
                <Image src="/system-arch.png" alt="System Architecture Diagram" width={1024} height={576} className={styles.pixelImage} />
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h3_24') }} />
                <div className={styles.text} style={{ textAlign: 'justify', marginBottom: '24px' }}>
                  {locale === 'en' ? <>In the world of PathTrick, we combine two technological treasures that work together seamlessly like an adventure shop:</> : <>Dalam dunia PathTrick, kami menggabungkan dua pusaka teknologi yang saling bekerja sama dengan mulus layaknya sebuah kedai petualang:</>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#3e2723', border: '3px solid #5d4037', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                      <Image src="/PrivyLogo.jpeg" alt="Privy" width={48} height={48} style={{ objectFit: 'cover' }} />
                    </div>
                    <div>
                      <h4 style={{ fontFamily: '"Press Start 2P"', fontSize: '0.9rem', color: '#3e2723', marginBottom: '8px', lineHeight: '1.4' }}>
                        {locale === 'en' ? <>Privy (The Receptionist)</> : <>Privy (Sang Resepsionis)</>}
                      </h4>
                      <p className={styles.text} style={{ textAlign: 'justify', fontSize: '1rem', lineHeight: '1.6', margin: 0 }} dangerouslySetInnerHTML={{ __html: t('docsContent.p_66') }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#3e2723', border: '3px solid #5d4037', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', padding: '4px' }}>
                      <Image src="/WagmiLogo.png" alt="Wagmi" width={40} height={40} style={{ objectFit: 'contain' }} />
                    </div>
                    <div>
                      <h4 style={{ fontFamily: '"Press Start 2P"', fontSize: '0.9rem', color: '#3e2723', marginBottom: '8px', lineHeight: '1.4' }}>
                        {locale === 'en' ? <>Wallet Provider + Ethers (The Transaction Courier)</> : <>Wallet Provider + Ethers (Sang Kurir Transaksi)</>}
                      </h4>
                      <p className={styles.text} style={{ textAlign: 'justify', fontSize: '1rem', lineHeight: '1.6', margin: 0 }} dangerouslySetInnerHTML={{ __html: t('docsContent.p_67') }} />
                    </div>
                  </div>

                </div>
              </section>
            </>
          )}

          {activeSection === 'roles' && (
            <>
              <h2 className={styles.docTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h2_6') }} />
              <div className={styles.separator} />
              <p className={styles.text} style={{ textAlign: 'justify', marginBottom: '40px' }}>
                {locale === 'en' ? (
                  <>PathTrick is inhabited by two main characters traversing different stages of their academic and professional journeys. Get to know the personas that bring this platform to life.</>
                ) : (
                  <>PathTrick dihuni oleh dua karakter utama yang sedang menapaki tahap berbeda dalam perjalanan akademik dan profesional mereka. Kenali persona yang menghidupkan platform ini.</>
                )}
              </p>
              <section className={styles.section} style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                <div style={{ flex: 1, maxWidth: '800px' }}>
                  <h3 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h3_25') }} />
                  <p className={styles.text} style={{ textAlign: 'justify', marginBottom: 0 }} dangerouslySetInnerHTML={{ __html: t('docsContent.p_68') }} />
                </div>
                <Image src="/NPC High School Student.png" alt="The Dreamer" width={256} height={256} style={{ imageRendering: 'pixelated', flexShrink: 0, marginTop: '32px' }} />
              </section>
              <section className={styles.section} style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                <div style={{ flex: 1, maxWidth: '800px' }}>
                  <h3 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h3_26') }} />
                  <p className={styles.text} style={{ textAlign: 'justify', marginBottom: 0 }} dangerouslySetInnerHTML={{ __html: t('docsContent.p_69') }} />
                </div>
                <Image src="/NPC University Student.png" alt="The Chaser" width={256} height={256} style={{ imageRendering: 'pixelated', flexShrink: 0, marginTop: '32px' }} />
              </section>
            </>
          )}

          {activeSection === 'feature_sma' && (
            <>
              <h2 className={styles.docTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h2_7') }} />
              <div className={styles.separator} />
              <p className={styles.text} style={{ textAlign: 'justify', marginBottom: '24px' }}>
                {locale === 'en' ? (
                  <>Persona profile is in <button type="button" onClick={() => goTo('roles')} style={linkStyle}>User Roles</button>, usage flow is in <button type="button" onClick={() => goTo('flow')} style={linkStyle}>End-to-End Flow</button>.</>
                ) : (
                  <>Profil persona ada di <button type="button" onClick={() => goTo('roles')} style={linkStyle}>Peran Pengguna</button>, alur penggunaannya di <button type="button" onClick={() => goTo('flow')} style={linkStyle}>Alur End-to-End</button>.</>
                )}
              </p>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h3_27') }} />
                <div className={styles.tableScroll}>
                  <table className={styles.techTable}>
                    <thead>
                      <tr>
                        <th>{locale === 'en' ? 'Feature' : 'Fitur'}</th>
                        <th>{locale === 'en' ? 'Description' : 'Deskripsi'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ whiteSpace: 'nowrap' }}><strong>{locale === 'en' ? <>RIASEC Assessment</> : <>Asesmen RIASEC</>}</strong></td>
                        <td style={{ textAlign: 'justify' }}>{locale === 'en' ? <>Their journey begins here. Casually, they will answer a series of personal questions about hidden interests. Behind the scenes, our AI works hard to weave these answers into a complete profile, then presents recommendations for the most accurate majors and dream campuses to go to.</> : <>Perjalanan mereka dimulai di sini. Dengan santai, mereka akan menjawab serangkaian pertanyaan personal tentang minat terpendam. Di belakang layar, AI kita bekerja keras merajut jawaban tersebut menjadi sebuah profil utuh, lalu menyajikan rekomendasi jurusan dan kampus impian yang paling akurat untuk dituju.</>}</td>
                      </tr>
                      <tr>
                        <td style={{ whiteSpace: 'nowrap' }}><strong>{locale === 'en' ? <>Learning Progress</> : <>Kemajuan Belajar</>}</strong></td>
                        <td style={{ textAlign: 'justify' }}>{locale === 'en' ? <>Through a list of daily quests and epic weekly challenges, The Dreamer can track their readiness indicator (Readiness Meter). This mechanical system is deliberately designed to maintain the fire of enthusiasm for learning so that it never goes out in the middle of an adventure.</> : <>Melalui daftar quest harian dan tantangan mingguan yang epik, The Dreamer dapat melacak indikator kesiapan (Readiness Meter) mereka. Sistem mekanik ini sengaja dirancang untuk menjaga api semangat belajar agar tidak pernah padam di tengah petualangan.</>}</td>
                      </tr>
                      <tr>
                        <td style={{ whiteSpace: 'nowrap' }}><strong>{locale === 'en' ? <>University Center</> : <>Pusat Universitas</>}</strong></td>
                        <td style={{ textAlign: 'justify' }}>{locale === 'en' ? <>A special space for The Dreamer to explore detailed campus and study program information. Here they can map and determine future targets more concretely according to the results of their assessment.</> : <>Ruang khusus bagi The Dreamer untuk mengeksplorasi informasi detail kampus dan program studi. Di sini mereka bisa memetakan dan menentukan target masa depan dengan lebih konkret sesuai dengan hasil asesmen mereka.</>}</td>
                      </tr>
                      <tr>
                        <td style={{ whiteSpace: 'nowrap' }}><strong>{locale === 'en' ? <>Scholarship Center</> : <>Pusat Beasiswa</>}</strong></td>
                        <td style={{ textAlign: 'justify' }}>{locale === 'en' ? <>No dream should be extinguished just because of cost. The system actively matches adventurers' profiles with a sea of ​​scholarship databases in real-time, turning them from Scholarship Hunters into Awardee Material.</> : <>Tidak ada mimpi yang boleh padam hanya karena biaya. Sistem ini secara aktif mencocokkan profil sang petualang dengan lautan database beasiswa secara real-time, mengubah mereka dari Scholarship Hunter menjadi Awardee Material.</>}</td>
                      </tr>
                      <tr>
                        <td style={{ whiteSpace: 'nowrap' }}><strong>{locale === 'en' ? <>Relics & Treasures</> : <>Relik & Harta Karun</>}</strong></td>
                        <td style={{ textAlign: 'justify' }}>{locale === 'en' ? <>A treasure room to store every certificate or on-chain achievement you have earned. This is proof of their concrete steps in preparing for the future.</> : <>Sebuah ruang harta karun untuk menyimpan setiap sertifikat atau pencapaian on-chain yang berhasil didapatkan. Ini menjadi bukti langkah-langkah nyata mereka dalam mempersiapkan masa depan.</>}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {activeSection === 'feature_mahasiswa' && (
            <>
              <h2 className={styles.docTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h2_8') }} />
              <div className={styles.separator} />
              <p className={styles.text} style={{ textAlign: 'justify', marginBottom: '24px' }}>
                {locale === 'en' ? (
                  <>Persona profile is in <button type="button" onClick={() => goTo('roles')} style={linkStyle}>User Roles</button>, usage flow is in <button type="button" onClick={() => goTo('flow')} style={linkStyle}>End-to-End Flow</button>.</>
                ) : (
                  <>Profil persona ada di <button type="button" onClick={() => goTo('roles')} style={linkStyle}>Peran Pengguna</button>, alur penggunaannya di <button type="button" onClick={() => goTo('flow')} style={linkStyle}>Alur End-to-End</button>.</>
                )}
              </p>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h3_28') }} />
                <div className={styles.tableScroll}>
                  <table className={styles.techTable}>
                    <thead>
                      <tr>
                        <th>{locale === 'en' ? 'Feature' : 'Fitur'}</th>
                        <th>{locale === 'en' ? 'Description' : 'Deskripsi'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ whiteSpace: 'nowrap' }}><strong>{locale === 'en' ? <>AI Skill Gap Analysis</> : <>Analisis Skill Gap AI</>}</strong></td>
                        <td style={{ textAlign: 'justify' }}>{locale === 'en' ? <>Their battle started with a CV. Once uploaded, our intelligent AI system will dissect the CV layer by layer, discover the gaps between their current capabilities and the harsh industry standards, and create a precise roadmap to catch up.</> : <>Pertempuran mereka dimulai dengan selembar CV. Begitu diunggah, sistem AI cerdas kita akan membedah CV tersebut lapis demi lapis, menemukan jurang kesenjangan antara kemampuan mereka saat ini dengan kejamnya standar industri, dan menyusun peta jalan presisi untuk mengejar ketertinggalan.</>}</td>
                      </tr>
                      <tr>
                        <td style={{ whiteSpace: 'nowrap' }}><strong>{locale === 'en' ? <>Career Center</> : <>Pusat Karir</>}</strong></td>
                        <td style={{ textAlign: 'justify' }}>{locale === 'en' ? <>This is their main command center. A centralized dashboard that proudly displays their Career Score, accurately tracks learning progress on each competency, and displays a sparkling collection of token certificates they've won.</> : <>Ini adalah pusat komando utama mereka. Sebuah dashboard terpusat yang dengan bangga memamerkan Career Score mereka, melacak secara akurat progres belajar pada setiap kompetensi, dan memajang gemerlap koleksi token sertifikat yang telah mereka menangkan.</>}</td>
                      </tr>
                      <tr>
                        <td style={{ whiteSpace: 'nowrap' }}><strong>{locale === 'en' ? <>Learning Mission</> : <>Misi Belajar</>}</strong></td>
                        <td style={{ textAlign: 'justify' }}>{locale === 'en' ? <>Leaving the world of fairy tales, they enter a high-level learning mission completely adapted from the syllabus of the real industrial world. Each mission is tactically designed to close skill gaps that have previously been detected by our artificial intelligence.</> : <>Meninggalkan dunia dongeng, mereka memasuki misi belajar tingkat tinggi yang sepenuhnya diadaptasi dari silabus dunia industri sungguhan. Setiap misi dirancang secara taktis untuk menutup celah gap skill yang sebelumnya telah diendus oleh kecerdasan buatan kita.</>}</td>
                      </tr>
                      <tr>
                        <td style={{ whiteSpace: 'nowrap' }}><strong>{locale === 'en' ? <>Skill Badges</> : <>Lencana Skill</>}</strong></td>
                        <td style={{ textAlign: 'justify' }}>{locale === 'en' ? <>This is the adventurer's proud gallery space. A place to display Skill Badges and valuable certificates that have been achieved. These achievements can at any time be shared as a public link to recruiters to prove directly over the blockchain network that their abilities are real.</> : <>Inilah ruang galeri kebanggaan sang petualang. Sebuah tempat memajang Skill Badges dan sertifikat berharga yang telah diraih. Pencapaian ini kapan saja bisa dibagikan sebagai tautan publik kepada rekruter untuk membuktikan langsung di atas jaringan blockchain bahwa kemampuan mereka adalah nyata.</>}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {activeSection === 'ten_houses' && (
            <>
              <h2 className={styles.docTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h2_9') }} />
              <div className={styles.separator} />
              <section className={styles.section}>
                <p className={styles.text} style={{ textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: t('docsContent.p_72') }} />
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h3_30') }} />
                <div className={styles.featureGrid}>
                  <div className={styles.featureCardBoxed}>
                    <div className={styles.cardHeader}><div className={styles.cardTitle}>Education</div></div>
                    <div className={styles.cardText}>{locale === 'en' ? <>Science of education and teacher training. This world forges adventurers into future educators who understand modern teaching methods.</> : <>Ilmu pendidikan dan pelatihan keguruan. World ini menempa petualang menjadi pendidik masa depan yang memahami metode pengajaran modern.</>}</div>
                  </div>
                  <div className={styles.featureCardBoxed}>
                    <div className={styles.cardHeader}><div className={styles.cardTitle}>Arts & Humanities</div></div>
                    <div className={styles.cardText}>{locale === 'en' ? <>Arts and humanities, including languages, history, philosophy, and fine arts. A place to forge creativity and cultural understanding.</> : <>Seni dan humaniora, termasuk bahasa, sejarah, filsafat, dan seni rupa. Tempat menempa kreativitas dan pemahaman budaya.</>}</div>
                  </div>
                  <div className={styles.featureCardBoxed}>
                    <div className={styles.cardHeader}><div className={styles.cardTitle}>Social Sciences & Journalism</div></div>
                    <div className={styles.cardText}>{locale === 'en' ? <>Social sciences, journalism, information and libraries. World for those who want to understand and shape society.</> : <>Ilmu sosial, jurnalistik, informasi, dan perpustakaan. World bagi mereka yang ingin memahami dan membentuk masyarakat.</>}</div>
                  </div>
                  <div className={styles.featureCardBoxed}>
                    <div className={styles.cardHeader}><div className={styles.cardTitle}>Business, Admin & Law</div></div>
                    <div className={styles.cardText}>{locale === 'en' ? <>Business, administration, management, and law. Arena for potential leaders and economic drivers.</> : <>Bisnis, administrasi, manajemen, dan hukum. Arena bagi calon pemimpin dan penggerak ekonomi.</>}</div>
                  </div>
                  <div className={styles.featureCardBoxed}>
                    <div className={styles.cardHeader}><div className={styles.cardTitle}>Natural Sciences & Math</div></div>
                    <div className={styles.cardText}>{locale === 'en' ? <>Natural sciences, mathematics and statistics. A solid scientific foundation for innovation and research.</> : <>Ilmu pengetahuan alam, matematika, dan statistika. Fondasi sains yang kokoh untuk inovasi dan riset.</>}</div>
                  </div>
                  <div className={styles.featureCardBoxed}>
                    <div className={styles.cardHeader}><div className={styles.cardTitle}>ICT</div></div>
                    <div className={styles.cardText}>{locale === 'en' ? <>Information and communication technology. A digital world where adventurers master the technological weapons of the future.</> : <>Teknologi Informasi dan Komunikasi. World digital tempat petualang menguasai senjata teknologi masa depan.</>}</div>
                  </div>
                  <div className={styles.featureCardBoxed}>
                    <div className={styles.cardHeader}><div className={styles.cardTitle}>Engineering & Construction</div></div>
                    <div className={styles.cardText}>{locale === 'en' ? <>Engineering, manufacturing, and construction. A workshop where building the physical world from blueprint to reality.</> : <>Teknik, manufaktur, dan konstruksi. Bengkel tempat membangun dunia fisik dari blueprint menjadi kenyataan.</>}</div>
                  </div>
                  <div className={styles.featureCardBoxed}>
                    <div className={styles.cardHeader}><div className={styles.cardTitle}>Agriculture & Veterinary</div></div>
                    <div className={styles.cardText}>{locale === 'en' ? <>Agriculture, forestry, fisheries and veterinary medicine. World for protecting the earth and food security.</> : <>Pertanian, kehutanan, perikanan, dan kedokteran hewan. World bagi penjaga bumi dan ketahanan pangan.</>}</div>
                  </div>
                  <div className={styles.featureCardBoxed}>
                    <div className={styles.cardHeader}><div className={styles.cardTitle}>Health & Welfare</div></div>
                    <div className={styles.cardText}>{locale === 'en' ? <>Health and social welfare, including medicine and nursing. A place to forge health heroes.</> : <>Kesehatan dan kesejahteraan sosial, termasuk kedokteran dan keperawatan. Tempat menempa pahlawan kesehatan.</>}</div>
                  </div>
                  <div className={styles.featureCardBoxed}>
                    <div className={styles.cardHeader}><div className={styles.cardTitle}>Services</div></div>
                    <div className={styles.cardText}>{locale === 'en' ? <>Services such as tourism, hospitality, transportation and job security. World connects the world with experience.</> : <>Layanan jasa seperti pariwisata, perhotelan, transportasi, dan keamanan kerja. World penghubung dunia dengan pengalaman.</>}</div>
                  </div>
                </div>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h3_31') }} />
                <div className={styles.timeline}>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>1</div>
                    <div className={styles.timelineContent}>
                      <strong>{locale === 'en' ? <>Reading the Theory Scrolls:</> : <>Membaca Gulungan Teori:</>}</strong>{' '}
                      {locale === 'en'
                        ? <>Every adventure in each world begins by studying the narrative material. We use simple real-world analogies so that even technical concepts can be easily digested by beginners.</>
                        : <>Petualangan di setiap world selalu dimulai dengan mempelajari materi naratif. Kami menggunakan analogi sederhana dunia nyata agar konsep teknis sekalipun mudah dicerna oleh para pemula.</>
                      }
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>2</div>
                    <div className={styles.timelineContent}>
                      <strong>{locale === 'en' ? <>Quick Comprehension Test:</> : <>Ujian Pemahaman Cepat:</>}</strong>{' '}
                      {locale === 'en'
                        ? <>A short quiz will appear automatically. If you miss a question, the world guardian will kindly guide you back to the reading room before letting you try again.</>
                        : <>Sebuah kuis singkat akan muncul secara otomatis. Jika tebakan Anda meleset, penjaga world akan ramah mengarahkan Anda kembali ke ruang baca sebelum mengizinkan Anda mencoba lagi.</>
                      }
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>3</div>
                    <div className={styles.timelineContent}>
                      <strong>{locale === 'en' ? <>Forging Weapons in the Lab:</> : <>Menempa Senjata di Lab:</>}</strong> {locale === 'en' ? <>Using a smart code editor integrated with the browser, you can immediately experiment typing code and see the results appear instantly before your eyes.</> : <>Menggunakan editor kode pintar yang menyatu dengan browser, Anda bisa langsung bereksperimen mengetik kode dan melihat hasilnya muncul seketika di depan mata.</>}
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>4</div>
                    <div className={styles.timelineContent}>
                      <strong>{locale === 'en' ? <>Boss Battle:</> : <>Pertarungan Melawan Boss:</>}</strong>{' '}
                      {locale === 'en'
                        ? <>This is the final exam. Your mini project will be strictly evaluated by the AI referee (Agent 3 – Essay Evaluator). If you achieve a passing score, the system will immediately place a permanent medal (SBT) into your wallet.</>
                        : <>Ini adalah ujian akhir. Mini project Anda akan dievaluasi dengan ketat oleh wasit AI (Agent 3 – Essay Evaluator). Jika berhasil meraih skor kelulusan, sistem akan langsung menempakan medali abadi (SBT) ke dalam dompet Anda.</>
                      }
                    </div>
                  </div>
                </div>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h3_32') }} />
                <p className={styles.text} style={{ textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: t('docsContent.p_73') }} />
              </section>
            </>
          )}

          {activeSection === 'ai_riasec' && (
            <>
              <h2 className={styles.docTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h2_10') }} />
              <div className={styles.separator} />

              <section className={styles.section}>
                <h3 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h3_33') }} />
                <p className={styles.text} style={{ textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: t('docsContent.p_74') }} />
              </section>

              <section className={styles.section}>
                <h3 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h3_34') }} />
                <div className={styles.timeline}>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>1</div>
                    <div className={styles.timelineContent}>
                      <strong>{locale === 'en' ? <>Trace Collection:</> : <>Pengumpulan Jejak:</>}</strong> {locale === 'en' ? <>Users will not feel like they are being tested. They were only invited to answer dozens of casual scenarios that teased their daily activity preferences, not to test their intelligence. Here, there are absolutely no wrong answers.</> : <>Pengguna tidak akan merasa sedang diuji. Mereka hanya diajak menjawab puluhan skenario santai yang memancing preferensi aktivitas sehari-hari, bukan menguji kecerdasan mereka. Di sini, murni tidak ada jawaban yang salah.</>}
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>2</div>
                    <div className={styles.timelineContent}>
                      <strong>{locale === 'en' ? <>Automatic Grading Machine:</> : <>Mesin Penilai Otomatis:</>}</strong> {locale === 'en' ? <>In the depths of the system, each answer is weighed with precision. The AI ​​acts like an alchemist who accumulates scores and produces unique Holland Code crystals, displaying the adventurer's three most dominant personalities.</> : <>Di kedalaman sistem, setiap jawaban ditimbang secara presisi. AI bertindak layaknya alkemis yang mengakumulasi skor dan menghasilkan kristal Holland Code unik, menampilkan tiga kepribadian paling dominan dalam diri sang petualang.</>}
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>3</div>
                    <div className={styles.timelineContent}>
                      <strong>{locale === 'en' ? <>AI Potion Synthesis:</> : <>Sintesis Ramuan AI:</>}</strong> {locale === 'en' ? <>The code is then combined with the user's personal dreams, such as their target city or scholarship needs. This concoction is sent to the big brain of the AI ​​Language Model which will reply with ideas in the form of a list of the most suitable majors, campuses and scholarships.</> : <>Kode tersebut lalu diramu bersama dengan impian personal pengguna, seperti kota incaran atau kebutuhan beasiswa. Ramuan ini dikirim ke dalam otak besar AI Language Model yang akan membalasnya dengan wangsit berupa daftar jurusan, kampus, dan beasiswa paling cocok.</>}
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>4</div>
                    <div className={styles.timelineContent}>
                      <strong>{locale === 'en' ? <>Roadmap Creation:</> : <>Penciptaan Peta Jalan:</>}</strong> {locale === 'en' ? <>The idea from AI was not left in the form of rigid text. Our system quickly turns this into an interactive roadmap structure in the Dashboard, determining which <strong>Houses (Learning Path)</strong> are the most suitable and should be conquered first.</> : <>Wangsit dari AI tadi tidak dibiarkan berbentuk teks kaku. Sistem kita dengan cepat menyulapnya menjadi sebuah struktur peta jalan interaktif di Dashboard, menentukan <strong>Houses (Learning Path)</strong> mana saja yang paling cocok dan harus pertama kali mereka taklukkan.</>}
                    </div>
                  </div>
                </div>
              </section>

              <section className={styles.section}>
                <h3 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h3_35') }} />
                <p className={styles.text} style={{ textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: t('docsContent.p_75') }} />
              </section>

              <section className={styles.section}>
                <h3 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h3_36') }} />
                <p className={styles.text} style={{ textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: t('docsContent.p_76') }} />
              </section>
            </>
          )}

          {activeSection === 'ai_cv' && (
            <>
              <h2 className={styles.docTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h2_11') }} />
              <div className={styles.separator} />
              <section className={styles.section}>
                <h3 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h3_37') }} />
                <p className={styles.text} style={{ textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: t('docsContent.p_77') }} />
              </section>

              <section className={styles.section}>
                <h3 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h3_38') }} />
                <div className={styles.timeline}>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>1</div>
                    <div className={styles.timelineContent}>
                      <strong>{locale === 'en' ? <>Document Submission:</> : <>Penyerahan Dokumen:</>}</strong> {locale === 'en' ? <>When a user submits their rolled CV (either as a PDF or a plain text document), the behind-the-scenes system immediately extracts the entire written text without destroying the meaning within.</> : <>Saat pengguna menyerahkan gulungan CV mereka (baik dalam bentuk PDF maupun teks dokumen biasa), sistem di belakang layar segera mengekstrak seluruh teks yang tertulis tanpa merusak makna di dalamnya.</>}
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>2</div>
                    <div className={styles.timelineContent}>
                      <strong>{locale === 'en' ? <>AI Eagle Eye:</> : <>Mata Elang AI:</>}</strong>{' '}
                      {locale === 'en'
                        ? <>The AI then casts a Named Entity Recognition spell, combing through every word to find hidden treasures: from hard skills and programming languages to a long history of internships and past certifications.</>
                        : <>AI lalu merapal mantra Named Entity Recognition, menyisir setiap kata untuk menemukan harta karun tersembunyi: dari mulai barisan hard skill, bahasa pemrograman, hingga riwayat panjang magang dan sertifikasi masa lalu.</>
                      }
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>3</div>
                    <div className={styles.timelineContent}>
                      <strong>{locale === 'en' ? <>Industry Standard Exams:</> : <>Ujian Standar Industri:</>}</strong> {locale === 'en' ? <>The results of these findings were not left alone. Our AI will immediately collide with the thick wall of industry expectations (Skill Matrix). From this clash, a very transparent and honest career readiness score was born.</> : <>Hasil temuan tersebut tidak dibiarkan begitu saja. AI kita akan langsung menabrakkannya dengan dinding tebal ekspektasi industri (Skill Matrix). Dari benturan ini, lahirlah sebuah nilai skor kesiapan karir yang sangat transparan dan jujur.</>}
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>4</div>
                    <div className={styles.timelineContent}>
                      <strong>{locale === 'en' ? <>Weak Point Search:</> : <>Pencarian Titik Lemah:</>}</strong> {locale === 'en' ? <>AI not only criticizes, but also looks for where the most crucial weaknesses lie. The system identifies existing gaps in ability, then develops a priority strategy: which skills must be mastered tonight so that recruiters can see them tomorrow morning.</> : <>AI tidak hanya mengkritik, tetapi juga mencari di mana letak kelemahan paling krusial. Sistem mengidentifikasi jurang kemampuan (gap) yang ada, lalu menyusun strategi prioritas: mana skill yang harus dikuasai malam ini juga agar bisa dilirik rekruter besok pagi.</>}
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>5</div>
                    <div className={styles.timelineContent}>
                      <strong>{locale === 'en' ? <>Forging a New Curriculum:</> : <>Penempaan Kurikulum Baru:</>}</strong> {locale === 'en' ? <>The results of these weaknesses were finally forged into a sequence of advanced Learning Missions. As a result, users no longer need to fumble around in the dark. They know exactly what skills to conquer next.</> : <>Hasil temuan kelemahan itu akhirnya ditempa menjadi sebuah urutan Misi Belajar (Learning Mission) tingkat lanjut. Alhasil, pengguna tidak perlu lagi meraba-raba dalam gelap. Mereka tahu persis skill apa yang harus ditaklukkan selanjutnya.</>}
                    </div>
                  </div>
                </div>
              </section>

              <section className={styles.section}>
                <h3 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h3_39') }} />
                <div className={styles.featureGrid}>
                  <div className={styles.featureCardBoxed}>
                    <div className={styles.cardHeader}>
                      <div className={`${styles.cardIcon} ${styles.cardIconBlue}`}>1</div>
                      <div className={styles.cardTitle}>{locale === 'en' ? <>Career Score</> : <>Skor Karir</>}</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      {locale === 'en' ? <>A report card (or slap in the face) that displays your career readiness percentage in various challenging domains in the real world.</> : <>Sebuah rapot kebanggaan (atau tamparan keras) yang menampilkan persentase kesiapan karir Anda pada berbagai domain menantang di dunia nyata.</>}
                    </div>
                  </div>
                  <div className={styles.featureCardBoxed}>
                    <div className={styles.cardHeader}>
                      <div className={`${styles.cardIcon} ${styles.cardIconGreen}`}>2</div>
                      <div className={styles.cardTitle}>{locale === 'en' ? <>Skill Inventory</> : <>Inventaris Skill</>}</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      {locale === 'en' ? <>A complete inventory is like a list of your weapons, showing what abilities are detected along with an estimate of their mastery strength.</> : <>Inventaris lengkap layaknya daftar senjata Anda, memperlihatkan kemampuan apa saja yang terdeteksi beserta estimasi kekuatan penguasaannya.</>}
                    </div>
                  </div>
                  <div className={styles.featureCardBoxed}>
                    <div className={styles.cardHeader}>
                      <div className={`${styles.cardIcon} ${styles.cardIconOrange}`}>3</div>
                      <div className={styles.cardTitle}>{locale === 'en' ? <>Skill Gap Report</> : <>Laporan Skill Gap</>}</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      {locale === 'en' ? <>This is a red list. A summary of critical weaknesses that have been the reason why your CV has never been called for an interview.</> : <>Ini adalah daftar merah. Sebuah rangkuman kelemahan kritis yang selama ini menjadi alasan mengapa CV Anda belum pernah dipanggil wawancara.</>}
                    </div>
                  </div>
                  <div className={styles.featureCardBoxed}>
                    <div className={styles.cardHeader}>
                      <div className={styles.cardIcon}>4</div>
                      <div className={styles.cardTitle}>{locale === 'en' ? <>Job Suitability</> : <>Kecocokan Kerja</>}</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      {locale === 'en' ? <>Accurate predictions like a crystal ball, recommending the top three job seats that currently best align with your CV strength percentage.</> : <>Prediksi akurat layaknya bola kristal, merekomendasikan tiga kursi pekerjaan teratas yang saat ini paling selaras dengan persentase kekuatan CV Anda.</>}
                    </div>
                  </div>
                  <div className={styles.featureCardBoxed}>
                    <div className={styles.cardHeader}>
                      <div className={`${styles.cardIcon} ${styles.cardIconBlue}`}>5</div>
                      <div className={styles.cardTitle}>{locale === 'en' ? <>Learning Roadmap</> : <>Peta Jalan Belajar</>}</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      {locale === 'en' ? <>The next battle tactics scroll. Directs you through a sequence of learning missions specifically designed to eliminate each of these weaknesses.</> : <>Gulungan taktik pertempuran selanjutnya. Mengarahkan Anda pada urutan misi belajar yang dirancang khusus untuk memusnahkan setiap kelemahan tadi.</>}
                    </div>
                  </div>
                </div>
              </section>

              <section className={styles.section}>
                <h3 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h3_40') }} />
                <p className={styles.text} style={{ textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: t('docsContent.p_78') }} />
                <p className={styles.text} style={{ marginTop: '16px', textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: t('docsContent.p_79') }} />
              </section>
            </>
          )}

          {activeSection === 'web3_infra' && (
            <>
              <h2 className={styles.docTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h2_12') }} />
              <div className={styles.separator} />
              <section className={styles.section}>
                <h3 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h3_41') }} />
                <div className={styles.callout} style={{ textAlign: 'justify' }}>
                  "Pengguna menikmati seluruh keajaiban Web3 tanpa perlu pusing menyadari bahwa mereka sedang berinteraksi dengan teknologi blockchain."
                </div>
                <p className={styles.text} style={{ marginTop: '16px', textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: t('docsContent.p_80') }} />
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h3_42') }} />
                <div className={styles.featureGrid}>
                  <div className={styles.featureCardBoxed}>
                    <div className={styles.cardHeader}>
                      <Image src="/PrivyLogo.jpeg" alt="Privy" width={32} height={32} style={{ borderRadius: '6px', marginRight: '12px' }} />
                      <div className={styles.cardTitle}>{locale === 'en' ? <>Wallet Layer</> : <>Lapisan Dompet</>}</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Alih-alih memaksa pengguna menghafal kata sandi rumit atau menginstal dompet digital terpisah, kami menggunakan <strong>Privy</strong>. Pengguna cukup masuk dengan <strong>akun Google</strong> mereka, semudah bermain media sosial biasa.
                    </div>
                  </div>
                  <div className={styles.featureCardBoxed}>
                    <div className={styles.cardHeader}>
                      <Image src="/BNBSmartChainLogo.png" alt="BNB Chain" width={32} height={32} style={{ borderRadius: '6px', marginRight: '12px', objectFit: 'contain' }} />
                      <div className={styles.cardTitle}>{locale === 'en' ? <>Blockchain</> : <>Blockchain</>}</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      {locale === 'en' ? <>We chose the <strong>BNB Chain</strong> network because of its very friendly <strong>transaction fees</strong> and its huge ecosystem in Southeast Asia. This makes it the perfect foundation for our educational world.</> : <>Kami memilih jaringan <strong>BNB Chain</strong> karena <strong>biaya transaksi</strong> yang sangat bersahabat dan ekosistemnya yang begitu besar di Asia Tenggara. Ini menjadikannya fondasi yang sempurna untuk dunia edukasi kita.</>}
                    </div>
                  </div>
                  <div className={styles.featureCardBoxed}>
                    <div className={styles.cardHeader}>
                      <Image src="/sbt_logo.jpg" alt="Soulbound Token" width={32} height={32} style={{ borderRadius: '6px', marginRight: '12px', objectFit: 'contain' }} />
                      <div className={styles.cardTitle}>{locale === 'en' ? <>Standard Tokens</> : <>Token Standard</>}</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      {locale === 'en' ? <>Your digital certificate of completion is printed as a <strong>Soulbound Token (SBT)</strong>. It is a permanent proof of achievement that binds the character's soul<strong>to</strong>ment. Once issued, this certificate can never be transferred or sold to anyone else.</> : <>Sertifikat digital kelulusan Anda dicetak sebagai <strong>Soulbound Token (SBT)</strong>. Ini adalah bukti pencapaian permanen yang <strong>mengikat jiwa</strong> karakternya. Sekali diterbitkan, sertifikat ini tidak akan pernah bisa <strong>dipindahtangankan</strong> atau dijual ke orang lain.</>}
                    </div>
                  </div>
                  <div className={styles.featureCardBoxed}>
                    <div className={styles.cardHeader}>
                      <Image src="/gas_fee_logo.jpg" alt="Gas Fee" width={32} height={32} style={{ borderRadius: '6px', marginRight: '12px', objectFit: 'contain' }} />
                      <div className={styles.cardTitle}>{locale === 'en' ? <>Gas Cost Model</> : <>Model Biaya Gas</>}</div>
                    </div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      {locale === 'en' ? <>Certificate printing uses the <strong>User-Paid & Backend Authorized</strong> system. Users bear the <strong>mint price</strong> and a small <strong>gas fee</strong> independently. Before the transaction is sent, the backend checks for course completion and then issues a <strong>limited-life signature</strong>. AI assists the evaluation process, while cryptographic authorization remains created by a backend signer that is never exposed to the frontend.</> : <>Pencetakan sertifikat mengusung sistem <strong>User-Paid & Backend Authorized</strong>. Pengguna menanggung <strong>mint price</strong> dan sedikit <strong>biaya gas</strong> secara mandiri. Sebelum transaksi dikirim, backend memeriksa kelulusan course lalu menerbitkan <strong>signature berumur terbatas</strong>. AI membantu proses evaluasi, sedangkan otorisasi kriptografi tetap dibuat oleh signer backend yang tidak pernah terekspos ke frontend.</>}
                    </div>
                  </div>
                </div>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h3_43') }} />
                <div className={styles.featureGrid}>
                  <div className={styles.featureCardBoxed} style={{ padding: '20px' }}>
                    <div className={styles.cardTitle} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}><Image src="/Coin.png" alt="" width={28} height={28} className={styles.cardInlineIcon} /> {locale === 'en' ? <>Low Cost</> : <>Biaya Rendah</>}</div>
                    <div className={styles.cardText} style={{ fontSize: '0.95rem', textAlign: 'justify' }}>{locale === 'en' ? <>This is an ideal option for printing millions of future student certificates without burdening them with exorbitant gas fees.</> : <>Ini adalah pilihan yang sangat ideal untuk mencetak jutaan <strong>sertifikat pelajar</strong> masa depan tanpa perlu membebani mereka dengan <strong>biaya gas</strong> yang mencekik.</>}</div>
                  </div>
                  <div className={styles.featureCardBoxed} style={{ padding: '20px' }}>
                    <div className={styles.cardTitle} style={{ marginBottom: '8px' }}>{locale === 'en' ? <>EVM Compatible</> : <>EVM Compatible</>}</div>
                    <div className={styles.cardText} style={{ fontSize: '0.95rem', textAlign: 'justify' }}>{locale === 'en' ? <>This world is built on a mature <strong>smart contract</strong> foundation, <strong>super secure</strong>, and adheres to standard standards so it is very <strong>transparent</strong> to be audited by anyone.</> : <>Dunia ini dibangun di atas fondasi <strong>kontrak pintar</strong> yang matang, <strong>super aman</strong>, dan mengikuti standar baku sehingga sangat <strong>transparan</strong> untuk diaudit oleh siapapun.</>}</div>
                  </div>
                  <div className={styles.featureCardBoxed} style={{ padding: '20px' }}>
                    <div className={styles.cardTitle} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}><Image src="/globe.svg" alt="" width={28} height={28} className={styles.cardInlineIcon} /> {locale === 'en' ? <>Local Adoption</> : <>Adopsi Lokal</>}</div>
                    <div className={styles.cardText} style={{ fontSize: '0.95rem', textAlign: 'justify' }}>{locale === 'en' ? <>This ecosystem has succeeded in winning the hearts of the local community, making it the most appropriate home with an extraordinarily high adoption rate in the Indonesian market.</> : <>Ekosistem ini sudah berhasil memenangkan hati <strong>komunitas lokal</strong>, menjadikannya rumah yang paling tepat dengan tingkat <strong>adopsi yang luar biasa tinggi</strong> di pasar <strong>Indonesia</strong>.</>}</div>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeSection === 'smart_contract' && (
            <>
              <h2 className={styles.docTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h2_13') }} />
              <div className={styles.separator} />
              <section className={styles.section}>
                <h3 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h3_44') }} />
                <div style={{ background: '#3e2723', padding: '20px', borderRadius: '8px', border: '2px solid #5d4037' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <p style={{ color: '#d7ccc8', fontSize: '0.7rem', marginBottom: '8px', fontFamily: '"Press Start 2P"' }} dangerouslySetInnerHTML={{ __html: t('docsContent.p_81') }} />
                      <p style={{ color: '#ffb300', fontWeight: 'bold' }} dangerouslySetInnerHTML={{ __html: t('docsContent.p_82') }} />
                    </div>
                    <div>
                      <p style={{ color: '#d7ccc8', fontSize: '0.7rem', marginBottom: '8px', fontFamily: '"Press Start 2P"' }} dangerouslySetInnerHTML={{ __html: t('docsContent.p_83') }} />
                      <p style={{ color: '#fff', fontWeight: 'bold' }} dangerouslySetInnerHTML={{ __html: t('docsContent.p_84') }} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <p style={{ color: '#d7ccc8', fontSize: '0.7rem', marginBottom: '8px', fontFamily: '"Press Start 2P"' }} dangerouslySetInnerHTML={{ __html: t('docsContent.p_85') }} />
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
                <h3 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h3_45') }} />
                <div className={styles.timeline}>
                  <div className={styles.timelineItem}>
                    <div className={styles.timelinePoint}>1</div>
                    <div className={styles.timelineContent}>
                      <strong>{locale === 'en' ? <>Course completion:</> : <>Course selesai:</>}</strong> {locale === 'en' ? <>Users complete the course and meet the graduation requirements determined by the system.</> : <>Pengguna menyelesaikan course dan memenuhi syarat kelulusan yang ditentukan sistem.</>}
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
                <h3 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h3_46') }} />
                <div className={styles.featureGrid}>
                  <div className={styles.featureCardBoxed}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}><Image src="/BNBSmartChainLogo.png" alt="" width={28} height={28} className={styles.cardIconImage} /></div><div className={styles.cardTitle}>{locale === 'en' ? <>Network and Contract</> : <>Jaringan dan Contract</>}</div></div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Deployment aktif berada di <strong>BNB Smart Chain Testnet</strong> dengan <strong>Chain ID 97</strong>. Contract certificate menggunakan alamat <code>0x39632892C33435a76043343Ef17Ac03124627ba9</code> dan ABI resmi dari <code>integration/PathtrickSBT.abi.json</code>. Data transaksi dapat diverifikasi melalui BscScan Testnet.
                    </div>
                  </div>
                  <div className={styles.featureCardBoxed}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}><Image src="/Security.png" alt="" width={28} height={28} className={styles.cardIconImage} /></div><div className={styles.cardTitle}>{locale === 'en' ? <>Authorization Flow</> : <>Alur Otorisasi</>}</div></div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Setelah course selesai, frontend meminta authorization ke <code>POST /api/certificates/prepare-mint</code>. Backend mengembalikan <strong>courseId</strong>, <strong>nonce</strong>, <strong>deadline</strong>, dan <strong>signature</strong>. Frontend tidak membuat, mengubah, atau memakai ulang nonce dan deadline secara manual.
                    </div>
                  </div>
                  <div className={styles.featureCardBoxed}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}><Image src="/sbt_logo.jpg" alt="" width={28} height={28} className={styles.cardIconImage} /></div><div className={styles.cardTitle}>{locale === 'en' ? <>On-chain Verification</> : <>Verifikasi On-chain</>}</div></div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Wallet harus berada di Chain ID 97. Frontend membaca <strong>mintPrice()</strong> secara langsung, menghitung kebutuhan saldo bersama gas, lalu memanggil <code>mintCertificate(courseId, deadline, signature)</code>. Setelah receipt tersedia, frontend memeriksa event <strong>CertificateMinted(to, courseId)</strong>.
                    </div>
                  </div>
                  <div className={styles.featureCardBoxed}>
                    <div className={styles.cardHeader}><div className={styles.cardIcon}><Image src="/certificate-template.png" alt="" width={28} height={28} className={styles.cardIconImage} /></div><div className={styles.cardTitle}>{locale === 'en' ? <>Backend Confirmation</> : <>Konfirmasi Backend</>}</div></div>
                    <div className={styles.cardText} style={{ textAlign: 'justify' }}>
                      Certificate belum dianggap selesai hanya karena wallet mengirim transaksi. Setelah receipt dan event valid, frontend mengirim <code>txHash</code> ke <code>POST /api/certificates/confirm-mint</code>. Status sukses baru ditampilkan setelah backend menerima dan memvalidasi transaksi tersebut.
                    </div>
                  </div>
                </div>
              </section>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h3_47') }} />
                <p className={styles.text} style={{ textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: t('docsContent.p_86') }} />
              </section>
            </>
          )}



          {activeSection === 'credential_sbt' && (
            <>
              <h2 className={styles.docTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h2_14') }} />
              <div className={styles.separator} />

              <section className={styles.section}>
                <h3 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h3_48') }} />
                <p className={styles.text} style={{ textAlign: 'justify', marginBottom: '16px' }} dangerouslySetInnerHTML={{ __html: t('docsContent.p_87') }} />
                <p className={styles.text} style={{ textAlign: 'justify', marginBottom: '24px' }} dangerouslySetInnerHTML={{ __html: t('docsContent.p_88') }} />
              </section>

              <section className={styles.section}>
                <h3 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h3_49') }} />
                <p className={styles.text} style={{ textAlign: 'justify', marginBottom: '16px' }}>
                  {locale === 'en' ? (
                    <>As explained in the <button type="button" onClick={() => goTo('background')} style={linkStyle}>Background</button> chapter, one of the biggest problems for fresh graduates and recruiters today is Web2 certificates (PDF/JPG) which are very easy to manipulate with photo editing applications or copied by people who have never taken the course.</>
                  ) : (
                    <>Seperti yang dijelaskan pada bab <button type="button" onClick={() => goTo('background')} style={linkStyle}>Latar Belakang</button>, salah satu masalah terbesar fresh graduate dan rekruter hari ini adalah sertifikat Web2 (PDF/JPG) yang sangat mudah dimanipulasi dengan aplikasi pengedit foto atau disalin oleh orang yang tidak pernah mengikuti kursusnya.</>
                  )}
                </p>
                <p className={styles.text} style={{ textAlign: 'justify', marginBottom: '24px' }} dangerouslySetInnerHTML={{ __html: t('docsContent.p_90') }} />
              </section>

              <section className={styles.section}>
                <h3 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h3_50') }} />
                <p className={styles.text} style={{ textAlign: 'justify', marginBottom: '16px' }} dangerouslySetInnerHTML={{ __html: t('docsContent.p_91') }} />
                <div className={styles.callout} style={{ marginBottom: '16px' }}>
                  <strong>Keamanan EIP-712 Signature</strong><br />
                  {locale === 'en' ? <>Every printing (minting) process must receive approval (Cryptographic Signature) from the PathTrick backend. The Smart Contract will only print tokens if and only if the user is proven to have validly passed the quiz, by matching the sent parameters with the signature. This prevents any user from printing the certificate without the game engine's knowledge.</> : <>Setiap proses pencetakan (minting) harus mendapat restu (Tanda Tangan Kriptografis) dari backend PathTrick. Smart Contract hanya akan mencetak token jika dan hanya jika pengguna terbukti secara sah lulus kuis, dengan menyocokkan kecocokan antara parameter yang dikirim dengan tanda tangan tersebut. Ini mencegah pengguna mana pun mencetak sertifikat tanpa sepengetahuan game engine.</>}
                </div>
                <p className={styles.text} style={{ textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: t('docsContent.p_92') }} />
              </section>
            </>
          )}

          {activeSection === 'tech_stack' && (
            <>
              <h2 className={styles.docTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h2_15') }} />
              <div className={styles.separator} />
              <section className={styles.section}>
                <table className={styles.techTable}>
                  <thead>
                    <tr>
                      <th>Kategori</th>
                      <th>{locale === 'en' ? <>Technology Used</> : <>Teknologi yang Digunakan</>}</th>
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
                      <td>Groq API (Qwen 3.8-27b)  -  3 AI Agents: Dreamer, Chaser, Essay Evaluator</td>
                    </tr>
                    <tr>
                      <td><strong>AI Embedding (RAG)</strong></td>
                      <td>Cohere embed-multilingual-v3.0 (1024 dim)  -  Knowledge Base Retrieval</td>
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

          {activeSection === 'api_integration' && (
            <>
              <h2 className={styles.docTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h2_16') }} />
              <div className={styles.separator} />

              <section className={styles.section}>
                <h3 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h3_51') }} />
                <p className={styles.text} style={{ textAlign: 'justify', marginBottom: '16px' }} dangerouslySetInnerHTML={{ __html: t('docsContent.p_93') }} />
                <div className={styles.codeBlockWrapper} style={{ marginBottom: '24px' }}>
                  <pre className={styles.codeBlock}>
{`POST /api/auth/sync
Headers:
  Authorization: Bearer <privy_access_token>
Body (opsional):
  { "email": "user@example.com", "name": "Budi" }

Response (200 OK):
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": { "name": "DREAMER", "displayName": "The Dreamer" },
    "walletAddress": "0x123..."
  },
  "token": "eyJhb..." // JWT Sesi Aplikasi PathTrick
}`}
                  </pre>
                </div>
                <p className={styles.text} style={{ textAlign: 'justify', marginBottom: '32px' }}>
                  {locale === 'en' ? 'This JWT must be included in all requests to other protected routes (e.g., GET /api/me to fetch profile data upon page reload).' : 'JWT inilah yang kemudian wajib disertakan pada semua request ke rute terproteksi lainnya (misalnya GET /api/me untuk mengambil data profile saat page reload).'}
                </p>
              </section>

              <section className={styles.section}>
                <h3 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h3_52') }} />
                <p className={styles.text} style={{ textAlign: 'justify', marginBottom: '16px' }} dangerouslySetInnerHTML={{ __html: t('docsContent.p_95') }} />
                <div className={styles.codeBlockWrapper} style={{ marginBottom: '32px' }}>
                  <pre className={styles.codeBlock}>
                    {`GET /api/riasec/questions
// (Publik) Mengambil daftar pertanyaan RIASEC tanpa kategori (agar tidak dimanipulasi).

POST /api/assessment
Headers:
  Authorization: Bearer <app_jwt_token>
Body (The Dreamer):
  { "type": "DREAMER_RIASEC", "payload": { "answers": [...] } }
Body (The Chaser):
  { "type": "CHASER_PROFILE", "payload": { "cvText": "...", "skills": [...] } }`}
                  </pre>
                </div>
              </section>

              <section className={styles.section}>
                <h3 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h3_53') }} />
                <p className={styles.text} style={{ textAlign: 'justify', marginBottom: '16px' }}>
                  {locale === 'en' ? (
                    <>Every time an adventurer completes all quizzes in a <strong>House</strong>, the PathTrick backend is ready to issue on-chain credentials in the form of a permanent digital certificate. This flow uses the EIP-712 Signature pattern to verify claim validity.</>
                  ) : (
                    <>Setiap kali seorang petualang menyelesaikan seluruh kuis di suatu <strong>House</strong>, backend PathTrick siap menerbitkan kredensial on-chain berupa sertifikat digital permanen. Alur ini menggunakan pola EIP-712 Signature untuk memverifikasi keabsahan klaim.</>
                  )}
                </p>
                <div className={styles.codeBlockWrapper}>
                  <pre className={styles.codeBlock}>
                    {`Langkah 1: Request Tanda Tangan Backend
POST /api/certificates/prepare-mint
Body: { "courseId": "1" }
Response: { "courseId": "1", "nonce": "...", "deadline": "...", "signature": "0x..." }

Langkah 2: Eksekusi di Frontend
// Frontend memanggil contract.mint(...) dengan signature di atas melalui dompet Privy.

Langkah 3: Konfirmasi Transaksi
POST /api/certificates/confirm-mint
Body: { "courseId": "1", "txHash": "0xabc..." }
// Backend memverifikasi receipt dan event on-chain sebelum mengubah status menjadi MINTED.`}
                  </pre>
                </div>
              </section>
            </>
          )}

          {activeSection === 'privacy_security' && (
            <>
              <h2 className={styles.docTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h2_17') }} />
              <div className={styles.separator} />

              <section className={styles.section}>
                <h3 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h3_54') }} />
                <p className={styles.text} style={{ textAlign: 'justify', marginBottom: '16px' }}>
                  {locale === 'en' ? (
                    'In this battlefield, privacy is the most valuable shield. When you hand over a magical document in PDF or text format (such as a CV), our server library warriors will only extract its contents into temporary memory.'
                  ) : (
                    'Dalam medan perang ini, privasi adalah perisai paling berharga. Saat Anda menyerahkan dokumen sakti berformat PDF atau teks (seperti CV), prajurit library di server kami hanya akan mengekstrak isinya ke dalam memori sementara.'
                  )}
                </p>
                <p className={styles.text} style={{ textAlign: 'justify', marginBottom: '24px' }} dangerouslySetInnerHTML={{ __html: t('docsContent.p_96') }} />
              </section>

              <section className={styles.section}>
                <h3 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h3_55') }} />
                <p className={styles.text} style={{ textAlign: 'justify', marginBottom: '24px' }} dangerouslySetInnerHTML={{ __html: t('docsContent.p_97') }} />
              </section>

              <section className={styles.section}>
                <h3 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h3_56') }} />
                <p className={styles.text} style={{ textAlign: 'justify', marginBottom: '24px' }} dangerouslySetInnerHTML={{ __html: t('docsContent.p_98') }} />
              </section>

              <section className={styles.section}>
                <h3 className={styles.sectionTitle} dangerouslySetInnerHTML={{ __html: t('docsContent.h3_57') }} />
                <p className={styles.text} style={{ textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: t('docsContent.p_99') }} />
              </section>
            </>
          )}


        </div>
      </div>
    </div>
  );
}
