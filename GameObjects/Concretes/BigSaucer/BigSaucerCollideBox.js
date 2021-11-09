class BigSaucerCollideBox extends CompositeCollideBox {
    constructor(position, size) {
        super(position, size);
        this.addCollideBox(new CircleCollideBox(this.position, this.size.y / 2, new Vec2((this.size.x - this.size.y) / 2, 0)));
        this.addCollideBox(new RectCollideBox(this.position, new Vec2(this.size.x, this.size.y / 3), new Vec2(0, this.size.y / 3)));
    }
}
