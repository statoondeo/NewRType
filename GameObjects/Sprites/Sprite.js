class Sprite extends GameObject {
    constructor(image) {
        super();
        this.image = image;
        this.originalSize = new Vec2(this.image.width, this.image.height);
        this.size = new Vec2(this.image.width, this.image.height);
        this.scale = new Vec2(1);
        this.alpha = 1;
    }

    getClone() {
        return new Sprite(this.image);
    }

    update(dt) {
        super.update(dt);
    }

    draw(context) {
        context.save();
        context.globalAlpha = this.globalAlpha;
        context.drawImage(
            this.image, 
            Math.floor(this.position.x), 
            Math.floor(this.position.y));
        context.restore();
        if (Services.get(Services.PARAMETER).colliderDisplay) {
            this.collideBox.draw(context);
        }
    }
}