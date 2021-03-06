class GameObject {
    constructor() {
        this.type = "NONE";
        this.position = new Vec2();
        this.size = new Vec2();
        this.vector = new Vec2();
        this.speed = 0;
        this.collideBox = new BaseCollideBox();
        this.status = "ACTIVE";
        this.layer = 1;
        this.partition = "GAME_PARTITION";
        this.maxLife = 0;
        this.life = 0;
        this.moveStrategy = new DummyMoveStrategy();
        this.fireCommand = new DummyCommand();
        this.collideCommand = new DummyCommand();
        this.dealDamageCommand = new DummyCommand();
        this.dieCommand = new CompositeCommand();
        this.dieCommand.addCommand(new DieCommand(this));
        this.takeDamage = new DummyCommand();
    }

    damage(amount) {
        this.life -= amount;
        if (this.life <= 0) {
            this.life = Tools.clamp(this.life, 0, this.maxLife);
            this.dieCommand.execute();
        }
    }    

    // Mise à jour du gameObject
    // Les comportements sont modélisés dans des commandes
    update(dt) {
        // Mise à jour et application du movement
        this.moveStrategy.update(dt);

        // Mise à jour des commandes
        this.fireCommand.update(dt);
        this.collideCommand.update(dt);
        this.dealDamageCommand.update(dt);
        this.dieCommand.update(dt);

        // Mise à jour de la boite de collision
        this.collideBox.update(dt);
    }

    // Affichage du gameObject
    draw(context) {
        if (Services.get("PARAMETER").colliderDisplay) {
            this.collideBox.draw(context);
        }
    }
}