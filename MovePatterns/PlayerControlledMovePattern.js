class PlayerControlledMovePattern extends baseMovePattern {
    constructor(keyListener, baseSpeed) {
        super(new Vec2());
        this.keyListener = keyListener;
        this.baseSpeed = baseSpeed;
    }

    getClone() {
        return (new PlayerControlledMovePattern(this.keyListener, this.baseSpeed));
    }

    update(dt) {
        this.vector.x = this.vector.y = 0;
        if (this.keyListener.getKeyStatus("ArrowUp") || this.keyListener.getKeyStatus("KeyW")) {
            this.vector.y = -this.baseSpeed;
        }
        if (this.keyListener.getKeyStatus("ArrowDown") || this.keyListener.getKeyStatus("KeyS")) {
            this.vector.y = this.baseSpeed;
        }
        if (this.keyListener.getKeyStatus("ArrowLeft") || this.keyListener.getKeyStatus("KeyA")) {
            this.vector.x = -this.baseSpeed;
        }
        if (this.keyListener.getKeyStatus("ArrowRight") || this.keyListener.getKeyStatus("KeyD")) {
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