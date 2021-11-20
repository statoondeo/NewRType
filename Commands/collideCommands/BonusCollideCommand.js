class SpeedBonusCollideCommand extends BaseCommand {
    constructor(gameObject) {
        super(gameObject);
        this.sound = Services.get("ASSET").get("Sounds/Click_Digital_10_wav.wav");
    }

    getClone(gameObject) {
        return new SpeedBonusCollideCommand(gameObject);
    }

    execute(otherGameObject) {
        if (this.canExecute && otherGameObject.type == "SHIP") {
            this.canExecute = false;
            this.sound.play();
            // On donne une moveStrategy au bonus

            let pt0 = this.gameObject.position;
            let pt3 = Services.get("SCENE").currentScene.playerShip.hud.getNextSpeedBonusPosition();
            pt3.x -= this.gameObject.size.x / 2 - 16;
            pt3.y -= this.gameObject.size.y / 2 - 16 ;

            this.gameObject.moveStrategy = new BezierApexMoveStrategy(this.gameObject, new TweenCurve(1, pt0, pt3, Easing.easeInOutCubic));
            this.gameObject.layer = 2;
        }
    }
}
class WeaponBonusCollideCommand extends BaseCommand {
    constructor(gameObject) {
        super(gameObject);
        this.sound = new SoundPool(Services.get("ASSET").get("Sounds/Click_Digital_10_wav.wav"), 5);
    }

    getClone(gameObject) {
        return new WeaponBonusCollideCommand(gameObject);
    }

    execute(otherGameObject) {
        if (this.canExecute && otherGameObject.type == "SHIP") {
            this.canExecute = false;
            this.sound.play();
            // On donne une moveStrategy au bonus

            let pt0 = this.gameObject.position;
            let pt3 = Services.get("SCENE").currentScene.playerShip.hud.getNextWeaponBonusPosition();
            pt3.x -= this.gameObject.size.x / 2 - 16;
            pt3.y -= this.gameObject.size.y / 2 - 16;

            this.gameObject.moveStrategy = new BezierApexMoveStrategy(this.gameObject, new TweenCurve(1, pt0, pt3, Easing.easeInOutCubic));
            this.gameObject.layer = 2;
        }
    }
}
class LifeBonusCollideCommand extends BaseCommand {
    constructor(gameObject) {
        super(gameObject);
        this.sound = new SoundPool(Services.get("ASSET").get("Sounds/Click_Digital_10_wav.wav"), 5);
    }

    getClone(gameObject) {
        return new LifeBonusCollideCommand(gameObject);
    }

    execute(otherGameObject) {
        if (this.canExecute && otherGameObject.type == "SHIP") {
            this.canExecute = false;
            this.sound.play();

            // On donne une moveStrategy au bonus

            let pt0 = this.gameObject.position;
            let pt3 = new Vec2(82, 106);
            pt3.x -= this.gameObject.size.x / 2;
            pt3.y -= this.gameObject.size.y / 2;

            this.gameObject.moveStrategy = new BezierApexMoveStrategy(this.gameObject, new TweenCurve(1, pt0, pt3, Easing.easeInOutCubic));
            this.gameObject.layer = 2;
        }
    }
}
