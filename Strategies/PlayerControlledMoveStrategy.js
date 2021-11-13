class PlayerControlledMoveStrategy extends BaseMoveStrategy {
    constructor(gameObject, initialVector) {
        super(gameObject, initialVector);
    }

    update(dt) {
        // Initialisation du mouvement
        this.vector.x = this.vector.y = 0;

        // On exécute toutes les commandes demandées par le joueur
        Services.get(Services.INPUT).handleInput().forEach(command => {
            command.execute();
        });

        // Application des mouvements demandés
        super.update(dt);

        // On contrôle qu'il ne soit pas hors de l'écran
        let screen = Services.get(Services.SCREEN);
        if (this.gameObject.position.x < 0) {
            this.gameObject.position.x = 0;
        } else if (this.gameObject.position.x + this.gameObject.size.x > screen.width) {
            this.gameObject.position.x = screen.width - this.gameObject.size.x; 
        }
        
        if (this.gameObject.position.y < 0) {
            this.gameObject.position.y = 0;
        } else if (this.gameObject.position.y + this.gameObject.size.y > screen.height) {
            this.gameObject.position.y = screen.height - this.gameObject.size.y; 
        }
    }
}
