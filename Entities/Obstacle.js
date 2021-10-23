class Obstacle {
    constructor(sprite, startAt, initialPosition) {
        this.sprite = sprite;
        this.startAt = startAt;
        this.initialPosition = initialPosition;
        this.started = this.ended = false;
        this.currentStep = 0;
    }

    getClone() {
        return (new Obstacle(this.sprite.getClone(), this.startAt));
    }

    update(dt) {
        if (this.started && !this.ended) {
            this.sprite.update(dt);
            let position = this.getPosition();
            position.x = ServiceLocator.getService(ServiceLocator.SCREEN).width - (this.currentStep - this.startAt);
            this.setPosition(position);            
            this.ended = isOutOfScreen(this.getPosition(), this.getSize());
        }
        else {
            if (!this.started && this.currentStep >= this.startAt) {
                this.started = true
                this.setPosition(this.initialPosition);
            }
        }
    }

    draw(context) {
        if (this.started && !this.ended) {
            this.sprite.draw(context);
        }
    }

    setPosition(position) {
        this.sprite.setPosition(position);
    }

    getPosition() {
        return this.sprite.getPosition();
    }

    getSize() {
        return this.sprite.getSize();
    }
}