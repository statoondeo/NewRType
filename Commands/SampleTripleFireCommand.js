class SampleTripleFireCommand {
    constructor(gameObject, fireRate) {
        this.gameObject = gameObject;
        this.fireRate = fireRate;
        this.currentTtl = this.fireRate;
        this.executed = false;
        this.bulletPrototype = new AnimatedSprite(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("images/redbullet.png"), new Vec2(32, 32));
        this.bulletPrototype.partition = this.gameObject.partition;
        this.bulletPrototype.collideBox = new CircleCollideBox(this.bulletPrototype.position, this.bulletPrototype.size.x / 2);
        this.bulletPrototype.speed = 400;
        this.bulletPrototype.addAnimation(new Animation("IDLE", [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 10 / 1000, true));
        this.bulletPrototype.startAnimation("IDLE", 0);
    }

    update(dt) {
        if (this.currentTtl > 0) {
            this.currentTtl -= dt;
            if (this.currentTtl <= 0) {
                this.currentTtl = 0;
            }
        }

        if (ServiceLocator.getService(ServiceLocator.KEYBOARD).isDown("KeyF") && this.currentTtl == 0) {
            this.executed = true;
        }
    }

    execute() {
        if (this.executed) {            
            this.executed = false;
            this.currentTtl = this.fireRate;
            let baseAngle = -Math.PI / 4;
            let angleOffset = Math.PI / 4;
            for (let index = 0; index < 3; index++) {
                let bullet = this.bulletPrototype.getClone();
                bullet.partition = this.bulletPrototype.partition
                bullet.moveCommand = new UniformMoveCommand(bullet, new Vec2(Math.cos(baseAngle + index * angleOffset), Math.sin(baseAngle + index * angleOffset)));
                bullet.position = this.gameObject.position.getClone();
                bullet.position.x += this.gameObject.size.x - bullet.size.x;
                bullet.position.y += (this.gameObject.size.y - bullet.size.y) / 2 ;
                bullet.collideBox.position = bullet.position;
                ServiceLocator.getService(ServiceLocator.SCENE).currentScene.addGameObject(bullet);          
            }
        }
    }
}