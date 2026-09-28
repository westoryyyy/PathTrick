'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { useAuthSync } from '@/hooks/useAuthSync';
import styles from './page.module.css';
import PixelIcon from '@/components/ui/PixelIcon';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { useTranslation } from '@/hooks/useTranslation';

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

// Stats values are fixed numbers, only labels are translated (done inside the component)
const STAT_KEYS = [
  { value: '10.5K', labelKey: 'landing.stats.activeLearners' },
  { value: '40K', labelKey: 'landing.stats.questsCleared' },
  { value: '98%', labelKey: 'landing.stats.satisfaction' },
  { value: '3 Min', labelKey: 'landing.stats.avgToStart' },
];

// Nav links use translation keys too
const NAV_LINK_KEYS = [
  { labelKey: 'landing.nav.features', href: '#features' },
  { labelKey: 'landing.nav.docs', href: '/docs' },
];

export default function LandingPage() {
  const { login, ready, authenticated } = usePrivy();
  const { t } = useTranslation();
  const router = useRouter();
  const { selectedRole } = useOnboardingStore();
  const { isSyncing } = useAuthSync();
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isScrolled, setIsScrolled] = React.useState(false);

  // No longer auto-redirecting here — redirect is handled inside useAuthSync
  // after backend sync completes (see hooks/useAuthSync.ts).

  const handleStart = () => {
    if (!ready || isSyncing) return;
    if (authenticated) {
      if (selectedRole) {
        router.replace(`/${selectedRole}/dashboard`);
      } else {
        router.replace('/select-role');
      }
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
            {NAV_LINK_KEYS.map(l => (
              <Link
                key={l.labelKey}
                href={l.href}
                className={styles.navLink}
                onClick={(e) => handleNavClick(e, l.href)}
              >
                {t(l.labelKey)}
              </Link>
            ))}
          </div>
          <div className={styles.navRight}>
            <LanguageToggle />
            <button onClick={handleStart} className={styles.signUpBtn} id="nav-signup-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} disabled={!ready || isSyncing}>
              {authenticated ? (
                <span style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '120px',
                  height: '36px',
                  color: 'white', 
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: '0.45rem',
                  backgroundColor: '#DD1A21',
                  border: '2px solid white',
                  borderRadius: '4px',
                  boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.2)',
                  textTransform: 'capitalize',
                  textShadow: '1px 1px 0 rgba(0,0,0,0.5)',
                  lineHeight: 1
                }}>
                  {isSyncing ? '...' : selectedRole ? 'Dashboard' : 'LANJUTKAN SETUP'}
                </span>
              ) : (
                <Image
                  src="/Sign Up.png"
                  alt="Sign Up"
                  width={120}
                  height={36}
                  unoptimized
                  style={{ objectFit: 'contain', imageRendering: 'pixelated' }}
                />
              )}
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
          <span className={styles.scrollPixel}>{t('landing.hero.scrollToExplore')}</span>
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
            <h2 className={styles.coursesTitle}>{t('landing.courses.sectionTitle')}</h2>
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
          <h2 className={styles.journeyTitle}>{t('landing.journey.title')}</h2>
          <p className={styles.journeyDesc}>
            {t('landing.journey.desc')}
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
          <h2 className={styles.growUpSubtitle}>{t('landing.growUp.subtitle')}</h2>
          <div className={styles.growUpLogoWrap}>
            <span className={styles.growUpLogoText}>Path<span className={styles.logoAccent}>trick</span></span>
          </div>

          {/* USER: Edit paragraf deskripsi di sini */}
          <p className={styles.growUpDesc}>
            {t('landing.growUp.desc')}
          </p>
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
            <span className={styles.hallTitlePrefix}>{t('landing.hall.wallOf')}</span><br />
            {t('landing.hall.heroes').slice(0, -2)}<span className={styles.hallTitleAccent}>{t('landing.hall.heroes').slice(-2)}</span>
          </h2>

          {/* Stats row */}
          <div className={styles.statsRow}>
            {STAT_KEYS.map((s, i) => (
              <React.Fragment key={i}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>{t(s.labelKey)}</span>
                  <span className={styles.statValue}>{s.value}</span>
                </div>
                {i < STAT_KEYS.length - 1 && <span className={styles.statDivider}>/</span>}
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
                    <span className={styles.heroBadgeIcon}><PixelIcon icon={hero.badgeIcon} size={24} /></span>
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
        <img className={styles.portalGem} src="/red-gem.png" alt="" aria-hidden="true" />

        <div className={styles.portalInner}>
          <p className={styles.portalEyebrow}>{t('landing.cta.eyebrow')}</p>
          <h2 className={styles.portalTitle}>
            {t('landing.cta.title')} <span className={styles.portalOpen}>{t('landing.cta.titleOpen')}</span>
          </h2>
          <p className={styles.portalClaim}>
            <span className={styles.portalClaimAccent}>{t('landing.cta.claimAccent')}</span> {t('landing.cta.claim')}
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

          <p className={styles.footerTagline}>{t('landing.footer.tagline')}</p>

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
            <span>{t('landing.footer.copyright')}</span>
            <a href="#" className={styles.footerLink}>{t('landing.footer.privacyPolicy')}</a>
            <a href="#" className={styles.footerLink}>{t('landing.footer.termOfService')}</a>
            <a href="#" className={styles.footerLink}>{t('landing.footer.cookieSettings')}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
