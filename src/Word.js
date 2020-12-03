import { Scene } from "phaser";

export class Word extends Phaser.GameObjects.Text {

    constructor(scenep, x, y, text, words) {      
        super(scenep, x, y, text, { font: "20px Quicksand", fill: "#000000"});
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
    fillPartnerDist(twoDArray){
        twoDArray.forEach(element => {
            if(element[0] == this.text){
                this.partnerDist.push([element[1], element[2]]);
            }
            if(element[1] == this.text){
                this.partnerDist.push([element[0], element[2]]);
            }
        });
    }

    getDist(word){
        for(var i=0; i<this.partnerDist.length; i++){
            if(this.partnerDist[i][0] == word.text){
                var comparableDist = Math.round(parseFloat(this.partnerDist[i][1]));
                if(comparableDist == 0 || comparableDist == 1){
                    return 1;
                } else if(comparableDist == 2 || comparableDist == 3){
                    return 2;
                } else {
                    return 3;
                } 
            }
        }
        return this.defaultDist;
    }
}