// Classe définissant un bonus
class BonusGameObject extends DoubleSprite {
    constructor(gameObject, sparkSprite, bonusSprite, speed) {
        super(sparkSprite, bonusSprite, speed);
        this.gameObject = gameObject;
        this.type = "BONUS";
        this.partition = "GAME_PARTITION";
        this.status = "ACTIVE";
        this.moveStrategy = new SinWaveMoveStrategy(this, new Vec2(-1, 0), 10, Math.random() * 2 * Math.PI);
    }

    update(dt) {
        super.update(dt);

    }

    draw(context) {
        super.draw(context);
    }
}

