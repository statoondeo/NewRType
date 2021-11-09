class EnemyShipGameObject extends AnimatedSprite {
    constructor(image, tile, maxLife, speed) {
        super(image, tile)
        this.type = GameObjectType.SHIP;
        this.collideBox = new CircleCollideBox(this.position, 0.8 * this.size.x / 2, new Vec2(0.3 * this.size.x / 2, 0.2 * this.size.y / 2));
        this.layer = 0.995;
        this.partition = GameObjectPartition.GAME_PARTITION;
        this.collideCommand = new ShipCollideCommand(this);
        this.dieCommand = new PopAndDieCommand(this, new MediumRedExplosionGameObject());
        this.life = this.maxLife = maxLife;
        this.speed = speed;
        this.dealDamageCommand = new DealDamageCommand(this, this.maxLife);
    }

    draw(context) {
        super.draw(context);

        // On dessine une barre de vie de la hauteur du sprite
        if (ServiceLocator.getService(ServiceLocator.PARAMETER).colliderDisplay) {
            context.save();
            context.fillStyle = "red";
            context.fillRect(this.position.x + this.size.x, this.position.y, 8, this.size.y);
            context.fillStyle = "green";
            context.fillRect(this.position.x + this.size.x, this.position.y + this.size.y - Math.floor(this.size.y * this.life / this.maxLife), 8, Math.floor(this.size.y * this.life / this.maxLife));
            context.strokeStyle = "white";
            context.strokeRect(this.position.x + this.size.x, this.position.y, 8, this.size.y);
            context.restore();
        }
    }
}