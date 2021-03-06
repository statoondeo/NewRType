class SwitchSceneCommand extends BaseCommand {
    constructor(currentScene, targetScene, start) {
        super();
        this.currentScene = currentScene;
        this.targetScene = targetScene;
        this.start = start;
        this.gotoCommand = new GotoSceneCommand(this.targetScene, this.start);
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
