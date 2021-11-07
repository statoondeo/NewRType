// Définition de base d'un spawner
// Un spawner est un élément qui en fait apparaitre d'autre
class BaseSpawner extends GameObject {
    constructor(gameObjectPrototype, spawnNumber, appearPoint) {
        super();
        this.gameObjectPrototype = gameObjectPrototype;
        this.spawnNumber = spawnNumber;
        if (null != appearPoint.position) {
            this.position = appearPoint.position;
            this.size = appearPoint.size;
        }
        else {
            this.position.x = appearPoint.x;
            this.position.y = appearPoint.y;
            this.size.x = this.size.y = 0;
        }
    }

    update(dt) {
        super.update(dt);
    }

    spawn() {

    }
}
