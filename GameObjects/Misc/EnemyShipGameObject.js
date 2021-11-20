class EnemyShipGameObject extends AnimatedSprite {
    constructor(image, tile, maxLife, speed, damagedImage = null) {
        super(image, tile, damagedImage)
        this.type = "SHIP";
        this.collideBox = new CircleCollideBox(this.position, 0.8 * this.size.x / 2, new Vec2(0.3 * this.size.x / 2, 0.2 * this.size.y / 2));
        this.layer = 0.995;
        this.partition = "GAME_PARTITION";
        this.collideCommand = new ShipCollideCommand(this);
        this.dieCommand.addCommand(new PopCommand(this, new ParticlesMediumExplosionGameObject(this, [ new MediumRedExplosionGameObject(100), new RedExplosionGameObject(75) ])));
        this.life = this.maxLife = maxLife;
        this.speed = speed;
        this.dealDamageCommand = new DealDamageCommand(this, this.maxLife);
        this.takeDamage = new TakeDamageCommand(this);
    }

    draw(context) {
        super.draw(context);

        // On dessine une barre de vie de la hauteur du sprite
        if (Services.get("PARAMETER").colliderDisplay) {
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
