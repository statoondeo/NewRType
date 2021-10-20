class Scene {
    constructor(backgroundManager, waveManager, sceneStart, player) {
        this.backgroundManager = backgroundManager;
        this.waveManager = waveManager;
        this.player = player;
        this.currentStep = sceneStart;
        this.baseSpeed = 60;
    }

    start() {
        this.suscribe(this.backgroundManager);
    }

    update(dt) {
        // On avance dans la scène
        this.currentStep += this.baseSpeed * dt;

        // On fait avancer le background
        this.backgroundManager.update(dt, this.currentStep);

        // On fait avancer les vagues d'ennemis
        this.waveManager.update(dt, this.currentStep);

        // On met à jour le vaisseau du joueur
        this.player.update(dt);
    }

    draw(context) {
        // On dessine le backgroundManager
        this.backgroundManager.draw(context);

        // On dessine le waveManager
        this.waveManager.draw(context);        

        // On dessine le vaisseau du joueur
        this.player.draw(context);
    }
}