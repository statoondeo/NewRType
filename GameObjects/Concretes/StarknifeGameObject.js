class StarknifeGameObject extends EnemyShipGameObject {
    constructor(initialDt = 0) {
        // Paramétrage du vaisseau ennemi
        super(Services.get("ASSET").get("Images/starknife.png"), new Vec2(64), 400, 250, Services.get("ASSET").get("Images/starknife2.png"))
        this.initialDt = initialDt;
        this.moveStrategy = new SinWaveMoveStrategy(this, new Vec2(-1, 0), 300, this.initialDt);
        this.fireCommand = new AsapFireCommand(new FireRatedFireCommand(this, new RedBulletGameObject(this.partition, new Vec2(-1, 0), Math.random() * 300 + 300), new Vec2(), Math.random() * 1.5 + 1.5, Services.get("AUDIO")["Sounds/laser5.mp3"]));
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 60 / 1000, true));
        this.startAnimation("IDLE", 0);
        this.sound = Services.get("AUDIO")["Sounds/Rifle_v1_variation_02_wav.wav"];
        this.dieCommand.addCommand(new PlaySoundCommand(Services.get("AUDIO")["Sounds/Explosion_Sci_Fi_03_variation_01_wav.wav"]));
    }
            
    getClone() {
        return new StarknifeGameObject(this.initialDt);
    }

    damage(amount) {
        super.damage(amount);
        this.sound.play();
    }
}

