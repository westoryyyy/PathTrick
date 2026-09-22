import Phaser from 'phaser';
import type { CourseNodeData } from '../config';
import { NODE_INTERACT_RADIUS, NODE_ICON_MAP, MILESTONE_ICON_MAP } from '../config';

export type NodeEventCallback = (node: CourseNodeData) => void;

const STATUS_CONFIG = {
  locked:      { alpha: 0.6, scale: 0.85 },
  available:   { alpha: 1.0, scale: 1.0 },
  in_progress: { alpha: 1.0, scale: 1.05 },
  completed:   { alpha: 1.0, scale: 1.0 },
};

export class CourseNode {
  private scene: Phaser.Scene;
  public data: CourseNodeData;
  public container!: Phaser.GameObjects.Container;
  private innerCircle!: Phaser.GameObjects.Arc;
  private iconImage!: Phaser.GameObjects.Image;
  private labelText!: Phaser.GameObjects.Text;
  private isNearPlayer = false;
  private onInteract: NodeEventCallback;

  /** Quest order number — shown as a small circle badge in Duolingo mode */
  private questOrder?: number;

  static readonly NODE_RADIUS = 18;

  constructor(
    scene: Phaser.Scene,
    data: CourseNodeData,
    onInteract: NodeEventCallback,
    questOrder?: number,
  ) {
    this.scene = scene;
    this.data = data;
    this.onInteract = onInteract;
    this.questOrder = questOrder;
    this.create();
  }

  /** Resolve the correct sprite key for this node */
  private getIconSpriteKey(): string {
    return this.data.npcKey || 'npc-professor';
  }

  private create() {
    const { x, y, status } = this.data;
    const cfg = STATUS_CONFIG[status];
    const worldX = x * 32 + 16;
    const worldY = y * 32 + 16;

    this.container = this.scene.add.container(worldX, worldY);
    this.container.setDepth(5);

    // Invisible hit area circle
    this.innerCircle = this.scene.add.circle(0, 0, CourseNode.NODE_RADIUS * 1.5, 0x000000, 0.01);
    this.container.add(this.innerCircle);

    // Pixel art icon image (replacing emoji text)
    const spriteKey = this.getIconSpriteKey();
    this.iconImage = this.scene.add.image(0, -10, spriteKey)
      .setOrigin(0.5)
      .setScale(0.35); // Adjusted scale to match player character
    this.container.add(this.iconImage);

    const titleText = this.data.title.replace(': ', '\n');
      
    const displayText = status === 'locked' ? `🔒\n${titleText}` : titleText;

    // Create text without built-in backgroundColor
    this.labelText = this.scene.add.text(0, -CourseNode.NODE_RADIUS - 24, displayText, {
      fontSize: '9px',
      fontFamily: '"Press Start 2P", monospace',
      color: status === 'locked' ? '#94a3b8' : '#fbbf24',
      align: 'center',
      wordWrap: { width: 200 },
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5, 1).setAlpha(1);

    // Draw Dinkum-style rounded background
    const padX = 10;
    const padY = 6;
    const labelW = this.labelText.width + padX * 2;
    const labelH = this.labelText.height + padY * 2;
    const labelX = -labelW / 2;
    // label is origin(0.5, 1), so top Y is -CourseNode.NODE_RADIUS - 24 - height
    const labelY = -CourseNode.NODE_RADIUS - 24 - this.labelText.height - padY;

    const labelBg = this.scene.add.graphics();
    labelBg.fillStyle(0x3b261b, 0.95); // Retro brown fill
    labelBg.fillRoundedRect(labelX, labelY, labelW, labelH, 8);
    labelBg.lineStyle(3, 0x5a3a29, 1); // Thick border
    labelBg.strokeRoundedRect(labelX, labelY, labelW, labelH, 8);

    this.container.add(labelBg);
    this.container.add(this.labelText);

    // Quest order badge (Duolingo mode)
    if (this.questOrder !== undefined) {
      const orderNum = this.questOrder + 1; // 1-indexed display

      // Background circle for number badge
      const badgeBg = this.scene.add.circle(
        -CourseNode.NODE_RADIUS - 6,
        -CourseNode.NODE_RADIUS - 6,
        14, // Increased from 9 for better visibility
        status === 'completed' ? 0x10b981 : status === 'available' ? 0x7c3aed : 0x334155,
        1
      );
      badgeBg.setStrokeStyle(2, 0xffffff); // Add white border
      this.container.add(badgeBg);

      // Number text
      const badgeText = this.scene.add.text(
        -CourseNode.NODE_RADIUS - 6,
        -CourseNode.NODE_RADIUS - 6,
        `${orderNum}`,
        {
          fontSize: '11px', // Increased from 7px
          fontFamily: '"Press Start 2P", monospace',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 3,
        }
      ).setOrigin(0.5);
      this.container.add(badgeText);
    }

    // Scale & alpha
    this.container.setScale(cfg.scale);
    this.container.setAlpha(status === 'locked' ? 0.4 : 1.0);
    if (status === 'locked') {
      this.iconImage.setTint(0x555555); // Darken the locked node
    } else {
      this.iconImage.clearTint();
    }

    // Enable interaction
    this.innerCircle.setInteractive({ useHandCursor: true });
    this.innerCircle.on('pointerover', () => this.onHover(true));
    this.innerCircle.on('pointerout',  () => this.onHover(false));
    // Only allow interaction if the node is not locked. Locked nodes are non-interactive.
    this.innerCircle.on('pointerdown', (_pointer: Phaser.Input.Pointer, _localX: number, _localY: number, event: Phaser.Types.Input.EventData) => {
      event.stopPropagation();
      if (this.data.status !== 'locked') {
        this.onInteract(this.data);
      } else {
        // Brief feedback for locked node: small scale pulse
        this.scene.tweens.add({
          targets: this.container,
          scale: 1.05,
          duration: 100,
          yoyo: true,
        });
      }
    });

    // Animate available/in-progress nodes
    if (status === 'available' || status === 'in_progress') {
      this.scene.tweens.add({
        targets: this.container,
        y: worldY - 4,
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    if (status === 'completed') {
      this.addCompletedSparkles();
    }
  }

  private addCompletedSparkles() {
    const sparklePositions = [
      { x: -24, y: -20 }, { x: 24, y: -20 },
      { x: 0,   y: -28 }, { x: -16, y: 10 },
    ];
    sparklePositions.forEach(({ x, y }, i) => {
      const star = this.scene.add.text(x, y, '✨', { fontSize: '10px' }).setOrigin(0.5);
      this.container.add(star);
      this.scene.tweens.add({
        targets: star,
        alpha: 0, scale: 0,
        duration: 800,
        delay: i * 200,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });
  }

  private onHover(isOver: boolean) {
    this.scene.tweens.add({
      targets: this.container,
      scale: isOver ? 1.2 : 1,
      duration: 120,
      ease: 'Quad.easeOut',
    });
    this.scene.tweens.add({
      targets: this.labelText,
      scale: isOver ? 1.1 : 1,
      duration: 150,
      ease: 'Linear',
    });
  }

  /** Called every frame from WorldMapScene to check proximity */
  checkPlayerProximity(playerX: number, playerY: number): boolean {
    const worldX = this.data.x * 32 + 16;
    const worldY = this.data.y * 32 + 16;
    const dist = Phaser.Math.Distance.Between(playerX, playerY, worldX, worldY);
    const isNear = dist < NODE_INTERACT_RADIUS;

    if (isNear !== this.isNearPlayer) {
      this.isNearPlayer = isNear;
      // Highlight the label (White when near, yellow/gray when far based on status)
      const defaultColor = this.data.status === 'locked' ? '#94a3b8' : '#fbbf24';
      this.labelText.setStyle({ color: isNear ? '#ffffff' : defaultColor });
      // Scale icon on proximity
      this.scene.tweens.add({
        targets: this.iconImage,
        scale: isNear ? 0.45 : 0.35,
        duration: 200,
        ease: 'Back.easeOut',
      });
    }
    return isNear;
  }

  unlock() {
    this.data = { ...this.data, status: 'available' };
    this.scene.tweens.add({
      targets: this.container,
      scale: 1.3,
      duration: 200,
      yoyo: true,
      onComplete: () => {
        this.container.setAlpha(1);
        this.container.setScale(1);
        this.iconImage.clearTint();
        
        // Update label
        const titleText = this.data.title.includes('Level') 
          ? this.data.title.split(': ')[1] || this.data.title 
          : this.data.title;
        this.labelText.setText(titleText);
        this.labelText.setStyle({ color: '#fbbf24' });
      },
    });
  }

  destroy() {
    this.container.destroy();
  }
}
