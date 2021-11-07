class BulletWeaponFireCommand extends BaseCommand {
    constructor(gameObject, weapon) {
        super(gameObject);
        this.weapon = weapon;
    }

    update(dt) {
        this.weapon.update(dt);
    }

    execute() {
        this.weapon.fire();
    }
}
class FireRatedFireCommand extends BaseCommand {
    constructor(gameObject, prototype, startingPoint, fireRate, randomized = true) {
        super(gameObject);
        this.prototype = prototype;
        this.startingPoint = startingPoint;
        this.fireRate = fireRate;
        this.fireRateTtl = randomized ? Math.random() * this.fireRate : 0;
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

            let clone = this.prototype.getClone();
            clone.position.x = this.gameObject.position.x + (this.gameObject.size.x - clone.size.x) / 2 + this.startingPoint.x;
            clone.position.y = this.gameObject.position.y + (this.gameObject.size.y - clone.size.y) / 2 + this.startingPoint.y;

            ServiceLocator.getService(ServiceLocator.SCENE).currentScene.addGameObject(clone);
        }
    }   
}
class Level01RocketFireCommand extends FireRatedFireCommand {
    constructor(gameObject, prototype, startingPoint, fireRate) {
        super(gameObject, prototype, startingPoint, fireRate);
    }
}
class Level02RocketFireCommand extends FireRatedFireCommand {
    constructor(gameObject, prototype, startingPoint, fireRate) {
        super(gameObject, prototype, startingPoint, fireRate / 2);
    }
}
class Level1RocketFireCommand extends Level02RocketFireCommand {
    constructor(gameObject, prototype, startingPoint, fireRate) {
        super(gameObject, prototype, startingPoint, fireRate);
    }
}

