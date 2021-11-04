class DummyBehaveStrategy extends BaseBehaveStrategy {
    constructor() {
        super(null, null, null);
    }

    getClone() {
        return new DummyBehaveStrategy();
    }

    update(dt) {
    }
    
    behave() { 
    }
}