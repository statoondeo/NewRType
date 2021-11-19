class SpeedUpGameObject extends AnimatedSprite {
    constructor() {
        super(Services.get(Services.ASSET).get("Images/speedpowerup.png"), new Vec2(64))
        this.layer = 1;
        this.partition = GameObjectPartition.GAME_PARTITION;
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], 50 / 1000, true));
        this.startAnimation("IDLE", 0);
    }
            
    getClone() {
        return new SpeedUpGameObject();
    }
}
class MiniSpeedUpGameObject extends AnimatedSprite {
    constructor() {
        super(ImageHandler.zoomImage(Services.get(Services.ASSET).get("Images/speedpowerup.png"), new Vec2(0.5)), new Vec2(32))
        this.layer = 1;
        this.type = GameObjectPartition.NONE;
        this.partition = GameObjectPartition.NEUTRAL_PARTITION;
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], 50 / 1000, true));
        this.startAnimation("IDLE", 0);
    }
            
    getClone() {
        return new MiniSpeedUpGameObject();
    }
}
