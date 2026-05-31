import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import IntroScene from './scenes/IntroScene.js';
import InstructionsScene from './scenes/InstructionsScene.js';
import World1Scene from './scenes/World1Scene.js';
import World2Scene from './scenes/World2Scene.js';
import World3Scene from './scenes/World3Scene.js';
import EndingScene from './scenes/EndingScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },
    render: {
        pixelArt: true,
        antialias: false
    },
    scene: [
        BootScene,
        MenuScene,
        IntroScene,
        InstructionsScene,
        World1Scene,
        World2Scene,
        World3Scene,
        EndingScene
    ]
};

export default new Phaser.Game(config);
