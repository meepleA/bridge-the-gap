import { Scene } from "phaser";
import { Button } from "./Button";
import { myGame } from "./globalVariables";

export class Rules extends Scene {

    constructor() {
        super({ key: "rules" });
        this.introText = ["Hilf den Lemmingen über den Fluss!", "", "Baue ihnen eine Brücke, indem du benachbarte Pfeiler mit Wörtern füllst, deren pragmatische Distanz dem Abstand der Pfeiler entspricht. \n", "\n", "Pragmatische Distanz? \n Zwei Wörter haben eine kürzere Distanz, je eher du die Objekte, die sie beschreiben, intuitiv zusammen benutzen würdest. Es gibt insgesamt 3 Abstufungen."];
        this.prepText = ["Ablauf eines Levels: \n", "", "1. Eine zeitlich begrenzte Vorschau zeigt dir die Abstände der Brückenpfeiler \n", "", "\n", "2. Stelle dir aus einem Pool von Wörtern ein Set zusammen, mit dem du die Brücke bauen möchtest."];
        this.lvlText = ["3. Klicke auf ein Wort, dann auf einen Pfeiler, um es dort zu platzieren. Bereits platzierte Wörter können durch erneutes Anklicken wieder zurückgenommen werden. Zwischen benachbarten Wörtern wird ein Brückenteil gelegt. Entspricht die pragmatische Distanz dem Abstand der Pfeiler, können die Lemminge das Brückenteil überqueren."];
        this.currentScreen;
        this.intro;
        this.tutorial;
        this.lvlExpl;
        this.textPos = [340, 140];

        this.prevSnip;
        this.setSnip;
        this.lvlSnip;

        this.nextButton;
        this.backButton;
        this.goButton;
    }

    preload() {
        this.load.image('rulesBg', 'assets/rulesBg.png');
        this.load.image('previewSnippet', 'assets/previewSnippet.png');
        this.load.image('setCompilationSnippet', 'assets/setCompilationSnippet.png');
        this.load.image('levelSnippet', 'assets/levelSnippet.png');
        this.load.spritesheet('nextButton', 'assets/nextButton.png', { frameWidth: 293, frameHeight: 283 });
        this.load.spritesheet('backButton', 'assets/backButton.png', { frameWidth: 293, frameHeight: 284 });
        this.load.spritesheet('goButton', 'assets/goButton.png', { frameWidth: 294, frameHeight: 283 });
    }

    create() {
        this.currentScreen = 0;
        this.add.image(-30, 0, 'rulesBg').setScale(myGame.bgPicScale[0], myGame.bgPicScale[1]).setOrigin(0, 0);

        let rt = this.add.renderTexture(0, 0, this.cameras.main.width, this.cameras.main.height);
        rt.fill(0xffffff, 0.5);

        // let textCenter = [this.cameras.main.width - (this.cameras.main.width - this.textPos[0]) / 2, this.cameras.main.height - (this.cameras.main.height - this.textPos[1]) / 2]
        this.prevSnip = this.add.image(this.textPos[0], this.textPos[1] + 30, 'previewSnippet').setScale(0.3, 0.3).setOrigin(0, 0);
        this.setSnip = this.add.image(this.prevSnip.x, this.prevSnip.y + this.prevSnip.displayHeight + 30, 'setCompilationSnippet').setScale(0.3, 0.3).setOrigin(0, 0);

        let style = myGame.textStyle;
        let narrowStyle = { font: "20px Quicksand", fill: "#000000", wordWrap: { width: 370, useAdvancedWrap: true }, lineSpacing: 10 };
        this.intro = this.add.text(this.textPos[0], this.textPos[1], this.introText, style).setOrigin(0, 0);
        this.tutorial = this.add.text(this.textPos[0] + this.prevSnip.displayWidth + 30, this.textPos[1], this.prepText, narrowStyle).setOrigin(0, 0);
        this.lvlExpl = this.add.text(this.textPos[0], this.textPos[1], this.lvlText, style).setOrigin(0, 0);

        this.lvlSnip = this.add.image(this.cameras.main.width / 2, this.lvlExpl.y + this.lvlExpl.displayHeight + 30, 'levelSnippet').setScale(0.35, 0.35).setOrigin(0.5, 0);

        this.nextButton = new Button(this, 0, 0, "nextButton", () => { this.currentScreen++; });
        this.nextButton.setPosition(this.cameras.main.width - this.nextButton.displayWidth / 2 - 20, this.cameras.main.height - this.nextButton.displayHeight / 2 + 40)
            .setScale(0.5, 0.5);

        this.backButton = new Button(this, 0, 0, "backButton", () => { this.currentScreen--; }).setOrigin(0, 0);
        this.backButton.setPosition(20, this.cameras.main.height - this.backButton.displayHeight / 2 + 40)
            .setScale(0.5, 0.5);

        this.goButton = new Button(this, 0, 0, "goButton", () => { this.scene.start("preview", { level: [1, 1] }); });
        this.goButton.setPosition(this.cameras.main.width - this.nextButton.displayWidth - 20, this.cameras.main.height - this.nextButton.displayHeight + 40)
            .setScale(0.5, 0.5);
    }

    update() {

        this.intro.visible = false;
        this.tutorial.visible = false;
        this.nextButton.visible = true;
        this.backButton.visible = false;
        this.goButton.visible = false;
        this.prevSnip.visible = false;
        this.setSnip.visible = false;
        this.lvlSnip.visible = false;
        this.lvlExpl.visible = false;

        switch (this.currentScreen) {

            case 1:
                this.tutorial.visible = true;
                this.prevSnip.visible = true;
                this.setSnip.visible = true;
                this.backButton.visible = true;
                break;

            case 2:
                this.lvlSnip.visible = true;
                this.lvlExpl.visible = true;
                this.backButton.visible = true;
                this.nextButton.visible = false;
                this.goButton.visible = true;
                break;

            default:
                this.intro.visible = true;
                break;
        }
    }

}