'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CareerTrack } from '@/types/backend';
import PixelIcon from '@/components/ui/PixelIcon';
import { getAuthHeaders } from '@/hooks/useAuthSync';
import { API_BASE_URL } from '@/config/pathtrick';
import { useTranslation } from '@/hooks/useTranslation';

// categoryIcons removed
const categories = [
  'All',
  'Web Development',
  'Mobile',
  'Artificial Intelligence',
  'Blockchain',
  'Infrastructure',
  'Design',
  'Backend',
  'Security',
  'Gaming',
];

const difficultyColors: Record<string, string> = {
  beginner: 'from-emerald-100 to-teal-100 text-emerald-700',
  intermediate: 'from-blue-100 to-indigo-100 text-blue-700',
  advanced: 'from-rose-100 to-red-100 text-rose-700',
};

const difficultyLabels: Record<string, string> = {
  beginner: '🌱 Beginner',
  intermediate: '🔧 Intermediate',
  advanced: '⚡ Advanced',
};

export default function ExploreTracks() {
  const { t } = useTranslation();
  const [careerTracks, setCareerTracks] = useState<CareerTrack[]>([]);
  const [metadata, setMetadata] = useState<any>({ riasecScore: 'N/A', primaryTrack: 'N/A', targetCountry: 'N/A' });
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    async function loadData() {
      try {
        const headers = await getAuthHeaders();
        // Fetch User profile to get RIASEC score
        const userRes = await fetch(`${API_BASE_URL}/api/users/me`, { headers });
        if (userRes.ok) {
          const userData = await userRes.json();
          setMetadata({
            riasecScore: userData.assessment?.riasecScore || 'TBD',
            primaryTrack: userData.role?.displayName || 'TBD',
            targetCountry: userData.assessment?.countryPreference?.[0] || 'TBD',
          });
        }
        
        // Fetch Jobs to act as Career Tracks
        const jobsRes = await fetch(`${API_BASE_URL}/api/jobs`, { headers });
        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          const mappedTracks: CareerTrack[] = (jobsData.jobs || []).map((job: any, index: number) => ({
            id: job.id,
            title: job.title,
            description: `A career as ${job.title} at ${job.company}`,
            category: job.type || 'Web Development',
            techTags: job.skillsRequired || ['General'],
            iconType: '💼',
            difficulty: index % 3 === 0 ? 'beginner' : (index % 3 === 1 ? 'intermediate' : 'advanced'),
            estimatedWeeks: 12 + (index % 5) * 4
          }));
          setCareerTracks(mappedTracks);
        }
      } catch (e) {
        console.error('Failed to load explore tracks', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTracks = useMemo(() => {
    if (selectedCategory === 'All') return careerTracks;
    return careerTracks.filter(track => track.category === selectedCategory);
  }, [selectedCategory, careerTracks]);

  const [mascot, setMascot] = useState('🚀');

  React.useEffect(() => {
    const mascots = ['🚀', '🎯', '💡', '🏆', '⭐'];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMascot(mascots[Math.floor(Math.random() * mascots.length)]);
  }, []);
  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-slate-800 font-sans antialiased p-6 sm:p-8 lg:p-10">
      {/* ─── HEADER SECTION ─── */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 mb-8">
          {/* Left Content */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-3">
                {t('tracks.header.title')}
              </h1>
              <p className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl leading-relaxed mb-6">
                {t('tracks.header.desc')}
              </p>

              {/* RIASEC & Primary Track Info */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-bold border border-blue-200">
                  🧠 {metadata.riasecScore}
                </div>
                <div className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold border border-indigo-200">
                  ✨ {metadata.primaryTrack}
                </div>
                <div className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold border border-emerald-200">
                  🌍 {metadata.targetCountry}
                </div>
              </div>
            </motion.div>

            {/* Category Filter Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-3 flex-wrap"
            >
              <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">{t('tracks.filter.label')}</span>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-white border border-gray-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right - Decorative Card with Mascot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:shrink-0 w-full lg:w-auto"
          >
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center gap-4 shadow-sm min-h-[280px]">
              <div className="animate-bounce"><PixelIcon icon={mascot} size={64} /></div>
              <div>
                <h3 className="font-extrabold text-xl text-slate-900 mb-1">
                  {t('tracks.header.title')}
                </h3>
                <p className="text-sm text-slate-600 font-medium">
                  {t('tracks.header.desc')}
                </p>
              </div>
              <div className="flex gap-2 text-lg mt-2">
                <span>TRACK</span>
                <span>💪</span>
                <span>START</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── RESULTS COUNT ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mb-6"
        >
          <p className="text-sm font-semibold text-slate-600">
            Showing <span className="text-blue-600 font-extrabold">{filteredTracks.length}</span> {filteredTracks.length !== 1 ? t('tracks.cta').toLowerCase() + 's' : t('tracks.cta').toLowerCase()} in{' '}
            <span className="text-blue-600 font-extrabold">{selectedCategory}</span>
          </p>
        </motion.div>

        {/* ─── TRACKS GRID ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredTracks.map((track: CareerTrack, idx: number) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="group h-full"
            >
              <div className="bg-white rounded-[2rem] border border-gray-200 p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition-all duration-300 flex flex-col h-full gap-4">
                {/* Top Section - Icon & Title */}
                <div className="flex items-start justify-between gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                    {track.iconType}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-base text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-1">
                      {track.title}
                    </h3>
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                      {track.category}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 font-medium line-clamp-2 leading-relaxed flex-1">
                  {track.description}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2">
                  {track.techTags.slice(0, 2).map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-700 hover:border-blue-300 hover:bg-blue-50 transition-all"
                    >
                      {tag}
                    </span>
                  ))}
                  {track.techTags.length > 2 && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-100 text-[10px] font-bold text-slate-600">
                      +{track.techTags.length - 2} more
                    </span>
                  )}
                </div>

                {/* Bottom Section - Meta Info */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {track.difficulty && (
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-gradient-to-r ${difficultyColors[track.difficulty]}`}
                      >
                        {difficultyLabels[track.difficulty]}
                      </span>
                    )}
                  </div>
                  {track.estimatedWeeks && (
                    <span className="text-xs font-semibold text-slate-500">
                      ~{track.estimatedWeeks} weeks
                    </span>
                  )}
                </div>

                {/* CTA Button */}
                <button className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-sm hover:shadow-lg hover:scale-105 active:scale-95 transition-all mt-2">
                  {t('tracks.cta')}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ─── EMPTY STATE ─── */}
        {filteredTracks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">{t('tracks.noTracks.heading')}</h3>
            <p className="text-slate-600 font-medium mb-6">
              {t('tracks.noTracks.desc')}
            </p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-extrabold hover:bg-blue-700 transition-colors"
            >
              {t('tracks.noTracks.viewAll')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
