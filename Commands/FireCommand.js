class FireCommand extends BaseCommand {
    constructor(gameObject, bulletPrototype, startingPoint, fireRate, fireDelay = 0) {
        super(gameObject);
        this.bulletPrototype = bulletPrototype;
        this.startingPoint = startingPoint;
        this.fireRate = fireRate;
        this.fireRateTtl = this.fireRate;
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

            let bullet = this.bulletPrototype.getClone();
            bullet.position.x = this.gameObject.position.x + this.startingPoint.x;
            bullet.position.y = this.gameObject.position.y + this.startingPoint.y;

            ServiceLocator.getService(ServiceLocator.SCENE).currentScene.addGameObject(bullet);
        }
    }
}
