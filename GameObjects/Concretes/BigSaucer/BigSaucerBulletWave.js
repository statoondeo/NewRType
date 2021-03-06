class BigSaucerBulletWave extends BaseCommand {
    constructor(bigSaucer) {
        super();
        this.bigSaucer = bigSaucer;
        this.AllInCircleSpawnerTtl = 5;
        this.step = 0;
        this.sound = Services.get("AUDIO")["Sounds/laser1.mp3"];
    }

    update(dt) {
        // Gestion de la vague de red bullets
        this.AllInCircleSpawnerTtl -= dt;
        if (this.AllInCircleSpawnerTtl <= 0) {
            this.canExecute = true;
            this.sound.play();
            switch (this.step) {
                case 0:
                    this.AllInCircleSpawnerTtl = 0.25;
                    this.step++;
                    break;
                case 1:
                    this.AllInCircleSpawnerTtl = 0.2;
                    this.step++;
                    break;
                case 2:
                    this.AllInCircleSpawnerTtl = 0.15;
                    this.step++;
                    break;
                case 3:
                    this.AllInCircleSpawnerTtl = 0.1;
                    this.step++;
                    break;
                case 4:
                    this.AllInCircleSpawnerTtl = 2;
                    this.step = 0;
                    break;
            }
        }
    }

    execute() {
        if (this.canExecute) {
            this.canExecute = false;
            this.AllInCircleSpawnerGameObject = new AllInCircleSpawnerGameObject(new RedBulletGameObject(this.bigSaucer.partition, new Vec2(), 150), this.bigSaucer, 12, 0);
            this.AllInCircleSpawnerGameObject.spawn();
        }
    }
}
class BigSaucerGunWave extends BaseCommand {
    constructor(bigSaucer) {
        super();
        this.bigSaucer = bigSaucer;
        this.spawnNumber = 2;
        this.deltaAngle = 2 * Math.PI / this.spawnNumber;
        this.angle = 0;
        this.angleSpeed = 150;
        this.ttl = this.maxTtl = 0.05;
        this.sound = Services.get("AUDIO")["Sounds/laser1.mp3"];
    }

    update(dt) {
        // Gestion de la vague de red bullets
        this.ttl -= dt;
        this.angle += this.angleSpeed * dt;
        if (this.ttl < 0) {
            this.ttl = this.maxTtl;
            this.canExecute = true;
             this.sound.play();
        }
    }

    execute() {
        if (this.canExecute) {
            this.canExecute = false;
            // On spawne tous les exemplaires demand??s
            for (let index = 0; index < this.spawnNumber; index++) {
        
                // Duplication du prototype
                let newShip = new GreenBulletGameObject(this.bigSaucer);
                newShip.position.x = this.bigSaucer.position.x + this.bigSaucer.size.x / 2;
                newShip.position.y = this.bigSaucer.position.y + this.bigSaucer.size.y / 2;
                
                // On lui donne une direction qui s'??loigne du point d'apparition
                newShip.moveStrategy = new UniformMoveStrategy(newShip, new Vec2(Math.cos(this.angle + this.deltaAngle * index), Math.sin(this.angle + this.deltaAngle * index)));
                newShip.speed = 200;

                // On l'ajoute ?? la liste des gameObjects de la scene
                Services.get("SCENE").currentScene.addGameObject(newShip);
            }
        }
    }
}