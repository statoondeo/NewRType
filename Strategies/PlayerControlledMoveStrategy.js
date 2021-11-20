class PlayerControlledMoveStrategy extends BaseMoveStrategy {
    constructor(gameObject, initialVector = new Vec2()) {
        super(gameObject, initialVector);
    }

    update(dt) {
        // Initialisation du mouvement
        this.vector.x = this.vector.y = 0;

        // On exécute toutes les commandes demandées par le joueur
        let commands = Services.get("INPUT").handleInput();
        for (let index = 0, len = commands.length; index < len; index++) {
            const command = commands[index];
            command.execute();
        }

        // Application des mouvements demandés
        super.update(dt);

        // On contrôle qu'il ne soit pas hors de l'écran
        let screen = Services.get("SCREEN");
        this.gameObject.position.x = Tools.clamp(this.gameObject.position.x, 0, screen.width - this.gameObject.size.x);
        this.gameObject.position.y = Tools.clamp(this.gameObject.position.y, 0, screen.height - this.gameObject.size.y);
    }
}
