import { Scene } from "phaser";
import { PoolWord } from "./PoolWord";
import { Button } from "./Button";
import { WordSet } from "./WordSet";

export class SetCompilation extends Scene {

    constructor() {
        super({ key: "set" });

        // data from previous scene
        this.levelCount;
        this.textStyle;
        this.pillars;
        this.bridgeParts;

        // server, scenen manager
        this.allWordPairs = [];
        this.allSingleWords = [];

        this.set = [];
        this.pool = [];
        this.poolWords; 
        this.finishButton;
        this.lvlCountText;
    }

    init(data) {
        this.levelCount = data.level;
        this.textStyle = data.generalTextStyle;
        this.pillars = data.pillarArr;
        this.bridgeParts = data.bridgePartArr;
    }

    preload() {
        this.load.image('background', 'assets/background.png');
    }

    async create() {
        // server, scenen manager
        this.allWordPairs = [];
        this.hardCodeWordPairs();
        // const fetchPromise = await this.getWordPairs();

        this.allSingleWords = this.getAllWithoutDoubles(this.allWordPairs);
        this.set = new WordSet(this);
        this.pool = [];

        while (this.pool.length <= 20) {
            var randomWord = this.allSingleWords[Math.floor(Math.random() * this.allSingleWords.length)];
            if (!this.pool.includes(randomWord)) {
                this.pool.push(randomWord);
            }
        }

        this.poolWords = null;

        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.lvlCountText = this.add.text(this.cameras.main.centerX * 2 - 100, 30, "Level: " + this.levelCount.toString(), this.textStyle);
        this.createButtons();
        this.createPool();
    }

    update() {
        // display the chosen word set
        this.set.setWordPositions(20, 25, false, this.cameras.main.centerX * 2 - this.lvlCountText.x + 50);
    }

    createButtons() {
        this.finishButton = new Button(this, 700, 170, "Weiter", () => {
            this.scene.start("level", { generalTextStyle: this.textStyle, level: this.levelCount, pairDist: this.allWordPairs, wordSet: this.set.getSet(), pillarArr: this.pillars, bridgePartArr: this.bridgeParts });
        });
        this.finishButton.visible = false;
    }

    createPool() {
        this.poolWords = new WordSet(this);
        this.pool.forEach(element => {
            this.poolWords.addWord(new PoolWord(this, 0, 0, this.textStyle, element));
        });
        this.poolWords.setWordPositions(20, 300, true, 20);
    }

    selectWord(word) {
        if (this.set.getSet().includes(word)) {
            this.set.spliceWords(this.set.getSet().indexOf(word), 1);
            word.setPosition(word.originalX, word.originalY);
        } else if (this.set.getSet().length < this.pillars.length) {
            this.set.addWord(word);
        }

        if (this.set.getSet().length == this.pillars.length) {
            this.finishButton.visible = true;
        } else {
            this.finishButton.visible = false;
        }
    }

    // server
    hardCodeWordPairs() {
        // die ersten 20 Einträge vom Goldstandard
        this.allWordPairs.push(["Kochtopf", "Tee", "0"]);
        this.allWordPairs.push(["Geschirrtuch", "Tisch", "0"]);
        this.allWordPairs.push(["Schere", "Papier", "0"]);
        this.allWordPairs.push(["Tasse", "Topfdeckel", "3"]);
        this.allWordPairs.push(["Kerze", "Feuerzeug", "0"]);
        this.allWordPairs.push(["Lampe", "Kabel", "0"]);
        this.allWordPairs.push(["Bleistift", "Papiertaschentuch", "2"]);
        this.allWordPairs.push(["Plastikverpackung", "Klebeband", "1"]);
        this.allWordPairs.push(["Schwamm", "Spülmittel", "0"]);
        this.allWordPairs.push(["Korken", "Kugelschreiber", "5"]);
        this.allWordPairs.push(["Holzbrett", "Bleistift", "3"]);
        this.allWordPairs.push(["Spülmittel", "Gemüsemesser", "0"]);
        this.allWordPairs.push(["Nadel", "Faden", "0"]);
        this.allWordPairs.push(["Streichholz", "Schere", "5"]);
        this.allWordPairs.push(["Kochlöffel", "Kochtopf", "0"]);
        this.allWordPairs.push(["Glas", "Geschirrtuch", "0"]);
        this.allWordPairs.push(["Papiertaschentuch", "Teller", "2"]);
        this.allWordPairs.push(["Hemd", "Wäscheklammer", "1"]);
        this.allWordPairs.push(["Weinflasche", "Korken", "0"]);
        this.allWordPairs.push(["Hemd", "Bügeleisen", "0"]);
    }

    // TODO: unterscheidung studie - free play
    getWordPairs() {
        return fetch("/wordPairs", {
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