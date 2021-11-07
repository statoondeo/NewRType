class WeaponPowerUpGameObject extends BonusGameObject {
    constructor(playerShip) {
        super(new PurpleSparkGameObject(), new WeaponUpGameObject(), 75);
        this.bonusCommand = new WeaponBonusCommand(playerShip);
    }
            
    getClone() {
        return new WeaponPowerUpGameObject(this.playerShip);
    }

    static size = new Vec2(200);
}
