class BaseMoveCommand {
    constructor(gameObject) {
        this.gameObject = gameObject;
        this.vector = new Vec2();
    }

    getClone() {
        return new BaseMoveCommand(null);
    }

    update(dt) { 
    }

    execute() {
        this.gameObject.position.x += this.vector.x * this.gameObject.speed;
        this.gameObject.position.y += this.vector.y * this.gameObject.speed;
    }
}