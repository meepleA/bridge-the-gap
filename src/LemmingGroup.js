import { Group } from "phaser";

export class LemmingGroup {

    constructor(scene){
        this.myGroup = scene.physics.add.group({
            key: 'lemming',
            repeat: 3,
            setXY: { x: 30, y: 280, stepX: -27 }
        });

        this.myGroup.children.iterate(function (child) {

            child.setScale(0.5, 0.5);
            child.setBounce(0.2);
            child.body.setGravityY(500);
            child.setVelocityX(100);

        });

        scene.anims.create({
            key: 'run',
            frames: scene.anims.generateFrameNumbers('lemming', { start: 0, end: 12 }),
            frameRate: 24,
            repeat: -1
        });

        scene.anims.create({
            key: 'fall',
            frames: [ { key: 'lemming', frame: 13 } ],
            frameRate: 24
        });
    }

    // resetPosition(){
    //     this.myGroup.children.iterate(function (child) {

    //         if (child.body.position.y >= 600) {
    //             child.body.reset(30, 260);
    //             child.setVelocityX(100);
    //         }
    //     });
    // }

    animate(newGroup){
        this.myGroup.children.each( (child) => {

            if(child.body.position.y >= 300 && child.body.touching.down){
                // change group
                child.body.setGravityY(0);
                child.setVelocityX(-70);
                newGroup.add(child);
                this.myGroup.remove(child);
            } else if(child.body.position.y >= 300 && child.body.position.y <= 525){
                child.anims.play("fall", true);
            } else {
                child.anims.play("run", true);
                child.setVelocityX(100);
            }
        });
    }
}