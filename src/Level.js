import { Scene } from "phaser";
import { Image } from "phaser";
import { Pillar } from "./Pillar";
import { Bridge } from "./Bridge";
import { Word } from "./Word";

export class Level extends Scene {

    constructor() {
        super({ key: "level" });

        // loggingValues = [word1, word2, distance, error]
        this.loggingValues = [];
        this.pairDist = [];
        // server, scenen manager
        this.playerID;

        this.playerWordSet = [];
        // vorauswahl
        this.words = [];

        this.selectedWord;
        this.selectedPillar;
        this.givenPillars;
        this.givenBridgeParts;
        this.pillars = [];
        this.bridgeParts = [];
        this.adjacentBridgeParts = [];
        this.message;
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

        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.createStatics();
        this.createButtons();

        this.leftPreviewBridge = this.add.image(0, 0, 'previewBridge').setOrigin(1, 0);
        this.leftPreviewBridge.visible = false;
        this.rightPreviewBridge = this.add.image(0, 0, 'previewBridge').setOrigin(0, 0);
        this.rightPreviewBridge.visible = false;

        this.createLemmings();
        this.physics.add.collider(this.lemmings, this.grounds);

        this.message = this.add.text(200, 170, "Das passt nicht.", { font: "20px Quicksand", fill: "#000000" });
        this.message.visible = false;
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

        // if(this.adjacentBridgeParts[1] != null){
        //     var rightpreviewBridge = this.add.graphics();
        //     rightpreviewBridge.fillStyle("#9a7f61", 0.5);
        //     rightpreviewBridge.fillRect(this.adjacentBridgeParts[1].x, this.adjacentBridgeParts[1].y, 300 * value, 30);

        //     rightpreviewBridge.destroy();
        // }
    }

    createStatics() {
        this.grounds = this.physics.add.group();
        // TODO: letzten von pillars abhängig machen
        this.grounds.create(0, 300, 'cliff').setOrigin(0, 0);
        this.grounds.create(700, 300, 'cliff').setOrigin(0, 0);

        // instantiate pillars and bridge parts 
        this.givenPillars.forEach(element => {
            this.pillars.push(new Pillar(this, element.x, element.y));
        });

        this.givenBridgeParts.forEach(element => {
            this.bridgeParts.push(new Bridge(this, element.x, element.y, element.dist));
        });

        // add pillars and bridge parts to grounds group and set their physics
        this.pillars.forEach(pillar => {
            this.grounds.add(pillar);
            pillar.setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                this.changeSelectedPillar(pillar);
            });
        });
        this.bridgeParts.forEach(part => {
            this.grounds.add(part);
        });

        this.grounds.children.iterate(function (child) {
            child.body.allowGravity = false;
            child.body.immovable = true;
        });

        this.bridgeParts.forEach(element => {
            element.body.enable = false;
        });

        // create player's word set
        var offset = 20;
        for (var i = 0; i < this.words.length; i++) {
            this.playerWordSet.push(new Word(this, offset, 25, this.words[i].text, this.pairDist));
            offset += this.playerWordSet[i].displayWidth + 50;
        }
    }

    createButtons() {
        // next level button
        this.nextLvlButton = this.add.text(600, 170, "Nächstes Level", { font: "20px Quicksand", fill: "#000000" });
        this.nextLvlButton.visible = false;
        this.nextLvlButton.setInteractive().on('pointerdown', () => {
            // rückgabe an scene manager
            this.resetVariables();
            this.scene.start('preview');
        });
        this.nextLvlButton.on('pointerover', () => { this.nextLvlButton.setColor("#0046aa"); });
        this.nextLvlButton.on('pointerout', () => { this.nextLvlButton.setColor("BLACK"); });
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

        this.message.visible = false;

        for (var i = 0; i < this.pillars.length; i++) {
            if (this.pillars[i].enteredWord != null && this.pillars[i].enteredWord == word) {
                word.setAngle(0);
                word.setPosition(word.originalX, word.originalY);
                this.pillars[i].enteredWord = null;
                this.adjacentBridgeParts = [];
                // this.leftPreviewBridge.visible = false;
                // this.rightPreviewBridge.visible = false;
                if (i > 0) {
                    this.bridgeParts[i - 1].visible = false;
                    this.bridgeParts[i - 1].body.enable = false;
                }
                if (i < this.pillars.length - 1) {
                    this.bridgeParts[i].visible = false;
                    this.bridgeParts[i].body.enable = false;
                }
            }
        }

        this.pillars.forEach(pillar => {
            if (pillar.enteredWord == null) {
                pillar.setTexture('pillarHighlight');

            }
        });
    }

    changeSelectedPillar(pillar) {
        this.message.visible = false;
        if (pillar.enteredWord == null && this.selectedWord != null) {
            this.selectedPillar = pillar;
            this.prevBridgeWidth = 0;
            this.enterWordIntoPillar(pillar);
        }
    }

    enterWordIntoPillar(pillar) {
        this.wordFitsToPillar(this.selectedWord, pillar);
        pillar.enteredWord = this.selectedWord;

        this.selectedWord.setPosition(pillar.x + this.selectedWord.displayHeight, pillar.y + pillar.displayHeight);
        this.selectedWord.setRotation(-1.5708);
        this.selectedWord.setColor("BLACK");


        this.pillars.forEach(pillar => {
            pillar.setTexture('pillar');
        });
        // } else {
        //     this.message.visible = true;
        // }
    }

    wordFitsToPillar(word, pillar) {
        var pillarIndex = this.pillars.indexOf(pillar);
        var leftFits = true;
        var rightFits = true;

        // check if there is a left pillar with a word and if so compare dist
        if (pillarIndex > 0 && this.pillars[pillarIndex - 1].enteredWord != null) {
            this.adjacentBridgeParts[0] = this.bridgeParts[pillarIndex - 1];
            var leftdist = this.pillars[pillarIndex - 1].enteredWord.getDist(word);
            if (leftdist != -1) {
                if (this.bridgeParts[pillarIndex - 1].dist != leftdist) {
                    leftFits = false;
                }
            }
        }
        // check right side
        if (pillarIndex < this.pillars.length - 1 && this.pillars[pillarIndex + 1].enteredWord != null) {
            this.adjacentBridgeParts[1] = this.bridgeParts[pillarIndex];
            var rightDist = this.pillars[pillarIndex + 1].enteredWord.getDist(word);
            if (rightDist != -1) {
                if (this.bridgeParts[pillarIndex].dist != rightDist) {
                    rightFits = false;
                }
            }
        }

        // auslagern

        // if (leftFits && rightFits) {
        //     // show bridge
        //     this.adjacentBridgeParts.forEach(part => {
        //         part.visible = true;
        //         part.body.enable = true;
        //     });
        //     this.adjacentBridgeParts = [];
        //     return true;
        // } else {
        //     this.adjacentBridgeParts = [];
        //     return false;
        // }
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

    showBridgePart(bridge) {
        bridge.visible = true;
        bridge.body.enable = true;
    }

    // show a preview of the bridge parts for the entered word
    showBridgePreview(img, idx) {

        var wordDist = this.getAdjacentDist(this.selectedWord, this.selectedPillar);
        img.visible = true;

        if (wordDist[idx] == -1 && this.prevBridgeWidth >= this.adjacentBridgeParts[idx].displayWidth) {
            this.showBridgePart(this.adjacentBridgeParts[idx]);
            this.adjacentBridgeParts[idx] = null;
            img.visible = false;
        } else if ((wordDist[idx] == 1 && this.prevBridgeWidth >= this.shortBridge)
            || wordDist[idx] == 2 && this.prevBridgeWidth >= this.mediumBridge
            || wordDist[idx] == 3 && this.prevBridgeWidth >= this.longBridge) {

            if (this.adjacentBridgeParts[idx].dist == wordDist[idx]) {
                this.showBridgePart(this.adjacentBridgeParts[idx]);
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

    resetVariables() {
        this.loggingValues = [];
        this.pairDist = [];

        this.playerWordSet = [];
        // vorauswahl
        this.words = [];

        this.givenPillars = [];
        this.givenBridgeParts = [];
        this.pillars = [];
        this.bridgeParts = [];
        this.message = null;
        this.nextLvlButton = null;
    }
}