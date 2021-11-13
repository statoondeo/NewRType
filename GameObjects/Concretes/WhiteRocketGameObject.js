class WhiteRocketGameObject extends RocketGameObject {
    constructor(partition, direction) {
        // Paramétrage des bullets 
        super(Services.get(Services.ASSET).getImage("Images/rocket.png"), new Vec2(32), partition, direction, 500, 200);
        this.dieCommand.addCommand(new PopCommand(this, new RedExplosionGameObject()));
    }
                
    getClone() {
        return new WhiteRocketGameObject(this.partition, this.direction.getClone());
    }
}

