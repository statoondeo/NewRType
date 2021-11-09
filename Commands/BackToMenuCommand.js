class BackToMenuCommand extends BaseCommand {
    constructor() {
        super();
    }

    getClone() {
        return new BackToMenuCommand();
    }

    execute(otherGameObject) {
        if (this.canExecute) {
            ServiceLocator.getService(ServiceLocator.SCENE).setCurrent("MENU");
        }
    }
}
