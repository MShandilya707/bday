import Phaser from 'phaser';

// Import assets for robust path handling
import chest1 from '../../public/assets/closed_chest.png';
import chest2 from '../../public/assets/chest_25_open.png';
import chest3 from '../../public/assets/chest_50_open.png';
import chest4 from '../../public/assets/chest_75_open.png';
import chest5 from '../../public/assets/chest_open.png';
import scrollImg from '../../public/assets/scoll_open.png';

export default class IntroScene extends Phaser.Scene {
    constructor() {
        super('IntroScene');
        // Define your custom message pages here (3 lines each is best)
        this.messagePages = [
            "Hi Ananya,\n\nI knew you first when\nu were 19 and now I am\ngoing to be with you\nwhen you're going to 22.",
            "You are by far the most\namazing person I know,\nbeautiful, driven\nand strong.",
            "I am beyond confident\nthat your best years\nare yet to come and I\nhope to be lucky enough\nto be a part of them.",
            "I promise you,\neverything u want,\nsmall or big,\nu will have in life.",
            "Over the past two years\nyou have been my friend,\nconfidante, lover and\ninspiration...",
            "But most importantly\nyou have always been\nthe one person\nwho saves me.",
            "I dont have a lot to\noffer to you right now\nbut I am waiting for u.",
            "I have a lot more to\noffer to you right now\nbut I am waiting for u.",
            "I have a lot more to\nsay to you but for now\nmy sweet, enjoy this\npresent I made you."
        ];
        this.currentPage = 0;
    }

    preload() {
        // Load the custom named chest images using imported URLs
        this.load.image('chest_frame_1', chest1);
        this.load.image('chest_frame_2', chest2);
        this.load.image('chest_frame_3', chest3);
        this.load.image('chest_frame_4', chest4);
        this.load.image('chest_frame_5', chest5);

        this.load.image('scroll_custom', scrollImg);
    }

    create() {
        this.cameras.main.setBackgroundColor('#1a1a2e');
        
        this.chest = this.add.image(400, 300, 'chest_frame_1').setInteractive();
        const scale = Math.min(600 / this.chest.height, 600 / this.chest.width);
        this.chest.setScale(scale);

        this.currentFrame = 1;
        this.isOpening = false;

        this.hint = this.add.text(400, 550, '[ CLICK THE CHEST TO OPEN ]', { 
            fontSize: '16px', 
            color: '#ffffff',
            fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5);

        this.chest.on('pointerdown', () => {
            if (this.isOpening) return;
            this.isOpening = true;
            this.hint.destroy();
            this.openChest();
        });
    }

    openChest() {
        this.time.addEvent({
            delay: 300,
            callback: () => {
                this.currentFrame++;
                if (this.currentFrame <= 5) {
                    this.chest.setTexture(`chest_frame_${this.currentFrame}`);
                } else {
                    this.showScroll();
                }
            },
            repeat: 4
        });
    }

    showScroll() {
        this.tweens.add({
            targets: this.chest,
            alpha: 0,
            duration: 500
        });

        this.scrollImg = this.add.image(400, 300, 'scroll_custom').setAlpha(0).setScale(0.1);
        const targetScale = Math.min(500 / this.scrollImg.height, 650 / this.scrollImg.width);

        this.tweens.add({
            targets: this.scrollImg,
            alpha: 1,
            scale: targetScale,
            duration: 1000,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.setupTextDisplay();
            }
        });
    }

    setupTextDisplay() {
        this.textObj = this.add.text(400, 300, '', {
            fontSize: '16px',
            color: '#3d2b1f',
            align: 'center',
            fontFamily: '"Press Start 2P"',
            lineSpacing: 12
        }).setOrigin(0.5);

        this.clickZone = this.add.zone(400, 300, 800, 600).setInteractive();
        this.clickZone.on('pointerdown', () => {
            if (this.isTyping) {
                // Skip typing if player clicks while text is still appearing
                this.skipTyping();
            } else {
                this.nextPage();
            }
        });

        this.showCurrentPage();
    }

    showCurrentPage() {
        if (this.currentPage >= this.messagePages.length) {
            this.finishScroll();
            return;
        }

        this.isTyping = true;
        this.fullText = this.messagePages[this.currentPage];
        this.textObj.text = '';
        this.charIndex = 0;

        this.typingTimer = this.time.addEvent({
            delay: 50,
            callback: () => {
                this.textObj.text += this.fullText[this.charIndex];
                this.charIndex++;
                if (this.charIndex === this.fullText.length) {
                    this.isTyping = false;
                    this.showNextPrompt();
                }
            },
            repeat: this.fullText.length - 1
        });
    }

    skipTyping() {
        this.typingTimer.remove();
        this.textObj.text = this.fullText;
        this.isTyping = false;
        this.showNextPrompt();
    }

    showNextPrompt() {
        this.nextHint = this.add.text(400, 520, '[ CLICK TO CONTINUE ]', { 
            fontSize: '12px', 
            color: '#3d2b1f',
            fontFamily: '"Press Start 2P"'
        }).setOrigin(0.5);
    }

    nextPage() {
        if (this.nextHint) this.nextHint.destroy();
        this.currentPage++;
        this.showCurrentPage();
    }

    finishScroll() {
        this.clickZone.destroy();
        this.textObj.destroy();
        
        const startBtn = this.add.text(400, 300, '[ START THE RESCUE ]', { 
            fontSize: '22px', 
            color: '#ffff00',
            fontFamily: '"Press Start 2P"',
            stroke: '#000',
            strokeThickness: 6
        })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.cameras.main.fade(1000, 0, 0, 0);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('InstructionsScene');
                });
            });

        this.tweens.add({
            targets: startBtn,
            scale: 1.1,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }
}
