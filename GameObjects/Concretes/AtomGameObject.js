class AtomGameObject extends EnemyShipGameObject {
    constructor() {
        // Paramétrage du vaisseau ennemi
        super(Services.get("ASSET").get("Images/atom.png"), new Vec2(64), 5000, 100, Services.get("ASSET").get("Images/atom2.png"))
        this.moveStrategy = new SinWaveMoveStrategy(this, new Vec2(-1, 0), 800);
        this.fireCommand = new AsapFireCommand(new AtomBulletWave(this));
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], 60 / 1000, true));
        this.startAnimation("IDLE", 0);
        this.sound = Services.get("AUDIO")["Sounds/Rifle_v1_variation_02_wav.wav"];
        this.dieCommand.addCommand(new PlaySoundCommand(Services.get("AUDIO")["Sounds/Explosion_Sci_Fi_03_variation_01_wav.wav"]));
    }
            
    getClone() {
        return new AtomGameObject();
    }

    damage(amount) {
        super.damage(amount);
        this.sound.play();
    }
}
class AtomBulletWave extends BaseCommand {
    constructor(gameObject) {
        super(gameObject);
        this.AllInCircleSpawnerTtl = Math.random() * 2 + 2;
        this.sound = Services.get("AUDIO")["Sounds/laser1.mp3"];
    }

    update(dt) {
        // Gestion de la vague de red bullets
        this.AllInCircleSpawnerTtl -= dt;
        this.canExecute = this.AllInCircleSpawnerTtl < 0;
    }

    execute() {
        if (this.canExecute) {
            this.canExecute = false;
            this.AllInCircleSpawnerTtl = 4;
            this.sound.play();
            this.AllInCircleSpawnerGameObject = new AllInCircleSpawnerGameObject(new RedBulletGameObject(this.gameObject.partition, new Vec2(), Math.random() * 75 + 50), this.gameObject, 8, 0);
            this.AllInCircleSpawnerGameObject.spawn();
        }
    }
}