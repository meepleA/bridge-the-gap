import { Scene } from "phaser";
import { Image } from "phaser";

export class Bridge extends Phaser.GameObjects.Image {
    constructor(scenep, x, y, distp) {
        super(scenep, x, y, 'bridge');
        scenep.add.existing(this).setOrigin(0, 0);

        this.dist = distp;
        this.visible = false;
        
        // TODO: Bild und Positionen anpassen, je nach länge
        if(this.dist == 3){
            this.setScale(5, 1);
        }
    }
}