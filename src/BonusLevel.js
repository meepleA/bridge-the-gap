import { Scene } from "phaser";
import { Preview } from "./Preview";
import { SetCompilation } from "./SetCompilation";
import { Pillar } from "./Pillar";
import { Bridge } from "./Bridge";
import { Word } from "./Word";

export class BonusLevel extends Scene {

    constructor() {
        super({ key: "bonusLevel" });

        // data from previous scene
        this.levelCount;
        this.textStyle;

        // server, scenen manager
        this.allWordPairs = [];
        this.allSingleWords = [];
        this.pillars = [];
        this.bridgeParts = [];

        this.set = [];

        this.setCompilationObj = new SetCompilation();
        this.previewObj = new Preview();
    }

    init(data) {
        this.levelCount = data.level;
        this.textStyle = data.generalTextStyle;
    }

    preload() {
        this.load.image('background', 'assets/background.png');
    }

    async create() {
        // server, scenen manager
        this.allWordPairs = [];
        this.setCompilationObj.hardCodeWordPairs(this.allWordPairs);
        // await this.setCompilationObj.getWordPairs(this.allWordPairs);

        this.allSingleWords = this.setCompilationObj.getAllWithoutDoubles(this.allWordPairs);
        this.set = [];

        this.add.image(0, 0, 'background').setOrigin(0, 0);

        this.calcPlayerSet(this.set);
        this.createBridge();
        this.set = this.compileSet();
        // show level   
        console.log(this.set);
        this.levelAnnouncement();
    }

    calcPlayerSet(arr) {

        if (!this.bridgeFull()) {

            let failedCandidates = [];
            let candidates = [];

            if (arr.length == 0) {
                candidates = this.allSingleWords;
            } else {
                let lastWord = arr[arr.length - 1];
                this.allWordPairs.forEach(element => {
                    if (element[0] == lastWord && !arr.includes(element[1])) {
                        candidates.push(element[1]);
                    }
                    if (element[1] == lastWord && !arr.includes(element[0])) {
                        candidates.push(element[0]);
                    }
                });
            }

            let numberOfCandidates = candidates.length;

            for (let i = 0; i < numberOfCandidates; i++) {
                let triedCandidate = this.getRand(candidates);
                arr.push(triedCandidate);
                if (!this.calcPlayerSet(arr)) {
                    failedCandidates.push(arr.pop());
                    candidates.splice(candidates.indexOf(triedCandidate), 1);
                } else {
                    i = numberOfCandidates;
                }
            }
            if (numberOfCandidates == failedCandidates.length) {
                return false
            }
        } 
        return true;
    }

    bridgeFull() {
        
        let totalBridgeLength = this.previewObj.pillarWidth;
        let partialLengths = this.getBridgeLengths();
        partialLengths.forEach(element => {
            totalBridgeLength += element * this.previewObj.bridgeWidth + this.previewObj.pillarWidth;
        });
        if(totalBridgeLength <= 500 ){
            return false;
        }   
        console.log(partialLengths);
        console.log(this.set.length);
        console.log(totalBridgeLength);
        return true;
    }

    createBridge() {

        let bridgeLengths = this.getBridgeLengths();
        this.pillars[0] = new Pillar(this, 100, 300);
        this.bridgeParts.push(new Bridge(this, 100 + this.previewObj.pillarWidth, 300, bridgeLengths[0]));

        for (let i = 1; i < bridgeLengths.length; i++) {
            let xPos = this.previewObj.pillarWidth + this.bridgeParts[i - 1].x + this.bridgeParts[i - 1].displayWidth;
            this.bridgeParts.push(new Bridge(this, xPos, 300, bridgeLengths[i]));
        }

        for (let i = 1; i < bridgeLengths.length + 1; i++) {
            this.pillars.push(new Pillar(this, this.bridgeParts[i - 1].x + this.bridgeParts[i - 1].displayWidth, 300));
        }

        this.add.image(0, 300, 'cliff').setOrigin(0, 0);
        this.add.image(this.pillars[this.pillars.length - 1].x + this.pillars[this.pillars.length - 1].displayWidth, 300, 'cliff').setOrigin(0, 0).setScale(2, 1);

        console.log(this.getBridgeLengths().length);
    }

    levelAnnouncement() {

        let rt = this.add.renderTexture(0, 0, this.cameras.main.width, this.cameras.main.height);
        rt.fill(0xffffff, 0.8);

        let style = { font: "20px Quicksand", fill: "#000000", align: "center", wordWrap: { width: 600, useAdvancedWrap: true }, lineSpacing: 20 };
        let text = "Extra Level! \n \n Für dieses Level sind die Wörter bereits vorgegeben."
        this.add.text(this.cameras.main.centerX, this.cameras.main.height / 3, text, style).setOrigin(0.5, 0.5);

        // stattdessen klick
        this.timedEventBonus = this.time.addEvent({ delay: 5000, callback: this.startLevel, callbackScope: this });
    }

    startLevel() {
        this.scene.start("level", { generalTextStyle: this.textStyle, level: this.levelCount, pairDist: this.allWordPairs, wordSet: this.set, pillarArr: this.pillars, bridgePartArr: this.bridgeParts });
    }

    getRand(arr){
        return arr[Math.floor(Math.random() * arr.length)];
    }

    compileSet(){
        let mixed =[];
        while(this.set.length > 0){
            mixed.push(new Word(this, 0, 0, this.getRand(this.set), {}, [[],[]]));
            console.log(mixed[mixed.length - 1].text);
            this.set.splice(this.set.indexOf(mixed[mixed.length - 1].text), 1);
        }
        return mixed;
    }

    getBridgeLengths(){
        let lengths = [];
        for(let i = 0; i < this.set.length - 1 ; i++){
            this.allWordPairs.forEach(element => {
                if (element.includes(this.set[i]) && element.includes(this.set[i+1])) {
                    lengths.push(Math.round(parseFloat(element[2])));
                }
            });
        }
        return lengths;
    }
}