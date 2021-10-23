class UniformMovePattern extends BaseMovePattern {
    constructor(initialVector) {
        super(initialVector);
    }

    getClone() {
        return (new UniformMovePattern(this.initialVector));
    }
}