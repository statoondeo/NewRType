// Partie de scrolling qui ne produira qu'une fois
// C'est un observer abonné au métronome de la scène en cours
// pour savoir quand commencer à apparaître
class OnceLayer extends GameObject {
    constructor(layer, sceneSpeed, image, startAt, direction) {
        super();

        this.layer = layer;
        this.startAt = startAt;
        this.status = GameObject.IDLE;

        this.sprite = new Sprite(image);
        this.sprite.speed = layer * sceneSpeed;
        this.sprite.moveCommand = new UniformMoveCommand(this.sprite, direction);       
    }
    
    subjectChanged(scheduler) {
        if (scheduler.currentStep >= this.startAt) {
            this.status = GameObject.ACTIVE;
            this.sprite.position.x = ServiceLocator.getService(ServiceLocator.SCREEN).width;
            this.sprite.position.y = 0;
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