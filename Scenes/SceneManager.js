class SceneManager {
    constructor() {
        this.scenes = new Manager();
        this.currentScene = null;
    }

    addScene(Scene) {
        this.scenes.addItem(Scene);
    }

    setCurrent(scene) {
        let index = this.scenes.items.indexOf(scene);
        if (index != -1) {
            this.currentScene = scene;
        }
    }

    update(dt) {
        if (this.currentScene != null) {
            this.currentScene.update(dt);
        }
    }

    draw(context) {
        if (this.currentScene != null) {
            this.currentScene.draw(context);
        }
    }
}