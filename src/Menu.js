import { Scene } from "phaser";
import { Button } from "./Button";

export class Menu extends Scene {

    constructor() {
        super({ key: "menu" });
    }

    preload() {
        this.load.image('startBg', 'assets/startBg.png');
        this.load.spritesheet('startButton', 'assets/startButton.png', { frameWidth: 296, frameHeight: 267 });
    }

    create() {
        this.add.image(0, 0, 'startBg').setScale(0.55, 0.67).setOrigin(0, 0);
        this.startButton = new Button(this, this.cameras.main.centerX + 50, this.cameras.main.centerY + 50, "startButton", () => {
            this.scene.start("rules");
        }).setOrigin(0.5, 0.5);
    }

    update(){

    }

}