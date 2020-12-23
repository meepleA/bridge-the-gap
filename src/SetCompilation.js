import { Scene } from "phaser";
import { PoolWord } from "./PoolWord";
import { Button } from "./Button";
import { WordSet } from "./WordSet";

export class SetCompilation extends Scene {

    constructor() {
        super({ key: "set" });

        // data from previous scene
        this.levelCount;
        this.totalLevelCount;
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
        this.levelCount = data.level[0];
        this.totalLevelCount = data.level[1];
        this.textStyle = data.generalTextStyle;
        this.pillars = data.pillarArr;
        this.bridgeParts = data.bridgePartArr;
    }

    preload() {
        this.load.image('setCompilationBg', 'assets/setCompilationBg.png');
        this.load.image('setBg', 'assets/setBg.png');
        this.load.image('wordBg', 'assets/wordBg.png');
        this.load.spritesheet('toBridgeButton', 'assets/toBridgeButton.png', { frameWidth: 293, frameHeight: 283 });
    }

    async create() {
        // server, scenen manager
        this.allWordPairs = [];
        // this.hardCodeWordPairs(this.allWordPairs);
        const fetchPromise = await this.getWordPairs();

        this.allSingleWords = this.getAllWithoutDoubles(this.allWordPairs);
        this.set = new WordSet(this);
        this.pool = [];

        this.add.image(0, 0, 'setCompilationBg').setScale(0.55, 0.67).setOrigin(0, 0);
        this.add.image(0, 0, 'setBg').setScale(0.45, 0.75).setOrigin(0, 0);

        this.lvlCountText = this.add.text(this.cameras.main.width - 100, 20, "Level: " + this.levelCount.toString(), this.textStyle);
        this.createButtons();
        this.createPool();

    }

    update() {
        // display the chosen word set
        if (this.set.length != 0) {
            this.set.setWordPositions(50, 65, false, 400);
        }
    }

    createButtons() {
        this.finishButton = new Button(this, this.cameras.main.width - 10, 200, "toBridgeButton", () => {
            this.scene.start("level", { generalTextStyle: this.textStyle, level: [this.levelCount, this.totalLevelCount], pairDist: this.allWordPairs, wordSet: this.set.getSet(), pillarArr: this.pillars, bridgePartArr: this.bridgeParts });
        }).setOrigin(1, 0);
        this.finishButton.visible = false;
        this.finishButton.setScale(0.5, 0.5);
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
            this.poolWords.bgPics.push(this.add.image(0, 0, "wordBg").setOrigin(0, 0));
            this.poolWords.addWord(new PoolWord(this, 0, 0, this.textStyle, element));
        });
        this.poolWords.setWordPositions(20, 370, true, 100);
    }

    selectWord(word) {
        if (this.set.getSet().includes(word)) {

            let singleBg = this.set.bgPics[this.set.getSet().indexOf(word)];
            this.set.bgPics.splice(this.set.getSet().indexOf(word), 1);

            this.set.spliceWords(this.set.getSet().indexOf(word), 1);
            word.setPosition(word.originalX, word.originalY);

            singleBg.setPosition(word.x - 5, word.y - 5);

        } else if (this.set.getSet().length < this.pillars.length) {
            this.set.bgPics.push(this.poolWords.bgPics[this.poolWords.getSet().indexOf(word)]);
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