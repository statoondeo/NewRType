// 
class DecorsGameObject extends GameObject {
    constructor(image, layer, sceneSpeed, startAt, initialPosition) {
        super()
        this.startAt = startAt;
        this.initialPosition = initialPosition;
        this.layer = layer;
        this.status = GameObject.IDLE;
        this.sprite = new Sprite(image);
        this.sprite.speed = layer * sceneSpeed;
        this.sprite.moveCommand = new UniformMoveCommand(this.sprite, new Vec2(-1, 0));
    }
    
    subjectChanged(scheduler) {
        if (scheduler.currentStep >= this.startAt) {
            this.status = GameObject.ACTIVE;
            this.sprite.position = this.initialPosition;
            scheduler.unregister(this);
        }
    }

    update(dt) {
        this.sprite.update(dt);
        if (Tools.isOutOfScreen(this.sprite.position, this.sprite.size)) {
            this.status = GameObject.OUTDATED;
        }
    }

    draw(context) {
        this.sprite.draw(context);
    }
}