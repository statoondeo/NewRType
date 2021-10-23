class PlayerControlledMovePattern extends BaseMovePattern {
    constructor(baseSpeed) {
        super(new Vec2());
        this.baseSpeed = baseSpeed;
    }

    getClone() {
        return (new PlayerControlledMovePattern(this.baseSpeed));
    }

    update(dt) {
        let keyListener = ServiceLocator.getService(ServiceLocator.KEYBOARD);
        this.vector.x = this.vector.y = 0;
        if (keyListener.getKeyStatus("ArrowUp") || keyListener.getKeyStatus("KeyW")) {
            this.vector.y = -this.baseSpeed;
        }
        if (keyListener.getKeyStatus("ArrowDown") || keyListener.getKeyStatus("KeyS")) {
            this.vector.y = this.baseSpeed;
        }
        if (keyListener.getKeyStatus("ArrowLeft") || keyListener.getKeyStatus("KeyA")) {
            this.vector.x = -this.baseSpeed;
        }
        if (keyListener.getKeyStatus("ArrowRight") || keyListener.getKeyStatus("KeyD")) {
            this.vector.x = this.baseSpeed;
        }
    
        // Normalisation du déplacement
        let normalization = Math.sqrt(Math.pow(this.vector.x, 2) + Math.pow(this.vector.y, 2));
        if (normalization != 0) {
            this.vector.x = this.vector.x / normalization * this.baseSpeed * dt;
            this.vector.y = this.vector.y / normalization * this.baseSpeed * dt;
        }
    }
}