class MissileCollideCommand extends BaseCommand {
    constructor(gameObject) {
        super(gameObject);
    }

    getClone(gameObject) {
        return new MissileCollideCommand(gameObject);
    }

    execute(otherGameObject) {
        if (this.canExecute && (otherGameObject.type == GameObjectType.SHIP || otherGameObject.type == GameObjectType.WALL)) {
            switch(otherGameObject.type) {
                case GameObjectType.SHIP:
                    this.gameObject.dealDamageCommand.execute(otherGameObject);
                    this.gameObject.dieCommand.execute();
                    break;
                case GameObjectType.WALL:
                    this.gameObject.dieCommand.execute();
                    break;
            }
            this.canExecute = false;
        }
    }
}
