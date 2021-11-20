class MissileCollideCommand extends BaseCommand {
    constructor(gameObject) {
        super(gameObject);
    }

    getClone(gameObject) {
        return new MissileCollideCommand(gameObject);
    }

    execute(otherGameObject) {
        if (this.canExecute && (otherGameObject.type == "SHIP" || otherGameObject.type == "WALL")) {
            switch(otherGameObject.type) {
                case "SHIP":
                    this.gameObject.dealDamageCommand.execute(otherGameObject);
                    this.gameObject.dieCommand.execute();
                    break;
                case "WALL":
                    this.gameObject.dieCommand.execute();
                    break;
            }
            this.canExecute = false;
        }
    }
}
