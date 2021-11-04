class BaseFireStrategy extends BaseStrategy {
    constructor(gameObject) {
        super(gameObject);
        this.fireCommand = new DummyCommand();
    }

    getClone(gameObject) {
        return new BaseFireStrategy(gameObject);
    }

    update(dt) {
    }

    getFireCommand() {
        return (this.fireCommand);
    }
}