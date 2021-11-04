class SpeedPowerUpGameObject extends BonusGameObject {
    constructor() {
        super(new BlueSparkGameObject(), new SpeedUpGameObject(), 75);
        this.partition = GameObjectPartition.GAME_PARTITION;
        this.status = GameObjectState.ACTIVE;
    }

    static size = new Vec2(200);
}
