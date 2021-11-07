class PlayerAimedUniformMoveStrategy extends UniformMoveStrategy {
    constructor(gameObject, origine, playerShip) {
        let fireAngle = Math.atan2(playerShip.position.y + playerShip.size.y / 2 - (origine.position.y + origine.size.y / 2), playerShip.position.x + playerShip.size.x / 2 - (origine.position.x + origine.size.x / 2));
        super(gameObject, new Vec2(Math.cos(fireAngle), Math.sin(fireAngle)));   
        this.origine = origine;
        this.playerShip = playerShip;
    }

    getClone(gameObject) {
        return new PlayerAimedUniformMoveStrategy(gameObject, this.origine, this.playerShip);
    }
}
