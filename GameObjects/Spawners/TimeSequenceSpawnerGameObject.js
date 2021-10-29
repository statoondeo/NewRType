class TimeSequenceSpawnerGameObject extends GameObject {
    constructor(gameObjectPrototype, moveCommandPrototype, startAt, appearPoint, spawnSpeed, spawnNumber) {
        super();
        this.gameObjectPrototype = gameObjectPrototype;
        this.moveCommand = moveCommandPrototype;
        this.startAt = startAt;
        this.appearPoint = appearPoint;
        this.spawnNumber = spawnNumber;
        this.spawnSpeed = spawnSpeed;
        this.spawnTime = this.spawnSpeed;
        this.status = GameObject.IDLE;
    }
      
    // Est-ce que le spawner rentre en action?
    subjectChanged(scheduler) {
        if (scheduler.currentStep >= this.startAt) {
            scheduler.unregister(this);
            this.status = GameObject.ACTIVE;
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
            this.status = GameObject.OUTDATED;
        }
    }     

    spawn() {
        // Duplication du prototype
        let newShip = this.gameObjectPrototype.getClone();

        // Il apparait sur le point prévu
        newShip.position = this.appearPoint.getClone();
        newShip.collideBox.position = newShip.position;

        // On lui associe le mouvement demandé
        let moveCommand = this.moveCommand.getClone();
        moveCommand.gameObject = newShip;
        newShip.moveCommand = moveCommand;

        // On l'ajoute à la liste des gameObjects de la scene
        ServiceLocator.getService(ServiceLocator.SCENE).currentScene.addGameObject(newShip);

        // On passe au suivant
        this.spawnNumber--;
        this.spawnTime = this.spawnSpeed;
    }
}