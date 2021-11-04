class DoubleSprite extends GameObject {
    constructor(firstSprite, secondSprite, speed) {
        super();
        this.firstSprite = firstSprite;
        this.secondSprite = secondSprite;
        this.size.x = Math.max(this.firstSprite.size.x, this.secondSprite.size.x);
        this.size.y = Math.max(this.firstSprite.size.y, this.secondSprite.size.y);
        this.firstSpriteOffset = (this.size.x - this.firstSprite.size.x) / 2;
        this.secondSpriteOffset = (this.size.x - this.secondSprite.size.x) / 2;
        this.collideBox = new CircleCollideBox(this.position, Math.max(this.firstSprite.size.x, this.secondSprite.size.x) / 2)
        this.firstSprite.collideBox.type = this.secondSprite.collideBox.type = BaseCollideBox.NONE;
        this.alpha = 1;
        this.speed = speed;
        this.firstSprite.speed = this.secondSprite.speed = 0;
    }

    getClone() {
        let clone = new DoubleSprite(this.firstSprite.getClone(), this.secondSprite.getClone(), this.speed);
        clone.partition = this.partition;
        clone.position = this.position.getClone();
        clone.size = this.size.getClone();
        clone.behaveStrategy = this.behaveStrategy.getClone(clone);
        clone.speed = this.speed;
        clone.collideBox = this.collideBox.getClone();
        clone.collideBox.position = clone.position;
        return clone;
    }

    update(dt) {
        super.update(dt);

        this.firstSprite.update(dt);
        this.firstSprite.position.x = this.position.x + this.firstSpriteOffset;
        this.firstSprite.position.y = this.position.y + this.firstSpriteOffset;

        this.secondSprite.update(dt);
        this.secondSprite.position.x = this.position.x + this.secondSpriteOffset;
        this.secondSprite.position.y = this.position.y + this.secondSpriteOffset;
    }

    draw(context) {
        if (ServiceLocator.getService(ServiceLocator.PARAMETER).colliderDisplay) {
            this.collideBox.draw(context);
        }
        else {
            this.firstSprite.draw(context);
            this.secondSprite.draw(context);
        }
    }
}