import { Scene } from "phaser";
import { PoolWord } from "./PoolWord";

export class SetCompilation extends Scene {

    constructor() {
        super({ key: "set" });

        // server, scenen manager
        this.allWordPairs = [];
        this.allSingleWords = [];

        this.set = [];
        this.pool = [];
        this.poolWords = [];

        this.pillars;
        this.bridgeParts;
        this.finishButton;
    }

    init(data) {
        this.pillars = data.pillarArr;
        this.bridgeParts = data.bridgePartArr;
    }

    preload() {
        this.load.image('background', 'assets/background.png');
    }

    async create() {
        // server, scenen manager
        this.allWordPairs = [];
        // this.hardCodeWordPairs();
        const fetchPromise = await this.getWordPairs();

        this.allSingleWords = this.getAllWithoutDoubles(this.allWordPairs);
        this.set = [];
        this.pool = [];

        while (this.pool.length <= 20) {
            var randomWord = this.allSingleWords[Math.floor(Math.random() * this.allSingleWords.length)];
            if (!this.pool.includes(randomWord)) {
                this.pool.push(randomWord);
            }
        }

        this.poolWords = [];

        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.createButtons();
        this.createPool();
    }

    update() {
        // display the chosen word set
        var offsetX = 20;
        var offsetY = 25;
        for (let i = 0; i < this.set.length; i++) {
            this.set[i].setPosition(offsetX, offsetY);
            offsetX += this.set[i].displayWidth + 50;
            if (this.set[i + 1] != null && this.set[i + 1].displayWidth >= this.cameras.main.centerX * 2 - offsetX - 20) {
                offsetY += 50;
                offsetX = 20;
            }
        }
    }

    createButtons() {
        this.finishButton = this.add.text(600, 170, "Fertig", { font: "20px Quicksand", fill: "BLACK" });
        this.finishButton.setInteractive().on('pointerdown', () => {
            // zu level
            this.scene.start("level", { pairDist: this.allWordPairs, wordSet: this.set, pillarArr: this.pillars, bridgePartArr: this.bridgeParts });
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

        if (this.set.length == this.pillars.length) {
            this.finishButton.visible = true;
        } else {
            this.finishButton.visible = false;
        }
    }

    // // server
    // hardCodeWordPairs() {
    //     // die ersten 20 Einträge vom Goldstandard
    //     this.allWordPairs.push(["Kochtopf", "Tee", "0"]);
    //     this.allWordPairs.push(["Geschirrtuch", "Tisch", "0"]);
    //     this.allWordPairs.push(["Schere", "Papier", "0"]);
    //     this.allWordPairs.push(["Tasse", "Topfdeckel", "3"]);
    //     this.allWordPairs.push(["Kerze", "Feuerzeug", "0"]);
    //     this.allWordPairs.push(["Lampe", "Kabel", "0"]);
    //     this.allWordPairs.push(["Bleistift", "Papiertaschentuch", "2"]);
    //     this.allWordPairs.push(["Plastikverpackung", "Klebeband", "1"]);
    //     this.allWordPairs.push(["Schwamm", "Spülmittel", "0"]);
    //     this.allWordPairs.push(["Korken", "Kugelschreiber", "5"]);
    //     this.allWordPairs.push(["Holzbrett", "Bleistift", "3"]);
    //     this.allWordPairs.push(["Spülmittel", "Gemüsemesser", "0"]);
    //     this.allWordPairs.push(["Nadel", "Faden", "0"]);
    //     this.allWordPairs.push(["Streichholz", "Schere", "5"]);
    //     this.allWordPairs.push(["Kochlöffel", "Kochtopf", "0"]);
    //     this.allWordPairs.push(["Glas", "Geschirrtuch", "0"]);
    //     this.allWordPairs.push(["Papiertaschentuch", "Teller", "2"]);
    //     this.allWordPairs.push(["Hemd", "Wäscheklammer", "1"]);
    //     this.allWordPairs.push(["Weinflasche", "Korken", "0"]);
    //     this.allWordPairs.push(["Hemd", "Bügeleisen", "0"]);
    // }

    // TODO: unterscheidung studie - free play
    getWordPairs() {
        return fetch("/api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ test: "greetings from the client" })
        })
            .then(response => response.json())
            .then(jsonObj => {
                console.log(jsonObj.array[0]);
                this.allWordPairs = jsonObj.array;
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    getAllWithoutDoubles(twoDArray) {
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