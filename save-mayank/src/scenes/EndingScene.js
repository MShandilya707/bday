import Phaser from 'phaser';

export default class EndingScene extends Phaser.Scene {
    constructor() {
        super('EndingScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#000022');
        
        // Stars
        for(let i=0; i<150; i++) {
            let x = Phaser.Math.Between(0, 800);
            let y = Phaser.Math.Between(0, 600);
            this.add.rectangle(x, y, 2, 2, 0xffffff).setAlpha(Math.random());
        }

        this.add.sprite(380, 250, 'player-sheet', 0).setScale(3);
        const savedMayank = this.add.sprite(440, 250, 'mayank_custom');
        savedMayank.setScale(64 / savedMayank.height);

        const message = `You didn't need saving.\nBut I'd fight through every world,\nevery castle, every star —\njust to end up right here, next to you.\n\nThank you for being my whole universe.\n— Mayank 💛`;

        this.textObj = this.add.text(400, 420, '', {
            fontSize: '12px',
            color: '#fff',
            align: 'center',
            lineSpacing: 15,
            fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5);

        this.typewriterText(message);

        this.add.particles(400, -50, 'particle_star', {
            x: { min: 0, max: 800 },
            speedY: { min: 50, max: 150 },
            scale: { start: 0.5, end: 0 },
            lifespan: 5000,
            frequency: 300,
            tint: 0xff69b4
        });
    }

    typewriterText(text) {
        const length = text.length;
        let i = 0;
        this.time.addEvent({
            callback: () => {
                this.textObj.text += text[i];
                i++;
                if (i === length) {
                    this.showPlayAgain();
                }
            },
            repeat: length - 1,
            delay: 50
        });
    }

    showPlayAgain() {
        const btn = this.add.text(400, 550, '[ Play Again 💕 ]', { 
            fontSize: '16px', 
            color: '#ff69b4',
            fontFamily: '"Press Start 2P"'
        })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('MenuScene');
            });
            
        this.tweens.add({
            targets: btn,
            alpha: 0.2,
            yoyo: true,
            repeat: -1,
            duration: 800
        });
    }
}
