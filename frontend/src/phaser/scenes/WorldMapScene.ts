import Phaser from 'phaser';
import {
  TILE_SIZE, MAP_WIDTH_TILES, MAP_HEIGHT_TILES,
  ASSET_PATHS,
  NODE_ICON_MAP, MILESTONE_ICON_MAP,
  AMBIENT_DECORATIONS, NPC_ASSIGNMENTS,
} from '../config';
import { PlayerCharacter } from '../objects/PlayerCharacter';
import { CourseNode } from '../objects/CourseNode';
import type { CourseNodeData } from '../config';
import type { QuestNode } from '@/store/useMapStore';
import { useMapStore } from '@/store/useMapStore';

// Events emitted to React
export const WORLD_MAP_EVENTS = {
  NODE_SELECTED: 'node:selected',
  NODE_NEARBY: 'node:nearby',
  NODE_LEAVE: 'node:leave',
  PLAYER_POSITION: 'player:position',
  READY: 'scene:ready',
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
  return quests.map((quest) => {
    // If the store has explicit non-zero coordinates, use them
    if (quest.x !== 0 || quest.y !== 0) {
      return { x: quest.x, y: quest.y };
    }

    // Generate random positions within a safe land area of the map
    // X between 300 and 950, Y between 250 and 750
    const randX = Math.floor(Math.random() * (950 - 300 + 1)) + 300;
    const randY = Math.floor(Math.random() * (750 - 250 + 1)) + 250;

    return { x: randX, y: randY };
  });
}

/** Resolve which map texture key should be shown for the current store state. */
function resolveMapTextureKey(state: { role: string; houseId?: string; activeChapterId?: string }): string {
  let textureKey = state.role === 'SMA' ? 'world-map-sma' : 'world-map-mahasiswa';

  if (state.houseId) {
    if (state.houseId === 'house-health') textureKey = 'world-map-kedokteran';
    else if (state.houseId === 'house-education') textureKey = 'world-map-3';
    else if (state.houseId === 'house-arts') textureKey = 'world-map-4';
    else if (state.houseId === 'house-social') textureKey = 'world-map-6';
    else if (state.houseId === 'house-agriculture') textureKey = 'world-map-8';
    else if (state.houseId === 'house-engineering' || state.houseId === 'house-ict') textureKey = 'world-map-mahasiswa';
    else textureKey = 'world-map-6';
  } else if (state.activeChapterId) {
    const c = state.activeChapterId;
    if (c === 'module-health-1-bab-1') textureKey = 'world-map-kedokteran';
    else if (c === 'module-education-1-bab-2') textureKey = 'world-map-3';
    else if (c === 'module-arts-1-bab-1') textureKey = 'world-map-4';
    else if (c === 'module-arts-1-bab-2') textureKey = 'world-map-5';
    else if (c === 'module-social-1-bab-1') textureKey = 'world-map-6';
    else if (c === 'module-social-1-bab-2') textureKey = 'world-map-7';
    else if (c === 'module-agriculture-1-bab-1') textureKey = 'world-map-8';
    else if (c.startsWith('module-engineering')) textureKey = 'world-map-mahasiswa';
    else textureKey = 'world-map-6';
  }
  return textureKey;
}

function mapTexturePath(key: string): string {
  if (key === 'world-map-sma') return ASSET_PATHS.MAP_MAIN as string;
  if (key === 'world-map-mahasiswa') return ASSET_PATHS.MAP_ENGINEER as string;
  if (key === 'world-map-kedokteran') return ASSET_PATHS.MAP_KEDOKTERAN as string;
  return encodeURI(`/map ${key.replace('world-map-', '')}.png`);
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
    // ── Map: hanya load texture yang dipakai (sebelumnya ±20 PNG besar diunduh sekaligus) ──
    const initialMapKey = resolveMapTextureKey(useMapStore.getState());
    this.load.image(initialMapKey, mapTexturePath(initialMapKey));

    // ── Player character sprites ──
    this.load.spritesheet('walk-down', ASSET_PATHS.CHAR_WALK_DOWN, { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('walk-up', ASSET_PATHS.CHAR_WALK_UP, { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('walk-left', ASSET_PATHS.CHAR_WALK_LEFT, { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('walk-right', ASSET_PATHS.CHAR_WALK_RIGHT, { frameWidth: 128, frameHeight: 128 });
    this.load.image('walk-side-1', ASSET_PATHS.CHAR_WALK_SIDE_1);
    this.load.image('walk-side-2', ASSET_PATHS.CHAR_WALK_SIDE_2);
    this.load.image('walk-side-3', ASSET_PATHS.CHAR_WALK_SIDE_3);
    this.load.image('walk-side-4', ASSET_PATHS.CHAR_WALK_SIDE_4);
    this.load.spritesheet('idle', ASSET_PATHS.CHAR_IDLE, { frameWidth: 128, frameHeight: 128 });

    // ── Node icon sprites ──
    Object.values(NODE_ICON_MAP).forEach(({ spriteKey, assetPath }) => {
      this.load.image(spriteKey, assetPath);
    });
    Object.values(MILESTONE_ICON_MAP).forEach(({ spriteKey, assetPath }) => {
      this.load.image(spriteKey, assetPath);
    });

    // ── NPCs ──
    Object.values(NPC_ASSIGNMENTS).forEach(({ spriteKey, assetPath }) => {
      this.load.image(spriteKey, assetPath);
    });

    // ── Audio ──
    this.load.audio('walk-sound', '/jalanMusic.ogg');
    this.load.audio('bgm-map', '/WorldMapMusic.ogg');
    this.load.audio('bgm-boss', '/BossFightMusic.ogg');
  }

  private openNodeDialog(nodeData: CourseNodeData) {
    try {
      const sfx = new Audio('/EntryLevel.ogg');
      sfx.volume = 0.6;
      sfx.play().catch(() => {});
    } catch(e) {}
    this.game.events.emit(WORLD_MAP_EVENTS.NODE_SELECTED, nodeData);
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

    // Initial BGM check
    this.updateBGM();

    const enterKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    if (enterKey) {
      enterKey.on('down', () => {
        if ((window as any).__isNodePanelOpen) return; // Ignore Enter key for map if UI panel is already open
        
        if (this.nearbyNodeId) {
          const node = this.courseNodes.find(n => n.data.id === this.nearbyNodeId);
          if (node && node.data.status !== 'locked') {
            this.openNodeDialog(node.data);
          }
        }
      });
    }

    // Subscribe to Zustand store for updates
    this.unsubscribeStore = useMapStore.subscribe((state, prevState) => {
      // Handle Role change or Chapter change (background switch)
      if (state.role !== prevState.role || state.activeChapterId !== prevState.activeChapterId) {
        const textureKey = resolveMapTextureKey(state);

        if (this.textures.exists(textureKey)) {
          this.mapImage.setTexture(textureKey);
        } else {
          // Texture belum dimuat (lazy) -> load dulu baru ganti
          this.load.image(textureKey, mapTexturePath(textureKey));
          this.load.once(Phaser.Loader.Events.COMPLETE, () => {
            if (this.mapImage && this.mapImage.scene) this.mapImage.setTexture(textureKey);
          });
          this.load.start();
        }
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

    this.events.once(Phaser.Scenes.Events.DESTROY, () => {
      if (this.unsubscribeStore) {
        this.unsubscribeStore();
        this.unsubscribeStore = undefined;
      }
    });

    // Beri tahu React bahwa scene sudah siap dirender
    this.game.events.emit(WORLD_MAP_EVENTS.READY);
  }

  /* ═══════════════════════════════════════════
     Map & Ambient
     ═══════════════════════════════════════════ */

  private buildMap() {
    const textureKey = resolveMapTextureKey(useMapStore.getState());

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

      const node = new CourseNode(this, questWithPos, (data: CourseNodeData, worldX: number, worldY: number, spriteKey: string) => {
        // Stop any current movement
        if (this.player) {
          // Walk to the node's position (slightly below the center)
          const targetY = worldY + 30;
          const dist = Phaser.Math.Distance.Between(this.player.sprite.x, this.player.sprite.y, worldX, targetY);
          const duration = Math.max(500, (dist / 150) * 1000); // 150 pixels per second

          this.player.autoWalkTo(worldX, targetY, duration, () => {
            this.openNodeDialog(data);
          });
        } else {
          this.openNodeDialog(data);
        }
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
          x1 + nx * end, y1 + ny * end,
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
    this.updateBGM();
  }

  /* ═══════════════════════════════════════════
     Legacy Flat Node Methods (Mahasiswa)
     ═══════════════════════════════════════════ */

  private buildCourseNodes() {
    const nodes = useMapStore.getState().nodes;
    nodes.forEach(nodeData => {
      const node = new CourseNode(this, nodeData, (data: CourseNodeData, worldX: number, worldY: number, spriteKey: string) => {
        if (this.player) {
          const targetY = worldY + 30;
          const dist = Phaser.Math.Distance.Between(this.player.sprite.x, this.player.sprite.y, worldX, targetY);
          const duration = Math.max(500, (dist / 150) * 1000);

          this.player.autoWalkTo(worldX, targetY, duration, () => {
            this.openNodeDialog(data);
          });
        } else {
          this.openNodeDialog(data);
        }
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
    this.updateBGM();
  }

  /* ═══════════════════════════════════════════
     Audio Management
     ═══════════════════════════════════════════ */

  private updateBGM() {
    if (!this.sound || !this.sound.get) return; // Guard if destroyed

    let shouldPlayBossMusic = false;

    // Get completed nodes from persistent store
    const completedDynamicNodes = useMapStore.getState().completedDynamicNodes;

    // Check if there is any active (non-completed) Boss node
    const hasActiveBossNode = this.courseNodes.some(node => {
      const data = node.data;
      const isBoss = data.category === 'milestone' || data.title.toLowerCase().includes('boss');
      const isCompleted = data.status === 'completed' || completedDynamicNodes.includes(data.id);
      return isBoss && !isCompleted && (data.status === 'available' || data.status === 'in_progress');
    });

    if (hasActiveBossNode) {
      shouldPlayBossMusic = true;
    }

    const targetBgmKey = shouldPlayBossMusic ? 'bgm-boss' : 'bgm-map';
    const otherBgmKey = targetBgmKey === 'bgm-boss' ? 'bgm-map' : 'bgm-boss';

    let targetSound = this.sound.get(targetBgmKey) as Phaser.Sound.WebAudioSound;
    if (!targetSound) {
      targetSound = this.sound.add(targetBgmKey, { loop: true, volume: 0 }) as Phaser.Sound.WebAudioSound;
    }

    // Play or switch the music with Crossfade
    if (!targetSound.isPlaying) {
      targetSound.setVolume(0);
      targetSound.play();

      this.tweens.add({
        targets: targetSound,
        volume: 0.4,
        duration: 1500,
        ease: 'Linear'
      });
    }

    const otherSound = this.sound.get(otherBgmKey) as Phaser.Sound.WebAudioSound;
    if (otherSound && otherSound.isPlaying) {
      this.tweens.add({
        targets: otherSound,
        volume: 0,
        duration: 1500,
        ease: 'Linear',
        onComplete: () => {
          otherSound.stop();
        }
      });
    }
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
      this.unsubscribeStore = undefined;
    }
  }
}
