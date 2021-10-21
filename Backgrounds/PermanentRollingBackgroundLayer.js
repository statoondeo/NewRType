class PermanentRollingBackgroundLayer extends BaseBackgroundLayer {
    constructor(sprite, speed) {
        super(sprite);
        this.speed = speed;
        this.currentX = 0;
    }

    update(dt) {
        super.update(dt);
        this.currentX -= this.speed * dt;
        if (this.currentX <= (-this.sprite.scale.x * this.sprite.size.x)) {
            this.currentX = 0;
        }
    }

    draw(context) {
        this.sprite.position.x = this.currentX;
        this.sprite.draw(context);
        this.sprite.position.x = this.currentX + this.sprite.scale.x * this.sprite.size.x;
        this.sprite.draw(context);
    }
}