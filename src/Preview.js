import { Scene } from "phaser";
import { Pillar } from "./Pillar";
import { Bridge } from "./Bridge";

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
        this.load.image('cliff', 'assets/cliff.png');
        this.load.image('pillar', 'assets/pillar.png');
        this.load.image('pillarHighlight', 'assets/pillarHighlight.png');
    }

    create() {
        this.pillars = [];
        this.bridgeParts = [];
        this.bridgeLengths = [];

        this.calcBridgeLengths();
        this.numberOfPillars = this.bridgeLengths.length + 1;
        this.counter = 5;

        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.add.text(this.cameras.main.width - 100, 30, "Level: " + this.levelCount.toString(), this.textStyle);
        this.createBridge();

        if (this.levelCount == 2) {
            this.scene.start("bonusLevel", { generalTextStyle: this.textStyle, level: this.levelCount });
        } else {
            this.countdown = this.add.text(this.cameras.main.centerX, 30, this.counter.toString(), this.textStyle);
            this.timedEvent = this.time.addEvent({ delay: 1000, callback: () => { this.counter--; console.log }, callbackScope: this, loop: true });
        }
    }

    update() {
        if (this.levelCount == 2) {
            //
        } else {
            if (this.counter == -1) {
                this.scene.start("set", { generalTextStyle: this.textStyle, level: this.levelCount, pillarArr: this.pillars, bridgePartArr: this.bridgeParts });
            } else {
                this.countdown.setText(this.counter.toString());
            }
        }
    }

    // calculate random bridge lengths
    calcBridgeLengths() {

        this.totalLength = this.pillarWidth;

        while (this.totalLength <= 700 - this.bridgeWidth - this.pillarWidth) {
            let rand = Math.floor(Math.random() * 3) + 1;
            if (this.totalLength + rand * this.bridgeWidth + this.pillarWidth <= 700) {
                this.bridgeLengths.push(rand);
                this.totalLength += rand * this.bridgeWidth + this.pillarWidth;
            }
        }
    }

    // instantiate pillars and bridge parts
    createBridge() {

        this.pillars[0] = new Pillar(this, 100, 300);
        this.bridgeParts.push(new Bridge(this, 100 + this.pillarWidth, 300, this.bridgeLengths[0]));

        for (let i = 1; i < this.bridgeLengths.length; i++) {
            let xPos = this.pillarWidth + this.bridgeParts[i - 1].x + this.bridgeParts[i - 1].displayWidth;
            this.bridgeParts.push(new Bridge(this, xPos, 300, this.bridgeLengths[i]));
        }

        for (let i = 1; i < this.numberOfPillars; i++) {
            this.pillars.push(new Pillar(this, this.bridgeParts[i - 1].x + this.bridgeParts[i - 1].displayWidth, 300));
        }

        this.add.image(0, 300, 'cliff').setOrigin(0, 0);
        this.add.image(this.pillars[this.pillars.length - 1].x + this.pillars[this.pillars.length - 1].displayWidth, 300, 'cliff').setOrigin(0, 0);

    }
}