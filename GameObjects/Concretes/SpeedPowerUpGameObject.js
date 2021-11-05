class SpeedPowerUpGameObject extends BonusGameObject {
    constructor(playerShip) {
        super(new BlueSparkGameObject(), new SpeedUpGameObject(), 75);
        this.bonusCommand = new SpeedBonusCommand(playerShip, 100);
    }

    static size = new Vec2(200);
}
