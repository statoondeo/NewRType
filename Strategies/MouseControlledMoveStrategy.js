class MouseControlledMoveStrategy extends BaseMoveStrategy {
    constructor(gameObject) {
        super(gameObject);
    }

    update(dt) {
        // On se place sur les coordonnées de la souris
        let inputListener = ServiceLocator.getService(ServiceLocator.KEYBOARD);
        this.gameObject.position.x = inputListener.mouse.x;
        this.gameObject.position.y = inputListener.mouse.y;
    }
}
