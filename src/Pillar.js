import { Image } from "phaser";
import { Scene } from "phaser";
import { Word } from "./Word";

export class Pillar extends Phaser.GameObjects.Image {

    constructor(scenep, x, y) {
        super(scenep, x, y, 'pillar');
        scenep.physics.add.existing(this);
        scenep.add.existing(this).setOrigin(0, 0);
        this.body.allowGravity = false;
        this.body.immovable = true;
        this.setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
            console.log("clickP");
            this.scene.changeSelectedPillar(this);
        });
        this.enteredWord;
    }

    getWord(){
        return this.enteredWord;
    }
}