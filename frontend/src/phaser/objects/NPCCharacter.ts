import Phaser from 'phaser';
import { TILE_SIZE } from '../config';

export interface NPCConfig {
  spriteKey: string;
  worldX: number;
  worldY: number;
  offsetX: number;
  offsetY: number;
}

/**
 * Static NPC character placed near a course node.
 * Shows an idle bob animation and a speech bubble indicator on hover.
 */
export class NPCCharacter {
  private scene: Phaser.Scene;
  private sprite: Phaser.GameObjects.Image;
  private shadow: Phaser.GameObjects.Ellipse;
  private speechBubble: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, config: NPCConfig) {
    this.scene = scene;

    const x = config.worldX + config.offsetX;
    const y = config.worldY + config.offsetY;

    // Shadow under NPC
    this.shadow = scene.add.ellipse(x, y + 18, 24, 8, 0x000000, 0.25)
      .setDepth(3);

    // NPC sprite
    this.sprite = scene.add.image(x, y, config.spriteKey)
      .setDepth(4)
      .setScale(0.5);

    // Speech bubble indicator (hidden by default)
    this.speechBubble = scene.add.text(x, y - 28, '💬', {
      fontSize: '12px',
    }).setOrigin(0.5).setDepth(5).setAlpha(0);

    // Idle bob animation
    scene.tweens.add({
      targets: this.sprite,
      y: y - 3,
      duration: 1800 + Math.random() * 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Shadow syncs with bob
    scene.tweens.add({
      targets: this.shadow,
      scaleX: { from: 0.95, to: 1.05 },
      alpha: { from: 0.2, to: 0.3 },
      duration: 1800 + Math.random() * 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Speech bubble float
    scene.tweens.add({
      targets: this.speechBubble,
      y: y - 32,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Interactive hover
    this.sprite.setInteractive({ useHandCursor: true });
    this.sprite.on('pointerover', () => {
      scene.tweens.add({
        targets: this.speechBubble,
        alpha: 1,
        duration: 200,
      });
      scene.tweens.add({
        targets: this.sprite,
        scale: 0.55,
        duration: 150,
        ease: 'Back.easeOut',
      });
    });
    this.sprite.on('pointerout', () => {
      scene.tweens.add({
        targets: this.speechBubble,
        alpha: 0,
        duration: 200,
      });
      scene.tweens.add({
        targets: this.sprite,
        scale: 0.5,
        duration: 150,
      });
    });
  }

  destroy() {
    this.sprite.destroy();
    this.shadow.destroy();
    this.speechBubble.destroy();
  }
}
