class FireActionCommand extends BaseCommand {
    constructor(gameObject) {
        super(gameObject);
    }

    execute() {
        if (this.canExecute) {
            this.gameObject.behaveStrategy.fire();
        }
    }
}
