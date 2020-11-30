import { Scene } from "phaser";
import { PoolWord } from "./PoolWord";

export class SetCompilation extends Scene {

    constructor() {
        super({ key: "set" });

        // server, scenen manager
        this.allWords = [];

        this.set = [];
        this.pool = [];
        this.poolWords = [];

        this.pillars;
        this.bridgeParts;
    }

    init(data) {
        this.pillars = data.pillarArr;
        this.bridgeParts = data.bridgePartArr;
    }

    preload() {
        this.load.image('background', 'assets/background.png');
    }

    create() {
        // server, scenen manager
        this.allWords = [];
        this.hardCodeWordPairs();

        this.set = [];
        this.pool = this.getAllWithouDoubles(this.allWords);
        this.pool.splice(20);
        this.poolWords = [];

        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.createButtons();
        this.createPool();
    }

    update() {
        // display the chosen word set
        var offset = 20;
        this.set.forEach(element => {
            element.setPosition(offset, 25);
            offset += element.displayWidth + 50;
        });

        if(this.set.length == this.pillars.length){
            this.finishButton.visible = true;
        } else {
            this.finishButton.visible = false;
        }
    }

    createButtons() {
        this.finishButton = this.add.text(600, 170, "Fertig", { font: "20px Quicksand", fill: "BLACK" });
        this.finishButton.setInteractive().on('pointerdown', () => {
            // zu level
            this.scene.start("level", { pairDist: this.allWords, wordSet: this.set, pillarArr: this.pillars, bridgePartArr: this.bridgeParts });
        });
        this.finishButton.on('pointerover', () => { this.finishButton.setColor("#0046aa"); });
        this.finishButton.on('pointerout', () => { this.finishButton.setColor("BLACK"); });
        this.finishButton.visible = false;
    }

    createPool() {
        this.poolWords = [];
        this.pool.forEach(element => {
            this.poolWords.push(new PoolWord(this, 0, 0, element));
        });
        var x = 20;
        var y = 300;
        for (let i = 0; i < this.poolWords.length; i++) {
            this.poolWords[i].setPosition(x, y);
            this.poolWords[i].setOriginals(x, y);
            x += this.poolWords[i].displayWidth + 50;
            if (i + 1 < this.poolWords.length && this.poolWords[i + 1].displayWidth >= this.cameras.main.centerX * 2 - x - 20) {
                y += 50;
                x = 20;
            }
        }
    }

    selectWord(word) {
        if (this.set.includes(word)) {
            this.set.splice(this.set.indexOf(word), 1);
            word.setPosition(word.originalX, word.originalY);
        } else if (this.set.length < this.pillars.length) {
            this.set.push(word);
        }
    }

    // server
    hardCodeWordPairs() {
        // this.pairDist.push(["Tasse", "Streichholz", "5"]);
        // this.pairDist.push(["Tee", "Tasse", "0"]);
        // this.pairDist.push(["Kochtopf", "Tee", "0"]);

        // die ersten 20 Einträge vom Goldstandard
        this.allWords.push(["Kochtopf", "Tee", "0"]);
        this.allWords.push(["Geschirrtuch", "Tisch", "0"]);
        this.allWords.push(["Schere", "Papier", "0"]);
        this.allWords.push(["Tasse", "Topfdeckel", "3"]);
        this.allWords.push(["Kerze", "Feuerzeug", "0"]);
        this.allWords.push(["Lampe", "Kabel", "0"]);
        this.allWords.push(["Bleistift", "Papiertaschentuch", "2"]);
        this.allWords.push(["Plastikverpackung", "Klebeband", "1"]);
        this.allWords.push(["Schwamm", "Spülmittel", "0"]);
        this.allWords.push(["Korken", "Kugelschreiber", "5"]);
        this.allWords.push(["Holzbrett", "Bleistift", "3"]);
        this.allWords.push(["Spülmittel", "Gemüsemesser", "0"]);
        this.allWords.push(["Nadel", "Faden", "0"]);
        this.allWords.push(["Streichholz", "Schere", "5"]);
        this.allWords.push(["Kochlöffel", "Kochtopf", "0"]);
        this.allWords.push(["Glas", "Geschirrtuch", "0"]);
        this.allWords.push(["Papiertaschentuch", "Teller", "2"]);
        this.allWords.push(["Hemd", "Wäscheklammer", "1"]);
        this.allWords.push(["Weinflasche", "Korken", "0"]);
        this.allWords.push(["Hemd", "Bügeleisen", "0"]);
    }

    getAllWithouDoubles(twoDArray) {
        var finalArray = [];
        twoDArray.forEach(elem => {
            for (let i = 0; i < 2; i++) {
                if (!finalArray.includes(elem[i])) {
                    finalArray.push(elem[i]);
                }
            }
        });
        return finalArray;
    }
}