class GotoSceneCommand extends BaseCommand {
    constructor(targetScene) {
        super();
        this.targetScene = targetScene;
    }

    getClone() {
        return new GotoSceneCommand(this.targetScene);
    }

    execute() {
        if (this.canExecute) {
            console.log("Goto");
            ServiceLocator.getService(ServiceLocator.SCENE).setCurrent(this.targetScene);
        }
    }
}