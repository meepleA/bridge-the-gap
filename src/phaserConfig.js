import Phaser from "phaser";
import { Level } from "./Level";
import { SetCompilation } from "./SetCompilation";
import { Preview } from "./Preview";
import { Menu } from "./Menu";
import { Rules } from "./Rules";
import { BonusLevel } from "./BonusLevel";
import { EndStudy } from "./EndStudy";


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
    scene: [Menu, Rules, Preview, SetCompilation, Level, BonusLevel, EndStudy]
};