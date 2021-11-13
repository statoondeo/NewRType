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
            Services.get(Services.SCENE).setCurrent(this.targetScene);
        }
    }
}
