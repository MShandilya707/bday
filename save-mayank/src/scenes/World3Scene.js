import BaseLevelScene from './BaseLevelScene.js';

export default class World3Scene extends BaseLevelScene {
    constructor() {
        super('World3Scene');
    }

    create() {
        super.create();
        const bg = this.add.image(0, 0, 'bg_space_custom').setOrigin(0, 0).setScrollFactor(0.5);
        const scale = 600 / bg.height;
        bg.setScale(scale);
        
        this.add.text(400, 100, 'The Star Tower', { 
            fontSize: '24px', 
            color: '#00ffff', 
            fontFamily: '"Press Start 2P"' 
        }).setOrigin(0.5).setScrollFactor(0).setDepth(10);

        // Ground & Platforms
        for (let i = 0; i < 20; i++) {
            this.platforms.create(i * 100 + 50, 580, 'plat_space');
        }

        this.platforms.create(400, 450, 'plat_space');
        this.platforms.create(600, 300, 'plat_space');
        this.platforms.create(900, 200, 'plat_space');

        this.setupPlayer(100, 400);

        // Boss Area
        this.bossActive = false;
        this.bossHp = 5;
        this.bossProjectiles = this.physics.add.group({ allowGravity: false });
        this.physics.add.overlap(this.player, this.bossProjectiles, this.hitByBossProjectile, null, this);

        this.bossTrigger = this.add.zone(1500, 300, 100, 600);
        this.physics.world.enable(this.bossTrigger);
        this.bossTrigger.body.setAllowGravity(false);
        this.physics.add.overlap(this.player, this.bossTrigger, this.startBossFight, null, this);
    }

    startBossFight() {
        if (this.bossActive) return;
        this.bossActive = true;
        this.bossTrigger.destroy();
        this.cameras.main.stopFollow();
        this.cameras.main.pan(1700, 300, 1000, 'Power2');

        this.boss = this.physics.add.sprite(1900, 300, 'zephyr_custom');
        this.boss.setScale(96 / this.boss.height); 
        this.boss.body.setAllowGravity(false);
        this.boss.setImmovable(true);

        // ADD MAYANK IN THE ORB NEAR THE BOSS
        this.rescuedMayank = this.add.sprite(2050, 300, 'mayank_custom');
        this.rescuedMayank.setScale(48 / this.rescuedMayank.height);
        
        // Add a glowing orb effect around him
        this.orbEffect = this.add.graphics();
        this.orbEffect.fillStyle(0x00ffff, 0.3);
        this.orbEffect.fillCircle(2050, 300, 40);
        this.orbEffect.lineStyle(2, 0xffffff, 1);
        this.orbEffect.strokeCircle(2050, 300, 40);

        this.tweens.add({
            targets: [this.boss, this.rescuedMayank],
            y: { from: 200, to: 400 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });
        
        // Update orb position in update loop or just tween it too
        this.tweens.add({
            targets: this.orbEffect,
            y: 100, // Relative to its current pos
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });

        this.time.addEvent({
            delay: 1500,
            callback: this.bossAttack,
            callbackScope: this,
            loop: true
        });

        this.physics.add.overlap(this.player, this.boss, this.hitBoss, null, this);
        this.bossText = this.add.text(1700, 50, 'ZEPHYR: "STOP!"', { 
            fontSize: '16px', 
            fill: '#ff0000', 
            fontFamily: '"Press Start 2P"' 
        }).setOrigin(0.5);
    }
    // ... rest of boss logic remains similar but uses better visuals
    bossAttack() {
        if (!this.boss || !this.boss.active) return;
        const proj = this.bossProjectiles.create(this.boss.x, this.boss.y, 'boss_proj');
        // TIGHTEN HITBOX: Use a small circular hitbox for the magic bolts
        proj.setCircle(3);
        this.physics.moveToObject(proj, this.player, 300);
    }

    hitByBossProjectile(player, proj) {
        proj.destroy();
        this.hitEnemy(player, { y: 9999 });
    }

    hitBoss(player, boss) {
        if (player.body.velocity.y > 0 && player.y < boss.y) {
            player.setVelocityY(-400);
            this.bossHp--;
            boss.setTint(0xff0000);
            this.time.delayedCall(200, () => boss.clearTint());
            this.cameras.main.shake(100, 0.01);
            if (this.bossHp <= 0) this.bossDefeated();
        } else {
            this.hitEnemy(player, boss);
        }
    }

    bossDefeated() {
        this.boss.destroy();
        this.bossText.setText('...I see it now.');
        this.bossActive = false;
        this.add.particles(1900, 300, 'particle_star', {
            speed: 200, scale: { start: 1, end: 0 }, lifespan: 1000, quantity: 50
        }).explode();
        this.time.delayedCall(2000, () => {
            this.bossText.destroy();
            this.spawnPortal(1900, 500, 'EndingScene');
        });
    }

    update() {
        super.update();
        if (this.bossActive && this.player.x < 1300) this.player.x = 1300;
    }
}
