class BaseMultiBulletFireCommand extends CompositeCommand {
    constructor(gameObject, bulletPrototype, fireRate) {
        super();
        this.gameObject = gameObject;
        this.bulletPrototype = bulletPrototype;
        this.fireRateTtl = this.fireRate = fireRate;
        this.frontAngle = Math.PI / 6;        
        this.rearAngle = Math.PI / 12;        
    }
}