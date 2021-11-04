class BaseMoveStrategy extends BaseStrategy {
    constructor(gameObject, initialVector = new Vec2()) {
        super(gameObject);
        this.initialVector = Tools.normalize(initialVector);
        this.moveCommand = new MoveCommand(gameObject, initialVector.getClone());
    }

    getClone(gameObject) {
        return new BaseMoveStrategy(gameObject, this.initialVector.getClone());
    }

    update(dt) {
    }

    getMoveCommand() {
        return (this.moveCommand);
    }
}