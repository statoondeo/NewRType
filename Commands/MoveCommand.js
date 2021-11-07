class MoveCommand extends BaseCommand {
    constructor(gameObject, vector) {
        super(gameObject);
        this.vector = vector;
    }

    execute() {
        if (this.canExecute) {
            this.gameObject.moveStrategy.vector.x += this.vector.x;
            this.gameObject.moveStrategy.vector.y += this.vector.y;
        }
    }
}
