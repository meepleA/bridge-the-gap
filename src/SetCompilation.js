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
        this.hardCodeWordPairs(this.allWordPairs);
        // const fetchPromise = await this.getWordPairs(this.allWordPairs);

        this.allSingleWords = this.getAllWithoutDoubles(this.allWordPairs);
        this.set = new WordSet(this);
        this.pool = [];

        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.lvlCountText = this.add.text(this.cameras.main.width - 100, 30, "Level: " + this.levelCount.toString(), this.textStyle);
        this.createButtons();
        this.createPool();

    }

    update() {
        // display the chosen word set
        this.set.setWordPositions(20, 25, false, this.cameras.main.width - this.lvlCountText.x + 50);
    }

    createButtons() {
        this.finishButton = new Button(this, 700, 170, "Weiter", () => {
            this.scene.start("level", { generalTextStyle: this.textStyle, level: this.levelCount, pairDist: this.allWordPairs, wordSet: this.set.getSet(), pillarArr: this.pillars, bridgePartArr: this.bridgeParts });
        });
        this.finishButton.visible = false;
    }

    createPool() {
        while (this.pool.length <= 20) {
            let randomWord = this.allSingleWords[Math.floor(Math.random() * this.allSingleWords.length)];
            if (!this.pool.includes(randomWord)) {
                this.pool.push(randomWord);
            }
        }

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
    hardCodeWordPairs(arr) {
        // die ersten 20 Einträge vom Goldstandard
        arr.push(["Kochtopf", "Tee", "1"]);
        arr.push(["Geschirrtuch", "Tisch", "1"]);
        arr.push(["Schere", "Papier", "1"]);
        arr.push(["Tasse", "Topfdeckel", "2"]);
        arr.push(["Kerze", "Feuerzeug", "1"]);
        arr.push(["Lampe", "Kabel", "1"]);
        arr.push(["Bleistift", "Papiertaschentuch", "2"]);
        arr.push(["Plastikverpackung", "Klebeband", "1"]);
        arr.push(["Schwamm", "Spülmittel", "1"]);
        arr.push(["Korken", "Kugelschreiber", "3"]);
        arr.push(["Holzbrett", "Bleistift", "2"]);
        arr.push(["Spülmittel", "Gemüsemesser", "1"]);
        arr.push(["Nadel", "Faden", "1"]);
        arr.push(["Streichholz", "Schere", "3"]);
        arr.push(["Kochlöffel", "Kochtopf", "1"]);
        arr.push(["Glas", "Geschirrtuch", "1"]);
        arr.push(["Papiertaschentuch", "Teller", "2"]);
        arr.push(["Hemd", "Wäscheklammer", "1"]);
        arr.push(["Weinflasche", "Korken", "1"]);
        arr.push(["Hemd", "Bügeleisen", "1"]);

        arr.push(["Tasse", "Tee", "1"]);
        arr.push(["Faden", "Topfdeckel", "2"]);
    }

    // TODO: unterscheidung studie - free play
    getWordPairs(resultArray) {
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
                resultArray = jsonObj.array;
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    getAllWithoutDoubles(twoDArray) {
        let finalArray = [];
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