import { myGame } from "./globalVariables";

export class Word extends Phaser.GameObjects.Text {

    constructor(scenep, x, y, text, words) {
        super(scenep, x, y, text, myGame.textStyle);
        this.scene = scenep;
        this.originalX = x;
        this.originalY = y;
        
        this.scene.add.existing(this).setOrigin(0, 0);
        this.setInteractive().on('pointerdown', () => {
            this.scene.changeSelectedWord(this);
        });
        this.on('pointerover', () => { this.setColor("RED"); });
        this.on('pointerout', () => { this.setColor("BLACK"); });

        this.defaultDist = -1;
        this.partnerDist = [];
        this.fillPartnerDist(words);
        this.isHighlighted = false;
        this.enteredPillar;
    }

    // später auf server, hier anfrage
    fillPartnerDist(twoDArray) {
        twoDArray.forEach(element => {
            if (element[0] == this.text) {
                this.partnerDist.push([element[1], element[2], element[3]]);
            }
            if (element[1] == this.text) {
                this.partnerDist.push([element[0], element[2], element[3]]);
            }
        });
    }

    getDist(word) {
        for (let i = 0; i < this.partnerDist.length; i++) {
            if (this.partnerDist[i][0] == word.text) {
                let comparableDist = Math.round(parseFloat(this.partnerDist[i][1]));
                return comparableDist;
            }
        }
        return this.defaultDist;
    }

    getDistVersion(word){
        for (let i = 0; i < this.partnerDist.length; i++) {
            if (this.partnerDist[i][0] == word.text) {
                 return this.partnerDist[i][2];
            }
        }
        return "0";
    }

    addDist(text, dist) {
        this.partnerDist.push([text, dist]);
    }

    setOriginals(x, y) {
        this.originalX = x;
        this.originalY = y;
    }

    resetPosition() {
        this.setAngle(0);
        this.setPosition(this.originalX, this.originalY);
    }

    newPosition(pillar) {
        this.setPosition(pillar.x + 10, pillar.y + pillar.displayHeight - 20);
        this.setRotation(-1.5708);
        this.setColor("BLACK");
    }
}