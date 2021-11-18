class StarknifeGameObject extends EnemyShipGameObject {
    constructor() {
        // Paramétrage du vaisseau ennemi
        super(Services.get(Services.ASSET).get("Images/starknife.png"), new Vec2(64), 400, 250, Services.get(Services.ASSET).get("Images/starknife2.png"))
        this.moveStrategy = new SinWaveMoveStrategy(this, new Vec2(-1, 0), 300);
        this.fireCommand = new AsapFireCommand(new FireRatedFireCommand(this, new RedBulletGameObject(this.partition, new Vec2(-1, 0)), new Vec2(), 3, new SoundPool(Services.get(Services.ASSET).get("Sounds/laser5.mp3"), 15)));
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 60 / 1000, true));
        this.startAnimation("IDLE", 0);
        this.sound = new SoundPool(Services.get(Services.ASSET).get("Sounds/Rifle_v1_variation_02_wav.wav"), 2);
        this.dieCommand.addCommand(new PlaySoundCommand(Services.get(Services.ASSET).get("Sounds/Explosion_Sci_Fi_03_variation_01_wav.wav").cloneNode()));
    }
            
    getClone() {
        return new StarknifeGameObject();
    }

    damage(amount) {
        super.damage(amount);
        this.sound.play();
    }

    static size = new Vec2(64);
}

