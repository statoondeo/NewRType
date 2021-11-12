class PlayerShipGameObject extends AnimatedSprite {
    static size = new Vec2(64);
    constructor(image, tile, initialPosition) {
        super(image, tile)
        this.type = GameObjectType.SHIP;
        this.collideBox = new CircleCollideBox(this.position, 0.6 * this.size.x / 2, new Vec2(0.3 * this.size.x / 2, 0.3 * this.size.x / 2));
        this.layer = 1;
        this.partition = GameObjectPartition.PLAYER_PARTITION;
        this.moveStrategy = new PlayerControlledMoveStrategy(this);
        this.position.x = initialPosition.x;
        this.position.y = initialPosition.y;
        this.collideCommand = new ShipCollideCommand(this);
        this.dieCommand = new DummyCommand();
        this.fireCommand = new WeaponFireCommand(this, WeaponFactory.getBulletWeapon(this));

        // Paramétrage du vaisseau du joueur
        this.life = this.maxLife = 1000;
        this.speed = 200;

        this.dealDamageCommand = new DealDamageCommand(this, this.maxLife);
        this.thrust = new ParticlesThrustGameObject(this, new BlueExplosionGameObject(75));
    }

    update(dt) {
        super.update(dt);
        this.thrust.update(dt);
    }
}
