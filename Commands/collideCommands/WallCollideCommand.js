class WallCollideCommand extends BaseCommand {
    constructor(gameObject) {
        super(gameObject);
        this.collideTtl = this.maxCollideTtl = 1; 
    }

    getClone(gameObject) {
        return new WallCollideCommand(gameObject);
    }
    
    update(dt) {
        if (this.collideTtl > 0) {
            this.collideTtl -= dt;
            this.collideTtl = this.collideTtl <= 0 ? 0 : this.collideTtl;
        }
        this.canExecute = this.collideTtl == 0;
    }

    execute(otherGameObject) {
        if (this.canExecute && otherGameObject.type == "SHIP") {
            this.gameObject.dealDamage.execute(otherGameObject);
        }
    }
}
