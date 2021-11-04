// 
class DecorsGameObject extends GameObject {
    constructor(image, layer, sceneSpeed, startAt, initialPosition, active) {
        super()
        this.image = image;
        this.startAt = startAt;
        this.initialPosition = initialPosition;
        this.layer = layer;
        this.status = GameObjectState.IDLE;
        this.sprite = new Sprite(image);
        this.sprite.speed = layer * sceneSpeed;
        this.sprite.behaveStrategy = new BaseBehaveStrategy(this.sprite, new UniformMoveStrategy(this.sprite, new Vec2(-1, 0)), new BaseFireStrategy(this.sprite));
        if (active) {
            this.collideBox = new RectCollideBox(this.sprite.position, this.sprite.size);
        }
    }
    
    subjectChanged(scheduler) {
        if (scheduler.currentStep >= this.startAt) {
            this.status = GameObjectState.ACTIVE;
            this.sprite.position.x = this.initialPosition.x;
            this.sprite.position.y = this.initialPosition.y;
            scheduler.unregister(this);
        }
    }

    update(dt) {
        super.update(dt);
        this.sprite.update(dt);
        if (Tools.isOutOfScreen(this.sprite.position, this.sprite.size)) {
            this.status = GameObjectState.OUTDATED;
        }
    }

    draw(context) {
        super.draw(context);
        this.sprite.draw(context);
    }
}