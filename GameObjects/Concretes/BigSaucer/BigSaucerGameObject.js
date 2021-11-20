
class BigSaucerGameObject extends EnemyShipGameObject {


    constructor(playerShip, cubePrototype = new CubeGameObject(playerShip)) {
        // Paramétrage du vaisseau ennemi
        super(Services.get("ASSET").get("Images/bigsaucer.png"), new Vec2(256, 96), 120000, 0, Services.get("ASSET").get("Images/bigsaucer2.png"))
        this.layer = 0.999;

        this.playerShip = playerShip;

        // Stratégie de déplacement
        this.moveStrategy = new BezierApexMoveStrategy(this, new BigSaucerComingOutApex(this.size));

        // Boite de collision spécifique
        this.collideBox = new BigSaucerCollideBox(this.position, this.size);

        // Armement
        let firstStateWeapon = new WeaponState("Bullet Wave", new AsapFireCommand(new BigSaucerBulletWave(this)), 1);
        let secondStateWeapon = new WeaponState("Bullet Wave", new AsapFireCommand(new BigSaucerGunWave(this)), 2);

        firstStateWeapon.nextWeaponState = secondStateWeapon;
        secondStateWeapon.previousWeaponState = firstStateWeapon;

        let weapon = new Weapon(this, firstStateWeapon);
        this.fireCommand = new WeaponFireCommand(this, weapon);
        this.fireCommandUp = false;

        // Animation
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], 20 / 1000, true));
        this.startAnimation("IDLE", 0);

        // Animation de mort
        this.dieCommand.addCommand(new PopCommand(this, new ParticlesMediumExplosionGameObject(this, [ new GiantRedExplosionGameObject(100), new MediumRedExplosionGameObject(90), new RedExplosionGameObject(80) ])));
        this.sound = new SoundPool(Services.get("ASSET").get("Sounds/Rifle_v1_variation_02_wav.wav"), 25);
        this.dieCommand.addCommand(new PlaySoundCommand(Services.get("ASSET").get("Sounds/Explosion_Sci_Fi_03_variation_02_wav.wav").cloneNode()));

        // Il spawn des cubes
        this.TimeSequenceSpawnerGameObject = new TimeSequenceSpawnerGameObject(cubePrototype, 0, this, 3, 15);
        this.TimeSequenceSpawnerGameObject.status = "ACTIVE";

        // On ajoute le HUD
        let screen = Services.get("SCREEN");
        this.bossHud = new RedMiniaturePanelUIElementDecorator(new RedHUDPanelUIElement(this, new Vec2(screen.width - 598 - 10, 0), false), new UIElementDecorator(new BigSaucerMiniatureGameObject()));
        this.bossHud.show();

        // Flash rouge lorsqu'on passe en phase 2
        let canvas = ImageHandler.createCanvas(screen.width, screen.height);
        let context = canvas.getContext("2d");
        context.fillStyle = "red";
        context.fillRect(0, 0, screen.width, screen.height);
        this.flashLayer = new FlashingLayer(canvas);
    }

    static getAnimatedSprite() {
        let sprite = new AnimatedSprite(Services.get("ASSET").get("Images/bigsaucer.png"), new Vec2(256, 96));
        sprite.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], 20 / 1000, true));
        sprite.startAnimation("IDLE", 0);
        return sprite;
    }

    damage(amount) {
        super.damage(amount);
        if (!this.fireCommandUp && this.life < this.maxLife * 0.3) {
            this.fireCommandUp = true;
            this.fireCommand.weapon.levelUp();
            this.flashLayer.show();
        }
        this.sound.play();
    }

    getName() {
        return "Big Saucer";
    }

    getClone() {
        return new BigSaucerGameObject(this.playerShip);
    }

    update(dt) {
        super.update(dt);

        // Gestion du spawn de cubes
        this.TimeSequenceSpawnerGameObject.update(dt);

        // Mise à jour du HUD
        this.bossHud.update(dt);
    }

    draw(context) {
        super.draw(context);

        // Affichage du HUD
        this.bossHud.draw(context);
    }
}
class BigSaucerMiniatureGameObject extends AnimatedSprite {
    constructor() {        
        let miniature = ImageHandler.zoomImage(Services.get("ASSET").get("Images/bigsaucer.png"), new Vec2(0.5));
        super(miniature, new Vec2(128, 48))

        // Animation
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], 20 / 1000, true));
        this.startAnimation("IDLE", 0);
    }
}
