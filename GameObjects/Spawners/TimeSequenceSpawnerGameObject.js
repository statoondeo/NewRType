// Les éléments apparaissent les uns à la suite des autres en fonction du timer demandé
class TimeSequenceSpawnerGameObject extends BaseSpawner {
    constructor(gameObjectPrototype, startAt, appearPoint, spawnSpeed, spawnNumber) {
        super(gameObjectPrototype, spawnNumber, appearPoint);
        this.startAt = startAt;
        this.spawnSpeed = spawnSpeed;
        this.spawnTime = this.spawnSpeed;
        this.status = GameObjectState.IDLE;
        this.initialSpawnNumber = this.spawnNumber;
    }
      
    // Est-ce que le spawner rentre en action?
    subjectChanged(scheduler) {
        if (scheduler.currentStep >= this.startAt) {
            scheduler.unregister(this);
            this.status = GameObjectState.ACTIVE;
            this.spawn();
        }
    }

    update(dt) {
        // Rafraichissement de la fréquence de spawn
        this.spawnTime -= dt;
        if (this.spawnTime <= 0) {
            this.spawn();
        }

        // Si il n'y a plus rien à spanwer, il devient obsolète
        if (this.spawnNumber == 0) {
            this.status = GameObjectState.OUTDATED;
        }
    }     

    spawn() {
        // Duplication du prototype
        // On l'ajoute à la liste des gameObjects de la scene
        let newShip = this.gameObjectPrototype.getClone();
        ServiceLocator.getService(ServiceLocator.SCENE).currentScene.addGameObject(newShip);

        // On passe au suivant
        this.spawnNumber--;
        this.spawnTime = this.spawnSpeed;

        // On ajoute un bonus si c'était le dernier
        if (this.spawnNumber == 0 && this.initialSpawnNumber > 1) {
            newShip.dieCommand = new PopAndDieCommand(newShip, new WeaponPowerUpGameObject(ServiceLocator.getService(ServiceLocator.SCENE).currentScene.playerShip));
        }
    }
}