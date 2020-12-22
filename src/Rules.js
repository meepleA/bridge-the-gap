import { Scene, Scenes } from "phaser";
import { Button } from "./Button";

export class Rules extends Scene {

    constructor() {
        super({ key: "rules" });
        this.explanation = "Das Ziel: \n Baue eine Brücke, damit die Lemminge über den Fluss kommen. \n \n Pragmatische Distanz: \n Zwei Objekte sind sich pragmatisch nahe, wenn du sie intuitiv zusammen benutzen würdest.";
        this.currentScreen;
        this.scenePic;
        this.paragraph;
    }

    preload() {
        this.load.image('rulesBg', 'assets/rulesBg.png');
        this.load.image('previewPic', 'assets/tutorialPic1.png');
        this.load.image('wordSelectionPic', 'assets/tutorialPic2.png');
        this.load.spritesheet('nextButton', 'assets/nextButton.png', { frameWidth: 293, frameHeight: 283 });
    }

    create() {
        this.currentScreen = 0;
        this.scenePic = this.add.image(0, 0, 'rulesBg').setScale(0.55, 0.67).setOrigin(0, 0);

        let rt = this.add.renderTexture(0, 0, this.cameras.main.width, this.cameras.main.height);
        rt.fill(0xffffff, 0.5);

        let style = { font: "20px Quicksand", fill: "#000000", align: "center", wordWrap: { width: 600, useAdvancedWrap: true }, lineSpacing: 20};
        this.paragraph = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, this.explanation, style).setOrigin(0.5, 0.5);
        
        
        this.rulesButton = new Button(this, this.cameras.main.centerX, this.cameras.main.centerY, "nextButton", () => {
            if(this.currentScreen == 2){
                this.scene.start("tutorial");
            } else {
                this.paragraph.visible = false;
                this.currentScreen ++;
            }
            
        });
        this.rulesButton.setPosition(this.cameras.main.width - this.rulesButton.displayWidth/2 - 10, this.cameras.main.height - this.rulesButton.displayHeight/2 + 30);
        this.rulesButton.setScale(0.5, 0.5);
    }

    update(){

    }

}