// Toues les éléments apparaissent en même temps du même points et partent dans toutes les directions
class AllInCircleSpawnerGameObject extends BaseSpawner {
    constructor(gameObjectPrototype, spawnNumber, startAt) {
        super(gameObjectPrototype, spawnNumber);
        this.startAt = startAt;
        this.spawns = [];
        this.status = GameObjectState.IDLE;
        this.spawnTime = 0.1;
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
        // Les éléments spawnés deviennent actifs après 1 seconde
        this.spawnTime -= dt;
        if (this.spawnTime <= 0) {
            this.spawns.forEach(spawn => {
                spawn.status = GameObjectState.ACTIVE;
            });
            this.status = GameObjectState.OUTDATED;        
        }
        else {
            this.spawns.forEach(spawn => {
                spawn.update(dt);
            });
        }
    }

    spawn() {
        let angle = 0;
        let deltaAngle = 2 * Math.PI / this.spawnNumber;
        for (let index = 0; index < this.spawnNumber; index++) {
            // Duplication du prototype
            let newShip = this.gameObjectPrototype.getClone();

            // Il apparait sur le point prévu
            newShip.position = this.appearPoint.getClone();
            newShip.collideBox.position = newShip.position;

            // On lui associe le mouvement demandé
            newShip.moveStrategy = new UniformMoveStrategy(newShip, new Vec2(Math.cos(angle + deltaAngle * index), Math.sin(angle + deltaAngle * index)));

            // On l'ajoute à la liste des gameObjects de la scene
            this.spawns.push(newShip);
            ServiceLocator.getService(ServiceLocator.SCENE).currentScene.addGameObject(newShip);            
        }
    }
}
