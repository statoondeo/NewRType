class Enemy {
    constructor(sprite) {
        this.sprite = sprite;
        this.baseSpeed = 20;
    }

    getClone() {
        return (new Enemy(this.sprite.getClone()));
    }

    update(dt) {
        this.sprite.update(dt);
        this.setPosition({ x : this.sprite.position.x - this.baseSpeed * dt, y : this.sprite.position.y });
    }

    draw(context) {
        this.sprite.draw(context);
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