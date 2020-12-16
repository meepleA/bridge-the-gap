import { Scene } from "phaser";
import { Image } from "phaser";
import { Pillar } from "./Pillar";
import { Bridge } from "./Bridge";
import { PreviewBridge } from "./PreviewBridge";
import { Word } from "./Word";
import { Button } from "./Button";
import { LemmingGroup } from "./LemmingGroup";
import { WordSet } from "./WordSet";

export class Level extends Scene {

    constructor() {
        super({ key: "level" });

        // loggingValues = [ [word1, word2, distance, error, playerID, mode, bonus], [...], ...]
        this.loggingValues = [];

        // data from previous scene
        this.levelCount;
        this.pairDist = [];
        this.words = [];
        this.givenPillars;
        this.givenBridgeParts;
        this.levelCount;
        this.textStyle;
        // TODO: server, scenen manager
        // strings
        this.playerID;
        this.gameMode;
        this.isBonus;

        this.playerWordSet;
        this.selectedWord;
        this.selectedPillar;
        this.pillars = [];
        this.bridgeParts = [];
        this.nextLvlButton;
        this.prevBridges = [];
        this.lvlCountText;
    }

    init(data) {
        this.levelCount = data.level;
        this.textStyle = data.generalTextStyle;
        this.pairDist = data.pairDist;
        this.words = data.wordSet;
        this.givenPillars = data.pillarArr;
        this.givenBridgeParts = data.bridgePartArr;
    }

    preload() {
        // this.load.image('floor', 'assets/floor.png');
        this.load.image('background', 'assets/background.png');
        this.load.image('bridge', 'assets/bridge.png');
        this.load.image('cliff', 'assets/cliff.png');
        this.load.image('pillar', 'assets/pillar.png');
        this.load.image('pillarHighlight', 'assets/pillarHighlight.png');
        this.load.image('previewBridge', 'assets/previewBridge.png');
        this.load.image('lemming', 'assets/lemming.png');
    }

    create() {
        
        console.log(this.words);

        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.lvlCountText = this.add.text(this.cameras.main.width - 100, 30, "Level: " + this.levelCount.toString(), this.textStyle);
        this.createStatics();
        this.createButtons();

        this.lemmings = new LemmingGroup(this);
        this.physics.add.collider(this.lemmings.myGroup, this.grounds);
    }

    update() {

        this.checkWin();

        if (this.selectedWord != null) {
            this.selectedWord.setColor("#fe8b68");
        }

        // lemmings
        // TODO: floor collision + move back
        this.lemmings.resetPosition();
        // preview bridge parts
        this.prevBridges.forEach(element => {
            if (!element.show()) {
                this.prevBridges.splice(this.prevBridges.indexOf(element), 1);
                element.destroy();
            }
        });
    }

    createStatics() {
        this.grounds = this.physics.add.group();

        // instantiate pillars and bridge parts as members of grounds group and set their physics
        for (let i = 0; i < this.givenPillars.length; i++) {
            this.pillars.push(new Pillar(this, this.givenPillars[i].x, this.givenPillars[i].y));
            this.grounds.add(this.pillars[i]);
        }

        for (let i = 0; i < this.givenBridgeParts.length; i++) {
            this.bridgeParts.push(new Bridge(this, this.givenBridgeParts[i].x, this.givenBridgeParts[i].y, this.givenBridgeParts[i].dist));
            this.grounds.add(this.bridgeParts[i]);
            this.bridgeParts[i].body.enable = false;
        }

        // other ground
        this.grounds.create(0, 300, 'cliff').setOrigin(0, 0);
        this.grounds.create(this.pillars[this.pillars.length - 1].x + this.pillars[this.pillars.length - 1].displayWidth, 300, 'cliff').setOrigin(0, 0).setScale(2, 1);

        this.grounds.children.iterate(function (child) {
            child.body.allowGravity = false;
            child.body.immovable = true;
        });

        // create player's word set
        this.playerWordSet = new WordSet(this);
        for (let i = 0; i < this.words.length; i++) {
            this.playerWordSet.addWord(new Word(this, 0, 0, this.words[i].text, this.textStyle, this.pairDist));
        }
        this.playerWordSet.setWordPositions(20, 25, true, this.cameras.main.width - this.lvlCountText.x + 50);
    }

    createButtons() {

        this.nextLvlButton = new Button(this, 600, 170, "Nächstes Level", async () => {

            // all data is sent in a single request -> server has to parse full list!
            const dataToBeSent = this.loggingValues.map(element => {
                return { wordpair: element.splice(0, 2), annotation: element }
            })
            // await this.sendResults(dataToBeSent); 

            console.log("start new level");
            this.resetVariables();
            this.levelCount++;

            if (this.levelCount % 4 == 0) {
                this.scene.start('bonusLevel', { generalTextStyle: this.textStyle, level: this.levelCount });
            } else {
                // if(this.levelCount == 5){
                //      // end game
                //     // zum fragebogen
                // }
                this.scene.start('preview', { level: this.levelCount });
            }
        });

        this.nextLvlButton.visible = false;
    }

    changeSelectedWord(word) {
        if (this.selectedWord != null) {
            this.selectedWord.setColor("BLACK");
        }
        this.selectedWord = word;

        if (word.enteredPillar != null) {
            let idx = this.pillars.indexOf(word.enteredPillar);
            word.resetPosition();
            this.pillars[idx].enteredWord = null;
            word.enteredPillar = null;
            if (idx > 0) {
                this.bridgeParts[idx - 1].makeVisible(false);
            }
            if (idx < this.pillars.length - 1) {
                this.bridgeParts[idx].makeVisible(false);
            }
        }

        this.pillars.forEach(pillar => {
            if (pillar.enteredWord == null) {
                pillar.setTexture('pillarHighlight');

            }
        });
    }

    changeSelectedPillar(pillar) {
        if (pillar.enteredWord == null && this.selectedWord != null) {
            this.selectedPillar = pillar;
            this.selectedWord.enteredPillar = pillar;
            pillar.enteredWord = this.selectedWord;

            this.wordIntoPillar(pillar);

            this.selectedWord.newPosition(pillar);

            this.pillars.forEach(pillar => {
                pillar.setTexture('pillar');
            });
        }
    }

    wordIntoPillar(pillar) {
        let pillarIndex = this.pillars.indexOf(pillar);

        // check if there is a left pillar with a word and if so set its connecting bridgePArt
        if (pillarIndex > 0 && this.pillars[pillarIndex - 1].enteredWord != null) {
            let leftBridge = this.bridgeParts[pillarIndex - 1];
            // create left preview
            let adjacentWord = this.pillars[this.pillars.indexOf(this.selectedPillar) - 1].enteredWord;
            this.prevBridges.push(new PreviewBridge(this, this.selectedPillar.x, this.selectedPillar.y, 1, this.selectedWord, adjacentWord, leftBridge));

            this.logData(this.pillars[pillarIndex - 1].enteredWord, leftBridge.dist);
        }
        // check right side
        if (pillarIndex < this.pillars.length - 1 && this.pillars[pillarIndex + 1].enteredWord != null) {
            let rightBridge = this.bridgeParts[pillarIndex];
            // create right preview
            let adjacentWord = this.pillars[this.pillars.indexOf(this.selectedPillar) + 1].enteredWord;
            this.prevBridges.push(new PreviewBridge(this, this.selectedPillar.x + this.selectedPillar.displayWidth, this.selectedPillar.y, 0, this.selectedWord, adjacentWord, rightBridge));

            this.logData(this.pillars[pillarIndex + 1].enteredWord, rightBridge.dist);
        }
    }

    logData(otherWord, distance) {
        let wordDist = otherWord.getDist(this.selectedWord);
        let distToLog = distance.toString();
        console.log(wordDist);

        if (wordDist == -1) {
            this.selectedWord.addDist(otherWord.text, distance);
            otherWord.addDist(this.selectedWord.text, distance);
            wordDist = distance;
            this.loggingValues.push([this.selectedWord.text, otherWord.text, distToLog, "initial", this.playerID, this.gameMode, this.isBonus]);

        } else if (distance == wordDist) {
            this.loggingValues.push([this.selectedWord.text, otherWord.text, distToLog, "correct", this.playerID, this.gameMode, this.isBonus]);
        } else {
            this.loggingValues.push([this.selectedWord.text, otherWord.text, distToLog, "wrong", this.playerID, this.gameMode, this.isBonus]);
        }
    }

    checkWin() {
        let win = true;
        this.bridgeParts.forEach(element => {
            if (!element.visible) {
                win = false;
            }
        });

        if (win) {
            this.nextLvlButton.visible = true;
        } else {
            this.nextLvlButton.visible = false;
        };
    }

    sendResults(data) {
        return fetch("/levelResult", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(jsonObj => {
                console.log(jsonObj);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    resetVariables() {
        this.loggingValues = [];
        this.pairDist = [];
        this.selectedWord = null;
        this.selectedPillar = null;

        this.playerWordSet = null;
        // vorauswahl
        this.words = [];

        this.givenPillars = [];
        this.givenBridgeParts = [];
        this.pillars = [];
        this.bridgeParts = [];
        this.nextLvlButton = null;
        this.prevBridges = [];
    }
}