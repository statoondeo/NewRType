class Vec2 {
    constructor(x = 0, y = x) {
        this.x = x;
        this.y = y;
    }

    getClone() {
        return new Vec2(this.x, this.y);
    }
}

