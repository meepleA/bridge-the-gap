import { Scene } from "phaser";
import { Image } from "phaser";

export class Bridge extends Phaser.GameObjects.Image {
    constructor(scenep, x, y) {
        super(scenep, x, y, 'bridge');
        scenep.physics.add.existing(this);
        scenep.add.existing(this).setOrigin(0, 0);
        this.body.allowGravity = false;
        this.body.immovable = true;
        this.length;
    }
}