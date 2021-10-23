class StaticLayer extends BaseLayer {
    constructor(speedRatio, sprite) {
        super(speedRatio);
        this.sprite = sprite;
        this.sprite.setPosition(new Vec2());
    }

    update(dt) {
        super.update(dt);
    }

    draw(context) {
        this.sprite.draw(context);
    }
}