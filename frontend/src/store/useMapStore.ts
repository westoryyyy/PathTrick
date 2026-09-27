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
}

/* ═══════════════════════════════════════════════
   Mock Data — AI Recommended Courses for SMA
   ═══════════════════════════════════════════════ */

const MOCK_RECOMMENDED_COURSES: RecommendedCourse[] = [
  /* ═══ MVP-READY COURSES (IT, Design, Business) ═══ */
  {
    id: 'html-basics',
    title: 'HTML Basics',
    description: 'Pelajari fondasi web development — struktur halaman, elemen semantik, dan form.',
    icon: ASSET_PATHS.OBJ_BOOK,
    category: 'coding',
    difficulty: 'beginner',
    totalQuests: 5,
    completedQuests: 0,
    isLocked: false,
    aiMatchPercent: 95,
    accentColor: '#f97316',
  },
  {
    id: 'python-logic',
    title: 'Python Logic',
    description: 'Kuasai dasar pemrograman — variabel, loop, kondisi, dan fungsi dengan Python.',
    icon: ASSET_PATHS.OBJ_SCROLL,
    category: 'coding',
    difficulty: 'beginner',
    totalQuests: 6,
    completedQuests: 0,
    isLocked: false,
    aiMatchPercent: 92,
    accentColor: '#3b82f6',
  },
  {
    id: 'figma-uiux',
    title: 'Figma UI/UX',
    description: 'Desain antarmuka yang indah dan user-friendly menggunakan Figma.',
    icon: ASSET_PATHS.OBJ_COMPASS,
    category: 'design',
    difficulty: 'beginner',
    totalQuests: 4,
    completedQuests: 0,
    isLocked: false,
    aiMatchPercent: 88,
    accentColor: '#a855f7',
  },
  {
    id: 'data-literacy',
    title: 'Data Literacy',
    description: 'Belajar membaca, menganalisis, dan memvisualisasikan data untuk pengambilan keputusan.',
    icon: ASSET_PATHS.OBJ_CRYSTAL_GEM,
    category: 'data',
    difficulty: 'intermediate',
    totalQuests: 5,
    completedQuests: 0,
    isLocked: false,
    aiMatchPercent: 78,
    accentColor: '#10b981',
  },
  {
    id: 'entrepreneurship-101',
    title: 'Entrepreneurship 101',
    description: 'Pelajari dasar bisnis, lean startup, dan validasi ide dari nol.',
    icon: ASSET_PATHS.OBJ_GOLD_TICKET,
    category: 'business',
    difficulty: 'intermediate',
    totalQuests: 4,
    completedQuests: 0,
    isLocked: false,
    aiMatchPercent: 72,
    accentColor: '#f59e0b',
  },
  {
    id: 'intro-ai',
    title: 'Intro to AI',
    description: 'Kenali konsep dasar kecerdasan buatan, machine learning, dan aplikasinya.',
    icon: ASSET_PATHS.OBJ_ENERGY_SHARD,
    category: 'coding',
    difficulty: 'advanced',
    totalQuests: 6,
    completedQuests: 0,
    isLocked: false,
    aiMatchPercent: 65,
    accentColor: '#ec4899',
  },

  /* ═══ COMING SOON COURSES (Non-MVP Faculties) ═══ */
  {
    id: 'anatomi-dasar',
    title: 'Anatomi & Fisiologi Dasar',
    description: 'Pelajari struktur tubuh manusia dan cara kerja organ — fondasi untuk jurusan Kedokteran.',
    icon: ASSET_PATHS.OBJ_RED_POTION,
    category: 'health',
    difficulty: 'intermediate',
    totalQuests: 8,
    completedQuests: 0,
    isLocked: false,
    comingSoon: true,
    aiMatchPercent: 70,
    accentColor: '#ef4444',
  },
  {
    id: 'pengantar-hukum',
    title: 'Pengantar Ilmu Hukum',
    description: 'Memahami sistem hukum Indonesia, hak warga negara, dan dasar-dasar perundangan.',
    icon: ASSET_PATHS.OBJ_SHIELD,
    category: 'law',
    difficulty: 'beginner',
    totalQuests: 6,
    completedQuests: 0,
    isLocked: false,
    comingSoon: true,
    aiMatchPercent: 60,
    accentColor: '#6366f1',
  },
  {
    id: 'psikologi-dasar',
    title: 'Psikologi Umum',
    description: 'Kenali dasar perilaku manusia, kognitif, emosi, dan perkembangan kepribadian.',
    icon: ASSET_PATHS.OBJ_BLUE_POTION,
    category: 'psychology',
    difficulty: 'beginner',
    totalQuests: 5,
    completedQuests: 0,
    isLocked: false,
    comingSoon: true,
    aiMatchPercent: 68,
    accentColor: '#8b5cf6',
  },
  {
    id: 'pedagogi-modern',
    title: 'Pedagogi Modern',
    description: 'Teknik mengajar abad 21 — project-based learning, diferensiasi, dan asesmen formatif.',
    icon: ASSET_PATHS.OBJ_LANTERN,
    category: 'education',
    difficulty: 'intermediate',
    totalQuests: 5,
    completedQuests: 0,
    isLocked: false,
    comingSoon: true,
    aiMatchPercent: 55,
    accentColor: '#14b8a6',
  },
  {
    id: 'mekanika-teknik',
    title: 'Mekanika Teknik',
    description: 'Fondasi teknik mesin dan sipil — gaya, momen, kesetimbangan, dan struktur.',
    icon: ASSET_PATHS.OBJ_SWORD,
    category: 'engineering',
    difficulty: 'advanced',
    totalQuests: 7,
    completedQuests: 0,
    isLocked: false,
    comingSoon: true,
    aiMatchPercent: 58,
    accentColor: '#78716c',
  },
  {
    id: 'farmasi-dasar',
    title: 'Farmasi & Kimia Obat',
    description: 'Pelajari interaksi obat, farmakokinetika, dan cara kerja senyawa aktif.',
    icon: ASSET_PATHS.OBJ_MANA_POTION,
    category: 'health',
    difficulty: 'advanced',
    totalQuests: 6,
    completedQuests: 0,
    isLocked: false,
    comingSoon: true,
    aiMatchPercent: 52,
    accentColor: '#d946ef',
  },
];

/* ═══════════════════════════════════════════════
   Mock Data — Quest Nodes per Course
   ═══════════════════════════════════════════════ */

const MOCK_COURSE_QUESTS: Record<string, QuestNode[]> = {
  'html-basics': [
    {
      id: 'html-1', order: 0, questType: 'lesson',
      title: 'Apa itu HTML?', description: 'Pengenalan dasar HTML dan bagaimana browser membaca kode.',
      category: 'foundation', status: 'available', xp: 50, x: 0, y: 0, prerequisites: [],
      badgeImage: ASSET_PATHS.BADGE_FIRST_STEP, npcKey: 'npc-mentor',
    },
    {
      id: 'html-2', order: 1, questType: 'lesson',
      title: 'Tags & Elements', description: 'Belajar tentang tag heading, paragraf, list, dan link.',
      category: 'skill', status: 'locked', xp: 75, x: 0, y: 0, prerequisites: ['html-1'],
      badgeImage: ASSET_PATHS.OBJ_BOOK, npcKey: 'npc-recruiter',
    },
    {
      id: 'html-3', order: 2, questType: 'quiz',
      title: 'Quiz: Struktur HTML', description: 'Uji pemahamanmu tentang tag dan elemen dasar.',
      category: 'skill', status: 'locked', xp: 100, x: 0, y: 0, prerequisites: ['html-2'],
      badgeImage: ASSET_PATHS.BADGE_QUIZ_MASTER, npcKey: 'npc-scholarship',
    },
    {
      id: 'html-4', order: 3, questType: 'project',
      title: 'Mini Project: Bio Page', description: 'Buat halaman bio personal menggunakan HTML murni.',
      category: 'project', status: 'locked', xp: 200, x: 0, y: 0, prerequisites: ['html-3'],
      badgeImage: ASSET_PATHS.OBJ_SCROLL, npcKey: 'npc-professor',
    },
    {
      id: 'html-5', order: 4, questType: 'lesson',
      title: 'Struktur Data & Tabel', description: 'Menyajikan data menggunakan tag table dan list.',
      category: 'skill', status: 'locked', xp: 150, x: 0, y: 0, prerequisites: ['html-4'],
      badgeImage: ASSET_PATHS.OBJ_BOOK, npcKey: 'npc-ai-engineer',
    },
    {
      id: 'html-6', order: 5, questType: 'lesson',
      title: 'Dasar Form & Input', description: 'Cara mengambil data teks dan angka dari pengguna.',
      category: 'skill', status: 'locked', xp: 150, x: 0, y: 0, prerequisites: ['html-5'],
      badgeImage: ASSET_PATHS.OBJ_BOOK, npcKey: 'npc-mentor',
    },
    {
      id: 'html-7', order: 6, questType: 'lesson',
      title: 'Input Lanjutan & Validasi', description: 'Checkbox, radio button, dan atribut required.',
      category: 'skill', status: 'locked', xp: 200, x: 0, y: 0, prerequisites: ['html-6'],
      badgeImage: ASSET_PATHS.OBJ_BOOK, npcKey: 'npc-recruiter',
    },
    {
      id: 'html-8', order: 7, questType: 'lesson',
      title: 'Semantic Web', description: 'Tag pembungkus cerdas seperti main, article, section.',
      category: 'skill', status: 'locked', xp: 250, x: 0, y: 0, prerequisites: ['html-7'],
      badgeImage: ASSET_PATHS.OBJ_BOOK, npcKey: 'npc-scholarship',
    },
    {
      id: 'html-9', order: 8, questType: 'lesson',
      title: 'Metadata & SEO', description: 'Optimasi ranking pencarian dengan Meta tag.',
      category: 'skill', status: 'locked', xp: 250, x: 0, y: 0, prerequisites: ['html-8'],
      badgeImage: ASSET_PATHS.OBJ_BOOK, npcKey: 'npc-professor',
    },
    {
      id: 'html-10', order: 9, questType: 'lesson',
      title: 'Aksesibilitas (a11y)', description: 'Praktik ARIA dan memastikan web ramah disabilitas.',
      category: 'skill', status: 'locked', xp: 250, x: 0, y: 0, prerequisites: ['html-9'],
      badgeImage: ASSET_PATHS.OBJ_BOOK, npcKey: 'npc-ai-engineer',
    },
    {
      id: 'html-11', order: 10, questType: 'project',
      title: 'Mini Project: Final Form', description: 'Buat form pendaftaran kompleks dan terstruktur.',
      category: 'project', status: 'locked', xp: 300, x: 0, y: 0, prerequisites: ['html-10'],
      badgeImage: ASSET_PATHS.OBJ_SCROLL, npcKey: 'npc-mentor',
    },
    {
      id: 'html-12', order: 11, questType: 'boss',
      title: 'Boss: HTML Mastery', description: 'Tantangan akhir — buktikan penguasaan HTML-mu!',
      category: 'milestone', status: 'locked', xp: 500, x: 0, y: 0, prerequisites: ['html-11'],
      badge: '🏆', badgeImage: ASSET_PATHS.BADGE_COURSE_MASTER, npcKey: 'npc-wizard',
    },
  ],
  'python-logic': [
    {
      id: 'py-1', order: 0, questType: 'lesson',
      title: 'Hello Python!', description: 'Install Python dan jalankan program pertamamu.',
      category: 'foundation', status: 'available', xp: 50, x: 0, y: 0, prerequisites: [],
      badgeImage: ASSET_PATHS.BADGE_FIRST_STEP, npcKey: 'npc-mentor',
    },
    {
      id: 'py-2', order: 1, questType: 'lesson',
      title: 'Variabel & Tipe Data', description: 'String, integer, float, boolean — dan cara menggunakannya.',
      category: 'skill', status: 'locked', xp: 75, x: 0, y: 0, prerequisites: ['py-1'],
      badgeImage: ASSET_PATHS.OBJ_BOOK, npcKey: 'npc-recruiter',
    },
    {
      id: 'py-3', order: 2, questType: 'lesson',
      title: 'If / Else Logic', description: 'Buat keputusan dalam kode dengan kondisional.',
      category: 'skill', status: 'locked', xp: 75, x: 0, y: 0, prerequisites: ['py-2'],
      badgeImage: ASSET_PATHS.OBJ_SWORD, npcKey: 'npc-scholarship',
    },
    {
      id: 'py-4', order: 3, questType: 'quiz',
      title: 'Quiz: Logic Flow', description: 'Uji pemahamanmu tentang alur logika Python.',
      category: 'skill', status: 'locked', xp: 100, x: 0, y: 0, prerequisites: ['py-3'],
      badgeImage: ASSET_PATHS.BADGE_QUIZ_MASTER, npcKey: 'npc-professor',
    },
    {
      id: 'py-5', order: 4, questType: 'project',
      title: 'Mini Project: Calculator', description: 'Buat kalkulator sederhana dengan Python.',
      category: 'project', status: 'locked', xp: 200, x: 0, y: 0, prerequisites: ['py-4'],
      badgeImage: ASSET_PATHS.OBJ_SCROLL, npcKey: 'npc-ai-engineer',
    },
    {
      id: 'py-6', order: 5, questType: 'boss',
      title: 'Boss: Python Logic Master', description: 'Tantangan akhir — selesaikan semua puzzle Python!',
      category: 'milestone', status: 'locked', xp: 500, x: 0, y: 0, prerequisites: ['py-5'],
      badge: '🏆', badgeImage: ASSET_PATHS.BADGE_COURSE_MASTER, npcKey: 'npc-wizard',
    },
  ],
  'figma-uiux': [
    {
      id: 'fig-1', order: 0, questType: 'lesson',
      title: 'Mengenal Figma', description: 'Navigasi Figma — artboard, frame, dan layer.',
      category: 'foundation', status: 'available', xp: 50, x: 0, y: 0, prerequisites: [],
      badgeImage: ASSET_PATHS.BADGE_FIRST_STEP, npcKey: 'npc-mentor',
    },
    {
      id: 'fig-2', order: 1, questType: 'lesson',
      title: 'Komponen & Style', description: 'Auto layout, komponen reusable, dan design tokens.',
      category: 'skill', status: 'locked', xp: 100, x: 0, y: 0, prerequisites: ['fig-1'],
      badgeImage: ASSET_PATHS.OBJ_COMPASS, npcKey: 'npc-recruiter',
    },
    {
      id: 'fig-3', order: 2, questType: 'project',
      title: 'Mini Project: App Screen', description: 'Desain satu halaman mobile app dari wireframe ke hi-fi.',
      category: 'project', status: 'locked', xp: 200, x: 0, y: 0, prerequisites: ['fig-2'],
      badgeImage: ASSET_PATHS.OBJ_SCROLL, npcKey: 'npc-scholarship',
    },
    {
      id: 'fig-4', order: 3, questType: 'boss',
      title: 'Boss: UI/UX Master', description: 'Evaluasi desainmu oleh AI — usability & estetika.',
      category: 'milestone', status: 'locked', xp: 500, x: 0, y: 0, prerequisites: ['fig-3'],
      badge: '🏆', badgeImage: ASSET_PATHS.BADGE_COURSE_MASTER, npcKey: 'npc-wizard',
    },
  ],
};

/* ═══════════════════════════════════════════════
   Mock AI APIs
   ═══════════════════════════════════════════════ */

const fetchAIRecommendedCoursesMock = async (): Promise<RecommendedCourse[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...MOCK_RECOMMENDED_COURSES]), 1200);
  });
};

const fetchAIRoadmapMock = async (role: 'SMA' | 'MAHASISWA', chapterId?: string): Promise<CourseNodeData[]> => {
  return new Promise((resolve) => {
    if (role === 'MAHASISWA' && chapterId) {
      // Generate dynamic nodes based on chapter
      const chapterTitle = chapterId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      
      // Determine context based on chapterId
      let levelContexts = [
        { t: 'Konsep Dasar', d: 'Pelajari fundamental' },
        { t: 'Praktik 1', d: 'Terapkan konsep dasar' },
        { t: 'Praktik Lanjutan', d: 'Eksplorasi teknik lanjutan' },
        { t: 'Mini Project', d: 'Uji kemampuan dengan live code' }
      ];
      
      if (chapterId.includes('framer')) {
        levelContexts = [
          { t: 'Intro to Motion', d: 'Pahami dasar animasi Framer' },
          { t: 'Gestures & Drag', d: 'Buat elemen interaktif' },
          { t: 'Scroll Animations', d: 'Animasi berbasis scroll' },
          { t: 'Layout Transitions', d: 'Transisi layout mulus' }
        ];
      } else if (chapterId.includes('tailwind')) {
        levelContexts = [
          { t: 'Utility Classes', d: 'Styling cepat dengan Tailwind' },
          { t: 'Flexbox & Grid', d: 'Membangun layout modern' },
          { t: 'Responsive Design', d: 'Desain mobile-first' },
          { t: 'Custom Themes', d: 'Konfigurasi tailwind.config' }
        ];
      } else if (chapterId.includes('sql')) {
        levelContexts = [
          { t: 'SELECT & WHERE', d: 'Query dasar pengambilan data' },
          { t: 'JOIN Operations', d: 'Menggabungkan beberapa tabel' },
          { t: 'GROUP BY & Aggregasi', d: 'Analisis data berkelompok' },
          { t: 'Subqueries', d: 'Query bersarang tingkat lanjut' }
        ];
      }

      const dynamicNodes: CourseNodeData[] = [
        {
          id: `${chapterId}-level-1`,
          title: `Level 1: ${levelContexts[0].t}`,
          description: `${levelContexts[0].d} dari ${chapterTitle}.`,
          category: 'skill',
          status: 'available',
          xp: 100,
          x: 13, y: 23,
          prerequisites: [],
          badgeImage: ASSET_PATHS.BADGE_FIRST_STEP,
          npcKey: 'npc-mentor',
        },
        {
          id: `${chapterId}-level-2`,
          title: `Level 2: ${levelContexts[1].t}`,
          description: `${levelContexts[1].d} untuk ${chapterTitle}.`,
          category: 'skill',
          status: 'locked',
          xp: 150,
          x: 15, y: 15,
          prerequisites: [`${chapterId}-level-1`],
          badgeImage: ASSET_PATHS.BADGE_QUICK_LEARNER,
          npcKey: 'npc-recruiter',
        },
        {
          id: `${chapterId}-level-3`,
          title: `Level 3: ${levelContexts[2].t}`,
          description: `${levelContexts[2].d}.`,
          category: 'skill',
          status: 'locked',
          xp: 150,
          x: 23, y: 13,
          prerequisites: [`${chapterId}-level-2`],
          badgeImage: ASSET_PATHS.BADGE_NIGHT_OWL,
          npcKey: 'npc-scholarship',
        },
        {
          id: `${chapterId}-level-4`,
          title: `Level 4: ${levelContexts[3].t}`,
          description: `${levelContexts[3].d}.`,
          category: 'project',
          status: 'locked',
          xp: 200,
          x: 28, y: 18,
          prerequisites: [`${chapterId}-level-3`],
          badgeImage: ASSET_PATHS.OBJ_SCROLL,
          npcKey: 'npc-professor',
        },
        {
          id: `${chapterId}-level-5`,
          title: `Level 5: Persiapan Ujian Akhir`,
          description: `Tinjau kembali seluruh materi ${chapterTitle} sebelum tantangan akhir.`,
          category: 'skill',
          status: 'locked',
          xp: 250,
          x: 25, y: 24,
          prerequisites: [`${chapterId}-level-4`],
          badgeImage: ASSET_PATHS.BADGE_NIGHT_OWL,
          npcKey: 'npc-ai-engineer',
        },
        {
          id: `${chapterId}-level-6`,
          title: `Boss Challenge`,
          description: `Ujian akhir untuk menguasai ${chapterTitle}.`,
          category: 'milestone',
          status: 'locked',
          xp: 500,
          x: 18, y: 26,
          prerequisites: [`${chapterId}-level-5`],
          badge: '🏆',
          badgeImage: ASSET_PATHS.BADGE_COURSE_MASTER,
          npcKey: 'npc-wizard',
        }
      ];
      resolve(dynamicNodes);
      return;
    }

    const sourceNodes = role === 'SMA' ? COURSE_NODES_SMA : COURSE_NODES_MAHASISWA;
    const roadmap = sourceNodes.map(node => {
      if (node.id === 'beasiswa-hub' || node.id === 'job-match') {
        return { ...node, aiRecommendation: 'AI Match (92%): Highly recommended based on your recent skill acquisitions.' };
      }
      if (node.id === 'internship-match' || node.id === 'advanced-skill') {
        return { ...node, aiRecommendation: 'AI Match (88%): Matches your logical reasoning assessment.' };
      }
      return node;
    });
    resolve(roadmap);
  });
};

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

  /* ═══════════════════════════════════════════
     SMA Actions
     ═══════════════════════════════════════════ */

  fetchRecommendedCourses: async () => {
    set({ isFetchingCourses: true, isLoading: true, error: null });
    try {
      const courses = await fetchAIRecommendedCoursesMock();
      set({ recommendedCourses: courses, isFetchingCourses: false, isLoading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch courses';
      set({ error: message, isFetchingCourses: false, isLoading: false });
    }
  },

  selectCourse: (courseId: string) => {
    const { recommendedCourses } = get();
    const course = recommendedCourses.find(c => c.id === courseId);
    if (!course || course.isLocked || course.comingSoon) return;

    // Fetch quest nodes for this course (mock)
    const quests = MOCK_COURSE_QUESTS[courseId] ?? [];

    const activeCourse: ActiveCourse = {
      id: course.id,
      title: course.title,
      description: course.description,
      icon: course.icon,
      category: course.category,
      difficulty: course.difficulty,
      accentColor: course.accentColor,
      quests: quests.map(q => ({ ...q })), // deep copy
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
      const roadmap = await fetchAIRoadmapMock(get().role, chapterId);
      
      // Re-apply completion status from state
      const { completedDynamicNodes } = get();
      const completedSet = new Set(completedDynamicNodes);

      let adjustedRoadmap = roadmap.map(node => {
        if (completedSet.has(node.id)) {
          return { ...node, status: 'completed' as const };
        }
        return node;
      });

      // Iteratively unlock nodes whose prerequisites are all completed
      let changed = true;
      let iterations = 0;
      while (changed && iterations < 100) {
        changed = false;
        iterations++;
        const currentCompleted = new Set(adjustedRoadmap.filter(n => n.status === 'completed').map(n => n.id));
        
        adjustedRoadmap = adjustedRoadmap.map(node => {
          if (node.status === 'locked' && node.prerequisites?.length > 0 && node.prerequisites.every(req => currentCompleted.has(req))) {
            changed = true;
            return { ...node, status: 'available' as const };
          }
          return node;
        });
      }

      set({ nodes: adjustedRoadmap, isLoading: false });
    } catch (err: unknown) {
      console.error("fetchRoadmap error:", err);
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
    }),
  }
  )
);

