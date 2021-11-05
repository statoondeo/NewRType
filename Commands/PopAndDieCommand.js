class PopAndDieCommand extends BaseCommand {
    constructor(gameObject, gameObjectPrototype) {
        super(gameObject);
        this.gameObjectPrototype = gameObjectPrototype;
    }

    getClone(gameObject) {
        return new PopAndDieCommand(gameObject, this.gameObjectPrototype.getClone());
    }

    execute() {
        if (this.canExecute) {
            this.gameObjectPrototype.position.x = this.gameObject.position.x;
            this.gameObjectPrototype.position.y = this.gameObject.position.y;
            this.gameObjectPrototype.status = GameObjectState.ACTIVE;
            this.gameObject.status = GameObjectState.OUTDATED;
            ServiceLocator.getService(ServiceLocator.SCENE).currentScene.addGameObject(this.gameObjectPrototype);
        }
    }
}
