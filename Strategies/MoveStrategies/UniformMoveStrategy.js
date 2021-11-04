class UniformMoveStrategy extends BaseMoveStrategy {
    constructor(gameObject, initialVector) {
        super(gameObject, initialVector);   
    }

    getClone(gameObject) {
        return new UniformMoveStrategy(gameObject, this.initialVector.getClone());
    }

    update(dt) {
        this.moveCommand.vector.x = this.initialVector.x * dt;
        this.moveCommand.vector.y = this.initialVector.y * dt;
    }
}
