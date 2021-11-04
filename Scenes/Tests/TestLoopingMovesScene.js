class TestLoopingMovesScene extends BaseScene {
    constructor(scheduler) {
        super(scheduler)
    }

    update(dt) {
        super.update(dt);
    }

    static createInstance() {

        // Scene de jeu proprement dite
        let scene = new TestLoopingMovesScene(new DummyScheduler());

        // Gestion du vaisseau
        let ship = new CircleShape("black", new Vec2(64));
        ship.status = GameObjectState.ACTIVE;
        ship.position.x = 0;
        ship.position.y = 100;
        ship.speed = 100;
        ship.behaveStrategy = new HorizontalLoopingMoveStrategy(ship, new Vec2(1, 1), 300, 2);

        // On ajoute le vaisseau à la scène
        scene.addGameObject(ship);

        // On ajoute le vaisseau à la scène
        scene.addGameObject(ship);

        // Scene retournée
        return scene;
    }
}