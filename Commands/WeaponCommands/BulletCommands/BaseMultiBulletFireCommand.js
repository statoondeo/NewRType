class BaseMultiBulletFireCommand extends CompositeCommand {
    constructor(gameObject, bulletPrototype, fireRate, sound) {
        super();
        this.gameObject = gameObject;
        this.bulletPrototype = bulletPrototype;
        this.fireRateTtl = this.fireRate = fireRate;
        this.frontAngle = Math.PI / 6;        
        this.rearAngle = Math.PI / 12;       
        this.sound = sound; 
    }

    execute() {
        if (this.commandsList[0].canExecute) {
            this.sound.play();
            super.execute();
        }
    }
}