class SpriteUIElement extends UIElement {
    constructor(image) {
        super();
        this.sprite = new Sprite(image);
    }

    setPosition(position) {
        this.sprite.position = position;
    }

    setAlpha(alpha) {
        super.setAlpha(alpha);
        this.sprite.globalAlpha = alpha;
    }

    update(dt) {
        this.sprite.update(dt);
    }

    draw(context) {
        this.sprite.draw(context);
    }
}