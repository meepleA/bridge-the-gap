import { Scene } from "phaser";
import { Button } from "./Button";

export class Tutorial extends Scene {

    constructor() {
        super({ key: "tutorial" });

    }

    preload() {
        this.load.image('background', 'assets/background.png');
    }

    create() {
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.rulesButton = new Button(this, this.cameras.main.centerX, this.cameras.main.centerY, "Los geht's", () => {
            this.scene.start("preview");
        }).setOrigin(0.5, 0.5);
    }

    update(){

    }

}