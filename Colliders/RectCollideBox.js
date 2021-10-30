class RectCollideBox extends BaseCollideBox {
    constructor(position, size) {
        super();
        this.type = BaseCollideBox.RECT;
        this.position = position;
        this.size = size;
    }
        
    getClone() {
        return new RectCollideBox(this.position.getClone(), this.size.getClone());
    }

    update(dt) {
        super.update(dt);
    }

    draw(context) {
        context.save();
        context.strokeStyle = this.color;
        context.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y);
        context.restore();
    }
}