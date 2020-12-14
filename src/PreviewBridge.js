import { Scene } from "phaser";
import { Image } from "phaser";

export class PreviewBridge extends Phaser.GameObjects.Image {

    constructor(scenep, x, y, origin) {
        super(scenep, x, y, 'previewBridge');

        scenep.add.existing(this).setOrigin(origin, 0);

        this.prevBridgeWidth = 0;
        this.visible = false;
        this.standardBridgeSize = 61;

    }

    show(actualDist, bridge) {

        let triedBridge = bridge;

        this.visible = true;
        this.prevBridgeWidth++;
        this.setScale(this.prevBridgeWidth, 1);

        if (actualDist == -1 && this.prevBridgeWidth >= triedBridge.displayWidth) {

            triedBridge.makeVisible(true);
            triedBridge = null;
            this.visible = false;
            this.prevBridgeWidth = 0;

        } else if (this.prevBridgeWidth >= this.standardBridgeSize * actualDist) {

            if (triedBridge.dist == actualDist) {
                triedBridge.makeVisible(true);
            }
            triedBridge = null;
            this.visible = false;
            this.prevBridgeWidth = 0;
            
        }

        return triedBridge;
    }
}