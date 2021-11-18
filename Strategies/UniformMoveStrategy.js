class UniformMoveStrategy extends BaseMoveStrategy {
    constructor(gameObject, initialVector) {
        super(gameObject, initialVector);   
    }

    getClone(gameObject) {
        return new UniformMoveStrategy(gameObject, this.initialVector.getClone());
    }

    rotate(angle) {
        let newAngle = Math.atan2(-this.initialVector.y, -this.initialVector.x) + angle;
        this.initialVector.x = Math.cos(newAngle);
        this.initialVector.y = Math.sin(newAngle);
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
