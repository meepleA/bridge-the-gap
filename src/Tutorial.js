import { Scene } from "phaser";
import { Button } from "./Button";

export class Tutorial extends Scene {

    constructor() {
        super({ key: "tutorial" });

    }

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('bridge', 'assets/bridge.png');
        this.load.image('cliff', 'assets/cliff.png');
        this.load.image('pillar', 'assets/pillar.png');
        this.load.image('pillarHighlight', 'assets/pillarHighlight.png');
        this.load.image('previewBridge', 'assets/previewBridge.png');
    }

    create() {
        this.scenePic = this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.rulesButton = new Button(this, this.cameras.main.centerX, this.cameras.main.centerY, "Los geht's!", () => {
            this.scene.start("preview", {level: 1});
        }).setOrigin(0.5, 0.5);
    }

    update(){

    }

}