class baseMovePattern {
    constructor(initialVector) {
        this.initialVector = initialVector;
        this.vector = new Vec2();
    }

    getClone() {
        return (new baseMovePattern(this.initialVector));
    }

    update(dt) {
        this.vector.x = this.initialVector.x * dt 
        this.vector.y = this.initialVector.y * dt;
    }

    getVector() {
        return this.vector;
    }
}