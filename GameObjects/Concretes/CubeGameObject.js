class CubeGameObject extends EnemyShipGameObject {
    constructor(playerShip) {
        // Paramétrage du vaisseau ennemi
        super(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("Images/cube.png"), new Vec2(64), 200, 0)
        this.playerShip = playerShip;
        this.layer = 0.99;
        this.moveStrategy = new DummyMoveStrategy();
        let bulletPrototype = new BlueBulletGameObject(this.partition, new Vec2());
        bulletPrototype.moveStrategy = new PlayerAimedUniformMoveStrategy(bulletPrototype, this, this.playerShip);
        this.fireCommand = new AsapFireCommand(new Level1BulletFireCommand(this, bulletPrototype, 5));
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], 100 / 1000, true));
        this.startAnimation("IDLE", 0);
    }
            
    getClone() {
        return new CubeGameObject(this.playerShip);
    }

    static size = new Vec2(64);
}

class TimedCubeGameObject extends EnemyShipGameObject {
    constructor(playerShip) {
        // Paramétrage du vaisseau ennemi
        super(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("Images/cube.png"), new Vec2(64), 200, 0)
        this.playerShip = playerShip;
        this.layer = 0.99;
        this.moveStrategy = new DummyMoveStrategy();
        let bulletPrototype = new BlueBulletGameObject(this.partition, new Vec2());
        bulletPrototype.moveStrategy = new PlayerAimedUniformMoveStrategy(bulletPrototype, this, this.playerShip);
        this.fireCommand = new AsapFireCommand(new Level1BulletFireCommand(this, bulletPrototype, 5));
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], 100 / 1000, true));
        this.startAnimation("IDLE", 0);
        this.ttl = 20;
    }
            
    getClone() {
        return new TimedCubeGameObject(this.playerShip);
    }

    update(dt) {
        super.update(dt);
        this.ttl -= dt;
        if (this.ttl < 0) {
            this.dieCommand.execute();
        }
    }

    static size = new Vec2(64);
}
