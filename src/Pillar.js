import { Image } from "phaser";
import { Scene } from "phaser";
import { Word } from "./Word";

export class Pillar extends Phaser.GameObjects.Image {

    constructor(scenep, x, y) {
        super(scenep, x, y, 'pillar');
        scenep.add.existing(this).setOrigin(0, 0);

        this.enteredWord;
        this.isHighlighted = false;
    }

    // getWord(){
    //     return this.enteredWord;
    // }
}