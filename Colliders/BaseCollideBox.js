class BaseCollideBox {
    constructor(position = new Vec2(), size = new Vec2(), offset = new Vec2()) {
        this.type = "NONE";
        this.isCollided = false;
        this.color = "gray";
        this.position = position;
        this.size = size;
        this.offset = offset;
        this.box = null;
    }

    // static NEUTRAL_COLOR = "gray";
    // static COLLIDED_COLOR = "red";
    // static NOT_COLLIDED_COLOR = "green";

    getOffsetPosition() {
        return new Vec2(this.position.x + this.offset.x, this.position.y + this.offset.y);
    }

    getBox() {
        if (this.box == null) {
            this.box = new RectCollideBox(this.position, this.size, this.offset);;
        }
        return this.box;
    }

    getCollided() {
        return this.isCollided;
    }

    setCollided(value) {
        this.isCollided = value;
    }

    getClone() {
        return new BaseCollideBox(this.position.getClone(), this.size.getClone(), this.offset.getClone());
    }

    update(dt) {
        if (this.type != "NONE") {
            this.color = this.getCollided() ? "red" : "green";
        }
    }

    draw(context) {
    }

    collide(otherCollideBox) {
        return Collider.isCollision(this, otherCollideBox);
    }
}