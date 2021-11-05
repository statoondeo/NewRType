class PlayerShipGameObject extends AnimatedSprite {
    constructor(image, tile, initialPosition) {
        super(image, tile)
        this.type = GameObjectType.SHIP;
        this.collideBox = new CircleCollideBox(this.position, 0.6 * this.size.x / 2);
        this.layer = 1;
        this.partition = GameObjectPartition.PLAYER_PARTITION;
        this.behaveStrategy = new PlayerControlledBehaveStrategy(this);
        this.position.x = initialPosition.x;
        this.position.y = initialPosition.y;
        this.collideCommand = new ShipCollideCommand(this);
        this.dieCommand = new DummyCommand(); //new DieCommand(this);

        // Paramétrage du vaisseau du joueur
        this.life = this.maxLife = 1000;
        this.speed = 200;

        this.dealDamageCommand = new DealDamageCommand(this, this.maxLife);
    }

    static size = new Vec2(64);
}
