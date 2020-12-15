import Phaser from "phaser";
import { Level } from "./Level";
import { SetCompilation } from "./SetCompilation";
import { Preview } from "./Preview";
import { Menu } from "./Menu";
import { Rules } from "./Rules";
import { Tutorial } from "./Tutorial";
import { BonusLevel } from "./BonusLevel";


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
    scene: [Menu, Rules, Tutorial, Preview, SetCompilation, Level, BonusLevel]
};