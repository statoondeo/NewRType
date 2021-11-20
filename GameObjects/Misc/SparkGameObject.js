class SparkGameObject extends AnimatedSprite {
    constructor(image) {
        let factor = 1.5;
        let sparkImage = image;
        let imageZoomer = new ImageHandler(new Vec2(sparkImage.width * factor, sparkImage.height * factor), new Vec2(factor, factor));
        imageZoomer.addImage(sparkImage);
        imageZoomer.assemble();
        sparkImage = imageZoomer.getAssembledImage();
        // super(sparkImage, new Vec2(100 * factor, 100 * factor));
        super(image, new Vec2(100, 100))
        this.layer = 1;
        this.partition = "GAME_PARTITION";
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], 200 / 1000, true));
        this.startAnimation("IDLE", 0);
    }
}
