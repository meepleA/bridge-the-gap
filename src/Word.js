import { Scene } from "phaser";

export class Word extends Phaser.GameObjects.Text {

    constructor(scenep, x, y, text, style, words) {
        super(scenep, x, y, text, style);
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
                this.partnerDist.push([element[1], element[2]]);
            }
            if (element[1] == this.text) {
                this.partnerDist.push([element[0], element[2]]);
            }
        });
    }

    getDist(word) {
        for (var i = 0; i < this.partnerDist.length; i++) {
            if (this.partnerDist[i][0] == word.text) {
                var comparableDist = Math.round(parseFloat(this.partnerDist[i][1]));
                return comparableDist;
            }
        }
        return this.defaultDist;
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
        this.setPosition(pillar.x + this.displayHeight, pillar.y + pillar.displayHeight);
        this.setRotation(-1.5708);
        this.setColor("BLACK");
    }
}