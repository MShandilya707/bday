import Phaser from 'phaser';

// Import assets to ensure Vite handles paths correctly
import forestBg from '../../public/assets/forest_background.png';
import castleBg from '../../public/assets/castle_background.png';
import spaceBg from '../../public/assets/space_background.png';
import heroineImg from '../../public/assets/heroine.png';
import zephyrImg from '../../public/assets/zephyr.png';
import enemyForestImg from '../../public/assets/enemy_forest.png';
import mayankImg from '../../public/assets/mayank.png';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Load custom backgrounds
        this.load.image('bg_forest_custom', forestBg);
        this.load.image('bg_castle_custom', castleBg);
        this.load.image('bg_space_custom', spaceBg);

        // Load custom characters
        this.load.image('heroine_custom', heroineImg);
        this.load.image('zephyr_custom', zephyrImg);
        this.load.image('enemy_forest_custom', enemyForestImg);
        this.load.image('mayank_custom', mayankImg);
    }

    create() {
        const g = this.add.graphics();

        // 1. Heroine (A sleek, glowing pink square with a "starlight" center)
        g.lineStyle(2, 0xffffff, 1);
        g.fillStyle(0xff69b4, 1);
        g.fillRect(0, 0, 32, 48);
        g.strokeRect(0, 0, 32, 48);
        g.fillStyle(0xffffff, 1);
        g.fillRect(10, 10, 12, 12); // "Eye/Star"
        g.generateTexture('player-sheet', 32, 48);
        g.clear();

        // 2. Mayank in Orb (Neon Blue)
        g.fillStyle(0x00ffff, 0.2);
        g.fillCircle(24, 24, 24);
        g.lineStyle(2, 0x00ffff, 1);
        g.strokeCircle(24, 24, 24);
        g.fillStyle(0x00ffff, 1);
        g.fillRect(20, 16, 8, 16);
        g.generateTexture('mayank_orb', 48, 48);
        g.clear();

        // 3. Zephyr Boss (Shadowy Purple with a red core)
        g.fillStyle(0x1a1a2e, 1);
        g.fillRect(0, 0, 64, 96);
        g.lineStyle(3, 0xff0000, 1);
        g.strokeRect(0, 0, 64, 96);
        g.fillStyle(0xff0000, 1);
        g.fillRect(24, 20, 16, 16);
        g.generateTexture('zephyr', 64, 96);
        g.clear();

        // 4. Grumble Sprite (Forest Enemy - Glowing Green)
        g.fillStyle(0x32cd32, 1);
        g.fillRect(0, 0, 24, 24);
        g.lineStyle(2, 0xffffff, 0.8);
        g.strokeRect(0, 0, 24, 24);
        g.generateTexture('enemy-sheet', 24, 24);
        g.clear();

        // 5. Platforms (Brickish Brown)
        const drawBrickPlat = (key, baseColor, strokeColor) => {
            g.clear();
            g.fillStyle(baseColor, 1);
            g.fillRect(0, 0, 100, 32);
            
            // Draw brick lines
            g.lineStyle(1, 0x000000, 0.3);
            g.lineBetween(0, 16, 100, 16); // horizontal line
            for(let i=0; i<100; i+=25) {
                g.lineBetween(i, 0, i, 16);
                g.lineBetween(i+12, 16, i+12, 32);
            }
            
            g.lineStyle(2, strokeColor, 1);
            g.strokeRect(0, 0, 100, 32);
            g.generateTexture(key, 100, 32);
        };

        drawBrickPlat('plat_forest', 0x8b4513, 0x5d2e0d);
        drawBrickPlat('plat_castle', 0x7b3f00, 0x3e1f00);
        drawBrickPlat('plat_space', 0x5d2e0d, 0x2e1706);
        g.clear();

        // 6. Collectibles
        g.fillStyle(0xffff00, 1);
        g.fillCircle(8, 8, 8);
        g.lineStyle(2, 0xffffff, 1);
        g.strokeCircle(8, 8, 8);
        g.generateTexture('item-sheet', 16, 16);
        g.clear();

        g.fillStyle(0xff0000, 1);
        g.fillCircle(8, 8, 8);
        g.generateTexture('heart_asset', 16, 16);
        g.clear();

        g.fillStyle(0xffff00, 1);
        g.fillCircle(4, 4, 4);
        g.generateTexture('boss_proj', 8, 8);
        g.clear();

        // 7. Portal
        g.fillStyle(0x8a2be2, 0.5);
        g.fillCircle(32, 32, 32);
        g.lineStyle(4, 0xffffff, 1);
        g.strokeCircle(32, 32, 32);
        g.generateTexture('portal', 64, 64);
        g.clear();
        
        // 8. Backgrounds
        g.fillStyle(0x0a0a0a, 1); g.fillRect(0, 0, 800, 600); g.generateTexture('sky', 800, 600); g.clear();
        g.fillStyle(0x0a0a0a, 1); g.fillRect(0, 0, 800, 600); g.generateTexture('clouds', 800, 600); g.clear();
        g.fillStyle(0x0a0a0a, 1); g.fillRect(0, 0, 800, 600); g.generateTexture('sea', 800, 600); g.clear();
        
        // Particles
        g.fillStyle(0xffffff, 1); g.fillCircle(4, 4, 4); g.generateTexture('smoke', 8, 8); g.clear();
        g.fillStyle(0xffff00, 1); g.fillCircle(4, 4, 4); g.generateTexture('particle_star', 8, 8); g.clear();

        // Re-create simple animations for the textures
        this.anims.create({ key: 'player-idle', frames: [ { key: 'player-sheet' } ] });
        this.anims.create({ key: 'player-run', frames: [ { key: 'player-sheet' } ] });
        this.anims.create({ key: 'enemy-walk', frames: [ { key: 'enemy-sheet' } ] });
        this.anims.create({ key: 'item-spin', frames: [ { key: 'item-sheet' } ] });

        this.scene.start('MenuScene');
    }
}
