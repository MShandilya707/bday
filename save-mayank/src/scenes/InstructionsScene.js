import Phaser from 'phaser';

export default class InstructionsScene extends Phaser.Scene {
    constructor() {
        super('InstructionsScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#000000');
        
        // Stars background
        for(let i=0; i<50; i++) {
            let x = Phaser.Math.Between(0, 800);
            let y = Phaser.Math.Between(0, 600);
            this.add.rectangle(x, y, 2, 2, 0xffffff).setAlpha(Math.random());
        }

        const title = this.add.text(400, 80, 'HOW TO PLAY', { 
            fontSize: '32px', 
            color: '#ff69b4', 
            fontFamily: '"Press Start 2P"' 
        }).setOrigin(0.5);

        const instructions = [
            "Use ARROW KEYS to Move",
            "Press SPACEBAR to Jump",
            "",
            "STOMP on enemies to defeat them",
            "(Jump and land on their heads!)",
            "",
            "COLLECT stars and hearts",
            "REACH the portal to advance",
            "",
            "DEFEAT ZEPHYR to save Mayank!"
        ];

        let delay = 0;
        instructions.forEach((line, index) => {
            this.time.delayedCall(delay, () => {
                this.add.text(400, 180 + (index * 35), line, {
                    fontSize: '14px',
                    color: '#ffffff',
                    fontFamily: '"Press Start 2P"',
                    align: 'center'
                }).setOrigin(0.5);
            });
            delay += 200;
        });

        this.time.delayedCall(delay + 500, () => {
            const startBtn = this.add.text(400, 540, '[ I AM READY ]', { 
                fontSize: '20px', 
                color: '#ffff00',
                fontFamily: '"Press Start 2P"'
            })
                .setOrigin(0.5)
                .setInteractive()
                .on('pointerdown', () => {
                    this.scene.start('World1Scene');
                });

            this.tweens.add({
                targets: startBtn,
                alpha: 0.2,
                yoyo: true,
                repeat: -1,
                duration: 800
            });
        });
    }
}
