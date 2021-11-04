class PlayerControlledBehaveStrategy extends BaseStrategy {
    constructor(gameObject) {
        super(gameObject);
        this.lastDt = 0;
        
        let bullet = new BlueBulletGameObject(gameObject.partition);
        bullet.behaveStrategy = new BaseBehaveStrategy(bullet, new UniformMoveStrategy(bullet, new Vec2(1, 0)), new BaseFireStrategy(bullet));

        this.fireCommand = new DoubleFireCommand(this.gameObject, bullet, 0.4);
    }

    update(dt) {
        super.update(dt);
        this.fireCommand.update(dt);
        this.lastDt = dt;
        this.gameObject.vector.x = this.gameObject.vector.y = 0;
    }
    
    behave() { 
        // On exécute toutes les commandes demandées par le joueur
        ServiceLocator.getService(ServiceLocator.KEYBOARD).handleInput().forEach(command => {
            command.execute();
        });
        
        // On applique les mouvements demandés
        this.move();
    }

    move() {
        // On applique les mouvements demandés
        this.gameObject.vector = Tools.normalize(this.gameObject.vector);   
        this.gameObject.position.x += this.gameObject.vector.x * this.gameObject.speed * this.lastDt;
        this.gameObject.position.y += this.gameObject.vector.y * this.gameObject.speed * this.lastDt;
    }

    fire() {
        this.fireCommand.execute();
    }
}
