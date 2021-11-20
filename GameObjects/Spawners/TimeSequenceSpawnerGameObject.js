// Les éléments apparaissent les uns à la suite des autres en fonction du timer demandé
class TimeSequenceSpawnerGameObject extends BaseSpawner {
    constructor(gameObjectPrototype, startAt, appearPoint, spawnSpeed, spawnNumber) {
        super(gameObjectPrototype, spawnNumber, appearPoint);
        this.startAt = startAt;
        this.spawnSpeed = spawnSpeed;
        this.spawnTime = this.spawnSpeed;
        this.status = "IDLE";
        this.initialSpawnNumber = this.spawnNumber;
        this.getReward = false;
        this.rewardChance = 1 / spawnNumber;
    }
      
    // Est-ce que le spawner rentre en action?
    subjectChanged(scheduler) {
        if (scheduler.currentStep >= this.startAt) {
            scheduler.unregister(this);
            this.status = "ACTIVE";
            this.spawn();
        }
    }

    update(dt) {
        super.update(dt);
        // Rafraichissement de la fréquence de spawn
        this.spawnTime -= dt;
        if (this.spawnTime <= 0) {
            this.spawn();
        }

        // Si il n'y a plus rien à spanwer, il devient obsolète
        if (this.spawnNumber == 0) {
            this.status = "OUTDATED";
        }
    }     

    spawn() {
        // Duplication du prototype
        // On l'ajoute à la liste des gameObjects de la scene
        let newShip = this.gameObjectPrototype.getClone();
        newShip.position.x = this.position.x + this.size.x / 2;
        newShip.position.y = this.position.y + this.size.y / 2;
        Services.get("SCENE").currentScene.addGameObject(newShip);

        // On passe au suivant
        this.spawnNumber--;
        this.spawnTime = this.spawnSpeed;

        // On ajoute un bonus
        if (!this.getReward) {
            if (Math.random() < this.rewardChance) {
                this.getReward = true;
                let bonus = null;
                let currentStep = Services.get("SCENE").currentScene.scheduler.currentStep;
                let playerShip = Services.get("SCENE").currentScene.playerShip;
                let pivot = currentStep <= 4000 ? 0.15 : (currentStep <= 8000 ? 0.5 : 0.85) ;
                if (Math.random() < pivot) {
                    bonus = new LifePowerUpGameObject(playerShip);
                }
                else {
                    bonus = new WeaponPowerUpGameObject(playerShip);
                }
                newShip.dieCommand.addCommand(new PopCommand(newShip, bonus));
            }
            else {
                this.rewardChance = (this.initialSpawnNumber - this.spawnNumber) / this.initialSpawnNumber;
            }
        }
    }
}