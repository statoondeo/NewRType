class BlueSparkGameObject extends AnimatedSprite {
    constructor() {
        let sparkImage = ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("images/bluespark.png");
        let imageZoomer = new ImageAssembler(new Vec2(sparkImage.width * 2, sparkImage.height * 2), new Vec2(2, 2));
        imageZoomer.addImage(sparkImage);
        imageZoomer.assemble();
        sparkImage = imageZoomer.getAssembledImage();
        super(sparkImage, new Vec2(200, 200))
        this.collideBox = new CircleCollideBox(this.position, 0.8 * this.size.x / 2);
        this.layer = 1;
        this.partition = GameObjectPartition.GAME_PARTITION;
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 50 / 1000, true));
        this.startAnimation("IDLE", 0);
    }
}
