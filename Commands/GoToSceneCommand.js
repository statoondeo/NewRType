class GoToSceneCommand {
    constructor(scene) {
        this.targetScene = scene;
    }

    getClone() {
        return new GoToSceneCommand(scene);
    }

    update(dt) { 
    }

    execute() {
        ServiceLocator.getService(ServiceLocator.SCENE).setCurrent(this.targetScene);
    }
}