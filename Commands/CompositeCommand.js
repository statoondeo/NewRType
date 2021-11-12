class CompositeCommand extends BaseCommand {
    constructor() {
        super();
        this.commandsList = [];
    }

    addCommand(command) {
        this.commandsList.unshift(command);
    }

    update(dt) {
        this.commandsList.forEach(command => {
            command.update(dt);
        });
    }

    execute() {
        this.commandsList.forEach(command => {
            command.execute();
        });
    }
}