// Phaser.js game configuration for PATHTRICK World Map
// Note: Phaser cannot be imported at module level in Next.js (browser-only)
// Config is built dynamically inside the WorldMapGame component

export const GAME_CONFIG = {
  type: 0, // Phaser.AUTO // Phaser.AUTO — resolves at runtime
  width: '100%',
  height: '100%',
  backgroundColor: '#0a0e1a',
  pixelArt: true,          // Enable pixel-perfect rendering
  antialias: false,         // Crisp pixels, no blur
  roundPixels: true,        // Prevent sub-pixel rendering
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
} as const;

// Map constants
export const TILE_SIZE = 32;
export const MAP_WIDTH_TILES = 40;
export const MAP_HEIGHT_TILES = 30;

// ══════════════════════════════════════════════
// Centralized Asset Paths
// ══════════════════════════════════════════════
export const ASSET_PATHS = {
  // Main Character
  CHAR_IDLE: '/assets/Main Chara/Idle/idle.png',
  CHAR_WALK_DOWN: '/assets/Main Chara/Idle/Walk(down).png', // Left leg
  CHAR_WALK_UP: '/assets/Main Chara/Idle/Walk(up).png',
  CHAR_WALK_LEFT: '/assets/Main Chara/Idle/Walk(left).png',
  CHAR_WALK_RIGHT: '/assets/Main Chara/Idle/Walk(right).png',
  CHAR_WALK_SIDE_1: '/assets/Main Chara/WalkSide/sidewalk1.png',
  CHAR_WALK_SIDE_2: '/assets/Main Chara/WalkSide/sidewalk2.png',
  CHAR_WALK_SIDE_3: '/assets/Main Chara/WalkSide/sidewalk3.png',
  CHAR_WALK_SIDE_4: '/assets/Main Chara/WalkSide/sidewalk4.png',
  CHAR_CELEBRATE: '/assets/Main Chara/Idle/Celebrate.png',
  CHAR_LEVEL_UP: '/assets/Main Chara/Idle/Level Up.png',
  CHAR_RUN_DOWN: '/assets/Main Chara/Idle/Run (down).png',
  CHAR_INTERACT_1: '/assets/Main Chara/Idle/Interact 1.png',
  CHAR_INTERACT_2: '/assets/Main Chara/Idle/Interact 2.png',
  CHAR_INTERACT_3: '/assets/Main Chara/Idle/Interact 3.png',

  // NPC Sprites
  NPC_GUIDE_BOY: '/NPC Guide Boy.png',
  NPC_HIGH_SCHOOL: '/NPC High School Student.png',
  NPC_WIZARD: '/NPC Wizard.png',
  NPC_MENTOR: '/NPC Mentor.png',
  NPC_AI_ENGINEER: '/NPC AI Engineer.png',
  NPC_PROFESSOR: '/npc-professor.png',
  NPC_SCHOLARSHIP: '/NPC Scolarship Officer.png',
  NPC_RECRUITER: '/NPC Recruiter.png',
  NPC_UNIVERSITY: '/NPC University Student.png',
  NPC_STARTUP: '/NPC Startup Founder.png',

  // Objects — Node Icons
  OBJ_CHEST: '/chest.png',
  OBJ_CHEST_OPEN: '/chest-2.png',
  OBJ_CRYSTAL_GEM: '/crystal-gem.png',
  OBJ_BLUE_GEM: '/blue-gem.png',
  OBJ_RED_GEM: '/red-gem.png',
  OBJ_GREEN_GEM: '/green-gem.png',
  OBJ_BOOK: '/book.png',
  OBJ_BOOK_2: '/assets/Object/book 2.png',
  OBJ_SCROLL: '/Scroll.png',
  OBJ_COMPASS: '/Compass.png',
  OBJ_COMPASS_ROSE: '/Compass Rose.png',
  OBJ_SWORD: '/Sword.png',
  OBJ_SHIELD: '/assets/Object/Shield.png',
  OBJ_COIN: '/assets/Object/Coin/Coin.png',
  OBJ_COIN_2: '/assets/Object/Coin/Coin 2.png',
  OBJ_COIN_3: '/assets/Object/Coin/Coin 3.png',
  OBJ_LANTERN: '/assets/Object/Lantern.png',
  OBJ_LANTERN_2: '/assets/Object/Lantern 2.png',
  OBJ_CANDLE: '/assets/Object/Candle.png',
  OBJ_BACKPACK: '/assets/Object/Backpack.png',
  OBJ_SATCHEL: '/assets/Object/Adventure Satchel.png',
  OBJ_MAP: '/assets/Object/Map/Map.png',
  OBJ_MAP_2: '/assets/Object/Map/Map 2.png',
  OBJ_WORLD_MAP: '/assets/Object/Map/Word Map.png',
  OBJ_ENERGY_SHARD: '/assets/Object/Energy Shard.png',
  OBJ_GOLD_TICKET: '/assets/Object/Gold Ticket.png',
  OBJ_KEYHOLE: '/assets/Object/Keyhole.png',
  OBJ_SILVER_KEY: '/assets/Object/Silver Key.png',
  OBJ_HOURGLASS: '/assets/Object/Hourglass.png',
  OBJ_HELMET: '/assets/Object/Helmet/Helmet.png',
  OBJ_HELMET_2: '/assets/Object/Helmet/Helmet 2.png',
  OBJ_LETTER: '/assets/Object/Letter.png',
  OBJ_JOURNAL: '/assets/Object/Journall.png',
  OBJ_BANNER: '/assets/Object/Banner.png',
  OBJ_BANNER_2: '/assets/Object/Banner 2.png',
  OBJ_CERTIFICATE: '/assets/Object/Sertifiicate.png',
  OBJ_PROGRESS_BAR: '/assets/Object/Progress Bar.png',
  OBJ_XP_BAR: '/assets/Object/XP Bar.png',
  OBJ_SECURITY: '/assets/Object/Security.png',
  OBJ_BLADE: '/assets/Object/Blade.png',
  OBJ_BLADE_2: '/assets/Object/Blade 2.png',
  OBJ_ESSENCE: '/assets/Object/Essence.png',
  OBJ_HEALING_POTION: '/assets/Object/Healing Potions.png',

  // Potions
  OBJ_RED_POTION: '/assets/Object/Potions/Red Potion.png',
  OBJ_BLUE_POTION: '/assets/Object/Potions/Blue Potions.png',
  OBJ_MANA_POTION: '/assets/Object/Potions/Mana Potion.png',
  OBJ_STAMINA_POTION: '/assets/Object/Potions/Stamina Potion.png',
  OBJ_ELIXIR: '/assets/Object/Potions/Elixir.png',

  // Badges
  BADGE_FIRST_STEP: '/First Step.png',
  BADGE_QUICK_LEARNER: '/Quick Learner copy.png',
  BADGE_COURSE_MASTER: '/course-master.png',
  BADGE_MISSION_COMPLETE: '/Mission Completer.png',
  BADGE_STREAK_WARRIOR: '/Streak Warrior copy.png',
  BADGE_QUIZ_MASTER: '/Quiz Master copy.png',
  BADGE_EARLY_BIRD: '/Early Bird.png',
  BADGE_NIGHT_OWL: '/Night Owl copy.png',
  BADGE_COMMUNITY: '/Community Helper.png',

  // Maps
  MAP_MAIN: '/mini-map-course-2.png',
  MAP_KEDOKTERAN: '/Kedokteran.png',
  MAP_MINI_COURSE: '/assets/map/Mini map course.png',
  MAP_ENGINEER: '/engineer map.png',
} as const;

// NPC → Node assignments
export const NPC_ASSIGNMENTS: Record<string, { spriteKey: string; assetPath: string; offsetX: number; offsetY: number }> = {
  'start': { spriteKey: 'npc-guide-boy', assetPath: ASSET_PATHS.NPC_GUIDE_BOY, offsetX: 40, offsetY: -8 },
  'assessment-sma': { spriteKey: 'npc-high-school', assetPath: ASSET_PATHS.NPC_HIGH_SCHOOL, offsetX: 40, offsetY: -8 },
  'roadmap-reveal': { spriteKey: 'npc-wizard', assetPath: ASSET_PATHS.NPC_WIZARD, offsetX: -40, offsetY: -8 },
  'skill-dasar': { spriteKey: 'npc-mentor', assetPath: ASSET_PATHS.NPC_MENTOR, offsetX: 40, offsetY: -8 },
  'mini-project-1': { spriteKey: 'npc-ai-engineer', assetPath: ASSET_PATHS.NPC_AI_ENGINEER, offsetX: -40, offsetY: -8 },
  'sbt-badge-1': { spriteKey: 'npc-professor', assetPath: ASSET_PATHS.NPC_PROFESSOR, offsetX: 40, offsetY: -8 },
  'beasiswa-hub': { spriteKey: 'npc-scholarship', assetPath: ASSET_PATHS.NPC_SCHOLARSHIP, offsetX: -40, offsetY: -8 },
  'internship-match': { spriteKey: 'npc-recruiter', assetPath: ASSET_PATHS.NPC_RECRUITER, offsetX: 40, offsetY: -8 },
};

// Node status → pixel art icon mapping (Phaser texture keys)
export const NODE_ICON_MAP: Record<string, { spriteKey: string; assetPath: string }> = {
  'locked': { spriteKey: 'obj-chest', assetPath: ASSET_PATHS.OBJ_CHEST },
  'available': { spriteKey: 'obj-crystal-gem', assetPath: ASSET_PATHS.OBJ_CRYSTAL_GEM },
  'in_progress': { spriteKey: 'obj-book', assetPath: ASSET_PATHS.OBJ_BOOK },
  'completed': { spriteKey: 'obj-badge-done', assetPath: ASSET_PATHS.BADGE_MISSION_COMPLETE },
};

// Milestone badge → pixel art override
export const MILESTONE_ICON_MAP: Record<string, { spriteKey: string; assetPath: string }> = {
  '🗺️': { spriteKey: 'obj-map', assetPath: ASSET_PATHS.OBJ_MAP },
  '🏆': { spriteKey: 'obj-badge-star', assetPath: ASSET_PATHS.BADGE_COURSE_MASTER },
  '💼': { spriteKey: 'obj-backpack', assetPath: ASSET_PATHS.OBJ_BACKPACK },
};

// Ambient decoration objects placed on the map
export const AMBIENT_DECORATIONS: { spriteKey: string; assetPath: string; x: number; y: number }[] = [
  { spriteKey: 'obj-lantern', assetPath: ASSET_PATHS.OBJ_LANTERN, x: 15, y: 10 },
  { spriteKey: 'obj-lantern-2', assetPath: ASSET_PATHS.OBJ_LANTERN_2, x: 32, y: 18 },
  { spriteKey: 'obj-candle', assetPath: ASSET_PATHS.OBJ_CANDLE, x: 5, y: 22 },
  { spriteKey: 'obj-compass-r', assetPath: ASSET_PATHS.OBJ_COMPASS_ROSE, x: 25, y: 5 },
  { spriteKey: 'obj-sword', assetPath: ASSET_PATHS.OBJ_SWORD, x: 33, y: 10 },
  { spriteKey: 'obj-shield', assetPath: ASSET_PATHS.OBJ_SHIELD, x: 12, y: 25 },
  { spriteKey: 'obj-scroll', assetPath: ASSET_PATHS.OBJ_SCROLL, x: 3, y: 8 },
  { spriteKey: 'obj-hourglass', assetPath: ASSET_PATHS.OBJ_HOURGLASS, x: 37, y: 24 },
];

// Legacy — kept for reference
export const ASSETS = {
  MAP: '/map.png',
  CHARACTER: '/character.png',
  SPRITE_CONFIG: {
    frameWidth: 32,
    frameHeight: 32,
    scale: 2,
  }
};

// Player movement speed
export const PLAYER_SPEED = 160;

// Node interaction radius (pixels)
export const NODE_INTERACT_RADIUS = 64;

// Course node definitions — replace with API data later
export interface CourseNodeData {
  id: string;
  title: string;
  description: string;
  category: 'foundation' | 'skill' | 'project' | 'milestone' | 'bonus';
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  xp: number;
  x: number; // tile x
  y: number; // tile y
  prerequisites: string[];
  badge?: string;
  /** Path to pixel art badge image for React UI */
  badgeImage?: string;
  /** AI generated recommendation shown in the NodeInfoPanel */
  aiRecommendation?: string;
  /** Which NPC sprite to use for this node */
  npcKey?: string;
  /** SMA specific: Link to university details */
  universityMatchId?: string;
  /** Mahasiswa specific: Link to skill gap details */
  jobGapId?: string;
  courseId?: string;
  sectionId?: string;
  chapterId?: string;
  missionId?: string;
}

export const COURSE_NODES_SMA: CourseNodeData[] = [
  {
    id: 'start',
    title: 'Titik Awal',
    description: 'Selamat datang di PATHTRICK! Mulai perjalanan karier kamu di sini.',
    category: 'foundation',
    status: 'available',
    xp: 50,
    x: 20, y: 14,
    prerequisites: [],
    badgeImage: ASSET_PATHS.BADGE_FIRST_STEP,
  },
  {
    id: 'assessment-sma',
    title: 'Asesmen Potensi',
    description: 'Kenali minat & bakatmu. AI akan menganalisis dan membuat roadmap personalmu.',
    category: 'foundation',
    status: 'available',
    xp: 100,
    x: 28, y: 21,
    prerequisites: ['start'],
    badgeImage: ASSET_PATHS.BADGE_QUICK_LEARNER,
  },
  {
    id: 'roadmap-reveal',
    title: 'Roadmap Karier',
    description: 'Roadmap personalmu sudah siap! Lihat jalur mana yang terbuka untukmu.',
    category: 'milestone',
    status: 'locked',
    xp: 150,
    x: 7, y: 12,
    prerequisites: ['assessment-sma'],
    badge: '🗺️',
    badgeImage: ASSET_PATHS.OBJ_MAP,
  },
  {
    id: 'skill-dasar',
    title: 'Fondasi Keahlian',
    description: 'Pelajari skill dasar yang dibutuhkan untuk jalur karier pilihanmu.',
    category: 'skill',
    status: 'locked',
    xp: 200,
    x: 10, y: 18,
    prerequisites: ['roadmap-reveal'],
    badgeImage: ASSET_PATHS.OBJ_SWORD,
  },
  {
    id: 'mini-project-1',
    title: 'Mini Project #1',
    description: 'Terapkan ilmumu dalam proyek nyata. AI akan mengevaluasi hasil kerjamu.',
    category: 'project',
    status: 'locked',
    xp: 300,
    x: 29, y: 8,
    prerequisites: ['skill-dasar'],
    badgeImage: ASSET_PATHS.OBJ_SCROLL,
  },
  {
    id: 'sbt-badge-1',
    title: 'Skill Badge — Level 1',
    description: 'Selamat! Kamu telah menyelesaikan fondasi. Klaim Sertifikat pertamamu yang tersimpan permanen on-chain.',
    category: 'milestone',
    status: 'locked',
    xp: 500,
    x: 20, y: 3,
    prerequisites: ['mini-project-1'],
    badge: '🏆',
    badgeImage: ASSET_PATHS.BADGE_COURSE_MASTER,
  },
  {
    id: 'beasiswa-hub',
    title: 'Beasiswa Hub',
    description: 'Temukan beasiswa yang cocok dengan profil dan prestasi akademikmu.',
    category: 'skill',
    status: 'locked',
    xp: 100,
    x: 7, y: 5,
    prerequisites: ['roadmap-reveal'],
    badgeImage: ASSET_PATHS.OBJ_GOLD_TICKET,
    universityMatchId: 'ui-cs',
  },
  {
    id: 'internship-match',
    title: 'University Match',
    description: 'AI mencocokkan profilmu dengan universitas yang tepat.',
    category: 'milestone',
    status: 'locked',
    xp: 250,
    x: 35, y: 15,
    prerequisites: ['sbt-badge-1'],
    badge: '💼',
    badgeImage: ASSET_PATHS.OBJ_BACKPACK,
    universityMatchId: 'itb-stei',
  },
];

export const COURSE_NODES_MAHASISWA: CourseNodeData[] = [
  {
    id: 'start',
    title: 'Welcome, Chaser!',
    description: 'Mulai persiapan karier profesionalmu di sini.',
    category: 'foundation',
    status: 'available',
    xp: 50,
    x: 2, y: 5,
    prerequisites: [],
    badgeImage: ASSET_PATHS.BADGE_FIRST_STEP,
  },
  {
    id: 'cv-review',
    title: 'AI CV Analysis',
    description: 'AI menganalisis CV dan Portofolio kamu untuk mencari gap skill.',
    category: 'foundation',
    status: 'locked',
    xp: 150,
    x: 10, y: 8,
    prerequisites: ['start'],
    badgeImage: ASSET_PATHS.BADGE_QUICK_LEARNER,
  },
  {
    id: 'advanced-skill',
    title: 'Advanced Tech Stack',
    description: 'Pelajari skill tingkat lanjut yang diminta oleh industri saat ini.',
    category: 'skill',
    status: 'locked',
    xp: 300,
    x: 18, y: 12,
    prerequisites: ['cv-review'],
    badgeImage: ASSET_PATHS.OBJ_SWORD,
    jobGapId: 'frontend-goto',
  },
  {
    id: 'job-match',
    title: 'Job & Internship Match',
    description: 'Temukan pekerjaan yang tepat setelah kamu memiliki semua SBT yang dibutuhkan.',
    category: 'milestone',
    status: 'locked',
    xp: 500,
    x: 28, y: 22,
    prerequisites: ['advanced-skill'],
    badge: '💼',
    badgeImage: ASSET_PATHS.OBJ_BACKPACK,
    jobGapId: 'uiux-traveloka',
  }
];
