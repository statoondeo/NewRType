class DoubleSprite extends GameObject {
    constructor(firstSprite, secondSprite, speed) {
        super();
        this.firstSprite = firstSprite;
        this.secondSprite = secondSprite;
        this.size.x = Math.max(this.firstSprite.size.x, this.secondSprite.size.x);
        this.size.y = Math.max(this.firstSprite.size.y, this.secondSprite.size.y);
        this.secondeSpriteOffset = new Vec2((this.firstSprite.size.x - this.secondSprite.size.x) / 2, (this.firstSprite.size.y - this.secondSprite.size.y) / 2);
        this.collideBox = new CircleCollideBox(this.position, Math.max(this.firstSprite.size.x, this.secondSprite.size.x) / 2)
        this.firstSprite.collideBox.type = this.secondSprite.collideBox.type = "NONE";
        this.alpha = 1;
        this.speed = speed;
        this.firstSprite.speed = this.secondSprite.speed = 0;
    }

    update(dt) {
        super.update(dt);

        this.firstSprite.update(dt);
        this.firstSprite.position.x = this.position.x;
        this.firstSprite.position.y = this.position.y;

        this.secondSprite.update(dt);
        this.secondSprite.position.x = this.position.x + this.secondeSpriteOffset.x;
        this.secondSprite.position.y = this.position.y + this.secondeSpriteOffset.y;
    }

    draw(context) {
        this.firstSprite.draw(context);
        this.secondSprite.draw(context);
        if (Services.get("PARAMETER").colliderDisplay) {
            this.collideBox.draw(context);
        }
    }
}