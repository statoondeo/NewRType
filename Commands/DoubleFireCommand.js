class DoubleFireCommand extends BaseCommand {
    constructor(gameObject, bulletPrototype, fireRate) {
        super(gameObject);
        this.fireRate = fireRate / 2;
        this.firstFireCommand = new FireCommand(gameObject, bulletPrototype, new Vec2(gameObject.size.x / 2, gameObject.size.y - 2 * bulletPrototype.size.y), fireRate);
        this.secondFireCommand = new FireCommand(gameObject, bulletPrototype, new Vec2(gameObject.size.x / 2, gameObject.size.y - bulletPrototype.size.y), fireRate);
    }

    update(dt) {
        if (this.firstFireCommand.fireRateTtl == this.secondFireCommand.fireRateTtl) {
            this.secondFireCommand.fireRateTtl += this.fireRate;
        }
        this.firstFireCommand.update(dt);
        this.secondFireCommand.update(dt);
    }

    execute() {
        this.firstFireCommand.execute();
        this.secondFireCommand.execute();
    }
}
