class CircleCollideBox extends BaseCollideBox {
    constructor(position, radius) {
        super();
        this.type = BaseCollideBox.CIRCLE;
        this.position = position;
        this.radius = radius;
    }
    
    getClone() {
        return new CircleCollideBox(this.position, this.radius);
    }

    update(dt) {
        super.update(dt);
    }

    draw(context) {
        context.save();
        // context.translate(-this.radius, -this.radius);
        context.strokeStyle = this.color;
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        context.stroke();
        context.restore();
    }
}
