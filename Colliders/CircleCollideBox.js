class CircleCollideBox extends BaseCollideBox {
    constructor(position, radius, offset) {
        super(position, new Vec2(2 * radius, 2 * radius), offset);
        this.type = CollideBoxType.CIRCLE;
        this.radius = radius;
    }
    
    getClone() {
        return new CircleCollideBox(this.position.getClone(), this.radius, this.offset.getClone());
    }

    update(dt) {
        super.update(dt);
    }

    draw(context) {
        context.save();
        context.translate(this.radius + this.offset.x, this.radius + this.offset.y);
        context.strokeStyle = this.color;
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        context.stroke();
        context.restore();
    }
}
