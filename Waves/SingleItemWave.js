class SingleItemWave {
    constructor(sprite, startAt, appearPoint) {
        this.sprite = sprite;
        this.startAt = startAt;
        this.appearPoint = appearPoint;
        this.started = false;
        this.ended = false;
    }

    update(dt, currentStep) {
        if (!this.started && currentStep >= this.startAt) {
            this.started = true;
            this.sprite.setPosition(this.appearPoint);
        }

        let position = this.sprite.getPosition();
        let size = this.sprite.getSize();
        if (this.started && (position.x + size.x <= 0)) {
            this.ended = true;
        }
        else {
            this.sprite.update(dt);
        }
    }

    draw(context) {
        if (this.started && !this.ended) {
            this.sprite.draw(context);
        }
    }
}