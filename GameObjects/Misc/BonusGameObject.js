// Classe définissant un bonus
class BonusGameObject extends DoubleSprite {
    constructor(gameObject, sparkSprite, bonusSprite, speed) {
        super(sparkSprite, bonusSprite, speed);
        this.gameObject = gameObject;
        this.type = GameObjectType.BONUS;
        this.partition = GameObjectPartition.GAME_PARTITION;
        this.status = GameObjectState.ACTIVE;
        this.moveStrategy = new SinWaveMoveStrategy(this, new Vec2(-1, 0), 10);
    }

    update(dt) {
        super.update(dt);

    }

    draw(context) {
        super.draw(context);
    }
}

