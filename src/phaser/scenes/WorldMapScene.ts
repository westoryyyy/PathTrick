import Phaser from 'phaser';
import {
  TILE_SIZE, MAP_WIDTH_TILES, MAP_HEIGHT_TILES,
  ASSET_PATHS,
  NODE_ICON_MAP, MILESTONE_ICON_MAP,
  AMBIENT_DECORATIONS,
} from '../config';
import { PlayerCharacter } from '../objects/PlayerCharacter';
import { CourseNode } from '../objects/CourseNode';
import type { CourseNodeData } from '../config';
import type { QuestNode } from '@/store/useMapStore';
import { useMapStore } from '@/store/useMapStore';

// Events emitted to React
export const WORLD_MAP_EVENTS = {
  NODE_SELECTED:    'node:selected',
  NODE_NEARBY:      'node:nearby',
  NODE_LEAVE:       'node:leave',
  PLAYER_POSITION:  'player:position',
} as const;

/* ═══════════════════════════════════════════════
   Duolingo-Style Path Layout
   ═══════════════════════════════════════════════ */

const PATH_CONFIG = {
  startY: 120,        // first node Y position (px)
  spacingY: 110,      // vertical gap between nodes (px)
  amplitudeX: 90,     // horizontal zigzag offset from center (px)
  centerX: (MAP_WIDTH_TILES * TILE_SIZE) / 2,  // horizontal center
};

// Hardcoded approximate coordinates for the 12 houses/points of interest on the map
const MANUAL_POSITIONS = [
  { x: 640, y: 150 }, // 1: Tenda (diubah dari posisi 12 sesuai instruksi user)
  { x: 350, y: 350 }, // 2: Pulau kecil kiri dgn mercusuar
  { x: 950, y: 580 }, // 3: Area kebun (bawah rumah biru)
  { x: 640, y: 520 }, // 4: Tengah map
  { x: 250, y: 560 }, // 5: Dekat jembatan kiri
  { x: 250, y: 780 }, // 6: Kiri bawah
  { x: 550, y: 820 }, // 7: Tengah bawah
  { x: 900, y: 820 }, // 8: Kanan bawah
  { x: 1150, y: 650 }, // 9: Kanan ujung
  { x: 800, y: 450 }, // 10: Dekat sungai kanan
  { x: 1000, y: 350 }, // 11: Rumah atap biru (kanan) - ditukar
  { x: 580, y: 300 }, // 12: Boss (tengah atas puncak - ditukar)
];

/** Calculate world positions for the quest chain */
function computeQuestPositions(quests: QuestNode[]): { x: number; y: number }[] {
  return quests.map((quest, index) => {
    // If the store has explicit non-zero coordinates, use them
    if (quest.x !== 0 || quest.y !== 0) {
      return { x: quest.x, y: quest.y };
    }
    // Otherwise fallback to our manual estimated positions for the 12 houses
    return MANUAL_POSITIONS[index % MANUAL_POSITIONS.length];
  });
}

export class WorldMapScene extends Phaser.Scene {
  private player!: PlayerCharacter;
  private courseNodes: CourseNode[] = [];
  private mapImage!: Phaser.GameObjects.Image;
  private pathGraphics!: Phaser.GameObjects.Graphics;
  private nearbyNodeId: string | null = null;
  private unsubscribeStore?: () => void;

  /** Whether this scene is in Duolingo-mode (SMA course) or legacy-mode (Mahasiswa) */
  private isDuolingoMode = false;

  static readonly SCENE_KEY = 'WorldMapScene';

  constructor() {
    super({ key: WorldMapScene.SCENE_KEY });
  }

  preload() {
    // ── Main map ──
    this.load.image('world-map-sma', ASSET_PATHS.MAP_MAIN);
    this.load.image('world-map-mahasiswa', ASSET_PATHS.MAP_ENGINEER);

    // ── Dynamic Maps (3 to 20) ──
    for (let i = 3; i <= 20; i++) {
      this.load.image(`world-map-${i}`, encodeURI(`/map ${i}.png`));
    }

    // ── Custom Maps ──
    this.load.image('world-map-kedokteran', ASSET_PATHS.MAP_KEDOKTERAN);

    // ── Player character sprites ──
    this.load.spritesheet('walk-down',  ASSET_PATHS.CHAR_WALK_DOWN,  { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('walk-up',    ASSET_PATHS.CHAR_WALK_UP,    { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('walk-left',  ASSET_PATHS.CHAR_WALK_LEFT,  { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('walk-right', ASSET_PATHS.CHAR_WALK_RIGHT, { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('idle',       ASSET_PATHS.CHAR_IDLE,       { frameWidth: 128, frameHeight: 128 });

    // ── Node icon sprites ──
    Object.values(NODE_ICON_MAP).forEach(({ spriteKey, assetPath }) => {
      this.load.image(spriteKey, assetPath);
    });
    Object.values(MILESTONE_ICON_MAP).forEach(({ spriteKey, assetPath }) => {
      this.load.image(spriteKey, assetPath);
    });

    // ── NPCs ──
    this.load.image('npc-professor', ASSET_PATHS.NPC_PROFESSOR);
  }

  create() {
    const state = useMapStore.getState();
    this.isDuolingoMode = state.role === 'SMA' && state.currentActiveCourse !== null;

    this.buildMap();
    this.pathGraphics = this.add.graphics();
    this.pathGraphics.setDepth(3);

    if (!this.isDuolingoMode) {
      // Legacy Mahasiswa mode
      this.buildCourseNodes();
    } else {
      // Duolingo SMA mode
      this.buildDuolingoNodes();
      this.drawDuolingoPath();
    }

    this.buildPlayer();
    this.setupCamera();
    this.setupPointerMovement();

    const enterKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    if (enterKey) {
      enterKey.on('down', () => {
        if (this.nearbyNodeId) {
          const node = this.courseNodes.find(n => n.data.id === this.nearbyNodeId);
          if (node && node.data.status !== 'locked') {
            this.game.events.emit(WORLD_MAP_EVENTS.NODE_SELECTED, node.data);
          }
        }
      });
    }

    // Subscribe to Zustand store for updates
    this.unsubscribeStore = useMapStore.subscribe((state, prevState) => {
      // Handle Role change or Chapter change (background switch)
      if (state.role !== prevState.role || state.activeChapterId !== prevState.activeChapterId) {
        let textureKey = state.role === 'SMA' ? 'world-map-sma' : 'world-map-mahasiswa';
        
        // If there's an active chapter, deterministically pick a map
        if (state.activeChapterId) {
          if (state.activeChapterId === 'module-health-1-bab-1') {
            textureKey = 'world-map-kedokteran';
          } else if (state.activeChapterId.startsWith('module-engineering')) {
            textureKey = 'world-map-mahasiswa';
          } else {
            const mapIndex = 6; // Default to map 6
            textureKey = `world-map-${mapIndex}`;
          }
        }
        
        this.mapImage.setTexture(textureKey);
      }

      // Duolingo mode: listen to currentActiveCourse quest updates
      if (this.isDuolingoMode && state.currentActiveCourse) {
        const prevQuests = prevState.currentActiveCourse?.quests;
        const currQuests = state.currentActiveCourse.quests;

        if (prevQuests && currQuests && prevQuests !== currQuests) {
          this.syncDuolingoNodes(currQuests);
        }
      }

      // Legacy mode: handle flat nodes update
      if (!this.isDuolingoMode && state.nodes !== prevState.nodes && state.nodes.length > 0) {
        const isNewRoadmap = prevState.nodes.length === 0 || state.nodes[0].id !== prevState.nodes[0]?.id;
        if (isNewRoadmap) {
          this.rebuildCourseNodes();
          this.resetPlayerPosition();
        } else {
          this.syncCourseNodes(state.nodes);
        }
      }
    });
  }

  /* ═══════════════════════════════════════════
     Map & Ambient
     ═══════════════════════════════════════════ */

  private buildMap() {
    const state = useMapStore.getState();
    let textureKey = state.role === 'SMA' ? 'world-map-sma' : 'world-map-mahasiswa';

    if (state.activeChapterId) {
      if (state.activeChapterId === 'module-health-1-bab-1') {
        textureKey = 'world-map-kedokteran';
      } else if (state.activeChapterId.startsWith('module-engineering')) {
        textureKey = 'world-map-mahasiswa';
      } else {
        textureKey = 'world-map-6';
      }
    }

    this.mapImage = this.add.image(0, 0, textureKey).setOrigin(0, 0);
    this.mapImage.setDisplaySize(MAP_WIDTH_TILES * TILE_SIZE, MAP_HEIGHT_TILES * TILE_SIZE);
    this.mapImage.setDepth(0);
  }

  /* ═══════════════════════════════════════════
     Duolingo-Style Quest Nodes
     ═══════════════════════════════════════════ */

  private buildDuolingoNodes() {
    const activeCourse = useMapStore.getState().currentActiveCourse;
    if (!activeCourse) return;

    const quests = activeCourse.quests;
    const positions = computeQuestPositions(quests);

    quests.forEach((quest, i) => {
      // Override the tile-based x/y with computed pixel positions
      const questWithPos: CourseNodeData = {
        ...quest,
        // Store pixel coords divided by TILE_SIZE so CourseNode's `x * 32 + 16` yields the right position
        x: (positions[i].x - 16) / 32,
        y: (positions[i].y - 16) / 32,
      };

      const node = new CourseNode(this, questWithPos, (data: CourseNodeData) => {
        this.game.events.emit(WORLD_MAP_EVENTS.NODE_SELECTED, data);
      }, quest.order);
      this.courseNodes.push(node);
    });
  }

  private drawDuolingoPath() {
    // User requested to remove the connecting lines entirely 
    // and rely only on the numbered badges.
    const gfx = this.pathGraphics;
    gfx.clear();
  }

  private drawDashedLine(
    gfx: Phaser.GameObjects.Graphics,
    x1: number, y1: number,
    x2: number, y2: number,
    color: number, alpha: number, lineWidth: number,
    dashLength = 8, gapLength = 6,
  ) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const nx = dx / dist;
    const ny = dy / dist;

    let drawn = 0;
    let drawing = true;

    gfx.lineStyle(lineWidth, color, alpha);

    while (drawn < dist) {
      const segLen = drawing ? dashLength : gapLength;
      const end = Math.min(drawn + segLen, dist);

      if (drawing) {
        gfx.lineBetween(
          x1 + nx * drawn, y1 + ny * drawn,
          x1 + nx * end,   y1 + ny * end,
        );
      }

      drawn = end;
      drawing = !drawing;
    }
  }

  private syncDuolingoNodes(quests: QuestNode[]) {
    this.courseNodes.forEach(node => {
      const updated = quests.find(q => q.id === node.data.id);
      if (updated && updated.status !== node.data.status) {
        if (updated.status === 'available' && node.data.status === 'locked') {
          node.unlock();
        } else {
          node.data = updated;
        }
      }
    });
    // Redraw paths to reflect new unlock state
    this.drawDuolingoPath();
  }

  /* ═══════════════════════════════════════════
     Legacy Flat Node Methods (Mahasiswa)
     ═══════════════════════════════════════════ */

  private buildCourseNodes() {
    const nodes = useMapStore.getState().nodes;
    nodes.forEach(nodeData => {
      const node = new CourseNode(this, nodeData, (data: CourseNodeData) => {
        this.game.events.emit(WORLD_MAP_EVENTS.NODE_SELECTED, data);
      });
      this.courseNodes.push(node);
    });
  }

  private rebuildCourseNodes() {
    this.courseNodes.forEach(node => {
      node.destroy();
    });
    this.courseNodes = [];
    this.buildCourseNodes();
  }

  private syncCourseNodes(nodes: CourseNodeData[]) {
    this.courseNodes.forEach(node => {
      const newData = nodes.find(n => n.id === node.data.id);
      if (newData && newData.status !== node.data.status) {
        if (newData.status === 'available' && node.data.status === 'locked') {
          node.unlock();
        } else {
          node.data = newData;
        }
      }
    });
  }

  /* ═══════════════════════════════════════════
     Player & Camera
     ═══════════════════════════════════════════ */

  private resetPlayerPosition() {
    if (!this.player) return;
    const nodes = useMapStore.getState().nodes;
    const startNode = nodes.find(n => n.id === 'start');
    if (startNode) {
      this.player.sprite.setPosition(startNode.x * TILE_SIZE + 16, startNode.y * TILE_SIZE + 16);
    }
  }

  private buildPlayer() {
    let startX: number;
    let startY: number;

    if (this.isDuolingoMode) {
      const activeCourse = useMapStore.getState().currentActiveCourse;
      const lastCompletedQuestId = useMapStore.getState().lastCompletedQuestId;

      if (activeCourse && activeCourse.quests.length > 0) {
        const positions = computeQuestPositions(activeCourse.quests);
        
        // Default target is the first available quest
        const firstAvailable = activeCourse.quests.find(q => q.status === 'available')
          ?? activeCourse.quests[0];
        const targetPos = positions[firstAvailable.order] ?? positions[0];

        if (lastCompletedQuestId) {
          // If returning from a completed quest, start at the completed quest
          const lastCompleted = activeCourse.quests.find(q => q.id === lastCompletedQuestId);
          if (lastCompleted) {
            const startPos = positions[lastCompleted.order];
            startX = startPos.x;
            startY = startPos.y - 30;

            // Clear the state so it only happens once
            // Note: Do NOT auto-walk the player. The player must move manually to the next node.
            useMapStore.getState().clearLastCompletedQuest();
          } else {
            startX = targetPos.x;
            startY = targetPos.y - 30;
          }
        } else {
          // Normal spawn at current available node
          startX = targetPos.x;
          startY = targetPos.y - 30;
        }
      } else {
        startX = PATH_CONFIG.centerX;
        startY = PATH_CONFIG.startY;
      }
    } else {
      const nodes = useMapStore.getState().nodes;
      const startNode = nodes.find(n => n.id === 'start');
      startX = startNode ? startNode.x * TILE_SIZE + 16 : 20 * TILE_SIZE;
      startY = startNode ? startNode.y * TILE_SIZE + 16 : 14 * TILE_SIZE;
    }

    this.player = new PlayerCharacter(this, startX, startY);
    this.physics.world.setBounds(0, 0, MAP_WIDTH_TILES * TILE_SIZE, MAP_HEIGHT_TILES * TILE_SIZE);

  }

  private setupCamera() {
    const cam = this.cameras.main;
    cam.startFollow(this.player.sprite, true, 0.1, 0.1);
    cam.setZoom(this.isDuolingoMode ? 1.5 : 1.5);
    cam.setBounds(0, 0, MAP_WIDTH_TILES * TILE_SIZE, MAP_HEIGHT_TILES * TILE_SIZE);
  }

  private setupPointerMovement() {
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (!this.player || pointer.event?.defaultPrevented) return;

      const hitNodes = this.courseNodes.some((node) => {
        const distance = Phaser.Math.Distance.Between(
          pointer.worldX,
          pointer.worldY,
          node.container.x,
          node.container.y,
        );

        return distance <= 42;
      });

      if (hitNodes) return;
      this.player.moveTo(pointer.worldX, pointer.worldY);
    });
  }

  /* ═══════════════════════════════════════════
     Update Loop
     ═══════════════════════════════════════════ */

  update(_time: number, delta: number) {
    this.player.update(delta);

    let newNearby: string | null = null;
    this.courseNodes.forEach(node => {
      const isNear = node.checkPlayerProximity(this.player.x, this.player.y);
      if (isNear && node.data.status !== 'locked') newNearby = node.data.id;
    });

    if (newNearby !== this.nearbyNodeId) {
      this.nearbyNodeId = newNearby;
      if (newNearby) {
        const node = this.courseNodes.find(n => n.data.id === newNearby);
        if (node) {
          this.game.events.emit(WORLD_MAP_EVENTS.NODE_NEARBY, node.data);
        }
      } else {
        this.game.events.emit(WORLD_MAP_EVENTS.NODE_LEAVE);
      }
    }

    this.game.events.emit(WORLD_MAP_EVENTS.PLAYER_POSITION, { x: this.player.x, y: this.player.y });
  }

  shutdown() {
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
    }
  }
}
