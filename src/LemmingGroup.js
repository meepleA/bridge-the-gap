import { Group } from "phaser";

export class LemmingGroup {

    constructor(scene){
        this.myGroup = scene.physics.add.group({
            key: 'lemming',
            repeat: 3,
            setXY: { x: 30, y: 290, stepX: -27 }
        });

        this.myGroup.children.iterate(function (child) {

            child.setBounce(0.2);
            child.body.setGravityY(500);
            child.setVelocityX(110);

        });
    }

    resetPosition(){
        this.myGroup.children.iterate(function (child) {

            if (child.body.position.y >= 600) {
                child.body.reset(30, 290);
                child.setVelocityX(110);
            }
        });
    }
}