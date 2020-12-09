import { Scene } from "phaser";

export class Button extends Phaser.GameObjects.Text {

    constructor(scene, x, y, text, func) {
        super(scene, x, y, text, { font: "20px Quicksand", fill: "BLACK" });
        this.scene.add.existing(this).setOrigin(0, 0);
        this.setInteractive().on('pointerdown', () => {
            func();
        });
        this.on('pointerover', () => { this.setColor("#0046aa"); });
        this.on('pointerout', () => { this.setColor("BLACK"); });
    }

}