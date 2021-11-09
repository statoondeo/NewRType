class AsapFireCommand extends BaseCommand {
    constructor(command) {
        super();
        this.command = command;
    }

    getClone(gameObject) {
        return new AsapFireCommand(this.command.getClone(gameObject));
    }

    update(dt) {
        this.command.update(dt);
        if (this.command.canExecute) {
            this.command.execute();
        }
    }
}

