class BaseMultiBulletFireCommand extends CompositeCommand {
    constructor(gameObject, fireRate, sound) {
        super();
        this.gameObject = gameObject;
        this.fireRateTtl = this.fireRate = fireRate;
        this.frontAngle = Math.PI / 12;        
        this.rearAngle = Math.PI / 6;       
        this.sound = sound; 
    }

    execute() {
        if (this.commandsList[0].canExecute) {
            this.sound.play();
            super.execute();
        }
    }
}