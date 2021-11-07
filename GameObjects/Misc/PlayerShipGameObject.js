class PlayerShipGameObject extends AnimatedSprite {
    constructor(image, tile, initialPosition) {
        super(image, tile)
        this.type = GameObjectType.SHIP;
        this.collideBox = new CircleCollideBox(this.position, this.size.x / 2);
        this.layer = 1;
        this.partition = GameObjectPartition.PLAYER_PARTITION;
        this.moveStrategy = new PlayerControlledMoveStrategy(this);
        this.position.x = initialPosition.x;
        this.position.y = initialPosition.y;
        this.collideCommand = new ShipCollideCommand(this);
        this.dieCommand = new DummyCommand();
        this.fireCommand = new BulletWeaponFireCommand(this, BulletWeaponFactory.getBulletWeapon(this));

        // Paramétrage du vaisseau du joueur
        this.life = this.maxLife = 1000;
        this.speed = 200;

        this.dealDamageCommand = new DealDamageCommand(this, this.maxLife);
    }

    static size = new Vec2(64);
}
