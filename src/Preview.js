import { Scene } from "phaser";
import { Pillar } from "./Pillar";
import { Bridge } from "./Bridge";
import { Button } from "./Button";
import { myGame } from "./globalVariables";

export class Preview extends Scene {

    constructor() {
        super({ key: "preview" });

        // data from previous scene
        this.levelCount;
        this.totalLevelCount;

        this.textStyle = myGame.textStyle;
        this.pillars = [];
        this.bridgeParts = [];
        // TODO: random brückenlängen ermitteln
        this.bridgeLengths = [];
        this.totalLength;
        this.bridgeWidth = 61;
        this.pillarWidth = 44;
        this.numberOfPillars;

        this.counter;
        this.countdown;
        this.bridgeConstructYPos;
    }

    init(data) {
        this.levelCount = data.level[0];
        this.totalLevelCount = data.level[1];
    }

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('bridge', 'assets/bridge.png');
        this.load.image('pillar', 'assets/pillar.png');
        this.load.image('pillarHighlight', 'assets/pillarHighlight.png');
        this.load.image('cliffL', 'assets/cliffLeft.png');
        this.load.image('cliffR', 'assets/cliffRight.png');
        this.load.spritesheet('auswahlButton', 'assets/auswahlButton.png', { frameWidth: 294, frameHeight: 85 });
        this.load.spritesheet('stone', 'assets/stone.png', { frameWidth: 45, frameHeight: 36 });
    }

    create() {
        this.bridgeConstructYPos = myGame.bridgeYPos;
        this.pillars = [];
        this.bridgeParts = [];
        this.bridgeLengths = [];

        this.calcBridgeLengths();
        this.numberOfPillars = this.bridgeLengths.length + 1;
        this.counter = 5;

        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.add.text(this.cameras.main.width - 100, 20, "Level: " + this.levelCount.toString(), this.textStyle);
        this.createBridge();

        this.skipButton = new Button(this, 0, 100, 'auswahlButton', () => {
            this.scene.start("set", { level: [this.levelCount, this.totalLevelCount], pillarArr: this.pillars, bridgePartArr: this.bridgeParts });
        });
        this.skipButton.setScale(0.6, 0.6);
        this.skipButton.setPosition(this.cameras.main.width - this.skipButton.displayWidth - 10, 100);

            this.countdown = this.add.text(this.cameras.main.centerX, 30, this.counter.toString(), this.textStyle);
            this.timedEvent = this.time.addEvent({ delay: 1000, callback: () => { this.counter--; console.log }, callbackScope: this, loop: true });
    }

    update() {
            if (this.counter == -1) {
                this.scene.start("set", { level: [this.levelCount, this.totalLevelCount], pillarArr: this.pillars, bridgePartArr: this.bridgeParts });
            } else {
                this.countdown.setText(this.counter.toString());
            }
    }

    // calculate random bridge lengths
    calcBridgeLengths() {

        this.totalLength = this.pillarWidth;

        while (this.totalLength <= this.cameras.main.width - 150 - this.bridgeWidth - this.pillarWidth - 150) {
            let rand = Math.floor(Math.random() * 6) + 1;
            if (this.totalLength + rand * this.bridgeWidth + this.pillarWidth <= this.cameras.main.width - 200) {
                this.bridgeLengths.push(rand);
                this.totalLength += rand * this.bridgeWidth + this.pillarWidth;
            }
        }
    }

    // instantiate pillars and bridge parts and stones
    createBridge() {

        this.pillars[0] = new Pillar(this, 150, this.bridgeConstructYPos);
        this.bridgeParts.push(new Bridge(this, 150 + this.pillarWidth, this.bridgeConstructYPos, this.bridgeLengths[0]));

        for (let i = 1; i < this.bridgeLengths.length; i++) {
            let xPos = this.pillarWidth + this.bridgeParts[i - 1].x + this.bridgeParts[i - 1].displayWidth;
            this.bridgeParts.push(new Bridge(this, xPos, this.bridgeConstructYPos, this.bridgeLengths[i]));
        }

        for (let i = 1; i < this.numberOfPillars; i++) {
            this.pillars.push(new Pillar(this, this.bridgeParts[i - 1].x + this.bridgeParts[i - 1].displayWidth, this.bridgeConstructYPos));
        }

        // add dist stones
        for(let i = 0; i < this.bridgeParts.length; i++){
            for(let k = 1; k < this.bridgeParts[i].dist; k++){
                let xPos = this.bridgeParts[i].x + this.bridgeParts[i].displayWidth/this.bridgeParts[i].dist * k;
                let yPos = this.bridgeConstructYPos + this.pillars[0].displayHeight - 30;
                this.add.sprite(xPos, yPos, "stone", Math.floor(Math.random() * 3)).setScale(0.5, 0.5);
            }
        }

        this.add.image(-11, this.bridgeConstructYPos, 'cliffL').setOrigin(0, 0);
        this.add.image(this.pillars[this.pillars.length - 1].x - 8, this.bridgeConstructYPos, 'cliffR').setOrigin(0, 0);

    }
}