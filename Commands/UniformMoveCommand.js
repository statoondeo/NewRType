class UniformMoveCommand extends BaseMoveCommand {
    constructor(entity, vector) {
        super(entity);
        this.initialVector = Tools.normalize(vector);
    }

    getClone() {
        return new UniformMoveCommand(this.entity, this.initialVector.getClone());
    }

    update(dt) { 
        super.update(dt);
        this.vector.x = this.initialVector.x * dt;
        this.vector.y = this.initialVector.y * dt;
    }
}
