import { Scene } from "phaser";
import { Image } from "phaser";

export class Bridge extends Phaser.GameObjects.Image {
    constructor(scenep, x, y, distp) {
        super(scenep, x, y, 'bridge');

        scenep.add.existing(this).setOrigin(0, 0);
    
        this.dist = distp;
        this.visible = false;
        
        // TODO: Bild und Positionen anpassen, je nach länge
        if(this.dist == 2){
            this.setScale(2, 1);
        } else if(this.dist == 3){
            this.setScale(3, 1);
        }
    }
}