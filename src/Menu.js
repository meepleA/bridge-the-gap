import { Scene } from "phaser";
import { Button } from "./Button";

export class Menu extends Scene {

    constructor() {
        super({ key: "menu" });
    }

    preload() {
        this.load.image('background', 'assets/background.png');
    }

    create() {
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.rulesButton = new Button(this, this.cameras.main.centerX, this.cameras.main.centerY, "Spiel starten", () => {
            this.scene.start("rules");
        }).setOrigin(0.5, 0.5);
    }

    update(){

    }

}