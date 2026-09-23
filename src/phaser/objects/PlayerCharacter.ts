import Phaser from 'phaser';

export class PlayerCharacter {
  private scene: Phaser.Scene;
  public sprite: Phaser.Physics.Arcade.Sprite;
  private cursors!: {
    up: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key;
    w: Phaser.Input.Keyboard.Key;   s: Phaser.Input.Keyboard.Key;
    a: Phaser.Input.Keyboard.Key;   d: Phaser.Input.Keyboard.Key;
  };
  private facing: 'up' | 'down' | 'left' | 'right' = 'down';
  private isMoving = false;
  private moveTarget: Phaser.Math.Vector2 | null = null;
  private walkTimer = 0;
  private walkPhase = 0; // 0 = neutral, 1 = step1, 2 = neutral, 3 = step2
  private readonly WALK_INTERVAL = 150; // ms per walk phase
  private walkSound?: Phaser.Sound.BaseSound;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;

    // Start with idle (down-facing)
    this.sprite = scene.physics.add.sprite(x, y, 'idle');
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setDepth(10);
    this.sprite.setScale(0.4);

    this.setupAnimations();
    this.setupInput();
    this.addShadow();

    if (scene.cache.audio.exists('walk-sound')) {
      this.walkSound = scene.sound.add('walk-sound', { loop: true, volume: 0.8 });
    }
  }

  private setupAnimations() {
    const anims = this.scene.anims;
    if (anims.exists('player-walk-down')) return;

    // Walk animations — each PNG is a single frame, so frameRate doesn't matter much
    // We use the texture key directly and flip between idle and walk textures
    // to simulate walking motion.
    // All walk sprites: single 128x128 frame
    anims.create({ key: 'player-walk-down',  frames: [{ key: 'walk-down' }],  frameRate: 8, repeat: -1 });
    anims.create({ key: 'player-walk-left',  frames: [{ key: 'walk-left' }],  frameRate: 8, repeat: -1 });
    anims.create({ key: 'player-walk-right', frames: [{ key: 'walk-right' }], frameRate: 8, repeat: -1 });
    anims.create({ key: 'player-walk-up',    frames: [{ key: 'walk-up' }],    frameRate: 8, repeat: -1 });
    anims.create({ key: 'player-idle',       frames: [{ key: 'idle' }],       frameRate: 4, repeat: -1 });

    this.sprite.play('player-idle');
  }

  private setupInput() {
    const kb = this.scene.input.keyboard!;
    kb.addCapture([
      Phaser.Input.Keyboard.KeyCodes.UP,
      Phaser.Input.Keyboard.KeyCodes.DOWN,
      Phaser.Input.Keyboard.KeyCodes.LEFT,
      Phaser.Input.Keyboard.KeyCodes.RIGHT,
      Phaser.Input.Keyboard.KeyCodes.W,
      Phaser.Input.Keyboard.KeyCodes.A,
      Phaser.Input.Keyboard.KeyCodes.S,
      Phaser.Input.Keyboard.KeyCodes.D,
    ]);

    this.cursors = {
      up:    kb.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      down:  kb.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      left:  kb.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: kb.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      w:     kb.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      s:     kb.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      a:     kb.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      d:     kb.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
  }

  private addShadow() {
    // Subtle ellipse shadow under the character
    const shadow = this.scene.add.ellipse(
      this.sprite.x, this.sprite.y + 22,
      30, 10, 0x000000, 0.3
    ).setDepth(9);

    this.scene.tweens.add({
      targets: shadow,
      scaleX: { from: 0.9, to: 1.1 },
      alpha: { from: 0.25, to: 0.35 },
      duration: 800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });

    this.scene.events.on('update', () => {
      shadow.setPosition(this.sprite.x, this.sprite.y + 22);
    });
  }

  update(delta: number) {
    if (!this.cursors) return;

    const speed = 100;
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);

    const horizontalInput =
      (this.cursors.left.isDown || this.cursors.a.isDown ? -1 : 0)
      + (this.cursors.right.isDown || this.cursors.d.isDown ? 1 : 0);
    const verticalInput =
      (this.cursors.up.isDown || this.cursors.w.isDown ? -1 : 0)
      + (this.cursors.down.isDown || this.cursors.s.isDown ? 1 : 0);
    const hasManualInput = horizontalInput !== 0 || verticalInput !== 0;
    let moving = false;

    if (hasManualInput) {
      this.moveTarget = null;
      body.setVelocity(horizontalInput * speed, verticalInput * speed);

      if (Math.abs(horizontalInput) > Math.abs(verticalInput)) {
        this.facing = horizontalInput > 0 ? 'right' : 'left';
      } else if (verticalInput !== 0) {
        this.facing = verticalInput > 0 ? 'down' : 'up';
      }

      moving = true;
    } else if (this.moveTarget) {
      const distance = Phaser.Math.Distance.Between(
        this.sprite.x,
        this.sprite.y,
        this.moveTarget.x,
        this.moveTarget.y,
      );

      if (distance <= 5) {
        this.sprite.setPosition(this.moveTarget.x, this.moveTarget.y);
        this.moveTarget = null;
      } else {
        this.scene.physics.moveTo(this.sprite, this.moveTarget.x, this.moveTarget.y, speed);

        const dx = this.moveTarget.x - this.sprite.x;
        const dy = this.moveTarget.y - this.sprite.y;
        if (Math.abs(dx) > Math.abs(dy)) {
          this.facing = dx > 0 ? 'right' : 'left';
        } else {
          this.facing = dy > 0 ? 'down' : 'up';
        }

        moving = true;
      }
    }

    // Normalize diagonal movement
    if (body.velocity.length() > 0) {
      body.velocity.normalize().scale(speed);
    }

    // --- Animate: alternate walk angle to simulate stepping ---
    if (moving) {
      this.walkTimer += delta;
      if (this.walkTimer >= this.WALK_INTERVAL) {
        this.walkTimer = 0;
        this.walkPhase = (this.walkPhase + 1) % 2;
      }
      
      const texKey = `walk-${this.facing}`;
      if (this.sprite.texture.key !== texKey) {
        this.sprite.setTexture(texKey);
      }

      // Waddle effect
      this.sprite.setAngle(this.walkPhase === 0 ? -3 : 3);
      
    } else {
      // Idle
      this.walkTimer = 0;
      this.walkPhase = 0;
      this.sprite.setAngle(0);
      
      // Only use 'idle' texture (which faces down) if actually facing down
      const texKey = this.facing === 'down' ? 'idle' : `walk-${this.facing}`;
      if (this.sprite.texture.key !== texKey) {
        this.sprite.setTexture(texKey);
      }
    }

    if (moving && !this.isMoving) {
      this.walkSound?.play();
    } else if (!moving && this.isMoving) {
      this.walkSound?.pause();
    }

    this.isMoving = moving;
  }

  get x() { return this.sprite.x; }
  get y() { return this.sprite.y; }
  setPosition(x: number, y: number) {
    this.moveTarget = null;
    this.sprite.setPosition(x, y);
  }

  moveTo(x: number, y: number) {
    this.moveTarget = new Phaser.Math.Vector2(x, y);
  }

  /** Automatically walk to a specific coordinate */
  autoWalkTo(targetX: number, targetY: number, duration: number, onComplete?: () => void) {
    // Disable manual input temporarily
    this.isMoving = true;
    
    // Determine facing direction
    const dx = targetX - this.sprite.x;
    const dy = targetY - this.sprite.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      this.facing = dx > 0 ? 'right' : 'left';
    } else {
      this.facing = dy > 0 ? 'down' : 'up';
    }
    
    this.walkSound?.play();

    this.scene.tweens.add({
      targets: this.sprite,
      x: targetX,
      y: targetY,
      duration: duration,
      ease: 'Linear',
      onUpdate: () => {
        // Update walk animation manually during tween
        this.walkTimer += this.scene.game.loop.delta;
        if (this.walkTimer >= this.WALK_INTERVAL) {
          this.walkTimer = 0;
          this.walkPhase = (this.walkPhase + 1) % 2;
        }
        
        const texKey = `walk-${this.facing}`;
        if (this.sprite.texture.key !== texKey) {
          this.sprite.setTexture(texKey);
        }
        this.sprite.setAngle(this.walkPhase === 0 ? -3 : 3);
      },
      onComplete: () => {
        this.isMoving = false;
        this.walkSound?.pause();
        this.sprite.setAngle(0);
        const texKey = this.facing === 'down' ? 'idle' : `walk-${this.facing}`;
        this.sprite.setTexture(texKey);
        if (onComplete) onComplete();
      }
    });
  }
}
