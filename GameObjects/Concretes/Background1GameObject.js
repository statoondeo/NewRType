class Background1GameObject extends RollingLayer {
    constructor(baseSpeed) {
        super(0.1, baseSpeed, ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("images/background1.png"), new Vec2(-1, 0))
    }
}
