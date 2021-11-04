class BaseBehaveStrategy extends BaseStrategy {
    constructor(gameObject, moveStrategy, fireStrategy) {
        super(gameObject);
        this.moveStrategy = moveStrategy;
        this.fireStrategy = fireStrategy;
        this.lastDt = 0;
        this.fireCommand = new DummyCommand();
    }

    getClone(gameObject) {
        let clone = new BaseBehaveStrategy(gameObject, this.moveStrategy.getClone(gameObject), this.fireStrategy.getClone(gameObject));
        clone.fireCommand = this.fireCommand.getClone(gameObject);
        return clone;
    }

    update(dt) {
        super.update(dt);
        this.lastDt = dt;
        this.moveStrategy.update(dt);
        this.fireCommand.update(dt);
    }
    
    behave() { 
        // On exécute toutes les commandes de mouvement
        this.moveStrategy.getMoveCommand().execute();

        // On applique les mouvements demandés
        this.gameObject.vector = Tools.normalize(this.gameObject.vector);   
        this.gameObject.position.x += this.gameObject.vector.x * this.gameObject.speed * this.lastDt;
        this.gameObject.position.y += this.gameObject.vector.y * this.gameObject.speed * this.lastDt;

        // On exécute toutes les commandes de tir
        this.fireCommand.execute();
    }
}
