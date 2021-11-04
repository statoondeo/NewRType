// Définition de base d'un spawner
// Un spawner est un élément qui en fait apparaitre d'autre
class BaseSpawner extends GameObject {
    constructor(gameObjectPrototype, spawnNumber, appearPoint) {
        super();
        this.gameObjectPrototype = gameObjectPrototype;
        this.spawnNumber = spawnNumber;
        this.gameObjectPrototype.position.x = appearPoint.x;
        this.gameObjectPrototype.position.y = appearPoint.y;
    }

    update(dt) {

    }

    spawn() {

    }
}
