class SampleMenuScene extends BaseScene {
    constructor(scheduler) {
        super(scheduler)
    }

    static createInstance(firstScene) {
        let resources = ServiceLocator.getService(ServiceLocator.RESOURCE);
        let screen = ServiceLocator.getService(ServiceLocator.SCREEN);

        let scheduler = new DummyScheduler();

        // Scene de jeu proprement dite
        let scene = new SampleMenuScene(scheduler);

        // On lui ajoute un fond noir
        let shape = new RectShape("Black");
        shape.position = new Vec2(0, 0);
        shape.size = new Vec2(screen.width, screen.height);
        scene.addGameObject(new StaticLayer(0, shape));
        shape = new Sprite(resources.getImage("images/gas2.png"));
        shape.position.x = (screen.width - shape.size.x) / 2;
        scene.addGameObject(new StaticLayer(0, shape));

        // On lui ajoute un groupe
        let group = new GroupGuiElement(new Sprite(resources.getImage("images/gui/bigPanel.png")));
        scene.addGameObject(group);

        let sprite = new Sprite(resources.getImage("images/gui/button.png"));
        let position = new Vec2(screen.width - 1.5 * sprite.size.x, screen.height - 1.5 * sprite.size.y);
        let text = new TextGuiElement("Jouer", "bold 24pt Arial", "Black");
        group.addElement(new ButtonGuiElement(sprite, new GoToSceneCommand(firstScene), position, text));

        // Scene retournée
        return scene;
    }
}