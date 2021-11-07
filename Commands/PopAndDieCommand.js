class PopAndDieCommand extends BaseCommand {
    constructor(gameObject, gameObjectPrototype) {
        super(gameObject);
        this.gameObjectPrototype = gameObjectPrototype;
        this.offset = new Vec2((this.gameObject.size.x - this.gameObjectPrototype.size.x) / 2, (this.gameObject.size.x - this.gameObjectPrototype.size.x) / 2);
    }

    getClone(gameObject) {
        return new PopAndDieCommand(gameObject, this.gameObjectPrototype.getClone());
    }

    execute() {
        if (this.canExecute) {
            this.gameObjectPrototype.position.x = this.gameObject.position.x + this.offset.x;
            this.gameObjectPrototype.position.y = this.gameObject.position.y + this.offset.y;
            this.gameObjectPrototype.status = GameObjectState.ACTIVE;
            this.gameObject.status = GameObjectState.OUTDATED;
            ServiceLocator.getService(ServiceLocator.SCENE).currentScene.addGameObject(this.gameObjectPrototype);
        }
    }
}
