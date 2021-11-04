class TestUniformMovesScene extends BaseScene {
    constructor(scheduler) {
        super(scheduler)
    }

    update(dt) {
        super.update(dt);
    }

    static createInstance() {
        let resources = ServiceLocator.getService(ServiceLocator.RESOURCE);
        let screen = ServiceLocator.getService(ServiceLocator.SCREEN);

        // Scene de jeu proprement dite
        let scene = new TestUniformMovesScene(new DummyScheduler());

        // Gestion du vaisseau
        let ship = new CircleShape("black", new Vec2(64));
        ship.status = GameObjectState.ACTIVE;
        ship.position.x = 0;
        ship.position.y = (screen.height - ship.size.y) / 2;
        ship.behaveStrategy = new UniformMoveStrategy(ship, new Vec2(1, 0));
        ship.speed = 100;

        // On ajoute le vaisseau à la scène
        scene.addGameObject(ship);
        
        // Gestion du vaisseau
        ship = new CircleShape("black", new Vec2(64));
        ship.status = GameObjectState.ACTIVE;
        ship.position.x = screen.width - ship.size.x;
        ship.position.y = (screen.height - ship.size.y) / 2;
        ship.behaveStrategy = new UniformMoveStrategy(ship, new Vec2(-1, 0));
        ship.speed = 100;

        // On ajoute le vaisseau à la scène
        scene.addGameObject(ship);
                
        // Gestion du vaisseau
        ship = new CircleShape("black", new Vec2(64));
        ship.status = GameObjectState.ACTIVE;
        ship.position.x = (screen.width - ship.size.x) / 2;
        ship.position.y = 0;
        ship.behaveStrategy = new UniformMoveStrategy(ship, new Vec2(0, 1));
        ship.speed = 100;

        // On ajoute le vaisseau à la scène
        scene.addGameObject(ship);
                        
        // Gestion du vaisseau
        ship = new CircleShape("black", new Vec2(64));
        ship.status = GameObjectState.ACTIVE;
        ship.position.x = (screen.width - ship.size.x) / 2;
        ship.position.y = screen.height - ship.size.y;
        ship.behaveStrategy = new UniformMoveStrategy(ship, new Vec2(0, -1));
        ship.speed = 100;

        // On ajoute le vaisseau à la scène
        scene.addGameObject(ship);
                                
        // Gestion du vaisseau
        ship = new CircleShape("black", new Vec2(64));
        ship.status = GameObjectState.ACTIVE;
        ship.position.x = 0;
        ship.position.y = 0;
        ship.behaveStrategy = new UniformMoveStrategy(ship, new Vec2(1280, 800));
        ship.speed = 100;

        // On ajoute le vaisseau à la scène
        scene.addGameObject(ship);

        // Scene retournée
        return scene;
    }
}