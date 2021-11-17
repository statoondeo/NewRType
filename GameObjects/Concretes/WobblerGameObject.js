class WobblerGameObject extends EnemyShipGameObject {
    constructor(playerShip) {
        super(Services.get(Services.ASSET).get("Images/wobbler.png"), new Vec2(64), 600, 150, Services.get(Services.ASSET).get("Images/wobbler2.png"));
        this.playerShip = playerShip;
        this.moveStrategy = new SinWaveMoveStrategy(this, new Vec2(1, 0), 100);
        let bullet = new GreenBulletGameObject(this);
        bullet.moveStrategy = new PlayerAimedUniformMoveStrategy(bullet, this, this.playerShip);
        this.fireCommand = new AsapFireCommand(new FireRatedFireCommand(this, bullet, new Vec2(), 2, new SoundPool(Services.get(Services.ASSET).get("Sounds/laser4.mp3"), 10)));
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 60 / 1000, true));
        this.startAnimation("IDLE", 0);
        this.sound = new SoundPool(Services.get(Services.ASSET).get("Sounds/Rifle_v1_variation_02_wav.wav"), 2);
        this.dieCommand.addCommand(new PlaySoundCommand(Services.get(Services.ASSET).get("Sounds/Explosion_Sci_Fi_03_variation_02_wav.wav").cloneNode()));
    }
                
    getClone() {
        return new WobblerGameObject(this.playerShip);
    }

    damage(amount) {
        super.damage(amount);
        this.sound.play();
    }

    static size = new Vec2(64);
}
