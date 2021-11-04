class CircleShape extends BaseShape {
    constructor(color, size) {
        super(color);
        this.size.x = size.x;
        this.size.y = size.y;
    }

    draw(context) {
        context.save();
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2, this.size.x / 2, 0, 2 * Math.PI);
        context.fill();
        context.restore();
    }
}