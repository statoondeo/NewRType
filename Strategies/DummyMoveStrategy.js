class DummyMoveStrategy extends BaseStrategy {
    constructor(gameObject) {
        super(gameObject);
    }

    getClone(gameObject) {
        return new DummyMoveStrategy(gameObject);
    }

    update(dt) {
    }
}