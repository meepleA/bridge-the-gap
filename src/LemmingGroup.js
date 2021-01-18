import { Group } from "phaser";

export class LemmingGroup {

    constructor(scene){
        this.myScene = scene;

        this.myGroup = scene.physics.add.group({
            key: 'lemming',
            repeat: 23,
            setXY: { x: -550, y: scene.cameras.main.height - 320, stepX: 30 }
        });

        this.myGroup.children.iterate(function (child) {

            child.setScale(0.5, 0.5);
            child.setBounce(0.2);
            child.body.setGravityY(500);
            child.setVelocityX(110);

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

    animate(newGroup){
        this.myGroup.children.each( (child) => {
            if(child.body.position.x > this.myScene.cameras.main.width + child.displayWidth){
                child.body.setGravityY(0);
                child.setVelocityX(0);

            } else if(child.body.position.y >= this.myScene.cameras.main.height - 300 && child.body.touching.down){
                // change group
                child.body.setGravityY(0);
                child.setVelocityX(-50);
                newGroup.add(child);
                this.myGroup.remove(child);

            } else if(child.body.position.y >= this.myScene.cameras.main.height - 300 && child.body.position.y <= this.myScene.cameras.main.height - 75){
                child.anims.play("fall", true);

            } else {
                child.anims.play("run", true);
                child.setVelocityX(110);
            }
        });
    }
}