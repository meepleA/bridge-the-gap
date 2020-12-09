import { Scene } from "phaser";
import { Image } from "phaser";
import { Pillar } from "./Pillar";
import { Bridge } from "./Bridge";
import { Word } from "./Word";
import { Button } from "./Button";

export class Level extends Scene {

    constructor() {
        super({ key: "level" });

        // loggingValues = [ [word1, word2, distance, error, playerID, mode, bonus], [...], ...]
        this.loggingValues = [];

        // data from previous scene
        this.pairDist = [];
        this.words = [];
        this.givenPillars;
        this.givenBridgeParts;
        // TODO: server, scenen manager
        // strings
        this.playerID; 
        this.gameMode; 
        this.isBonus;

        this.playerWordSet = [];
        this.selectedWord;
        this.selectedPillar;
        this.pillars = [];
        this.bridgeParts = [];
        this.adjacentBridgeParts = [];
        this.nextLvlButton;
        this.shortBridge = 61;
        this.mediumBridge = 122;
        this.longBridge = 169;
        this.prevBridgeWidth;
        this.leftPreviewBridge;
        this.rightPreviewBridge;
    }

    init(data) {
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
        this.prevBridgeWidth = 0;
        this.loggingValues = [];

        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.createStatics();
        this.createButtons();

        this.leftPreviewBridge = this.add.image(0, 0, 'previewBridge').setOrigin(1, 0);
        this.leftPreviewBridge.visible = false;
        this.rightPreviewBridge = this.add.image(0, 0, 'previewBridge').setOrigin(0, 0);
        this.rightPreviewBridge.visible = false;

        this.createLemmings();
        this.physics.add.collider(this.lemmings, this.grounds);
    }

    update() {

        if (this.selectedWord != null) {
            this.selectedWord.setColor("#fe8b68");
        }

        this.checkWin();

        // lemmings
        this.lemmings.children.iterate(function (child) {

            if (child.body.position.y >= 600) {
                child.body.reset(30, 290);
                child.setVelocityX(110);
            }
        });

        // show a preview of the bridge parts for the entered word
        if (this.adjacentBridgeParts[0] != null) {
            this.leftPreviewBridge.setPosition(this.selectedPillar.x, this.selectedPillar.y);
            this.showBridgePreview(this.leftPreviewBridge, 0);
        }

        if (this.adjacentBridgeParts[1] != null) {
            this.rightPreviewBridge.setPosition(this.selectedPillar.x + this.selectedPillar.displayWidth, this.selectedPillar.y);
            this.showBridgePreview(this.rightPreviewBridge, 1);
        }
    }

    createStatics() {
        this.grounds = this.physics.add.group();

        // instantiate pillars and bridge parts as members of grounds group and set their physics
        for (let i = 0; i < this.givenPillars.length; i++) {
            this.pillars.push(new Pillar(this, this.givenPillars[i].x, this.givenPillars[i].y));
            this.grounds.add(this.pillars[i]);
            this.pillars[i].setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                this.changeSelectedPillar(this.pillars[i]);
            });
        }

        for (var i = 0; i < this.givenBridgeParts.length; i++) {
            this.bridgeParts.push(new Bridge(this, this.givenBridgeParts[i].x, this.givenBridgeParts[i].y, this.givenBridgeParts[i].dist));
            this.grounds.add(this.bridgeParts[i]);
            this.bridgeParts[i].body.enable = false;
        }

        // other ground
        this.grounds.create(0, 300, 'cliff').setOrigin(0, 0);
        this.grounds.create(this.pillars[this.pillars.length - 1].x + this.pillars[this.pillars.length - 1].displayWidth, 300, 'cliff').setOrigin(0, 0);

        this.grounds.children.iterate(function (child) {
            child.body.allowGravity = false;
            child.body.immovable = true;
        });
        
        // create player's word set
        var offsetX = 20; 
        var offsetY = 25;
        for (let i = 0; i < this.words.length; i++) {
            this.playerWordSet.push(new Word(this, offsetX, offsetY, this.words[i].text, this.pairDist));
            offsetX += this.words[i].displayWidth + 50;
            if (this.words[i+1] != null && this.words[i + 1].displayWidth >= this.cameras.main.centerX * 2 - offsetX - 20) {
                offsetY += 50;
                offsetX = 20;
            }
        } 
    }

    createButtons() {
        // next level button
        this.nextLvlButton = new Button(this, 600, 170, "Nächstes Level", () => {
            this.loggingValues.forEach(async element => {
                let dataToSend = { wordpair: element.splice(0, 2), annotation: element};
                // const fetchPromise = await this.sendResults(dataToSend);
            });
            
            console.log("start new level");
            this.resetVariables();
            this.scene.start('preview');
        });

        this.nextLvlButton.visible = false;
    }

    createLemmings() {
        this.lemmings = this.physics.add.group({
            key: 'lemming',
            repeat: 3,
            setXY: { x: 30, y: 290, stepX: -27 }
        });

        this.lemmings.children.iterate(function (child) {

            child.setBounce(0.2);
            child.body.setGravityY(500);
            child.setVelocityX(110);

        });
    }

    changeSelectedWord(word) {
        if (this.selectedWord != null) {
            this.selectedWord.setColor("BLACK");
        }
        this.selectedWord = word;

        if (word.enteredPillar != null) {
            var idx = this.pillars.indexOf(word.enteredPillar);
            word.setAngle(0);
            word.setPosition(word.originalX, word.originalY);
            this.pillars[idx].enteredWord = null;
            word.enteredPillar = null;
            this.adjacentBridgeParts = [];
            // this.leftPreviewBridge.visible = false;
            // this.rightPreviewBridge.visible = false;
            if (idx > 0) {
                this.toggleBridgePartVisibility(this.bridgeParts[idx - 1], false);
            }
            if (idx < this.pillars.length - 1) {
                this.toggleBridgePartVisibility(this.bridgeParts[idx], false);
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
            this.prevBridgeWidth = 0;
            this.selectedWord.enteredPillar = pillar;
            pillar.enteredWord = this.selectedWord;

            this.wordFitsToPillar(pillar);

            this.selectedWord.setPosition(pillar.x + this.selectedWord.displayHeight, pillar.y + pillar.displayHeight);
            this.selectedWord.setRotation(-1.5708);
            this.selectedWord.setColor("BLACK");

            this.pillars.forEach(pillar => {
                pillar.setTexture('pillar');
            });
        }
    }

    wordFitsToPillar(pillar) {
        var pillarIndex = this.pillars.indexOf(pillar);

        // check if there is a left pillar with a word and if so set its connecting bridgePArt
        if (pillarIndex > 0 && this.pillars[pillarIndex - 1].enteredWord != null) {
            this.adjacentBridgeParts[0] = this.bridgeParts[pillarIndex - 1];
            this.logData(0, this.pillars[pillarIndex - 1].enteredWord);
        }
        // check right side
        if (pillarIndex < this.pillars.length - 1 && this.pillars[pillarIndex + 1].enteredWord != null) {
            this.adjacentBridgeParts[1] = this.bridgeParts[pillarIndex];
            this.logData(1, this.pillars[pillarIndex + 1].enteredWord);
        }
    }

    logData(idx, otherWord){
        let wordDist = otherWord.getDist(this.selectedWord);
        let distToLog = this.adjacentBridgeParts[idx].dist.toString();
        console.log(wordDist);

        if (wordDist == -1) {
            this.selectedWord.addDist(otherWord.text, this.adjacentBridgeParts[idx].dist);
            otherWord.addDist(this.selectedWord.text, this.adjacentBridgeParts[idx].dist);
            wordDist = this.adjacentBridgeParts[idx].dist;
            this.loggingValues.push([this.selectedWord.text, otherWord.text, distToLog, "initial", this.playerID, this.gameMode, this.isBonus]);
      
        } else if (this.adjacentBridgeParts[idx].dist == wordDist) {
            this.loggingValues.push([this.selectedWord.text, otherWord.text, distToLog, "correct", this.playerID, this.gameMode, this.isBonus]);
        } else {
            this.loggingValues.push([this.selectedWord.text, otherWord.text, distToLog, "wrong", this.playerID, this.gameMode, this.isBonus]);
        }
    }

    getAdjacentDist(word, pillar) {
        var arr = [];
        var pillarIndex = this.pillars.indexOf(pillar);
        if (pillarIndex > 0 && this.pillars[pillarIndex - 1].enteredWord != null) {
            arr[0] = this.pillars[pillarIndex - 1].enteredWord.getDist(word);
        }
        if (pillarIndex < this.pillars.length - 1 && this.pillars[pillarIndex + 1].enteredWord != null) {
            arr[1] = this.pillars[pillarIndex + 1].enteredWord.getDist(word);
        }

        return arr;
    }

    toggleBridgePartVisibility(bridge, bool) {
        bridge.visible = bool;
        bridge.body.enable = bool;
    }

    // show a preview of the bridge parts for the entered word
    showBridgePreview(img, idx) {

        var wordDist = this.getAdjacentDist(this.selectedWord, this.selectedPillar);
        img.visible = true;

        if (wordDist[idx] == -1 && this.prevBridgeWidth >= this.adjacentBridgeParts[idx].displayWidth) {
            this.toggleBridgePartVisibility(this.adjacentBridgeParts[idx], true);
            this.adjacentBridgeParts[idx] = null;
            img.visible = false;
        } else if ((wordDist[idx] == 1 && this.prevBridgeWidth >= this.shortBridge)
            || wordDist[idx] == 2 && this.prevBridgeWidth >= this.mediumBridge
            || wordDist[idx] == 3 && this.prevBridgeWidth >= this.longBridge) {

            if (this.adjacentBridgeParts[idx].dist == wordDist[idx]) {
                this.toggleBridgePartVisibility(this.adjacentBridgeParts[idx], true);
            }
            this.adjacentBridgeParts[idx] = null;
            img.visible = false;

        } else {

            this.prevBridgeWidth++;
            img.setScale(this.prevBridgeWidth, 1);

        }
    }

    checkWin() {
        var win = true;
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

        this.playerWordSet = [];
        // vorauswahl
        this.words = [];

        this.givenPillars = [];
        this.givenBridgeParts = [];
        this.pillars = [];
        this.bridgeParts = [];
        this.nextLvlButton = null;
    }
}