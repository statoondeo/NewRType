// Classe définissant un bonus
class BonusGameObject extends DoubleSprite {
    constructor(sparkSprite, bonusSprite, speed) {
        super(sparkSprite, bonusSprite, speed);
        this.type = GameObjectType.BONUS;
        this.partition = GameObjectPartition.GAME_PARTITION;
        this.status = GameObjectState.ACTIVE;
        this.behaveStrategy = new BaseBehaveStrategy(this, new SinWaveMoveStrategy(this, new Vec2(-1, 0), 100), new BaseFireStrategy(this));
        this.bonusCommand = new DummyCommand();
        this.collideCommand = new BonusCollideCommand(this);
        this.dieCommand = new DieCommand(this);
    }

    getClone() {
        let clone = new BonusGameObject(this.firstSprite.getClone(), this.secondSprite.getClone(), this.speed);

        clone.type = this.type;
        clone.partition = this.partition;
        clone.status = this.status;
        clone.position = this.position.getClone();
        clone.size = this.size.getClone();
        clone.behaveStrategy = this.behaveStrategy.getClone(clone);
        clone.speed = this.speed;
        clone.collideBox = this.collideBox.getClone();
        clone.collideBox.position = clone.position;
        clone.bonusCommand = this.bonusCommand.getClone();
        clone.collideCommand = this.collideCommand.getClone(clone);
        clone.dieCommand = this.dieCommand.getClone(clone);
        clone.dealDamageCommand = this.dealDamageCommand.getClone(clone);

        return clone;
    }

    update(dt) {
        super.update(dt);

    }

    draw(context) {
        super.draw(context);
    }
}

