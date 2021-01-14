import { Scene } from "phaser";
import { Image } from "phaser";

export class PreviewBridge extends Phaser.GameObjects.Image {

    constructor(scenep, x, y, origin, rootWord, nextWord, bridgePart) {

        super(scenep, x, y, 'previewBridge');

        scenep.add.existing(this).setOrigin(origin, 0);

        this.prevBridgeWidth = 0;
        this.standardBridgeSize = 61;
        this.originWord = rootWord;
        this.otherWord = nextWord;
        this.bridge = bridgePart;

    }

    show() {

        let actualDist = this.otherWord.getDist(this.originWord);
        if(this.originWord.enteredPillar == null || this.otherWord.enteredPillar == null){
            return false;
        }

        if (actualDist[0] == -1 && this.prevBridgeWidth >= this.bridge.displayWidth) {

            // console.log("neu");
            this.bridge.makeVisible(true);
            return false;

        } else if (this.prevBridgeWidth >= this.standardBridgeSize * actualDist[0]
            && (this.bridge.dist == actualDist[0] || this.bridge.dist == actualDist[1])) {

            // if (this.bridge.dist == actualDist[0] || this.bridge.dist == actualDist[1]) {
                this.bridge.makeVisible(true);
                // console.log("passt");
                // console.log(actualDist);
                return false;
            // }

        } else if(this.prevBridgeWidth >= this.standardBridgeSize * actualDist[1]){

        } else {

            this.prevBridgeWidth++;
            this.setScale(this.prevBridgeWidth, 1);

        }
        return true;
    }
}