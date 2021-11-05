class EnemyShipGameObject extends AnimatedSprite {
    constructor(image, tile, maxLife, speed) {
        super(image, tile)
        this.type = GameObjectType.SHIP;
        this.collideBox = new CircleCollideBox(this.position, 0.8 * this.size.x / 2);
        this.layer = 1;
        this.partition = GameObjectPartition.GAME_PARTITION;
        this.collideCommand = new ShipCollideCommand(this);
        this.dieCommand = new DieCommand(this);
        this.life = this.maxLife = maxLife;
        this.speed = speed;
        this.dealDamageCommand = new DealDamageCommand(this, this.maxLife);
    }

    getClone() {
        let clone = new EnemyShipGameObject(this.image, this.tile.getClone(), this.maxLife, this.speed);

        // GameObject
        clone.position = this.position.getClone();
        clone.collideBox.position = clone.position;
        clone.collideBox.radius = 0.6 * this.size.x / 2;
        clone.originalSize = this.originalSize.getClone();
        clone.scale = this.scale.getClone();
        clone.size = this.size.getClone();
        clone.behaveStrategy = this.behaveStrategy.getClone(clone);
        clone.dieCommand = this.dieCommand.getClone(clone);
        clone.dealDamageCommand = this.dealDamageCommand.getClone(clone);
        clone.collideCommand = this.collideCommand.getClone(clone);

        // AnimatedSprite
        clone.currentFrame = this.currentFrame;
        clone.tile = this.tile.getClone();
        clone.animations = [];
        this.animations.forEach(animation => {
            clone.animations.push(animation.getClone());
        });
        let index = this.currentAnimation == null ? -1 : this.animations.indexOf(this.currentAnimation);
        clone.currentAnimation = index == -1 ? null : clone.animations[index];

        return clone;
    }

    draw(context) {
        super.draw(context);

        // On dessine une barre de vie de la hauteur du sprite
        if (ServiceLocator.getService(ServiceLocator.PARAMETER).colliderDisplay) {
            context.save();
            context.translate(-this.size.x, -this.size.y);
            context.fillStyle = "red";
            context.fillRect(this.position.x + 1.5 * this.size.x, this.position.y + this.size.y / 2, 8, this.size.y);
            context.fillStyle = "green";
            context.fillRect(this.position.x + 1.5 * this.size.x, this.position.y + this.size.y / 2, 8, Math.floor(this.size.y * this.life / this.maxLife));
            context.strokeStyle = "white";
            context.strokeRect(this.position.x + 1.5 * this.size.x, this.position.y + this.size.y / 2, 8, this.size.y);
            context.restore();
        }
    }
}
