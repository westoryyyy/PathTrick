'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import styles from './page.module.css';

/* ─── Feature icon cards ─── */
const FEATURE_ICONS = [
  { img: '/ai-career.png?v=3', label: '', noBorder: true },
  { img: '/learning-mission.png?v=3', label: '', noBorder: true },
  { img: '/university-scholar.png?v=3', label: '', noBorder: true },
  { img: '/achievement-vault.png?v=3', label: '', noBorder: true },
];

/* ─── Featured courses ─── */
const COURSES = [
  { img: '/perancangan.png', title: '', titleColor: '#4fc3f7', desc: '' },
  { img: '/ai rendering.png', title: '', titleColor: '#86efac', desc: '' },
  { img: '/web3.png', title: '', titleColor: '#fbbf24', desc: '' },
  { img: '/beasiswa.png', title: '', titleColor: '#fb923c', desc: '' },
];

const HEROES = [
  { avatar: '/npc 1.png', name: 'mondiggie', wallet: '0x4a93800S90868138e...', title: 'High School Student', badgeIcon: '🔥', badgeText: 'Streak Warrior' },
  { avatar: '/npc 2.png', name: 'westoryyy', wallet: '0x3F091A3aFd703830d...', title: 'Officer', badgeIcon: '🎓', badgeText: 'Course Master' },
  { avatar: '/npc 3.png', name: 'oumieeatmadu', wallet: '0x86a988032F3A1F84c...', title: 'AI Engineer', badgeIcon: '🌙', badgeText: 'Night Owl' },
  { avatar: '/npc 4.png', name: 'gravedigger', wallet: '0x71C7888607aB88b09...', title: 'Collage Student', badgeIcon: '🌟', badgeText: 'First Step' },
  { avatar: '/npc 5.png', name: 'PixiePaw', wallet: '0xd8DA68F38864aF9D7...', title: 'High School Student', badgeIcon: '📋', badgeText: 'Mission Completer' },
  { avatar: '/npc 6.png', name: 'Pau', wallet: '0x8B39Ba6a701c668B...', title: 'Collage Student', badgeIcon: '🧠', badgeText: 'Quick Learner' },
];

const STATS = [
  { value: '10.5K', label: 'Active Learners' },
  { value: '40K', label: 'Quests Cleared' },
  { value: '98%', label: 'Satisfaction' },
  { value: '3 Min', label: 'Avg. To Start' },
];

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Docs', href: '/docs' },
];

export default function LandingPage() {
  const { login, ready, authenticated } = usePrivy();
  const router = useRouter();
  const { selectedRole } = useOnboardingStore();
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isScrolled, setIsScrolled] = React.useState(false);

  // After Privy OAuth completes, redirect to /select-role.
  // The select-role page handles returning users (with saved role) → dashboard.
  React.useEffect(() => {
    if (ready && authenticated) {
      router.push('/select-role');
    }
  }, [ready, authenticated, router]);

  const handleStart = () => {
    if (!ready) return;
    if (authenticated) {
      router.push('/select-role');
    } else {
      login();
    }
  };

  React.useEffect(() => {
    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log('Autoplay blocked by browser:', e));
      }
    };
    
    // Coba putar langsung saat halaman dibuka
    playAudio();

    // Fallback: Kalau browser ngeblokir (karena security policy), kita tunggu klik pertama user
    document.addEventListener('click', playAudio, { once: true });
    return () => document.removeEventListener('click', playAudio);
  }, []);

  // Handle scroll for navbar blur effect
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll for anchor links — keeps href intact for accessibility
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className={styles.page}>
      
      {/* ════════ AUDIO BACKGROUND ════════ */}
      <audio ref={audioRef} src="/music%20for%20Landing%20Page.ogg" autoPlay loop preload="auto" />


      {/* ════════ NAVBAR ════════ */}
      <nav className={`${styles.nav} ${isScrolled ? styles.navScrolled : ''}`}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.logo}>
            <Image
              src="/PathTrick.png"
              alt="PathTrick"
              width={200}
              height={50}
              unoptimized
              style={{ objectFit: 'contain', imageRendering: 'pixelated' }}
            />
          </Link>
          <div className={styles.navLinks}>
            {NAV_LINKS.map(l => (
              <Link
                key={l.label}
                href={l.href}
                className={styles.navLink}
                onClick={(e) => handleNavClick(e, l.href)}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className={styles.navRight}>
            <button onClick={handleStart} className={styles.signUpBtn} id="nav-signup-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <Image
                src="/Sign Up.png"
                alt="Sign Up"
                width={120}
                height={36}
                unoptimized
                style={{ objectFit: 'contain', imageRendering: 'pixelated' }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* ════════ HERO — sky + floating island ════════ */}
      <section className={styles.hero}>
        {/* Island foreground */}
        <div className={styles.heroBgImg}>
          <Image src="/Group 295.png?v=2" alt="PathTrick world" fill priority unoptimized
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'right center', imageRendering: 'pixelated' }} />
        </div>
        {/* Gradient so left-side text is readable */}
        <div className={styles.heroGradient} />
        <div className={styles.heroContent}>
          <Image
            src="/Container.png?v=2"
            alt="Discover Your Path, Build Your Future"
            width={700}
            height={320}
            unoptimized
            className={styles.heroTitleFloat}
            style={{ objectFit: 'contain', imageRendering: 'pixelated', maxWidth: '100%', display: 'block', marginTop: '48px' }}
          />
          <button onClick={handleStart} className={styles.ctaImgBtn} id="hero-start-btn" style={{ marginTop: '30px', marginLeft: '-60px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <Image src="/StartLearn.png" alt="Start Learning" width={260} height={78} style={{ objectFit: 'contain', imageRendering: 'pixelated' }} />
          </button>
        </div>

        <div className={styles.scrollHint}>
          <span className={styles.scrollPixel}>Scroll to explore</span>
        </div>
      </section>

      {/* ════════ FEATURE ICON ROW ════════ */}
      <section id="features" className={styles.featureIconSection}>
        <div className={styles.featureIconRow}>
          {FEATURE_ICONS.map((f, i) => (
            <div key={i} className={styles.featureIconCard} id={`feature-${i}`}>
              <div className={f.noBorder ? styles.featureIconNoBorder : styles.featureIconImgWrap}>
                <Image src={f.img} alt={f.label || "Feature"} fill unoptimized style={{ objectFit: f.noBorder ? 'contain' : 'cover', imageRendering: 'pixelated' }} />
              </div>
              {f.label && (
                <span className={styles.featureIconLabel}>
                  {f.label.split('\n').map((line, j) => <span key={j}>{line}<br /></span>)}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ════════ FEATURED COURSES ════════ */}
      <section className={styles.coursesSection}>
        <div className={styles.coursesSectionInner}>
          <div className={styles.coursesSectionHeader}>
            <h2 className={styles.coursesTitle}>FEATURED COURSES</h2>
          </div>
          <div className={styles.courseCards}>
            {COURSES.map((c, i) => {
              const hasText = c.title || c.desc;
              return (
                <div key={i} className={`${styles.courseCard} ${!hasText ? styles.courseCardNoText : ''}`} id={`course-${i}`}>
                  <div className={hasText ? styles.courseCardImg : styles.courseCardImgNoText}>
                    <Image src={c.img} alt={c.title || 'Course'} fill style={{ objectFit: 'contain', imageRendering: 'pixelated' }} />
                  </div>
                  {hasText && (
                    <div className={styles.courseCardBody}>
                      {c.title && <h3 className={styles.courseCardTitle} style={{ color: c.titleColor }}>{c.title}</h3>}
                      {c.desc && <p className={styles.courseCardDesc}>{c.desc}</p>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className={styles.exploreAllWrap}>
            {/* ════════ WALKING GIF (Static) ════════ */}
            <div className={styles.staticGifWrap}>
              <Image 
                src="/Walking_transparent_v2.gif" 
                alt="Walking character" 
                width={80} 
                height={80} 
                unoptimized 
                style={{ imageRendering: 'pixelated' }} 
                className={styles.staticGifImg}
              />
            </div>
            
            <button onClick={handleStart} className={styles.exploreAllBtn} id="explore-all-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <Image src="/CTA.png" alt="Explore all courses" width={240} height={70} style={{ objectFit: 'contain', imageRendering: 'pixelated' }} />
            </button>
          </div>
        </div>
      </section>

      {/* ════════ JOURNEY + WORLD MAP ════════ */}
      <section className={styles.journeySection}>
        <div className={styles.journeySectionInner}>
          <h2 className={styles.journeyTitle}>YOUR JOURNEY TO A FUTURE STARTS HERE</h2>
          <p className={styles.journeyDesc}>
            Jelajahi Career Base kamu, dari Study Desk hingga Innovation Campus.
            Selesaikan Daily Mission dan Weekly Challenge untuk memperluas Skill Tree kamu.
            Setiap langkah yang kamu ambil akan membuka peluang internship atau pekerjaan impianmu melalui AI Career Finder.
          </p>
          <div className={styles.worldMapWrap}>
            <div className={styles.worldMapInner}>
              <Image src="/map1.png" alt="PathTrick world map" fill
                style={{ objectFit: 'cover', imageRendering: 'pixelated' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ════════ GROW UP WITH PATHTRICK ════════ */}
      <section className={styles.growUpSection} id="growup-section">

        {/* Floating background elements */}
        {/* USER: Ganti atribut src="..." di bawah ini dengan gambar Anda */}
        <div className={styles.floatingItem1}>
          <Image src="/Blue Potions 1.png" alt="Blue Potion" width={60} height={80} style={{ imageRendering: 'pixelated', objectFit: 'contain' }} />
        </div>
        <div className={styles.floatingItem2}>
          <Image src="/Red Potion 1.png" alt="Red Potion" width={50} height={70} style={{ imageRendering: 'pixelated', objectFit: 'contain' }} />
        </div>
        <div className={styles.floatingItem3}>
          <Image src="/Hourglass 1.png" alt="Hourglass" width={50} height={70} style={{ imageRendering: 'pixelated', objectFit: 'contain' }} />
        </div>
        <div className={styles.floatingItem4}>
          <Image src="/Essence 1.png" alt="Blue Flame" width={50} height={70} style={{ imageRendering: 'pixelated', objectFit: 'contain' }} />
        </div>


        {/* Text Content */}
        <div className={styles.growUpContent}>
          {/* USER: Edit teks "GROW UP WITH" dan logo di bawah ini */}
          <h2 className={styles.growUpSubtitle}>GROW UP WITH</h2>
          <div className={styles.growUpLogoWrap}>
            <span className={styles.growUpLogoText}>Path<span className={styles.logoAccent}>trick</span></span>
          </div>

          {/* USER: Edit paragraf deskripsi di sini */}
          <p className={styles.growUpDesc}>
            Pathrick hadir untuk mengubah cara kamu merencanakan masa depan. Baik kamu yang masih mencari arah jurusan, sedang menyusun tugas akhir, hingga fresh graduate yang mencari pekerjaan entry-level, sistem AI kami akan memberikan rekomendasi yang presisi. Didukung oleh teknologi blockchain, setiap pencapaianmu akan divalidasi dan tersimpan aman di Achievement Vault.          </p>
        </div>

        {/* Bridge with characters at the bottom */}
        <div className={styles.growUpCharacters}>
          <Image src="/yeay-2-1.png" alt="PathTrick bridge" width={1920} height={500}
            sizes="100vw"
            style={{ width: '100%', height: 'auto', imageRendering: 'pixelated' }} />
        </div>
      </section>

      {/* ════════ HALL OF HEROES ════════ */}
      <section className={styles.hallSection}>
        <div className={styles.hallInner}>
          <h2 className={styles.hallTitle}>
            <span className={styles.hallTitlePrefix}>Wall Of</span><br />
            Hero<span className={styles.hallTitleAccent}>es</span>
          </h2>

          {/* Stats row */}
          <div className={styles.statsRow}>
            {STATS.map((s, i) => (
              <React.Fragment key={i}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>{s.label}</span>
                  <span className={styles.statValue}>{s.value}</span>
                </div>
                {i < STATS.length - 1 && <span className={styles.statDivider}>/</span>}
              </React.Fragment>
            ))}
          </div>

          {/* Hero grid */}
          <div className={styles.heroesGrid}>
            {HEROES.map((hero, i) => (
              <div key={i} className={styles.heroCard}>
                <div className={styles.heroAvatarWrap}>
                  <Image src={hero.avatar} alt={hero.name} fill
                    style={{ objectFit: 'cover', imageRendering: 'pixelated' }} />
                </div>
                <div className={styles.heroInfo}>
                  <h3 className={styles.heroName}>{hero.name}</h3>
                  <p className={styles.heroWallet}>{hero.wallet}</p>
                  <p className={styles.heroTitle}>{hero.title}</p>
                  <div className={styles.heroBadgeRow}>
                    <span className={styles.heroBadgeIcon}>{hero.badgeIcon}</span>
                    <span className={styles.heroBadgeText}>{hero.badgeText}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CTA — THE PORTALS ARE OPEN ════════ */}
      <section className={styles.portalSection}>
        {/* floating pixel items */}
        <div className={styles.portalChest} aria-hidden="true">🪙</div>
        <div className={styles.portalGem} aria-hidden="true">💎</div>

        <div className={styles.portalInner}>
          <p className={styles.portalEyebrow}>Ready to Forge Your Path?</p>
          <h2 className={styles.portalTitle}>
            The portals are <span className={styles.portalOpen}>open</span>
          </h2>
          <p className={styles.portalClaim}>
            <span className={styles.portalClaimAccent}>Claim</span> your achievement today!
          </p>
        </div>
      </section>

      {/* ════════ CHARACTER PARADE ════════ */}
      <section className={styles.paradeSection}>
        {/* Infinite scrolling character strip */}
        <div className={styles.marqueeWrap}>
          <div className={styles.marqueeTrack}>
            <img src="/char-portraits.png" alt="PathTrick characters" className={styles.marqueeImg} />
            <img src="/char-portraits.png" alt="PathTrick characters" className={styles.marqueeImg} />
          </div>
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer className={styles.footer}>

        <div className={styles.footerContent}>
          {/* Logo */}
          <div className={styles.footerLogo}>
            <Image src="/PathTrick.png" alt="PathTrick" width={249} height={75} style={{ objectFit: 'contain', imageRendering: 'pixelated' }} />
          </div>

          <p className={styles.footerTagline}>Embark on an epic journey through pixel realms</p>

          {/* Social icons */}
          <div className={styles.footerSocials}>
            <a href="#" className={styles.socialImgLink} aria-label="Twitter">
              <Image src="/icon twitter.png" alt="Twitter" width={43} height={43} style={{ objectFit: 'contain', imageRendering: 'pixelated' }} />
            </a>
            <a href="#" className={styles.socialImgLink} aria-label="Figma">
              <Image src="/icon figma.png" alt="Figma" width={43} height={43} style={{ objectFit: 'contain', imageRendering: 'pixelated' }} />
            </a>
            <a href="#" className={styles.socialImgLink} aria-label="Discord">
              <Image src="/icon discord.png" alt="Discord" width={43} height={43} style={{ objectFit: 'contain', imageRendering: 'pixelated' }} />
            </a>
          </div>

          {/* Copyright bar */}
          <div className={styles.footerCopyBar}>
            <span>© 2025 Pathtrick. All rights reserved.</span>
            <a href="#" className={styles.footerLink}>Privacy Policy</a>
            <a href="#" className={styles.footerLink}>Term Of Service</a>
            <a href="#" className={styles.footerLink}>Cookie Settings</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
