class BaseScene {
    constructor(foregroundManager, backgroundManager, waveManager, sceneStart, player) {
        this.foregroundManager = foregroundManager;
        this.backgroundManager = backgroundManager;
        this.waveManager = waveManager;
        this.player = player;     
        this.currentStep = sceneStart;
        this.waveManager.currentStep = this.currentStep;
        this.foregroundManager.currentStep = this.currentStep;
        this.backgroundManager.currentStep = this.currentStep;
        this.baseSpeed = LayerManager.BASE_LAYER_SPEED;
        this.nextScene = null;
        this.isEnded = false;
    }

    start() {
        this.suscribe(this.backgroundManager);
    }

    isEnded() {
        return this.isEnded;
    }

    setNext(nextScene) {
        this.nextScene = nextScene;
    }

    getNext() {
        return this.nextScene;
    }

    update(dt) {
        // On avance dans la scène
        this.currentStep += this.baseSpeed * dt;

        // On fait avancer le background
        this.backgroundManager.update(dt);

        // On fait avancer le background
        this.foregroundManager.update(dt);

        // On fait avancer les vagues d'ennemis
        this.waveManager.update(dt);

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

        // On dessine le backgroundManager
        this.foregroundManager.draw(context);
    }
}