
// create bridgeparts und pillars aus level hierher verschieben
// abbruchbedingung, weiter zu setCompilation -> bridgeparts und pillars durchreichen
import { Scene } from "phaser";
import { Pillar } from "./Pillar";
import { Bridge } from "./Bridge";

export class Preview extends Scene {

    constructor() {
        super({ key: "preview" });

        this.pillars = [];
        this.bridgeParts = [];
        // TODO: random brückenlängen ermitteln
        this.bridgeLengths = [1, 1, 3];
        this.numberOfPillars = this.bridgeLengths.length - 1;

        this.counter = 3;
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
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.createBridge();
        this.countdown = this.add.text(this.cameras.main.centerX, 30, this.counter.toString(), { font: "20px Quicksand", fill: "BLACK" })
        this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.updateCounter, callbackScope: this, loop: true });
    }

    update() {
        if(this.counter == -1){
            // zu setCompilation
            this.scene.start("set", {pillarArr: this.pillars, bridgePartArr: this.bridgeParts});
        } else {
            this.countdown.setText(this.counter.toString());
        }   
    }

    createBridge() {
        // TODO: letzten von pillars abhängig machen
        this.add.image(0, 300, 'cliff').setOrigin(0, 0);
        this.add.image(700, 300, 'cliff').setOrigin(0, 0);

        // instantiate pillars and bridge parts
        this.pillars[0] = new Pillar(this, 100, 300);
        this.pillarWidth = this.pillars[0].displayWidth;
        this.bridgeParts.push(new Bridge(this, 100 + this.pillarWidth, 300, this.bridgeLengths[0]));

        for(var i=1; i<this.bridgeLengths.length; i++){
            var xPos = this.pillarWidth + this.bridgeParts[i-1].x + this.bridgeParts[i-1].displayWidth;
            this.bridgeParts.push(new Bridge(this, xPos, 300, this.bridgeLengths[i]));
        }
        
        for (var i = 1; i <= this.numberOfPillars; i++) {
            this.pillars[i] = new Pillar(this, this.bridgeParts[i].x-this.pillarWidth, 300);
        }
        this.pillars.push(new Pillar(this, 700 - this.pillarWidth, 300));    
    }

    updateCounter(){
        this.counter --;
    }
}