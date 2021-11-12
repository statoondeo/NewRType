class FireRatedFireCommand extends BaseCommand {
    constructor(gameObject, prototype, startingPoint, fireRate, randomized = true) {
        super(gameObject);
        this.prototype = prototype;
        this.startingPoint = startingPoint;
        this.fireRate = fireRate;
        this.fireRateTtl = randomized ? Math.random() * this.fireRate : 0;
    }

    update(dt) {
        if (this.fireRateTtl > 0){
            this.fireRateTtl -= dt;
            if (this.fireRateTtl < 0) {
                this.fireRateTtl = 0;
            }
        }
        this.canExecute = this.fireRateTtl == 0;
    }

    execute() {
        if (this.canExecute) {
            // let sound = ServiceLocator.getService(ServiceLocator.RESOURCE).getSound("sounds/laser4.mp3");
            // sound.stop();
            // sound.play();
            this.fireRateTtl = this.fireRate;

            let clone = this.prototype.getClone();
            clone.position.x = this.gameObject.position.x + (this.gameObject.size.x - clone.size.x) / 2 + this.startingPoint.x;
            clone.position.y = this.gameObject.position.y + (this.gameObject.size.y - clone.size.y) / 2 + this.startingPoint.y;

            ServiceLocator.getService(ServiceLocator.SCENE).currentScene.addGameObject(clone);
        }
    }   
}