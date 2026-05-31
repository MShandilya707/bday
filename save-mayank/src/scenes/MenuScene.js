import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        this.add.image(400, 300, 'sky');
        this.add.image(400, 400, 'clouds');
        this.add.image(400, 500, 'sea');

        const title = this.add.text(400, 150, 'STARLIGHT GUARDIAN', { 
            fontSize: '42px', 
            color: '#ff69b4', 
            fontFamily: '"Press Start 2P"',
            stroke: '#fff',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        const story = this.add.text(400, 320, 
            "The Jealous Star Sorcerer has stolen Mayank.\nHe's locked at the top of the Star Tower.\n\nLove always finds a way.", 
            { 
                fontSize: '12px', 
                color: '#fff', 
                align: 'center', 
                lineSpacing: 15,
                fontFamily: '"Press Start 2P"'
            }
        ).setOrigin(0.5);

        const startBtn = this.add.text(400, 480, '[ PRESS TO START ]', { 
            fontSize: '18px', 
            color: '#ffff00',
            fontFamily: '"Press Start 2P"'
        })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('IntroScene');
            });
            
        this.tweens.add({
            targets: startBtn,
            alpha: 0.2,
            yoyo: true,
            repeat: -1,
            duration: 800
        });
    }
}
