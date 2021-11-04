// Toues les éléments apparaissent en même temps du même points et partent dans toutes les directions
class AllInCircleSpawnerGameObject2 extends BaseSpawner {
    constructor(gameObjectPrototype, spawnNumber, startAt) {
        super(gameObjectPrototype, spawnNumber);
        this.startAt = startAt;
        this.spawns = [];
        this.status = GameObjectState.IDLE;
        this.angle = 2 * Math.PI / this.spawnNumber;
        this.spawnTime = 0.0625;
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
    }

    spawn() {
        
        // Duplication du prototype
        let newShip = this.gameObjectPrototype.getClone();

        // Il apparait sur le point prévu
        newShip.position = this.appearPoint.getClone();
        newShip.collideBox.position = newShip.position;

        // On lui associe le mouvement demandé
        newShip.moveCommand = new UniformMoveCommand(newShip, new Vec2(Math.cos(this.angle * this.spawnNumber), Math.sin(this.angle * this.spawnNumber)));

        // On simule 1 seconde de mouvement pour éviter qu'ils soient tous au même endroit au démarrage
        newShip.moveCommand.update(1);
        newShip.moveCommand.execute();

        // On lui associe la commande de tir
        newShip.fireCommand.gameObject = newShip;
        newShip.status = GameObject.IDLE;
        // On l'ajoute à la liste des gameObjects de la scene
        ServiceLocator.getService(ServiceLocator.SCENE).currentScene.addGameObject(newShip);
        this.spawns.push(newShip);

        this.spawnNumber--;

        this.spawnTime = 0.0625;

        if (this.spawnNumber <= 0) {
            this.spawns.forEach(spawn => {
                spawn.status = GameObjectState.ACTIVE;
            });
            this.status = GameObjectState.OUTDATED;
        }
    }
}
