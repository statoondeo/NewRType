class MediumRedExplosionGameObject extends ExplosionGameObject {
    constructor() {
        let image = ImageHandler.zoomImage(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("Images/redspark.png"), new Vec2(2));
        super(image, new Vec2(200), 30);
    }
    
    getClone() {
        return new MediumRedExplosionGameObject();
    }
}
class GiantRedExplosionGameObject extends ExplosionGameObject {
    constructor() {
        let image = ImageHandler.zoomImage(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("Images/redspark.png"), new Vec2(5));
        super(image, new Vec2(500), 75);
    }
    
    getClone() {
        return new GiantRedExplosionGameObject();
    }
}
class BigSaucerMediumExplosionGameObject extends MediumRedExplosionGameObject {
    constructor(gameObject) {
        super();
        this.gameObject = gameObject;
        this.explosionsList = [];
        this.speed = 60;
        let angle;
        let explosion;
        for (let index = 0; index < 5; index++) {
            explosion = new RedExplosionGameObject()
            explosion.speed = Math.random() * 120 + 120;
            explosion.position = this.position;
            angle = Math.random() * 2 * Math.PI;
            explosion.moveStrategy = new UniformMoveStrategy(explosion, new Vec2(Math.cos(angle), Math.sin(angle)));
            this.explosionsList.push(explosion);
            this.status = GameObjectState.IDLE;
        }        
        this.popped = false;
        this.status = GameObjectState.IDLE;
    }
    
    getClone(gameObject) {
        return new BigSaucerMediumExplosionGameObject(gameObject);
    }

    update(dt) {
        super.update(dt);
        if (this.status == GameObjectState.ACTIVE && !this.popped) {
            this.popped = true;
            this.explosionsList.forEach(explosion => {
                explosion.position.x = this.gameObject.position.x + (this.gameObject.size.x - explosion.size.x) / 2;
                explosion.position.y = this.gameObject.position.y + (this.gameObject.size.y - explosion.size.y) / 2;
                explosion.status = GameObjectState.ACTIVE;
                ServiceLocator.getService(ServiceLocator.SCENE).currentScene.addGameObject(explosion);
            });
        }
    }
}

class BigSaucerBigExplosionGameObject extends GiantRedExplosionGameObject {
    constructor(gameObject) {
        super();
        this.gameObject = gameObject;
        this.explosionsList = [];
        let angle;
        let explosion;
        for (let index = 0; index < 5; index++) {
            explosion = new BigSaucerMediumExplosionGameObject(this.gameObject)
            explosion.speed = Math.random() * 60 + 60;
            explosion.position = this.position;
            angle = Math.random() * 2 * Math.PI;
            explosion.moveStrategy = new UniformMoveStrategy(explosion, new Vec2(Math.cos(angle), Math.sin(angle)));
            this.explosionsList.push(explosion);
        }
        this.popped = false;
        this.status = GameObjectState.IDLE;
    }

    getClone(gameObject) {
        return new BigSaucerBigExplosionGameObject(gameObject);
    }

    update(dt) {
        super.update(dt);
        if (this.status == GameObjectState.ACTIVE && !this.popped) {
            this.popped = true;
            this.position.x = this.gameObject.position.x + (this.gameObject.size.x - this.size.x) / 2;
            this.position.y = this.gameObject.position.y + (this.gameObject.size.y - this.size.y) / 2;
            this.explosionsList.forEach(explosion => {
                explosion.position.x = this.gameObject.position.x + (this.gameObject.size.x - explosion.size.x) / 2;
                explosion.position.y = this.gameObject.position.y + (this.gameObject.size.y - explosion.size.y) / 2;
                explosion.status = GameObjectState.ACTIVE;
                ServiceLocator.getService(ServiceLocator.SCENE).currentScene.addGameObject(explosion);
            });
        }
    }
}
