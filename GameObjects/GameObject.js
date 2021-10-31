class GameObject {
    constructor() {
        this.position = new Vec2();
        this.originalSize = new Vec2();
        this.scale = new Vec2(1, 1);
        this.size = new Vec2();
        this.moveCommand = new DummyCommand();
        this.fireCommand = new DummyCommand();
        this.speed = 0;
        this.collideBox = new BaseCollideBox();
        this.status = GameObject.ACTIVE;
        this.layer = 1;
        this.id = GameObject.getNewObjectId();
        this.partition = BaseScene.GAME_PARTITION;
    }

    setScale(newScale) {
        this.scale.x = newScale.x;
        this.scale.y = newScale.y;

        // Mise à jour de la taille réélle
        this.size.x = this.originalSize.x * this.scale.x;
        this.size.y = this.originalSize.y * this.scale.y;
    }

    // Gestion d'un identifiant pour reconnaitre les objets lors du debug
    // TODO : A supprimer lors de la RC
    static newGameObjectId = 1;
    static getNewObjectId() {
        return GameObject.newGameObjectId++;
    }

    // Différentes états que peut prendre un gameObject
    static IDLE = "IDLE";
    static ACTIVE = "ACTIVE";
    static OUTDATED = "OUTDATED";

    getClone() {
        let clone = new GameObject();
        clone.partition = this.partition;
        clone.position = this.position.getClone();
        clone.originalSize = this.originalSize.getClone();
        clone.scale = this.scale.getClone();
        clone.size = this.size.getClone();
        clone.moveCommand = this.moveCommand.getClone();
        clone.fireCommand = this.fireCommand.getClone();
        clone.speed = this.speed;
        clone.collideBox = this.collideBox.getClone();
        return clone;
    }
    
    // Tous les gameObjets sont des observers
    subjectChanged(subject, property) {
    }

    // Mise à jour du gameObject
    // Les comportements sont modélisés dans des commandes
    update(dt) {
        // Mise à jour de la boite de collision
        this.collideBox.update(dt);

        // Gestion du mouvement
        this.moveCommand.update(dt);
        this.moveCommand.execute();

        // Gestion du tir
        this.fireCommand.update(dt);
        this.fireCommand.execute();
    }

    // Affichage du gameObject
    draw(context) {
        if (ServiceLocator.getService(ServiceLocator.PARAMETER).colliderDisplay) {
            this.collideBox.draw(context);
        }
    }
}