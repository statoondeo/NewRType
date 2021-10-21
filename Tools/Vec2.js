class Vec2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    getClone() {
        return new Vec2(this.x, this.y);
    }
}

