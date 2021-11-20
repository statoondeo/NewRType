class GotoSceneCommand extends BaseCommand {
    constructor(targetScene, start) {
        super();
        this.targetScene = targetScene;
        this.start = start;
    }

    getClone() {
        return new GotoSceneCommand(this.targetScene, this.start);
    }

    execute() {
        if (this.canExecute) {
            Services.get("SCENE").setCurrent(this.targetScene, this.start);
        }
    }
}
