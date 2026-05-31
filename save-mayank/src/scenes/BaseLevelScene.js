import Phaser from 'phaser';

export default class BaseLevelScene extends Phaser.Scene {
    constructor(key) {
        super(key);
    }

    create() {
        this.isTransitioning = false;
        
        // UI
        this.hp = 3;
        this.lanterns = 0;
        
        const textConfig = {
            fontSize: '18px', 
            fill: '#fff', 
            fontFamily: '"Press Start 2P"',
            stroke: '#000',
            strokeThickness: 4
        };
        
        this.uiText = this.add.text(16, 16, `HP: ${this.hp} | STARS: ${this.lanterns}`, textConfig)
            .setScrollFactor(0)
            .setDepth(100);

        // Physics Groups
        this.platforms = this.physics.add.staticGroup();
        this.enemies = this.physics.add.group();
        this.collectibles = this.physics.add.group({ allowGravity: false });
        this.portals = this.physics.add.staticGroup();

        // Particles
        this.trail = this.add.particles(0, 0, 'smoke', {
            speed: 20,
            scale: { start: 0.2, end: 0 },
            alpha: { start: 0.5, end: 0 },
            lifespan: 500,
            blendMode: 'ADD'
        });

        // Inputs
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    setupPlayer(x, y) {
        this.player = this.physics.add.sprite(x, y, 'heroine_custom');
        const scale = 64 / this.player.height;
        this.player.setScale(scale);
        
        // TIGHTEN HITBOX: Make it narrower and shorter to match the visual character
        // This prevents being hit by things that just touch the "transparent edge"
        this.player.body.setSize(this.player.width * 0.5, this.player.height * 0.85);
        this.player.body.setOffset(this.player.width * 0.25, this.player.height * 0.15);

        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(false);
        this.player.setDepth(5);
        
        // Collisions
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.enemies, this.platforms);
        
        // Enemy overlaps
        this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this);
        this.physics.add.overlap(this.player, this.collectibles, this.collectItem, null, this);
        this.physics.add.overlap(this.player, this.portals, this.enterPortal, null, this);

        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
        this.cameras.main.setBounds(0, 0, 3000, 600);
    }

    update() {
        if (!this.player || !this.player.active || this.isTransitioning) return;

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
            this.player.setFlipX(true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
            this.player.setFlipX(false);
        } else {
            this.player.setVelocityX(0);
        }

        if (this.cursors.space.isDown && this.player.body.touching.down) {
            // Increased jump velocity for the bigger character
            this.player.setVelocityY(-600);
            this.spawnJumpParticles();
        }

        // Particle trail when moving fast
        if (Math.abs(this.player.body.velocity.x) > 10 && this.player.body.touching.down) {
            this.trail.emitParticleAt(this.player.x, this.player.y + 20);
        }

        // Restart if fell off map
        if (this.player.y > 800) {
            this.scene.restart();
        }
    }

    spawnJumpParticles() {
        const p = this.add.particles(this.player.x, this.player.y + 24, 'smoke', {
            speed: { min: 50, max: 100 },
            angle: { min: 180, max: 360 },
            scale: { start: 0.2, end: 0 },
            lifespan: 300,
            quantity: 5
        });
        this.time.delayedCall(300, () => p.destroy());
    }

    hitEnemy(player, enemy) {
        if (this.isTransitioning) return;

        // Stomp mechanic: only if it's a real enemy object with a destroy method
        if (enemy && enemy.destroy && player.body.velocity.y > 0 && player.y < enemy.y - 10) {
            enemy.destroy();
            player.setVelocityY(-350);
            this.cameras.main.shake(100, 0.01);
        } else {
            this.takeDamage();
        }
    }

    takeDamage() {
        if (this.player.alpha < 1) return; // Invincible frames
        
        this.hp--;
        this.updateUI();
        this.cameras.main.shake(200, 0.02);
        
        if (this.hp <= 0) {
            this.scene.restart();
        } else {
            this.player.setAlpha(0.5);
            this.player.setVelocityY(-200);
            // Knockback
            this.player.setVelocityX(this.player.flipX ? 200 : -200);
            
            this.time.delayedCall(1000, () => {
                if (this.player && this.player.active) {
                    this.player.setAlpha(1);
                }
            });
        }
    }

    collectItem(player, item) {
        // Star burst
        const p = this.add.particles(item.x, item.y, 'particle_star', {
            speed: 100,
            scale: { start: 1, end: 0 },
            lifespan: 500,
            quantity: 10
        });
        this.time.delayedCall(500, () => p.destroy());

        if (item.texture.key === 'heart_asset') {
            this.hp = Math.min(3, this.hp + 1);
        } else {
            this.lanterns++;
        }
        item.destroy();
        this.updateUI();
    }

    updateUI() {
        this.uiText.setText(`HP: ${this.hp} | STARS: ${this.lanterns}`);
    }

    enterPortal(player, portal) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        this.player.setVelocity(0,0);
        this.cameras.main.fade(1000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(portal.targetScene);
        });
    }

    spawnPortal(x, y, targetScene) {
        const p = this.portals.create(x, y, 'portal');
        p.targetScene = targetScene;
    }
}
