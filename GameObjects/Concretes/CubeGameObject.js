class CubeGameObject extends EnemyShipGameObject {
    constructor(playerShip) {
        // Paramétrage du vaisseau ennemi
        super(Services.get(Services.ASSET).get("Images/cube.png"), new Vec2(64), 200, 0, Services.get(Services.ASSET).get("Images/cube2.png"))
        this.playerShip = playerShip;
        this.layer = 0.99;
        this.moveStrategy = new DummyMoveStrategy();
        this.bulletPrototype = new BlueBulletGameObject(this.partition, new Vec2());
        this.bulletPrototype.moveStrategy = new PlayerAimedUniformMoveStrategy(this.bulletPrototype, this, this.playerShip);
        this.fireCommand = new AsapFireCommand(new FireRatedFireCommand(this, this.bulletPrototype, new Vec2(), 5, new SoundPool(Services.get(Services.ASSET).get("Sounds/laser6.mp3"), 5)));
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], 100 / 1000, true));
        this.startAnimation("IDLE", 0);
        this.sound = new SoundPool(Services.get(Services.ASSET).get("Sounds/Rifle_v1_variation_02_wav.wav"), 1);
        this.dieCommand.addCommand(new PlaySoundCommand(Services.get(Services.ASSET).get("Sounds/Explosion_Sci_Fi_03_variation_02_wav.wav").cloneNode()));
    }

    damage(amount) {
        super.damage(amount);
        this.sound.play();
    }          

    getClone() {
        let clone = new CubeGameObject(this.playerShip);
        this.bulletPrototype = new BlueBulletGameObject(this.partition, new Vec2());
        this.bulletPrototype.moveStrategy = new PlayerAimedUniformMoveStrategy(this.bulletPrototype, this, this.playerShip);
        this.fireCommand = new AsapFireCommand(new FireRatedFireCommand(this, this.bulletPrototype, new Vec2(), 5));
        return clone;
    }

    static size = new Vec2(64);
}

class TimedCubeGameObject extends CubeGameObject {
    constructor(playerShip) {
        // Paramétrage du vaisseau ennemi
        super(playerShip)
        this.ttl = 20;
    }
            
    getClone() {
        let clone = new TimedCubeGameObject(this.playerShip);
        this.bulletPrototype = new BlueBulletGameObject(this.partition, new Vec2());
        this.bulletPrototype.moveStrategy = new PlayerAimedUniformMoveStrategy(this.bulletPrototype, this, this.playerShip);
        this.fireCommand = new AsapFireCommand(new FireRatedFireCommand(this, this.bulletPrototype, new Vec2(), 5));
        return clone;
    }

    update(dt) {
        super.update(dt);
        this.ttl -= dt;
        if (this.ttl < 0) {
            this.dieCommand.execute();
        }
    }

    static size = new Vec2(64);
}
