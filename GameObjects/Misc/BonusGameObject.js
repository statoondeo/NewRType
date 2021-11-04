// Classe définissant un bonus
class BonusGameObject extends DoubleSprite {
    constructor(sparkSprite, bonusSprite, speed) {
        super(sparkSprite, bonusSprite, speed);
        this.partition = GameObjectPartition.GAME_PARTITION;
        this.status = GameObjectState.ACTIVE;
        this.behaveStrategy = new BaseBehaveStrategy(this, new SinWaveMoveStrategy(this, new Vec2(-1, 0), 100), new BaseFireStrategy(this));
    }

    update(dt) {
        super.update(dt);

    }

    draw(context) {
        super.draw(context);
    }
}

