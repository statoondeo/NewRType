class FireCommand extends BaseCommand {
    constructor(gameObject, bulletPrototype, startingPoint, fireRate) {
        super(gameObject);
        this.bulletPrototype = bulletPrototype;
        this.startingPoint = startingPoint;
        this.fireRate = fireRate;
        this.fireRateTtl = this.fireRate;
        this.lastBullet = null;
    }

    getClone(gameObject) {
        return new FireCommand(gameObject, this.bulletPrototype.getClone(), this.startingPoint.getClone(), this.fireRate);
    }

    update(dt) {
        this.lastBullet = null;
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

            this.lastBullet = this.bulletPrototype.getClone();
            this.lastBullet.position.x = this.gameObject.position.x + this.startingPoint.x;
            this.lastBullet.position.y = this.gameObject.position.y + this.startingPoint.y;

            ServiceLocator.getService(ServiceLocator.SCENE).currentScene.addGameObject(this.lastBullet);
        }
    }
}
