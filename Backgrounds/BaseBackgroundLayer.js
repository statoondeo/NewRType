class BaseBackgroundLayer {
    constructor(sprite) {
        this.sprite = sprite;
        this.sprite.setPosition(new Vec2());
    }

    update(dt) {
    }

    draw(context) {
        this.sprite.draw(context);
    }
}