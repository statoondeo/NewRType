class WobblerGameObject extends EnemyShipGameObject {
    constructor(playerShip) {
        super(Services.get("ASSET").get("Images/wobbler.png"), new Vec2(64), 600, 200, Services.get("ASSET").get("Images/wobbler2.png"));
        this.playerShip = playerShip;
        this.moveStrategy = new BezierApexMoveStrategy(this, new WobblerCurve());
        let bullet = new GreenBulletGameObject(this);
        bullet.moveStrategy = new PlayerAimedUniformMoveStrategy(bullet, this, this.playerShip);
        this.fireCommand = new AsapFireCommand(new FireRatedFireCommand(this, bullet, new Vec2(), Math.random() * 2 + 2, new SoundPool(Services.get("ASSET").get("Sounds/laser4.mp3"), 10)));
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 60 / 1000, true));
        this.startAnimation("IDLE", 0);
        this.sound = new SoundPool(Services.get("ASSET").get("Sounds/Rifle_v1_variation_02_wav.wav"), 2);
        this.dieCommand.addCommand(new PlaySoundCommand(Services.get("ASSET").get("Sounds/Explosion_Sci_Fi_03_variation_02_wav.wav").cloneNode()));
    }
                
    getClone() {
        return new WobblerGameObject(this.playerShip);
    }

    damage(amount) {
        super.damage(amount);
        this.sound.play();
    }
}
class WobblerCurve extends BezierCurve {
    constructor() {
        // Points caractéristiques de la courbe
        let screen = Services.get("SCREEN");
        let pt1 = new Vec2(-screen.width / 4, screen.height - 64);
        let pt2 = new Vec2(screen.width * 1.3, screen.height);
        let pt3 = new Vec2(screen.width * 1.3, 0);
        let pt4 = new Vec2(-screen.width / 4, 0);

        super(8, [ pt1, pt2, pt3, pt4 ]);
    }
}
