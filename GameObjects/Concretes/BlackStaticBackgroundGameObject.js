class BlackStaticBackgroundGameObject extends StaticLayer {
    constructor() {
        let shape = new RectShape("Black");
        shape.position = new Vec2(0, 0);
        let screen = ServiceLocator.getService(ServiceLocator.SCREEN);
        shape.size = new Vec2(screen.width, screen.height);
        super(0, shape)
    }
}