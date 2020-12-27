export class fallenLemmingGroup {

    constructor(scene) {
        this.myGroup = scene.physics.add.group();
        this.myScene = scene;

        this.myGroup.children.iterate(function (child) {

            child.setScale(0.5, 0.5);
            child.body.setGravityY(0);
            child.setVelocityX(-70);

        });

        scene.anims.create({
            key: 'swim',
            frames: [{ key: 'lemming', frame: 14 }],
            frameRate: 24
        });

        scene.anims.create({
            key: 'climb',
            frames: scene.anims.generateFrameNumbers('lemming', { start: 15, end: 16 }),
            frameRate: 8,
            repeat: -1
        });
    }

    animate(newGroup) {
        this.myGroup.children.each( (child) => {

            if (child.body.position.y > this.myScene.cameras.main.height - 300 - child.displayHeight && child.body.position.x <= 13) {
                child.anims.play("climb", true);
                child.setVelocityX(0);
                child.setVelocityY(-80);
            
            } else if(child.body.position.y < this.myScene.cameras.main.height - 300){
                // change group
                child.setBounce(0.2);
                child.body.setGravityY(500);
                child.setVelocityX(110);
                newGroup.add(child);
                this.myGroup.remove(child);
            } else {
                child.anims.play("swim", true);
                child.setVelocityX(-50);
            }

            // child.anims.play("run", true);

        });
    }
}