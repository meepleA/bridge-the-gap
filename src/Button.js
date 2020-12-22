import { Scene } from "phaser";

export class Button extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, spriteKey, func) {
        super(scene, x, y, spriteKey, 0);
        this.scene.add.existing(this).setOrigin(0, 0);
        this.setInteractive().on('pointerdown', () => {
            // this.setFrame(2);
            func();
        });
        this.on('pointerover', () => { this.setFrame(1); });
        this.on('pointerout', () => { this.setFrame(0); });
    }

}