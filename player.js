class Player {
    constructor(keyListener, sprite) {
        this.keyListener = keyListener;
        this.sprite = sprite;
        this.baseSpeed = 100;
    }

    update(dt) {
        let playerVector = { x : 0, y : 0 };
        if (this.keyListener.getKeyStatus("ArrowUp") || this.keyListener.getKeyStatus("KeyW")) {
            playerVector.y = -this.baseSpeed;
        }
        if (this.keyListener.getKeyStatus("ArrowDown") || this.keyListener.getKeyStatus("KeyS")) {
            playerVector.y = this.baseSpeed;
        }
        if (this.keyListener.getKeyStatus("ArrowLeft") || this.keyListener.getKeyStatus("KeyA")) {
            playerVector.x = -this.baseSpeed;
        }
        if (this.keyListener.getKeyStatus("ArrowRight") || this.keyListener.getKeyStatus("KeyD")) {
            playerVector.x = this.baseSpeed;
        }
    
        // Normalisation du déplacement
        let normalization = Math.sqrt(Math.pow(playerVector.x, 2) + Math.pow(playerVector.y, 2));
        if (normalization != 0) {
            playerVector.x = playerVector.x / normalization * this.baseSpeed;
            playerVector.y = playerVector.y / normalization * this.baseSpeed;
            this.sprite.position.x += playerVector.x * dt;
            this.sprite.position.y += playerVector.y * dt;
        }
    }

    draw(context) {
        this.sprite.draw(context);
    }
}