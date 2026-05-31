import BaseLevelScene from './BaseLevelScene.js';

export default class World2Scene extends BaseLevelScene {
    constructor() {
        super('World2Scene');
    }

    create() {
        super.create();
        const bg = this.add.image(0, 0, 'bg_castle_custom').setOrigin(0, 0).setScrollFactor(0.5);
        const scale = 600 / bg.height;
        bg.setScale(scale).setTint(0x888888);
        
        this.add.text(400, 100, 'The Crumbling Castle', { 
            fontSize: '24px', 
            color: '#aaa', 
            fontFamily: '"Press Start 2P"' 
        }).setOrigin(0.5).setScrollFactor(0).setDepth(10);

        // Ground
        for (let i = 0; i < 30; i++) {
            if (i % 5 !== 0) {
                this.platforms.create(i * 100 + 50, 580, 'plat_castle');
            }
        }

        // Platforms
        this.platforms.create(300, 450, 'plat_castle');
        this.platforms.create(500, 300, 'plat_castle');
        this.platforms.create(800, 200, 'plat_castle');
        this.platforms.create(1200, 300, 'plat_castle');
        this.platforms.create(1500, 450, 'plat_castle');
        this.platforms.create(1800, 350, 'plat_castle');

        // Enemies
        const e1 = this.enemies.create(400, 500, 'enemy_forest_custom');
        e1.setScale(48 / e1.height).setTint(0x666666);
        this.tweens.add({ targets: e1, x: e1.x + 80, duration: 3000, yoyo: true, repeat: -1 });

        const e2 = this.enemies.create(1200, 200, 'enemy_forest_custom');
        e2.setScale(48 / e2.height).setTint(0x666666);
        this.tweens.add({ targets: e2, x: e2.x + 100, duration: 2000, yoyo: true, repeat: -1 });

        // Collectibles
        this.collectibles.create(500, 250, 'item-sheet');
        this.collectibles.create(800, 150, 'heart_asset');
        this.collectibles.create(1500, 400, 'item-sheet');

        this.spawnPortal(2600, 500, 'World3Scene');
        this.setupPlayer(100, 400);
    }
}
