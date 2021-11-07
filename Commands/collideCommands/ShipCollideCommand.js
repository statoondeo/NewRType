class ShipCollideCommand extends BaseCommand {
    constructor(gameObject) {
        super(gameObject);
        this.collideTtl = this.maxCollideTtl = 1; 
    }

    getClone(gameObject) {
        return new ShipCollideCommand(gameObject);
    }

    update(dt) {
        if (this.collideTtl > 0) {
            this.collideTtl -= dt;
            this.collideTtl = this.collideTtl <= 0 ? 0 : this.collideTtl;
        }
        this.canExecute = this.collideTtl == 0;
    }

    execute(otherGameObject) {
        if (this.canExecute && otherGameObject.type == GameObjectType.SHIP) {
            this.collideTtl = this.maxCollideTtl;
            this.gameObject.dealDamageCommand.execute(otherGameObject);
        }
    }
}
