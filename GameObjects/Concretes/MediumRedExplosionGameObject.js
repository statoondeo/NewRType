class MediumRedExplosionGameObject extends ExplosionGameObject {
    constructor(speed = 30) {
        super(ImageHandler.zoomImage(Services.get(Services.ASSET).get("Images/redspark.png"), new Vec2(2)), new Vec2(200), speed);
    }
    
    getClone() {
        return new MediumRedExplosionGameObject(this.speed);
    }
}
class GiantRedExplosionGameObject extends ExplosionGameObject {
    constructor(speed = 75) {
        super(ImageHandler.zoomImage(Services.get(Services.ASSET).get("Images/redspark.png"), new Vec2(5)), new Vec2(500), speed);
    }
    
    getClone() {
        return new GiantRedExplosionGameObject(this.speed);
    }
}
class ParticlesMediumExplosionGameObject extends GameObject {
    constructor(gameObject, prototypesList) {
        super();
        this.gameObject = gameObject;
        this.spawned = false;
        this.prototypesList = prototypesList;
        this.explosions = [];
        let number = 5;
        this.prototypesList.forEach(prototype => {
            prototype.partition = GameObjectPartition.NEUTRAL_PARTITION;
            this.createExplosions(number, prototype);
            number = number * 2 + 1;
        });
    }

    createExplosions(maxNumber, explosionPrototype) {
        for (let index = 0; index < maxNumber; index++) {
            let explosion = explosionPrototype.getClone();
            explosion.speed = Math.random() * 3 * explosion.speed / 4 + explosion.speed / 2;
            let angle = Math.random() * 2 * Math.PI;
            explosion.moveStrategy = new UniformMoveStrategy(explosion, new Vec2(Math.cos(angle), Math.sin(angle)));
            explosion.layer = this.gameObject.layer + 1;
            this.explosions.push(explosion);
        }        
    }
    
    getClone(gameObject) {
        return new ParticlesMediumExplosionGameObject(gameObject, this.prototypesList);
    }

    update(dt) {
        this.status = GameObjectState.OUTDATED;

        this.explosions.forEach(explosion => {
            explosion.status = GameObjectState.ACTIVE;
            explosion.position.x = this.gameObject.position.x + (this.gameObject.size.x - explosion.size.x) / 2;
            explosion.position.y = this.gameObject.position.y + (this.gameObject.size.y - explosion.size.y) / 2;
            Services.get(Services.SCENE).currentScene.addGameObject(explosion);
        });
    }
}
class ParticlesThrustGameObject extends GameObject {
    constructor(gameObject, prototype, direction = -1) {
        super();
        this.gameObject = gameObject;
        this.prototype = prototype;
        this.direction = direction;
        this.ttl = this.baseTtl = 0;
        this.lastPosition = new Vec2();
    }
    
    getClone(gameObject) {
        return new ParticlesThrustGameObject(gameObject, this.prototype, this.direction);
    }

    update(dt) {
        this.ttl -= dt;
        if (this.ttl < 0) {
            this.baseTtl = 50 / this.gameObject.speed;
            if (this.gameObject.position.x != this.lastPosition.x || this.gameObject.position.y != this.lastPosition.y) {
                this.ttl = Math.random() * this.baseTtl;
            }
            else {
                this.ttl = (Math.random() + 0.5) * this.baseTtl;
            }
            let explosion = this.prototype.getClone();
            let angle = Math.random() * Math.PI / 2 + Math.PI * (0.25 + this.direction * 0.5);
            explosion.position.x = this.gameObject.position.x + this.direction * explosion.size.x / 2;
            explosion.position.y = this.gameObject.position.y + (this.gameObject.size.y - explosion.size.y) / 2;
            explosion.moveStrategy = new UniformMoveStrategy(explosion, new Vec2(Math.cos(angle), Math.sin(angle)));
            explosion.status = GameObjectState.ACTIVE;
            Services.get(Services.SCENE).currentScene.addGameObject(explosion);
            this.lastPosition.x = this.gameObject.position.x;
            this.lastPosition.y = this.gameObject.position.y;
        }
    }
}
