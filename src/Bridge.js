import { Scene } from "phaser";
import { Image } from "phaser";

export class Bridge extends Phaser.GameObjects.Image {
    constructor(scenep, x, y, distp) {
        super(scenep, x, y, 'bridge');
        scenep.add.existing(this).setOrigin(0, 0);
    
        this.dist = distp;
        this.visible = false;
        
        // TODO: Bild und Positionen anpassen, je nach länge
        this.setScale(this.dist, 1);
    }

    makeVisible(bool){
        this.visible = bool;
        this.body.enable = bool;
    }
}