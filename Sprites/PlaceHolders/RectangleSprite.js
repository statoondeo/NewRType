class RectangleSprite {
    constructor(color, position = new Vec2(), size = new Vec2(20, 20)) {
        this.color = color;
        this.position = position;

        // Pour la gestion des spriteSheet
        this.currentFrame = 0;
        this.spriteSheet = false;
        this.size = size;

        // Gestion du zoom
        this.scale = new Vec2(1, 1);
    }

    getClone() {
        return new RectangleSprite(this.color, this.position.getClone(), this.size.getClone());
    }

    setPosition(position) {
        this.position = position;
    }

    getPosition() {
        return this.position.getClone();
    }

    getSize() {
        return this.size.getClone();
    }

    addAnimation(animation) {
    }

    startAnimation(name) {
    }

    setTileSheet(size) {
        this.size = size;
    }

    setScale(scale = new Vec2(1, 1)) {
        this.scale = scale;
    }

    update(dt) {
    }

    draw(context) {
        context.save();
        context.fillStyle = this.color;
        context.fillRect(this.position.x, this.position.y, this.scale.x * this.size.x, this.scale.y * this.size.y);
        context.restore();
    }
}