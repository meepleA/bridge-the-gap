import { Scene, Scenes } from "phaser";
import { Button } from "./Button";

export class Rules extends Scene {

    constructor() {
        super({ key: "rules" });
        this.explanation = "Hier stehen die Spielregeln mit der Erklärung von Pragmatischer Distanz... Die mit Sicherheit auch etwas länger werden, als das hier.";
        this.screens = [];
        this.currentScreen;
        this.scenePic;
        this.paragraph;
    }

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('previewPic', 'assets/tutorialPic1.png');
        this.load.image('wordSelectionPic', 'assets/tutorialPic2.png');
    }

    create() {
        this.screens = ['background', 'previewPic', 'wordSelectionPic']
        this.currentScreen = 0;
        this.scenePic = this.add.image(0, 0, 'background').setOrigin(0, 0);
        let style = { font: "20px Quicksand", fill: "#000000", wordWrap: { width: 600, useAdvancedWrap: true }, lineSpacing: 20};
        this.paragraph = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, this.explanation, style).setOrigin(0.5, 0.5);
        
        
        this.rulesButton = new Button(this, this.cameras.main.centerX, this.cameras.main.centerY, "Weiter", () => {
            if(this.currentScreen == 2){
                this.scene.start("tutorial");
            } else {
                this.paragraph.visible = false;
                this.currentScreen ++;
                this.scenePic.setTexture(this.screens[this.currentScreen]);
            }
            
        });
        this.rulesButton.setPosition(this.cameras.main.centerX *2 - this.rulesButton.displayWidth - 30, this.cameras.main.centerY *2 - this.rulesButton.displayHeight - 30);
    }

    update(){

    }

}