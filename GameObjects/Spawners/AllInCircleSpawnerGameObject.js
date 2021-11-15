// Toues les éléments apparaissent en même temps du même points et partent dans toutes les directions
class AllInCircleSpawnerGameObject extends BaseSpawner {
    constructor(gameObjectPrototype, appearPoint, spawnNumber, startAt) {
        super(gameObjectPrototype, spawnNumber, appearPoint);
        this.startAt = startAt;
        this.spawns = [];
        this.status = GameObjectState.IDLE;

        this.spawns = [];
        let angle = 0;
        let deltaAngle = 2 * Math.PI / this.spawnNumber;

        // On spawne tous les exemplaires demandés
        for (let index = 0; index < this.spawnNumber; index++) {
    
            // Duplication du prototype
            let newShip = this.gameObjectPrototype.getClone();
            newShip.position.x = this.position.x + this.size.x / 2;
            newShip.position.y = this.position.y + this.size.y / 2;
            
            // On lui donne une direction qui s'éloigne du point d'apparition
            newShip.moveStrategy = new UniformMoveStrategy(newShip, new Vec2(Math.cos(angle + deltaAngle * index), Math.sin(angle + deltaAngle * index)));
            newShip.speed = 75;

            // On l'ajoute à la liste des gameObjects de la scene
            this.spawns.push(newShip);            
        }
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
        // On spawne tous les exemplaires demandés
        this.spawns.forEach(spawnShip => {
            
            // On l'ajoute à la liste des gameObjects de la scene
            Services.get(Services.SCENE).currentScene.addGameObject(spawnShip);            
        });
    }
}
