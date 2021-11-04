class BlueBulletGameObject extends BulletGameObject {
    constructor(partition) {
        super(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("images/bluebullet.png"), new Vec2(32), partition)
    }
}

