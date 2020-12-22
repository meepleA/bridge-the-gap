import { Scene } from "phaser";
import { Pillar } from "./Pillar";
import { Bridge } from "./Bridge";
import { Button } from "./Button";

export class Preview extends Scene {

    constructor() {
        super({ key: "preview" });

        // data from previous scene
        this.levelCount;

        this.textStyle = { font: "20px Quicksand", fill: "BLACK" };
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
    }

    init(data) {
        this.levelCount = data.level;
    }

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('bridge', 'assets/bridge.png');
        this.load.image('pillar', 'assets/pillar.png');
        this.load.image('pillarHighlight', 'assets/pillarHighlight.png');
        this.load.image('cliffL', 'assets/cliffLeft.png');
        this.load.image('cliffR', 'assets/cliffRight.png');
        this.load.spritesheet('auswahlButton', 'assets/auswahlButton.png', { frameWidth: 294, frameHeight: 85 });
    }

    create() {
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
            this.scene.start("set", { generalTextStyle: this.textStyle, level: this.levelCount, pillarArr: this.pillars, bridgePartArr: this.bridgeParts });
        });
        this.skipButton.setScale(0.6, 0.6);
        this.skipButton.setPosition(this.cameras.main.width - this.skipButton.displayWidth - 10, 100);

        // if (this.levelCount == 1) {
        //     this.scene.start("bonusLevel", { generalTextStyle: this.textStyle, level: this.levelCount });
        // } else {
            this.countdown = this.add.text(this.cameras.main.centerX, 30, this.counter.toString(), this.textStyle);
            this.timedEvent = this.time.addEvent({ delay: 1000, callback: () => { this.counter--; console.log }, callbackScope: this, loop: true });
        // }
    }

    update() {
        // if (this.levelCount == 1) {
        //     //
        // } else {
            if (this.counter == -1) {
                this.scene.start("set", { generalTextStyle: this.textStyle, level: this.levelCount, pillarArr: this.pillars, bridgePartArr: this.bridgeParts });
            } else {
                this.countdown.setText(this.counter.toString());
            }
        // }
    }

    // calculate random bridge lengths
    calcBridgeLengths() {

        this.totalLength = this.pillarWidth;

        while (this.totalLength <= 650 - this.bridgeWidth - this.pillarWidth - 200) {
            let rand = Math.floor(Math.random() * 3) + 1;
            if (this.totalLength + rand * this.bridgeWidth + this.pillarWidth <= 700) {
                this.bridgeLengths.push(rand);
                this.totalLength += rand * this.bridgeWidth + this.pillarWidth;
            }
        }
    }

    // instantiate pillars and bridge parts
    createBridge() {

        this.pillars[0] = new Pillar(this, 150, 300);
        this.bridgeParts.push(new Bridge(this, 150 + this.pillarWidth, 300, this.bridgeLengths[0]));

        for (let i = 1; i < this.bridgeLengths.length; i++) {
            let xPos = this.pillarWidth + this.bridgeParts[i - 1].x + this.bridgeParts[i - 1].displayWidth;
            this.bridgeParts.push(new Bridge(this, xPos, 300, this.bridgeLengths[i]));
        }

        for (let i = 1; i < this.numberOfPillars; i++) {
            this.pillars.push(new Pillar(this, this.bridgeParts[i - 1].x + this.bridgeParts[i - 1].displayWidth, 300));
        }

        this.add.image(-11, 300, 'cliffL').setOrigin(0, 0);
        this.add.image(this.pillars[this.pillars.length - 1].x - 8, 300, 'cliffR').setOrigin(0, 0);

    }
}