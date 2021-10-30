class SceneManager extends Manager {
    constructor() {
        super();
        this.currentScene = null;
        this.pause = false;
    }

    addScene(Scene) {
        this.addItem(Scene);
    }

    setCurrent(scene) {
        let index = this.items.indexOf(scene);
        if (index != -1) {
            this.currentScene = scene;
        }
    }

    update(dt) {
        let inputHandler = ServiceLocator.getService(ServiceLocator.KEYBOARD);
        if (inputHandler.isPressed("Space")) {
            this.pause = !this.pause;
        }
        if (this.currentScene != null && !this.pause) {
            this.currentScene.update(dt);
        }
    }

    draw(context) {
        if (this.currentScene != null) {
            this.currentScene.draw(context);
        }
    }
}