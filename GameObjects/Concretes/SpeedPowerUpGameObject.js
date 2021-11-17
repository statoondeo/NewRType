class SpeedPowerUpGameObject extends BonusGameObject {
    constructor(playerShip) {
        super(new BlueSparkGameObject(), new SpeedUpGameObject(), 75);
        this.playerShip = playerShip;
        this.bonusCommand = new SpeedBonusCommand(this.playerShip, 50);
    }
        
    getClone() {
        return new SpeedPowerUpGameObject(this.playerShip);
    }

    static size = new Vec2(200);
}
