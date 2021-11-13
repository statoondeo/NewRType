class BaseMultiBulletFireCommand extends CompositeCommand {
    constructor(gameObject, bulletPrototype, fireRate) {
        super();
        this.gameObject = gameObject;
        this.bulletPrototype = bulletPrototype;
        this.fireRateTtl = this.fireRate = fireRate;
        this.frontAngle = Math.PI / 6;        
        this.rearAngle = Math.PI / 12;        
    }

    execute() {
        super.execute();
        if (this.commandsList[0].canExecute) {
            Services.get(Services.ASSET).getSound("sounds/laser4.mp3").play();
        }
    }
}