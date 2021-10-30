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

    // // Accesseurs de la position (avec mise à jour de la position de la collideBox)
    // get positionX() {
    //     return this.position.x;
    // }
    // set positionX(x) {
    //     this.position.x = x;
    //     this.collideBox.position.x = x;
    // }
    // get positionY() {
    //     return this.position.y;
    // }
    // set positionY(y) {
    //     this.position.y = y;
    //     this.collideBox.position.y = y;
    // }

    // // Accesseurs de l'echelle (avec mise à jour de la taille de la collideBox)
    // get scaleX() {
    //     return this.scale.x;
    // }
    // set scaleX(x) {
    //     this.scale.x = x;
    //     this.collideBox.size.x = x * this.originalSize.x;
    // }
    // get scaleY() {
    //     return this.scale.y;
    // }
    // set scaleY(y) {
    //     this.scale.y = y;
    //     this.collideBox.size.y = y * this.originalSize.y;
    // }
    
    // // Accesseurs de la taille (avec mise à jour de la taille de la collideBox)
    // get sizeX() {
    //     return this.size.x;
    // }
    // set sizeX(x) {
    //     this.size.x = x;
    //     this.collideBox.size.x = x * this.scale.x;
    // }
    // get sizeY() {
    //     return this.size.y;
    // }k
    // set sizeY(y) {
    //     this.size.y = y;
    //     this.collideBox.size.y = y * this.scale.y;
    // }

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