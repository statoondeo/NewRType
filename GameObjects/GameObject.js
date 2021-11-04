class GameObject {
    constructor() {
        this.type = GameObjectType.NONE;
        this.position = new Vec2();
        this.size = new Vec2();
        this.vector = new Vec2();
        this.speed = 0;
        this.collideBox = new BaseCollideBox();
        this.status = GameObjectState.ACTIVE;
        this.layer = 1;
        this.partition = GameObjectPartition.GAME_PARTITION;
        this.behaveStrategy = new DummyBehaveStrategy();
    }

    setScale(newScale) {
        this.scale.x = newScale.x;
        this.scale.y = newScale.y;

        // Mise à jour de la taille réélle
        this.size.x = this.originalSize.x * this.scale.x;
        this.size.y = this.originalSize.y * this.scale.y;
    }

    collideWith(otherGameObject) {
        this.collideBox.isCollided = true;
        this.status = GameObjectState.OUTDATED;
    }

    // Mise à jour du gameObject
    // Les comportements sont modélisés dans des commandes
    update(dt) {
        // Initialisation du mouvement
        this.vector.x = this.vector.y = 0;

        // Mise à jour et application du comportement ) adopter
        this.behaveStrategy.update(dt);
        this.behaveStrategy.behave();

        // Mise à jour de la boite de collision
        this.collideBox.update(dt);

        // En général un gameobject en dehors de l'écran devient obsolète
        this.status = Tools.isOutOfScreen(this.position, this.size) ? GameObjectState.OUTDATED : this.status;
    }

    // Affichage du gameObject
    draw(context) {
        this.collideBox.draw(context);
    }
}