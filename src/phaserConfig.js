import Phaser from "phaser";
import { Level } from "./Level";
import { SetCompilation } from "./SetCompilation";

export const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [SetCompilation, Level]
};