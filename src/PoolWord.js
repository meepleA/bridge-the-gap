import { myGame } from "./globalVariables";

export class PoolWord extends Phaser.GameObjects.Text {

    constructor(scenep, x, y, text) {      
        super(scenep, x, y, text, myGame.textStyle);
        this.scene = scenep;
        this.originalX = x;
        this.originalY = y;
        this.scene.add.existing(this).setOrigin(0, 0);
        this.setInteractive().on('pointerdown', () => {
            this.scene.selectWord(this);
        });
        this.on('pointerover', () => { this.setColor("RED"); });
        this.on('pointerout', () => { this.setColor("BLACK"); });
    }

    setOriginals(x, y){
        this.originalX = x;
        this.originalY = y;
    }
}