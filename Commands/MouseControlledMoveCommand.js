class MouseControlledMoveCommand extends BaseMoveCommand {
    constructor(gameObject, otherGameObject) {
        super(gameObject);
        this.otherGameObject = otherGameObject;
        this.gameObject.collideBox.distance = 0;
    }

    getClone() {
        return new MouseControlledMoveCommand(null);
    }

    update(dt) {
        this.gameObject.collideBox.distance = Tools.distance(this.gameObject.collideBox.position, this.otherGameObject.collideBox.position);
    }

    execute() {
        let keyListener = ServiceLocator.getService(ServiceLocator.KEYBOARD);
        this.gameObject.position.x = keyListener.mouse.x;
        this.gameObject.position.y = keyListener.mouse.y;
    }
}
