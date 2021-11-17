class SceneManager extends Manager {
    constructor() {
        super();
        this.scenes = [];
        this.currentScene = null;
        this.pause = false;
    }

    addScene(sceneName, scene) {
        this.scenes[sceneName] = scene;
    }

    setCurrent(sceneName, start) {
        this.currentScene = this.scenes[sceneName];
        this.currentScene.load(start);
    }

    update(dt) {
        if (this.currentScene != null) {
            let inputHandler = Services.get(Services.INPUT);
            if (inputHandler.isPressed("Space")) {
                this.pause = !this.pause;
            }
            this.currentScene.update(dt);
        }
    }

    draw(context) {
        if (this.currentScene != null) {
            this.currentScene.draw(context);
        }
    }
}