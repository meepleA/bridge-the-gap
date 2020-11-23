import { Scene } from "phaser";

export class Word extends Phaser.GameObjects.Text {

    constructor(scenep, x, y, text) {      
        super(scenep, x, y, text, { font: "20px Quicksand", fill: "#000000"});
        this.scene = scenep;
        this.scene.add.existing(this).setOrigin(0, 0);
        this.setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
            console.log("click");
            this.scene.changeSelectedWord(this);
        });
        this.defaultDist;
        this.partnerDist = [];
        this.fillPartnerDist();
    }

    fillPartnerDist(){
        // liste mit wortpaaren und distanzen bekommen und die mit text^ in partnerDist pushen
    }

    getDist(word){
        for(var i=0; i<this.partnerDist.length; i++){
            if(this.partnerDist[i][0] == word.text){
                return parseFloat(this.partnerDist[i][1]);
            }
        }
        return this.defaultDist;
    }
}