class LifeUpGameObject extends AnimatedSprite {
    constructor() {
        super(Services.get(Services.ASSET).get("Images/life.png"), new Vec2(64));
        this.partition = GameObjectPartition.GAME_PARTITION;
        this.layer = 1;
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], 50 / 1000, true));
        this.startAnimation("IDLE", 0);
    }
            
    getClone() {
        return new LifeUpGameObject();
    }
    
    static size = new Vec2(64);
}
