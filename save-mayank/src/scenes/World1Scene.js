import BaseLevelScene from './BaseLevelScene.js';

export default class World1Scene extends BaseLevelScene {
    constructor() {
        super('World1Scene');
    }

    create() {
        super.create();
        
        // Custom user background (scrolling)
        const bg = this.add.image(0, 0, 'bg_forest_custom').setOrigin(0, 0).setScrollFactor(0.5);
        // Scale to fit height if needed
        const scale = 600 / bg.height;
        bg.setScale(scale);
        
        this.add.text(400, 100, 'The Whispering Forest', { 
            fontSize: '24px', 
            color: '#fff', 
            fontFamily: '"Press Start 2P"' 
        }).setOrigin(0.5).setScrollFactor(0).setDepth(10);

        // Ground
        for (let i = 0; i < 30; i++) {
            this.platforms.create(i * 100 + 50, 580, 'plat_forest');
        }

        // Platforms
        this.platforms.create(400, 450, 'plat_forest');
        this.platforms.create(600, 350, 'plat_forest');
        this.platforms.create(850, 250, 'plat_forest');
        this.platforms.create(1100, 350, 'plat_forest');
        this.platforms.create(1400, 450, 'plat_forest');
        
        // Pits
        this.platforms.getChildren().forEach(p => {
            if (p.x > 1600 && p.x < 1900) p.destroy();
        });
        
        this.platforms.create(1750, 400, 'plat_forest');

        // Enemies
        const e1 = this.enemies.create(500, 500, 'enemy_forest_custom');
        e1.setScale(48 / e1.height);
        this.tweens.add({ targets: e1, x: e1.x + 100, duration: 2000, yoyo: true, repeat: -1 });

        const e2 = this.enemies.create(1200, 500, 'enemy_forest_custom');
        e2.setScale(48 / e2.height);
        this.tweens.add({ targets: e2, x: e2.x + 150, duration: 2500, yoyo: true, repeat: -1 });

        // Collectibles
        this.collectibles.create(400, 400, 'item-sheet');
        this.collectibles.create(850, 200, 'item-sheet');
        this.collectibles.create(1750, 350, 'heart_asset');

        // Portal
        this.spawnPortal(2500, 500, 'World2Scene');

        this.setupPlayer(100, 400);
    }
}
