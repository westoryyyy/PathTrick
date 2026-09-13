'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import mockAICourses from '@/mocks/mockAICourses';

export default function HouseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  // We use React.use() to unwrap the params promise in Next.js 15
  use(params);

  // We'll treat the HOUSES array as the "courses" inside this house for now
  const courses = mockAICourses.HOUSES.slice(0, 4); // Just show first 4 as an example

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* ─── Navigation Header ─── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard/sma')}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-slate-900">House of Technology</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            4 Courses Available
          </div>
        </div>
      </header>

      {/* ─── Hero Banner ─── */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 group">
          <img
            src="/mini-map-course-2.png"
            alt="House of Technology Banner"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex flex-col justify-end">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-wider mb-4 w-fit">
              <span>💻</span> Web Dev & Algoritma
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-md">
              House of Technology
            </h2>
            <p className="text-lg text-slate-200 max-w-2xl font-medium drop-shadow-sm leading-relaxed">
              Pelajari fondasi teknologi dari HTML dasar hingga Web3. Kuasai keahlian yang paling dicari oleh industri saat ini dan mulai bangun masa depanmu.
            </p>
          </div>
        </div>
      </div>

      {/* ─── Course List ─── */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Available Courses</h3>
          <span className="text-sm font-semibold text-slate-500">Pick your path</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course, index) => (
            <div
              key={course.id}
              onClick={() => router.push('/map')}
              className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col sm:flex-row gap-6 items-start sm:items-center relative overflow-hidden"
            >
              {/* Subtle hover gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Course Icon/Number */}
              <div className="relative z-10 w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-inner">
                {index + 1}
              </div>

              <div className="relative z-10 flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    Module {index + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    2-3 Hours
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                  {course.title.split(': ')[1] || course.title}
                </h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">
                  {course.shortDescription}
                </p>
              </div>

              {/* Action Button */}
              <div className="relative z-10 sm:w-auto w-full pt-4 sm:pt-0 sm:pl-4 sm:border-l border-slate-100 flex items-center justify-end sm:justify-center shrink-0">
                <button className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-blue-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-colors shadow-sm">
                  <svg className="w-5 h-5 translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
