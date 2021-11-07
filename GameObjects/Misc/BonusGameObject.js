// Classe définissant un bonus
class BonusGameObject extends DoubleSprite {
    constructor(sparkSprite, bonusSprite, speed) {
        super(sparkSprite, bonusSprite, speed);
        this.type = GameObjectType.BONUS;
        this.partition = GameObjectPartition.GAME_PARTITION;
        this.status = GameObjectState.ACTIVE;
        this.moveStrategy = new SinWaveMoveStrategy(this, new Vec2(-1, 0), 100);
        this.bonusCommand = new DummyCommand();
        this.collideCommand = new BonusCollideCommand(this);
        this.dieCommand = new DieCommand(this);
    }

    update(dt) {
        super.update(dt);

    }

    draw(context) {
        super.draw(context);
    }
}

