// Partie de scrolling qui ne produira qu'une fois
// C'est un observer abonné au métronome de la scène en cours
// pour savoir quand commencer à apparaître
class OnceLayer extends GameObject {
    constructor(layer, sceneSpeed, image, startAt, direction) {
        super();

        this.partition = "NEUTRAL_PARTITION";
        this.layer = layer;
        this.startAt = startAt;
        this.status = "IDLE";

        this.sprite = new Sprite(image);
        this.sprite.speed = layer * sceneSpeed;
        this.sprite.moveStrategy = new UniformMoveStrategy(this.sprite, direction.getClone());
    }
    
    subjectChanged(scheduler) {
        if (scheduler.currentStep >= this.startAt) {
            this.status = "ACTIVE";
            this.sprite.position.x = Services.get("SCREEN").width;
            this.sprite.position.y = 0;
            scheduler.unregister(this);
        }
    }

    update(dt) {
        super.update(dt);
        this.sprite.update(dt);
        if (Tools.isOutOfScreen(this.sprite.position, this.sprite.size)) {
            this.status = "OUTDATED";
        }
    }

    draw(context) {
        this.sprite.draw(context);
    }
}