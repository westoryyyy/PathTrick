import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CourseNodeData, COURSE_NODES_SMA, COURSE_NODES_MAHASISWA, ASSET_PATHS } from '@/phaser/config';

/* ═══════════════════════════════════════════════
   New Types — Course Hierarchy (SMA)
   ═══════════════════════════════════════════════ */

export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type CourseCategory = 'coding' | 'design' | 'data' | 'business' | 'general'
  | 'health' | 'law' | 'psychology' | 'education' | 'engineering';
export type QuestType = 'lesson' | 'quiz' | 'project' | 'boss';

/** A selectable course card on the Bento Dashboard */
export interface RecommendedCourse {
  id: string;
  title: string;
  description: string;
  icon: string;            // pixel art asset path
  category: CourseCategory;
  difficulty: CourseDifficulty;
  totalQuests: number;
  completedQuests: number;
  isLocked: boolean;
  /** Course content is not yet available — show "Coming Soon" popup on click */
  comingSoon?: boolean;
  /** AI match percentage shown on card */
  aiMatchPercent?: number;
  /** Accent color for the card border glow */
  accentColor: string;
}

/** A single quest node inside a course (extends CourseNodeData) */
export interface QuestNode extends CourseNodeData {
  /** Position in the linear Duolingo path (0-indexed) */
  order: number;
  /** Quest archetype — affects icon and UX */
  questType: QuestType;
}

/** The currently selected course with its quest chain */
export interface ActiveCourse {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: CourseCategory;
  difficulty: CourseDifficulty;
  accentColor: string;
  quests: QuestNode[];
}

/* ═══════════════════════════════════════════════
   Store Interface
   ═══════════════════════════════════════════════ */

interface MapState {
  role: 'SMA' | 'MAHASISWA';
  /** Number of unlocked badge achievements (shared app state) */
  badgeCount: number;
  /** Fetch achievements and update badgeCount, returns achievement keys */
  fetchAchievements: () => Promise<string[]>;

  /* ── SMA: Course Hierarchy ── */
  dashboardView: 'dashboard' | 'courses' | 'map';
  recommendedCourses: RecommendedCourse[];
  currentActiveCourse: ActiveCourse | null;
  isFetchingCourses: boolean;
  lastCompletedQuestId: string | null;

  nodes: CourseNodeData[];
  isLoading: boolean;
  error: string | null;
  completedDynamicNodes: string[];
  activeChapterId?: string;
  houseId?: string;

  /* ── Actions ── */
  setRole: (role: 'SMA' | 'MAHASISWA') => void;

  // SMA actions
  fetchRecommendedCourses: () => Promise<void>;
  selectCourse: (courseId: string) => void;
  goToCourses: () => void;
  backToDashboard: () => void;
  completeQuest: (questId: string) => Promise<void>;
  clearLastCompletedQuest: () => void;

  // Legacy Mahasiswa actions
  fetchRoadmap: (chapterId?: string) => Promise<void>;
  completeNode: (nodeId: string) => Promise<void>;
  unlockDependentNodes: (completedNodeId: string) => void;
  completeDynamicNode: (nodeId: string) => void;
  setHouseId: (houseId: string | undefined) => void;
}

/* ═══════════════════════════════════════════════
   Legacy mock data has been removed. SMA course cards and quest chains now come from the backend APIs.
   ═══════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════
   Store
   ═══════════════════════════════════════════════ */

export const useMapStore = create<MapState>()(
  persist(
    (set, get) => ({
  role: 'SMA',

  /* ── SMA: Course Hierarchy ── */
  dashboardView: 'dashboard',
  recommendedCourses: [],
  currentActiveCourse: null,
  isFetchingCourses: false,
  lastCompletedQuestId: null,

  /* ── Legacy: Flat node map (Mahasiswa) ── */
  nodes: [],
  isLoading: true,
  error: null,
  completedDynamicNodes: [],

  /* ── Role ── */
  setRole: (role) => {
    set({ role });
    if (role === 'MAHASISWA') {
      get().fetchRoadmap();
    } else {
      get().fetchRecommendedCourses();
    }
  },

  setHouseId: (houseId) => set({ houseId }),
  
  /* Shared badge count for achievements */
  badgeCount: 0,
  fetchAchievements: async () => {
    try {
      const { getAuthHeaders } = await import('@/hooks/useAuthSync');
      const { API_BASE_URL } = await import('@/config/pathtrick');
      const res = await fetch(`${API_BASE_URL}/api/gamification`, { headers: getAuthHeaders() });
      if (!res.ok) return [];
      const data = await res.json();
      const keys = Array.isArray(data.achievements) ? data.achievements.map((a: any) => a.key) : [];
      set({ badgeCount: keys.length });
      return keys;
    } catch (err) {
      return [];
    }
  },

  /* ═══════════════════════════════════════════
     SMA Actions
     ═══════════════════════════════════════════ */

  fetchRecommendedCourses: async () => {
    set({ isFetchingCourses: true, isLoading: true, error: null });
    try {
      const { getAuthHeaders } = await import('@/hooks/useAuthSync');
      const { API_BASE_URL } = await import('@/config/pathtrick');
      const res = await fetch(`${API_BASE_URL}/api/courses`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch courses');

      const data = await res.json();
      const backendCourses = Array.isArray(data?.courses) ? data.courses : [];

      const mappedCourses = backendCourses.map((course: any, index: number) => {
        const title = String(course.title || 'Learning Path');
        const description = course.reasonRecommended || course.description || 'Materi yang dipersonalisasi dari backend.';
        const facultyTags: string[] = Array.isArray(course.facultyTags) ? course.facultyTags : [];
        const category: CourseCategory = facultyTags.some(tag => /design|art|ui|ux/i.test(tag))
          ? 'design'
          : facultyTags.some(tag => /data|stat/i.test(tag))
            ? 'data'
            : facultyTags.some(tag => /business|manaj|econ/i.test(tag))
              ? 'business'
              : facultyTags.some(tag => /health|med/i.test(tag))
                ? 'health'
                : facultyTags.some(tag => /law/i.test(tag))
                  ? 'law'
                  : facultyTags.some(tag => /psych/i.test(tag))
                    ? 'psychology'
                    : facultyTags.some(tag => /educ/i.test(tag))
                      ? 'education'
                      : facultyTags.some(tag => /eng|tech|cs|it/i.test(tag))
                        ? 'engineering'
                        : 'coding';

        const progressStatus = course.progress?.status ?? 'NOT_STARTED';
        const completedQuests = progressStatus === 'COMPLETED'
          ? (course.sectionCount ?? 0)
          : Math.max(0, Math.min(course.progress?.currentSectionOrder ? course.progress.currentSectionOrder - 1 : 0, course.sectionCount ?? 0));

        return {
          id: course.id,
          title,
          description,
          icon: course.coverImageUrl || ASSET_PATHS.OBJ_BOOK,
          category,
          difficulty: (course.level === 'advanced' ? 'advanced' : course.level === 'intermediate' ? 'intermediate' : 'beginner') as CourseDifficulty,
          totalQuests: Math.max(1, course.sectionCount ?? 1),
          completedQuests,
          isLocked: false,
          comingSoon: false,
          aiMatchPercent: course.reasonRecommended ? 90 - (index * 3) : undefined,
          accentColor: ['#f97316', '#3b82f6', '#a855f7', '#10b981', '#f59e0b'][index % 5],
        } satisfies RecommendedCourse;
      });

      set({ recommendedCourses: mappedCourses, isFetchingCourses: false, isLoading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch courses';
      set({ error: message, isFetchingCourses: false, isLoading: false });
    }
  },

  selectCourse: (courseId: string) => {
    const { recommendedCourses } = get();
    const course = recommendedCourses.find(c => c.id === courseId);
    if (!course || course.isLocked || course.comingSoon) return;

    const fallbackQuests: QuestNode[] = [
      {
        id: `${courseId}-overview`,
        title: 'Overview Materi',
        description: `Mulai dengan gambaran umum ${course.title}.`,
        category: 'foundation',
        status: 'available',
        xp: 100,
        x: 120,
        y: 160,
        prerequisites: [],
        badgeImage: ASSET_PATHS.BADGE_FIRST_STEP,
        npcKey: 'npc-mentor',
        order: 0,
        questType: 'lesson',
      },
      {
        id: `${courseId}-practice`,
        title: 'Latihan Inti',
        description: `Terapkan konsep ${course.title} dalam soal dan tugas.` ,
        category: 'skill',
        status: 'locked',
        xp: 150,
        x: 240,
        y: 260,
        prerequisites: [`${courseId}-overview`],
        badgeImage: ASSET_PATHS.OBJ_BOOK,
        npcKey: 'npc-recruiter',
        order: 1,
        questType: 'quiz',
      },
      {
        id: `${courseId}-project`,
        title: 'Mini Project',
        description: `Buat proyek singkat yang relevan dengan ${course.title}.`,
        category: 'project',
        status: 'locked',
        xp: 250,
        x: 360,
        y: 360,
        prerequisites: [`${courseId}-practice`],
        badgeImage: ASSET_PATHS.OBJ_SCROLL,
        npcKey: 'npc-professor',
        order: 2,
        questType: 'project',
      },
    ];

    const activeCourse: ActiveCourse = {
      id: course.id,
      title: course.title,
      description: course.description,
      icon: course.icon,
      category: course.category,
      difficulty: course.difficulty,
      accentColor: course.accentColor,
      quests: fallbackQuests,
    };

    set({
      currentActiveCourse: activeCourse,
      dashboardView: 'map',
    });
  },

  goToCourses: () => {
    set({
      dashboardView: 'courses',
    });
  },

  backToDashboard: () => {
    set({
      currentActiveCourse: null,
      dashboardView: 'dashboard',
    });
  },

  completeQuest: async (questId: string) => {
    const { currentActiveCourse, recommendedCourses } = get();
    if (!currentActiveCourse) return;

    // 1. Mark quest as completed
    const updatedQuests = currentActiveCourse.quests.map(q =>
      q.id === questId ? { ...q, status: 'completed' as const } : q
    );

    // 2. Unlock the next sequential quest
    const completedQuest = updatedQuests.find(q => q.id === questId);
    if (completedQuest) {
      const nextOrder = completedQuest.order + 1;
      const nextQuest = updatedQuests.find(q => q.order === nextOrder);
      if (nextQuest && nextQuest.status === 'locked') {
        const idx = updatedQuests.indexOf(nextQuest);
        updatedQuests[idx] = { ...nextQuest, status: 'available' };
      }
    }

    // 3. Simulate API save
    await new Promise(resolve => setTimeout(resolve, 500));

    // 4. Update active course
    const updatedCourse = { ...currentActiveCourse, quests: updatedQuests };

    // 5. Update progress in recommended courses
    const completedCount = updatedQuests.filter(q => q.status === 'completed').length;
    const updatedRecommended = recommendedCourses.map(c =>
      c.id === currentActiveCourse.id
        ? { ...c, completedQuests: completedCount }
        : c
    );

    set({
      currentActiveCourse: updatedCourse,
      recommendedCourses: updatedRecommended,
      lastCompletedQuestId: questId,
    });
  },

  clearLastCompletedQuest: () => {
    set({ lastCompletedQuestId: null });
  },

  /* ═══════════════════════════════════════════
     Legacy Mahasiswa Actions
     ═══════════════════════════════════════════ */

  fetchRoadmap: async (chapterId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const { getAuthHeaders } = await import('@/hooks/useAuthSync');
      const { API_BASE_URL } = await import('@/config/pathtrick');
      const res = await fetch(`${API_BASE_URL}/api/roadmap`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch roadmap');

      const rawNodes = await res.json();
      const nodes = Array.isArray(rawNodes) ? rawNodes : [];

      const { ASSET_PATHS } = await import('@/phaser/config');
      const pathCoords = [
        { x: 13, y: 23 }, { x: 6, y: 8 }, { x: 22, y: 17 },
        { x: 21, y: 8 }, { x: 31, y: 11 }, { x: 28, y: 24 },
        { x: 26, y: 28 }, { x: 10, y: 28 },
      ];

      let mappedNodes: CourseNodeData[] = nodes.map((rn: any, idx: number) => {
        const coords = pathCoords[(rn.order ?? idx) % pathCoords.length];
        const isBoss = /boss|final|project/i.test(String(rn.title || ''));
        const isQuiz = /quiz|kuis/i.test(String(rn.title || ''));

        let category: CourseNodeData['category'] = 'skill';
        let badgeImage: string | undefined = ASSET_PATHS.OBJ_BOOK;
        let npcKey = 'npc-professor';

        if ((rn.order ?? 1) === 1) {
          badgeImage = ASSET_PATHS.BADGE_FIRST_STEP as string;
          category = 'foundation';
          npcKey = 'npc-mentor';
        } else if (isQuiz) {
          badgeImage = ASSET_PATHS.BADGE_QUIZ_MASTER as string;
          npcKey = 'npc-scholarship';
        } else if (isBoss) {
          badgeImage = ASSET_PATHS.BADGE_COURSE_MASTER as string;
          category = 'milestone';
          npcKey = 'npc-wizard';
        }

        return {
          id: rn.sectionId || rn.id || `${rn.chapterId || 'chapter'}-level-${rn.order ?? idx + 1}`,
          title: `Lvl ${(rn.order ?? idx + 1)}: ${rn.title || 'Materi'}`,
          description: `Materi dari bab ${rn.chapterId || 'aktif'}`,
          category,
          status: rn.status || (rn.completed ? 'completed' : rn.locked ? 'locked' : 'available'),
          xp: 150,
          x: coords.x,
          y: coords.y,
          prerequisites: [],
          badgeImage,
          npcKey,
          courseId: rn.courseId,
          sectionId: rn.sectionId,
          chapterId: rn.chapterId,
          missionId: rn.missionId,
        };
      });

      if (chapterId) {
        mappedNodes = mappedNodes.filter((node) => (node as any).chapterId === chapterId);
      }

      const normalizedCompletedIds = Array.from(
        new Set(
          nodes
            .filter((node: any) => node?.completed || node?.status === 'completed')
            .flatMap((node: any) => [
              node.sectionId,
              node.missionId,
              node.id,
            ].filter((value): value is string => typeof value === 'string' && value.length > 0))
        )
      );

      set({
        nodes: mappedNodes,
        isLoading: false,
        activeChapterId: chapterId,
        completedDynamicNodes: Array.from(new Set([...get().completedDynamicNodes, ...normalizedCompletedIds])),
      });
    } catch (err: unknown) {
      console.error('fetchRoadmap error:', err);
      const message = err instanceof Error ? err.message : 'Failed to fetch roadmap';
      set({ error: message, isLoading: false });
    }
  },

  completeNode: async (nodeId: string) => {
    set((state) => ({
      nodes: state.nodes.map(node =>
        node.id === nodeId ? { ...node, status: 'completed' as const } : node
      )
    }));
    await new Promise(resolve => setTimeout(resolve, 500));
    get().unlockDependentNodes(nodeId);
  },

  unlockDependentNodes: (completedNodeId: string) => {
    set((state) => {
      const completedNodeIds = new Set(
        state.nodes.filter(n => n.status === 'completed').map(n => n.id)
      );
      completedNodeIds.add(completedNodeId);

      const newNodes = state.nodes.map(node => {
        if (node.status === 'locked') {
          const allPrereqsMet = node.prerequisites.every(req => completedNodeIds.has(req));
          if (allPrereqsMet) {
            return { ...node, status: 'available' as const };
          }
        }
        return node;
      });

      return { nodes: newNodes };
    });
  },

  completeDynamicNode: (nodeId: string) => {
    set((state) => ({
      completedDynamicNodes: state.completedDynamicNodes.includes(nodeId)
        ? state.completedDynamicNodes
        : [...state.completedDynamicNodes, nodeId],
    }));
  }
  }),
  {
    name: 'pathtrick-map-progress',
    storage: createJSONStorage(() => localStorage),
    // Only persist the completed nodes list — everything else is re-derived on load
    partialize: (state) => ({
      completedDynamicNodes: state.completedDynamicNodes,
      badgeCount: state.badgeCount,
    }),
  }
  )
);

