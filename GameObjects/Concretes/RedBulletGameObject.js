class RedBulletGameObject extends BulletGameObject {
    constructor(partition) {
        super(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("images/redbullet.png"), new Vec2(32), partition)
    }
}

