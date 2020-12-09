import { Scene } from "phaser";
import { Pillar } from "./Pillar";
import { Bridge } from "./Bridge";

export class Preview extends Scene {

    constructor() {
        super({ key: "preview" });

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
        this.totalLength = this.pillarWidth;
        // TODO random
        while (this.totalLength <= 700 - this.bridgeWidth - this.pillarWidth) {
            var rand = Math.floor(Math.random() * 3) + 1;
            this.totalLength = this.pillarWidth;
            this.bridgeLengths.forEach(element => {
                this.totalLength += element * this.bridgeWidth + this.pillarWidth;
            });
            if(this.totalLength + rand * this.bridgeWidth + this.pillarWidth <= 700){
            this.bridgeLengths.push(rand);
            this.totalLength += rand * this.bridgeWidth + this.pillarWidth;
            } 
        }

        this.numberOfPillars = this.bridgeLengths.length + 1;
        this.counter = 5;

        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.createBridge();
        this.countdown = this.add.text(this.cameras.main.centerX, 30, this.counter.toString(), { font: "20px Quicksand", fill: "BLACK" })
        this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.updateCounter, callbackScope: this, loop: true });
    }

    update() {
        if (this.counter == -1) {
            // zu setCompilation
            this.scene.start("set", { pillarArr: this.pillars, bridgePartArr: this.bridgeParts });
        } else {
            this.countdown.setText(this.counter.toString());
        }
    }

    createBridge() {
        // instantiate pillars and bridge parts
        this.pillars[0] = new Pillar(this, 100, 300);
        this.bridgeParts.push(new Bridge(this, 100 + this.pillarWidth, 300, this.bridgeLengths[0]));

        for (var i = 1; i < this.bridgeLengths.length; i++) {
            var xPos = this.pillarWidth + this.bridgeParts[i - 1].x + this.bridgeParts[i - 1].displayWidth;
            this.bridgeParts.push(new Bridge(this, xPos, 300, this.bridgeLengths[i]));
        }

        for (var i = 1; i < this.numberOfPillars; i++) {
            this.pillars.push(new Pillar(this, this.bridgeParts[i-1].x + this.bridgeParts[i-1].displayWidth, 300));
        }
        // this.pillars.push(new Pillar(this, 700 - this.pillarWidth, 300));

        this.add.image(0, 300, 'cliff').setOrigin(0, 0);
        this.add.image(this.pillars[this.pillars.length - 1].x + this.pillars[this.pillars.length - 1].displayWidth, 300, 'cliff').setOrigin(0, 0);

    }

    updateCounter() {
        this.counter--;
    }
}