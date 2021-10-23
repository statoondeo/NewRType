class SceneManager extends Manager {
    constructor() {
        super();
        this.currentScene = null;
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