class SwitchSceneCommand extends BaseCommand {
    constructor(currentScene, targetScene) {
        super();
        this.currentScene = currentScene;
        this.targetScene = targetScene;
        this.gotoCommand = new GotoSceneCommand(this.targetScene);
    }

    getClone() {
        return new BackToMenuCommand();
    }

    execute() {
        if (this.canExecute) {
            this.canExecute = false;
            this.currentScene.hide(this.gotoCommand);
        }
    }
}
