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
    }

    // Gestion d'un identifiant pour reconnaitre les objets lors du debug
    // TODO : A supprimer lors de la RC
    static newGameObjectId = 1;
    static getNewObjectId() {
        return GameObject.newGameObjectId++;
    }

    // Différentes états que peut prendre un gameObject
    static IDLE = 0;
    static ACTIVE = 1;
    static OUTDATED = 2;

    getClone() {
        let clone = new GameObject();
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
    subjectChanged(subject) {
    }

    // Mise à jour du gammeObject
    // Les comportements sont modélisés ddans des commandes
    update(dt) {
        // Gestion du mouvement
        this.moveCommand.update(dt);
        this.moveCommand.execute();

        // Gestion du tir
        this.fireCommand.update(dt);
        this.fireCommand.execute();
    }

    // Affichage du gameObject
    draw(context) {
    }
}