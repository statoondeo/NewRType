class BaseMoveStrategy extends BaseStrategy {
    constructor(gameObject, initialVector = new Vec2()) {
        super(gameObject);
        this.initialVector = Tools.normalize(initialVector);
        this.vector = new Vec2();
    }

    getClone(gameObject) {
        return new BaseMoveStrategy(gameObject, this.initialVector.getClone());
    }

    update(dt) {
        // On applique les mouvements demandés
        this.vector = Tools.normalize(this.vector);   
        this.gameObject.position.x += this.vector.x * this.gameObject.speed * dt;
        this.gameObject.position.y += this.vector.y * this.gameObject.speed * dt;    
    }
}