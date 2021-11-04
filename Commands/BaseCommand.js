class BaseCommand {
    constructor(gameObject) {
        this.gameObject = gameObject;
        this.canExecute = true;
    }

    update(dt) {

    }

    execute() {
        console.log("BaseCommand");
    }
}
