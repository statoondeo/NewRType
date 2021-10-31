class MouseControlledMoveCommand extends BaseMoveCommand {
    constructor(gameObject) {
        super(gameObject);
    }

    getClone() {
        return new MouseControlledMoveCommand(null);
    }

    execute() {
        let keyListener = ServiceLocator.getService(ServiceLocator.KEYBOARD);
        this.gameObject.position.x = keyListener.mouse.x;
        this.gameObject.position.y = keyListener.mouse.y;
        this.gameObject.collideBox.position.x = keyListener.mouse.x;
        this.gameObject.collideBox.position.y = keyListener.mouse.y;
    }
}
