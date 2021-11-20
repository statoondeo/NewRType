// Les éléments apparaissent les uns à la suite des autres en fonction du timer demandé
class OnceSpawnerGameObject extends BaseSpawner {
    constructor(gameObjectPrototype, startAt, appearPoint, sound = null) {
        super(gameObjectPrototype, 1, appearPoint);
        this.startAt = startAt;
        this.status = "IDLE";
        this.sound = sound;
        this.initialSpawnNumber = this.spawnNumber;
        gameObjectPrototype.position.x = appearPoint.x;
        gameObjectPrototype.position.y = appearPoint.y;
    }
      
    // Est-ce que le spawner rentre en action?
    subjectChanged(scheduler) {
        if (scheduler.currentStep >= this.startAt) {
            scheduler.unregister(this);
            this.status = "OUTDATED";
            this.spawn();
        }
    }

    spawn() {
        // Duplication du prototype
        // On l'ajoute à la liste des gameObjects de la scene
        if (this.sound != null) {
            this.sound.play();
        }
        Services.get("SCENE").currentScene.addGameObject(this.gameObjectPrototype);
    }
}