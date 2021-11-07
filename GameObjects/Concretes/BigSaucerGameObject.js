class CompositeCommand extends BaseCommand {
    constructor() {
        super();
        this.commandsList = [];
    }

    addCommand(command) {
        this.commandsList.push(command);
    }

    update(dt) {
        this.commandsList.forEach(command => {
            command.update(dt);
        });
    }

    execute() {
        this.commandsList.forEach(command => {
            command.execute();
        });
    }
}
class BigSaucerBulletWave extends BaseCommand {
    constructor(bigSaucer) {
        super();
        this.AllInCircleSpawnerTtl = 5;
        this.step = 0;
        this.AllInCircleSpawnerGameObject = new AllInCircleSpawnerGameObject(new RedBulletGameObject(bigSaucer.partition), bigSaucer, 16, 0);
    }

    update(dt) {
        // Gestion de la vague de red bullets
        this.AllInCircleSpawnerTtl -= dt;
        if (this.AllInCircleSpawnerTtl <= 0) {
            switch (this.step) {
                case 0:
                    this.execute();
                    this.AllInCircleSpawnerTtl = 0.3;
                    this.step++;
                    break;
                case 1:
                    this.execute();
                    this.AllInCircleSpawnerTtl = 0.2;
                    this.step++;
                    break;
                case 2:
                    this.execute();
                    this.AllInCircleSpawnerTtl = 0.1;
                    this.step++;
                    break;
                case 3:
                    this.execute();
                    this.AllInCircleSpawnerTtl = 5;
                    this.step = 0;
                    break;
            }
        }
    }

    execute() {
        this.AllInCircleSpawnerGameObject.spawn();
    }
}

class BigSaucerGameObject extends EnemyShipGameObject {
    constructor(playerShip) {
        // Paramétrage du vaisseau ennemi
        super(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("images/bigsaucer.png"), new Vec2(256, 96), 20000, 0)

        this.playerShip = playerShip;
        let screen = ServiceLocator.getService(ServiceLocator.SCREEN);
        
        // Points caractéristiques de la courbe
        let pt1 = new Vec2(screen.width, 0);
        let pt2 = new Vec2();
        let pt3 = new Vec2(0, (screen.height - this.size.y) / 2);
        let pt4 = new Vec2((screen.width - this.size.x) / 2, (screen.height - this.size.y) / 2);
        let pt5 = new Vec2(screen.width - this.size.x, (screen.height - this.size.y) / 2);
        let pt6 = new Vec2(screen.width - this.size.x, screen.height - this.size.y);
        let pt7 = new Vec2((screen.width - this.size.x) / 2, screen.height - this.size.y);
        let pt8 = new Vec2(0, screen.height - this.size.y);
        let pt9 = new Vec2(screen.width - this.size.x, 0);
        let pt10 = new Vec2(-this.size.x, 0);

        // Trajectoire en huit pour 30 sec à l'écran
        let compositeCurve = new CompositeCurve();
        compositeCurve.addCurve(new Curve(pt1, pt2, pt3, pt4, 7.5));
        compositeCurve.addCurve(new Curve(pt4, pt5, pt6, pt7, 7.5));
        compositeCurve.addCurve(new Curve(pt7, pt8, pt3, pt4, 7.5));
        compositeCurve.addCurve(new Curve(pt4, pt5, pt9, pt10, 7.5));

        // Stratégie de déplacement
        this.moveStrategy = new BezierApexMoveStrategy(this, compositeCurve);
        
        this.collideBox = new CompositeCollideBox(this.position, this.size);
        this.collideBox.addCollideBox(new CircleCollideBox(this.position, this.size.y / 2, new Vec2((this.size.x - this.size.y) / 2, 0)));
        this.collideBox.addCollideBox(new RectCollideBox(this.position, new Vec2(this.size.x, this.size.y / 3), new Vec2(0, this.size.y / 3)));

        this.fireCommand = new BigSaucerBulletWave(this);
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], 20 / 1000, true));
        this.startAnimation("IDLE", 0);
        this.dieCommand = new PopAndDieCommand(this, new RedExplosionGameObject());

        // Il spawn des cubes
        this.TimeSequenceSpawnerGameObject = new TimeSequenceSpawnerGameObject(new CubeGameObject(this.playerShip), 0, this, 3, 15);
        this.TimeSequenceSpawnerGameObject.status = GameObjectState.ACTIVE;
    }

    getClone() {
        return new BigSaucerGameObject(this.playerShip);
    }

    update(dt) {
        super.update(dt);

        // Gestion du spawn de cubes
        this.TimeSequenceSpawnerGameObject.update(dt);
    }

    static size = new Vec2(256, 96);
}

