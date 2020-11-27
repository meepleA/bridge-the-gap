import { Scene } from "phaser";
import { Image } from "phaser";
import { Pillar } from "./Pillar";
import { Bridge } from "./Bridge";
import { Word } from "./Word";

export class Level extends Scene {

    constructor(pillarNumber) {
        super();

        // loggingValues = [word1, word2, distance, error]
        this.loggingValues = [];
        this.pairDist = [];
        // server, scenen manager
        this.hardCodeWordPairs();
        this.playerID;

        this.playerWordSet = [];
        // vorauswahl
        this.words = this.getAllWithouDoubles(this.pairDist);

        this.numberOfPillars = 2;
        this.selectedWord;
        this.pillars = [];
        this.bridgeParts = [];
        this.bridgeLengths = [1, 1, 3];
        this.message;
        this.nextLvlButton;
    }

    preload() {
        // this.load.image('floor', 'assets/floor.png');
        this.load.image('background', 'assets/background.png');
        this.load.image('bridge', 'assets/bridge.png');
        this.load.image('cliff', 'assets/cliff.png');
        this.load.image('pillar', 'assets/pillar.png');
        this.load.image('pillarHighlight', 'assets/pillarHighlight.png');
        this.load.image('lemming', 'assets/lemming.png');
    }

    create() {
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.createStatics();
        this.createButtons();
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

        // lemminge
        this.lemmings.children.iterate(function (child) {

            if (child.body.position.y >= 600) {
                child.body.reset(30, 280);
                child.setVelocityX(110);
            }
        });
    }

    createStatics() {
        this.grounds = this.physics.add.group();
        // TODO: letzten von pillars abhängig machen
        this.grounds.create(0, 300, 'cliff').setOrigin(0, 0);
        this.grounds.create(700, 300, 'cliff').setOrigin(0, 0);

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

        // add pillars and bridge parts to grounds group and set their physics
        this.pillars.forEach(pillar => {
            this.grounds.add(pillar);
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

        // display the player's word set
        // Erstellung in Vorauswahl, Anzeige hier
        var offset = 20;
        for (var i = 0; i < this.words.length; i++) {
            this.playerWordSet.push(new Word(this, offset, 25, this.words[i], this.pairDist));
            offset += this.playerWordSet[i].displayWidth + 50;
        }
    }

    createButtons(){
        // next level button
        this.nextLvlButton = this.add.text(600, 170, "Nächstes Level", { font: "20px Quicksand", fill: "#000000" });
        this.nextLvlButton.visible = false;
        this.nextLvlButton.setInteractive().on('pointerdown', () => {
            // rückgabe an scene manager
        });
        this.nextLvlButton.on('pointerover', () => { this.nextLvlButton.setColor("#0046aa"); });
        this.nextLvlButton.on('pointerout', () => { this.nextLvlButton.setColor("BLACK"); });
    }

    createLemmings(){
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
            this.enterWordIntoPillar(pillar);
        }
    }

    enterWordIntoPillar(pillar) {
        if (this.wordFitsToPillar(this.selectedWord, pillar)) {
            pillar.enteredWord = this.selectedWord;

            this.selectedWord.setPosition(pillar.x + this.selectedWord.displayHeight, pillar.y + pillar.displayHeight);
            this.selectedWord.setRotation(-1.5708);
            this.selectedWord.setColor("BLACK");
            this.selectedWord = null;

            this.pillars.forEach(pillar => {
                pillar.setTexture('pillar');
            });
        } else {
            this.message.visible = true;
        }
    }

    wordFitsToPillar(word, pillar) {
        var pillarIndex = this.pillars.indexOf(pillar);
        var leftFits = true;
        var rightFits = true;
        var adjacentBridgeParts = [];
        if (pillarIndex > 0 && this.pillars[pillarIndex - 1].enteredWord != null) {
            adjacentBridgeParts.push(this.bridgeParts[pillarIndex - 1]);
            var leftdist = this.pillars[pillarIndex - 1].enteredWord.getDist(word);
            if (leftdist != -1) {
                if (this.bridgeParts[pillarIndex - 1].dist != leftdist) {
                    leftFits = false;
                }
            }
        }
        if (pillarIndex < this.pillars.length - 1 && this.pillars[pillarIndex + 1].enteredWord != null) {
            adjacentBridgeParts.push(this.bridgeParts[pillarIndex]);
            var rightDist = this.pillars[pillarIndex + 1].enteredWord.getDist(word);
            if (rightDist != -1) {
                if (this.bridgeParts[pillarIndex].dist != rightDist) {
                    rightFits = false;
                }
            }
        }
        if (leftFits && rightFits) {
            // show bridge

            adjacentBridgeParts.forEach(part => {
                part.visible = true;
                part.body.enable = true;
            });
            return true;
        } else {
            adjacentBridgeParts.forEach(part => {
            });
            return false;
        }
    }

    checkWin() {
        var win = true;
        this.pillars.forEach(element => {
            if (element.enteredWord == null) {
                win = false;
            }
        });

        if (win) {
            this.nextLvlButton.visible = true;
        } else {
            this.nextLvlButton.visible = false;
        };
    }

    // server
    hardCodeWordPairs() {
        this.pairDist.push(["Tasse", "Streichholz", "5"]);
        this.pairDist.push(["Tee", "Tasse", "0"]);
        this.pairDist.push(["Kochtopf", "Tee", "0"]);
    }
    // vorauswahl
    getAllWithouDoubles(twoDArray) {
        var finalArray = [];
        twoDArray.forEach(elem => {
            for (var i = 0; i < 2; i++) {
                if (!finalArray.includes(elem[i])) {
                    finalArray.push(elem[i]);
                }
            }
        });
        return finalArray;
    }
}