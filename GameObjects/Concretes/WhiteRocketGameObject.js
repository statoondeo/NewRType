class WhiteRocketGameObject extends RocketGameObject {
    constructor(partition, direction) {
        // Paramétrage des bullets 
        super(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("images/rocket.png"), new Vec2(32), partition, direction, 500, 200);
        this.dieCommand = new PopAndDieCommand(this, new RedExplosionGameObject());
    }
                
    getClone() {
        return new WhiteRocketGameObject(this.partition, this.direction.getClone());
    }
}

