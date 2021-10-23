class BaseCommand {
    constructor() {
    }

    getClone() {
        return (new BaseCommand(this.initialVector));
    }

    execute() {
        
    }
}