// Toues les éléments apparaissent en même temps du même points et partent dans toutes les directions
class AllInCircleSpawnerGameObject extends BaseSpawner {
    constructor(gameObjectPrototype, appearPoint, spawnNumber, startAt) {
        super(gameObjectPrototype, spawnNumber, appearPoint);
        this.startAt = startAt;
        this.spawns = [];
        this.status = "IDLE";

        this.spawns = [];
        let deltaAngle = 2 * Math.PI / this.spawnNumber;

        // On spawne tous les exemplaires demandés
        for (let index = 0; index < this.spawnNumber; index++) {
    
            // Duplication du prototype
            let newShip = this.gameObjectPrototype.getClone();
            newShip.position.x = this.position.x + this.size.x / 2;
            newShip.position.y = this.position.y + this.size.y / 2;
            
            newShip.moveStrategy = this.gameObjectPrototype.moveStrategy.getClone(newShip);
            newShip.moveStrategy.rotate(deltaAngle * index);

            // On l'ajoute à la liste des gameObjects de la scene
            this.spawns.push(newShip);            
        }
    }

    getClone() {
        return new AllInCircleSpawnerGameObject(this.gameObjectPrototype, this.appearPoint.getClone(), this.spawnNumber, this.startAt);
    }

    // Est-ce que le spawner rentre en action?
    subjectChanged(scheduler) {
        if (scheduler.currentStep >= this.startAt) {
            scheduler.unregister(this);
            this.status = "OUTDATED";
            this.spawn();
        }
    }

    update(dt) {
        if (this.startAt == 0) {
            this.spawn();
            this.status = "OUTDATED";
        }
    }

    spawn() {
        // On spawne tous les exemplaires demandés
        this.spawns.forEach(spawnShip => {
            
            // On l'ajoute à la liste des gameObjects de la scene
            Services.get("SCENE").currentScene.addGameObject(spawnShip);            
        });
    }
}
