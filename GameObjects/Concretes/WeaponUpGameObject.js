class WeaponUpGameObject extends AnimatedSprite {
    constructor() {
        super(Services.get("ASSET").get("Images/powerup.png"), new Vec2(64));
        this.partition = "GAME_PARTITION";
        this.layer = 1;
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], 80 / 1000, true));
        this.startAnimation("IDLE", 0);
        // this.dieCommand.commandsList = [];
    }
            
    getClone() {
        return new WeaponUpGameObject();
    }
}
class MiniWeaponUpGameObject extends AnimatedSprite {
    constructor() {
        super(ImageHandler.zoomImage(Services.get("ASSET").get("Images/powerup.png"), new Vec2(0.5)), new Vec2(32))
        this.layer = 1;
        this.type = "NONE";
        this.partition = "NEUTRAL_PARTITION";
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], 80 / 1000, true));
        this.startAnimation("IDLE", 0);
    }
            
    getClone() {
        return new MiniWeaponUpGameObject();
    }
}