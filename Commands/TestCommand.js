class TestCommand {
    constructor() {
    }

    getClone() {
        return new TestCommand();
    }

    update(dt) { 
    }

    execute() {
        console.log("Test command executed!");
    }
}