class RectShape extends BaseShape {
    constructor(color) {
        super(color);
    }

    draw(context) {
        context.save();
        context.fillStyle = this.color;
        context.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
        context.restore();
    }
}