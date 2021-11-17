class FireRatedFireCommand extends BaseCommand {
    constructor(gameObject, prototype, startingPoint, fireRate, sound = null) {
        super(gameObject);
        this.prototype = prototype;
        this.startingPoint = startingPoint;
        this.fireRate = fireRate;
        this.fireRateTtl = Math.random() * this.fireRate;
        this.sound = sound;
    }

    update(dt) {
        if (this.fireRateTtl > 0){
            this.fireRateTtl -= dt;
            if (this.fireRateTtl < 0) {
                this.fireRateTtl = 0;
            }
        }
        this.canExecute = this.fireRateTtl == 0;
    }

    execute() {
        if (this.canExecute) {
            this.fireRateTtl = this.fireRate;
            if (this.sound != null) {
                this.sound.play();
            }
            let clone = this.prototype.getClone();
            clone.position.x = this.gameObject.position.x + (this.gameObject.size.x - clone.size.x) / 2 + this.startingPoint.x;
            clone.position.y = this.gameObject.position.y + (this.gameObject.size.y - clone.size.y) / 2 + this.startingPoint.y;
            Services.get(Services.SCENE).currentScene.addGameObject(clone);
        }
    }   
}
class RandomizedFireRatedFireCommand extends BaseCommand {
    constructor(gameObject, prototype, startingPoint, fireRate) {
        super(gameObject);
        this.prototype = prototype;
        this.startingPoint = startingPoint;
        this.fireRate = fireRate;
        this.fireRateTtl = 0;
    }

    update(dt) {
        if (this.fireRateTtl > 0){
            this.fireRateTtl -= dt;
            if (this.fireRateTtl < 0) {
                this.fireRateTtl = 0;
            }
        }
        this.canExecute = this.fireRateTtl == 0;
    }

    execute() {
        if (this.canExecute) {
            this.fireRateTtl = this.fireRate * (0.9 + Math.random() * 0.2);

            let clone = this.prototype.getClone();
            clone.position.x = this.gameObject.position.x + (this.gameObject.size.x - clone.size.x) / 2 + this.startingPoint.x;
            clone.position.y = this.gameObject.position.y + (this.gameObject.size.y - clone.size.y) / 2 + this.startingPoint.y;
            Services.get(Services.SCENE).currentScene.addGameObject(clone);
        }
    }   
}