import { Scene } from "phaser";
import { Button } from "./Button";

export class Rules extends Scene {

    constructor() {
        super({ key: "rules" });

    }

    preload() {
        this.load.image('background', 'assets/background.png');
    }

    create() {
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.rulesButton = new Button(this, this.cameras.main.centerX, this.cameras.main.centerY, "Weiter", () => {
            this.scene.start("tutorial");
        }).setOrigin(0.5, 0.5);
    }

    update(){

    }

}