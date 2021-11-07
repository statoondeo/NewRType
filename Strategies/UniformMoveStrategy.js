class UniformMoveStrategy extends BaseMoveStrategy {
    constructor(gameObject, initialVector) {
        super(gameObject, initialVector);   
    }

    getClone(gameObject) {
        return new UniformMoveStrategy(gameObject, this.initialVector.getClone());
    }

    update(dt) {
        this.vector.x = this.initialVector.x * dt;
        this.vector.y = this.initialVector.y * dt;

        super.update(dt);

        if (this.gameObject.status == GameObjectState.ACTIVE && Tools.isOutOfScreen(this.gameObject.position, this.gameObject.size)) {
            this.gameObject.status = GameObjectState.OUTDATED;
        }
    }
}
