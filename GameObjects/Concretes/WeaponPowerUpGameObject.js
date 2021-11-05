class WeaponPowerUpGameObject extends BonusGameObject {
    constructor(playerShip) {
        super(new PurpleSparkGameObject(), new WeaponUpGameObject(), 75);
        this.bonusCommand = new SpeedBonusCommand(playerShip, 100);
    }

    static size = new Vec2(200);
}
