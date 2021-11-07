// Fond d'écran qui tourne en permanence et se répère à l'infini
class RollingLayer extends GameObject {
    constructor(layer, sceneSpeed, visual, direction) {
        super();
        this.layer = layer;

        this.firstSprite = new Sprite(visual);
        this.firstSprite.speed = layer * sceneSpeed;
        this.firstSprite.position = new Vec2();

        this.secondSprite = this.firstSprite.getClone();
        this.secondSprite.speed = this.firstSprite.speed;
        this.secondSprite.position = new Vec2(this.firstSprite.size.x, 0);

        this.firstSprite.moveStrategy = new UniformMoveStrategy(this.firstSprite, direction.getClone());
        this.secondSprite.moveStrategy = new UniformMoveStrategy(this.secondSprite, direction.getClone());
    }

    update(dt) {
        super.update(dt);
        this.firstSprite.update(dt);
        this.secondSprite.update(dt);
        if (this.secondSprite.position.x < 0) {
            this.firstSprite.position.x = 0;
            this.secondSprite.position.x = this.firstSprite.size.x;
        }
    }

    draw(context) {
        this.firstSprite.draw(context);
        this.secondSprite.draw(context);
    }
}
