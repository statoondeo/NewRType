class MoveCommand extends BaseCommand {
    constructor(gameObject, vector) {
        super(gameObject);
        this.vector = vector;
    }

    execute() {
        if (this.canExecute) {
            this.gameObject.vector.x += this.vector.x;
            this.gameObject.vector.y += this.vector.y;
        }
    }
}
