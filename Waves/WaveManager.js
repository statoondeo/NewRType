class WaveManager extends Manager {
    constructor() {
        super();
        this.currentStep = 0;
    }

    addWave(wave) {
        this.addItem(wave);
    }

    update(dt) {
        // On fait avancer chaque vague ennemie, et on enregistre les vagues terminées pour les supprimer ensuite
        let wavesToKill = []
        this.items.forEach(wave => {
            wave.currentStep = this.currentStep;
            wave.update(dt);
            if (wave.ended) {
                wavesToKill.push(wave);
            }
        });

        // Suppression des vagues terminées
        wavesToKill.forEach(wave => {
            this.deleteItem(wave);
        });
    }

    draw(context) {
        this.items.forEach(wave => {
            wave.draw(context);
        });
    }
}