// Toues les éléments apparaissent en même temps du même points et partent dans toutes les directions
class AllInCircleSpawnerGameObject extends BaseSpawner {
    constructor(gameObjectPrototype, appearPoint, spawnNumber, startAt) {
        super(gameObjectPrototype, spawnNumber, appearPoint);
        this.startAt = startAt;
        this.spawns = [];
        this.status = GameObjectState.IDLE;
    }
     
    // Est-ce que le spawner rentre en action?
    subjectChanged(scheduler) {
        if (scheduler.currentStep >= this.startAt) {
            scheduler.unregister(this);
            this.status = GameObjectState.ACTIVE;
            this.spawn();
        }
    }

    spawn() {
        let angle = 0;
        let deltaAngle = 2 * Math.PI / this.spawnNumber;

        // On spawne tous les exemplaires demandés
        for (let index = 0; index < this.spawnNumber; index++) {
            
            // Duplication du prototype
            let newShip = this.gameObjectPrototype.getClone();

            // On lui donne une direction qui s'éloigne du point d'apparition
            newShip.behaveStrategy.moveStrategy = new UniformMoveStrategy(newShip, new Vec2(Math.cos(angle + deltaAngle * index), Math.sin(angle + deltaAngle * index)));
            newShip.speed = 75;

            // On l'ajoute à la liste des gameObjects de la scene
            ServiceLocator.getService(ServiceLocator.SCENE).currentScene.addGameObject(newShip);            
        }
    }
}
