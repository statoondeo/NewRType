class PlayerControlledMoveStrategy extends BaseMoveStrategy {
    constructor(gameObject, initialVector) {
        super(gameObject, initialVector);
    }

    update(dt) {
        // Initialisation du mouvement
        this.vector.x = this.vector.y = 0;

        // On exécute toutes les commandes demandées par le joueur
        ServiceLocator.getService(ServiceLocator.KEYBOARD).handleInput().forEach(command => {
            command.execute();
        });

        // Application des mouvements demandés
        super.update(dt);
    }
}
