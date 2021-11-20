class RectCollideBox extends BaseCollideBox {
    constructor(position, size, offset) {
        super(position, size, offset);
        this.type = "RECT";
    }
        
    getClone() {
        return new RectCollideBox(this.position.getClone(), this.size.getClone(), this.offset.getClone());
    }

    update(dt) {
        super.update(dt);
    }

    draw(context) {
        context.save();
        context.translate(this.offset.x, this.offset.y);
        context.strokeStyle = this.color;
        context.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y);
        context.restore();
    }
}