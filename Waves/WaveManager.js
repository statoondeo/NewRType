class WaveManager {
    constructor() {
        this.waves = new Manager();
    }

    addWave(wave) {
        this.waves.addItem(wave);
    }

    update(dt, currentStep) {
        // On fait avancer chaque vague ennemie, et on enregistre les vagues terminées pour les supprimer ensuite
        let wavesToKill = []
        this.waves.items.forEach(wave => {
            wave.update(dt, currentStep);
            if (wave.ended) {
                wavesToKill.push(wave);
            }
        });

        // Suppression des vagues terminées
        wavesToKill.forEach(wave => {
            this.waves.deleteItem(wave);
        });
    }

    draw(context) {
        this.waves.items.forEach(wave => {
            wave.draw(context);
        });
    }
}