'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useMapStore } from '@/store/useMapStore';
import type { RecommendedCourse } from '@/store/useMapStore';
import GameLoadingScreen from '@/components/ui/GameLoadingScreen';
import styles from './CourseBentoGrid.module.css';
import { pixelAssetFor } from './PixelIcon';

/* ═══════════════════════════════════════════════
   Category Config
   ═══════════════════════════════════════════════ */

const CATEGORY_CONFIG: Record<string, { icon: string; label: string }> = {
  coding:      { icon: '💻', label: 'Coding' },
  design:      { icon: '🎨', label: 'Design' },
  data:        { icon: '📊', label: 'Data' },
  business:    { icon: '💼', label: 'Business' },
  general:     { icon: '📚', label: 'General' },
  health:      { icon: '🏥', label: 'Kesehatan' },
  law:         { icon: '⚖️', label: 'Hukum' },
  psychology:  { icon: '🧠', label: 'Psikologi' },
  education:   { icon: '🎓', label: 'Pendidikan' },
  engineering: { icon: '⚙️', label: 'Teknik' },
};

const DIFFICULTY_CLASS: Record<string, string> = {
  beginner:     styles.diffBeginner,
  intermediate: styles.diffIntermediate,
  advanced:     styles.diffAdvanced,
};

/* ═══════════════════════════════════════════════
   ComingSoonPopup
   ═══════════════════════════════════════════════ */

function ComingSoonPopup({
  course,
  onClose,
}: {
  course: RecommendedCourse;
  onClose: () => void;
}) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const catConfig = CATEGORY_CONFIG[course.category] ?? CATEGORY_CONFIG.general;

  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div
        className={styles.popupCard}
        style={{ '--card-accent': course.accentColor } as React.CSSProperties}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Course in Development"
      >
        {/* Pixel construction icon */}
        <div className={styles.popupIconWrap}>
          <Image src={pixelAssetFor('🏗️')} alt="" width={64} height={64} />
        </div>

        {/* Title */}
        <h2 className={styles.popupTitle}>Course in Development</h2>

        {/* Course name */}
        <p className={styles.popupCourseName}>
          <Image src={pixelAssetFor(catConfig.icon)} alt="" width={24} height={24} /> {course.title}
        </p>

        {/* Message */}
        <p className={styles.popupMessage}>
          Course ini sedang dalam tahap pengembangan oleh tim PATHTRICK.
          Kami sedang menyusun materi berkualitas tinggi untukmu!
        </p>

        {/* Coming soon badge */}
        <div className={styles.popupBadge}>
          <span className={styles.popupBadgeDot} />
          Segera Hadir
        </div>

        {/* CTA */}
        <button className={styles.popupBtn} onClick={onClose}>
          Mengerti, Kembali
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CourseCard
   ═══════════════════════════════════════════════ */

function CourseCard({
  course,
  onSelect,
  onComingSoon,
}: {
  course: RecommendedCourse;
  onSelect: (id: string) => void;
  onComingSoon: (course: RecommendedCourse) => void;
}) {
  const progress = course.totalQuests > 0
    ? Math.round((course.completedQuests / course.totalQuests) * 100)
    : 0;

  const diffClass = DIFFICULTY_CLASS[course.difficulty] ?? styles.diffBeginner;
  const isComingSoon = !!course.comingSoon;

  const handleClick = () => {
    if (course.isLocked) return;
    if (isComingSoon) {
      onComingSoon(course);
      return;
    }
    onSelect(course.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  // Determine card class
  let cardClass = styles.card;
  if (course.isLocked) cardClass += ` ${styles.cardLocked}`;
  else if (isComingSoon) cardClass += ` ${styles.cardComingSoon}`;

  return (
    <div
      className={cardClass}
      style={{ '--card-accent': course.accentColor } as React.CSSProperties}
      onClick={handleClick}
      role="button"
      tabIndex={course.isLocked ? -1 : 0}
      aria-disabled={course.isLocked}
      aria-label={`${course.isLocked ? 'Locked: ' : isComingSoon ? 'Coming Soon: ' : ''}${course.title}`}
      onKeyDown={handleKeyDown}
    >
      {/* Locked overlay */}
      {course.isLocked && <Image src={pixelAssetFor('🔒')} alt="Locked" width={28} height={28} className={styles.lockIcon} />}

      {/* Top Half: Illustration Area */}
      <div className={styles.cardIllustration}>
        {/* Coming Soon ribbon */}
        {isComingSoon && !course.isLocked && (
          <div className={styles.comingSoonRibbon}>
            <span>COMING SOON</span>
          </div>
        )}
        <Image
          src="/ai_course_bg.jpg"
          alt="Course Illustration"
          fill
          className={styles.illustrationBg}
          style={{ objectFit: 'cover' }}
          unoptimized
        />
        <div className={styles.illustrationOverlay} />

        <div className={styles.bigIconWrap}>
          <Image
            src={course.icon}
            alt=""
            width={72}
            height={72}
            unoptimized
          />
        </div>
        
        {/* Floating Badges inside illustration */}
        <div className={styles.floatingBadges}>
          {course.aiMatchPercent && (
            <span className={styles.matchBadge}>
              AI {course.aiMatchPercent}%
            </span>
          )}
          <span className={`${styles.difficultyBadge} ${diffClass}`}>
            {course.difficulty}
          </span>
        </div>
      </div>

      {/* Bottom Half: Text & Progress */}
      <div className={styles.cardTextContent}>
        <h3 className={styles.cardTitle}>{course.title}</h3>
        <p className={styles.cardDesc}>{course.description}</p>

        {/* Progress Bar */}
        <div className={styles.progressRow}>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className={styles.progressLabel}>
            {course.completedQuests}/{course.totalQuests}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CourseBentoGrid (Main Export)
   ═══════════════════════════════════════════════ */

export default function CourseBentoGrid() {
  const {
    recommendedCourses,
    isFetchingCourses,
    selectCourse,
  } = useMapStore();

  const [comingSoonCourse, setComingSoonCourse] = useState<RecommendedCourse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const handleComingSoon = useCallback((course: RecommendedCourse) => {
    setComingSoonCourse(course);
  }, []);

  const handleClosePopup = useCallback(() => {
    setComingSoonCourse(null);
  }, []);

  if (isFetchingCourses || recommendedCourses.length === 0) {
    return <GameLoadingScreen statusText="AI sedang menyusun rekomendasi kursus..." />;
  }

  const availableCount = recommendedCourses.filter(c => !c.isLocked && !c.comingSoon).length;
  const totalQuests = recommendedCourses.reduce((sum, c) => sum + c.totalQuests, 0);

  // Pagination logic
  const totalPages = Math.ceil(recommendedCourses.length / ITEMS_PER_PAGE);

  const paginatedCourses = recommendedCourses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className={styles.bentoContainer} id="course-bento-dashboard">
      {/* Scanlines overlay */}
      <div className={styles.scanlines} />

      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Pilih Course-mu</h1>
        <p className={styles.headerSubtitle}>
          Berdasarkan hasil asesmen RIASEC-mu, AI telah memilihkan course yang paling cocok.
          Pilih salah satu untuk memulai petualangan belajar!
        </p>
        <div className={styles.headerMeta}>
          <span className={styles.metaBadge}>
            {availableCount} Course Tersedia
          </span>
          <span className={styles.metaBadge}>
            {totalQuests} Total Quest
          </span>
          <span className={styles.metaBadge}>
            🔮 {recommendedCourses.length} Jurusan
          </span>
        </div>
      </header>

      {/* Bento Grid */}
      <div className={styles.grid}>
        {paginatedCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onSelect={selectCourse}
            onComingSoon={handleComingSoon}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className={styles.paginationWrapper}>
          <button
            className={styles.pageNavBtn}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ◀
          </button>
          
          <div className={styles.paginationScrollArea}>
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              const isActive = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  className={`${styles.pageBtn} ${isActive ? styles.pageBtnActive : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            className={styles.pageNavBtn}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            ▶
          </button>
        </div>
      )}

      {/* Coming Soon Popup */}
      {comingSoonCourse && (
        <ComingSoonPopup
          course={comingSoonCourse}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
}
