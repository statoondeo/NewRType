class RectangleSprite extends Sprite {
    constructor(color, position = new Vec2(), size = new Vec2(20, 20)) {
        super(null, position)
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

    draw(context) {
        context.save();
        context.fillStyle = this.color;
        context.fillRect(this.position.x, this.position.y, this.scale.x * this.size.x, this.scale.y * this.size.y);
        context.restore();
    }
}