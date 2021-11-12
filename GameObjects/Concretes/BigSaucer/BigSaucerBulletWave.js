class BigSaucerBulletWave extends BaseCommand {
    constructor(bigSaucer) {
        super();
        this.bigSaucer = bigSaucer;
        this.AllInCircleSpawnerTtl = 5;
        this.step = 0;
    }

    update(dt) {
        // Gestion de la vague de red bullets
        this.AllInCircleSpawnerTtl -= dt;
        if (this.AllInCircleSpawnerTtl <= 0) {
            this.canExecute = true;
            switch (this.step) {
                case 0:
                    this.AllInCircleSpawnerTtl = 0.4;
                    this.step++;
                    break;
                case 1:
                    this.AllInCircleSpawnerTtl = 0.3;
                    this.step++;
                    break;
                case 2:
                    this.AllInCircleSpawnerTtl = 0.2;
                    this.step++;
                    break;
                case 3:
                    this.AllInCircleSpawnerTtl = 0.1;
                    this.step++;
                    break;
                case 4:
                    this.AllInCircleSpawnerTtl = 5;
                    this.step = 0;
                    break;
            }
        }
    }

    execute() {
        if (this.canExecute) {
            this.canExecute = false;
            this.AllInCircleSpawnerGameObject = new AllInCircleSpawnerGameObject(new RedBulletGameObject(this.bigSaucer.partition), this.bigSaucer, 12, 0);
            this.AllInCircleSpawnerGameObject.spawn();
        }
    }
}