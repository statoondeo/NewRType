class UniformMovePattern extends baseMovePattern {
    constructor(initialVector) {
        super(initialVector);
    }

    getClone() {
        return (new UniformMovePattern(this.initialVector));
    }
}