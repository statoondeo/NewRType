class Ship {
    constructor(sprite) {
        this.sprite = sprite;
        this.movePattern = null;
    }

    getClone() {
        return (new Ship(this.sprite.getClone()));
    }

    setMovepattern(movePattern) {
        this.movePattern = movePattern;
    }

    update(dt) {
        this.sprite.update(dt);
        if (null != this.movePattern) {
            this.movePattern.update(dt);
            let position = this.sprite.getPosition();
            let vector = this.movePattern.getVector();
            position.x += vector.x;
            position.y += vector.y;
            this.setPosition(position);
        }
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