class StaticBackgroundLayer {
    constructor(sprite) {
        this.sprite = sprite;
        this.sprite.position = { x : 0, y : 0 };
    }

    update(dt) {
    }

    draw(context) {
        this.sprite.draw(context);
    }
}