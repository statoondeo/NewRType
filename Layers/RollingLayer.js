class RollingLayer extends BaseLayer {
    constructor(speedRatio, sprite) {
        super(speedRatio);
        this.firstSprite = sprite;
        this.firstSprite.setPosition(new Vec2());
        this.secondSprite = this.firstSprite.getClone();
        this.offset = this.firstSprite.scale.x * this.firstSprite.size.x;
        this.currentX = 0;
    }

    update(dt) {
        super.update(dt);
        this.currentX = -this.currentStep % this.offset;
        this.firstSprite.position.x = this.currentX;
        this.secondSprite.position.x = this.currentX + this.offset;
    }

    draw(context) {
        this.firstSprite.draw(context);
        this.secondSprite.draw(context);
    }
}