class EnemyFireCommand extends BaseCommand {
    constructor(gameObject, bulletPrototype, fireRate) {
        super(gameObject);
        this.bulletPrototype = bulletPrototype;
        this.fireRate = fireRate;
        this.fireRateTtl = this.fireRate;
    }

    getClone(gameObject) {
        return new EnemyFireCommand(gameObject, this.bulletPrototype, this.fireRate);
    }

    update(dt) {
        if (this.fireRateTtl < 0) {
            this.fireRateTtl = 0;
        }
        else {
            this.fireRateTtl -= dt;
        }
        this.canExecute = this.fireRateTtl == 0;
    }

    execute() {
        if (this.canExecute) {
            this.fireRateTtl = this.fireRate;

            let playerShip = ServiceLocator.getService(ServiceLocator.SCENE).currentScene.playerShip;
            let bullet = this.bulletPrototype.getClone();
            bullet.position.x = this.gameObject.position.x + this.gameObject.size.x / 2;
            bullet.position.y = this.gameObject.position.y + (this.gameObject.size.y - bullet.size.y) / 2;
            let fireAngle = Math.atan2(playerShip.position.y - bullet.position.y, playerShip.position.x - bullet.position.x);
            bullet.behaveStrategy.moveStrategy.initialVector.x = Math.cos(fireAngle);
            bullet.behaveStrategy.moveStrategy.initialVector.y = Math.sin(fireAngle);

            ServiceLocator.getService(ServiceLocator.SCENE).currentScene.addGameObject(bullet);
        }
    }
}
