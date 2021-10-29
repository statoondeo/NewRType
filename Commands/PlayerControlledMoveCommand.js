class PlayerControlledMoveCommand extends BaseMoveCommand {
    constructor(gameObject) {
        super(gameObject);
    }

    getClone() {
        return new PlayerControlledMoveCommand(null);
    }

    update(dt) {
        let keyListener = ServiceLocator.getService(ServiceLocator.KEYBOARD);
        this.vector.x = this.vector.y = 0;

        // Choix des directions
        if (keyListener.isDown("ArrowUp") || keyListener.isDown("KeyW")) {
            this.vector.y = -1;
        }
        if (keyListener.isDown("ArrowDown") || keyListener.isDown("KeyS")) {
            this.vector.y = 1;
        }
        if (keyListener.isDown("ArrowLeft") || keyListener.isDown("KeyA")) {
            this.vector.x = -1;
        }
        if (keyListener.isDown("ArrowRight") || keyListener.isDown("KeyD")) {
            this.vector.x = 1;
        }    

        // Normalisation du vecteur à appliquer
        this.vector = Tools.normalize(this.vector);   
        this.vector.x *= dt;
        this.vector.y *= dt;
    }
}
