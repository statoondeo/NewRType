class GreenBulletGameObject extends BulletGameObject {
    constructor(partition) {
        super(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("images/greenbullet.png"), new Vec2(32), partition)
    }
}

