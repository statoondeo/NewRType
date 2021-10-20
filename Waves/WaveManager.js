class WaveManager {
    constructor() {
        this.waves = [];
    }

    addWave(wave) {
        this.waves.push(wave);
    }

    deleteWave(wave) {
        let index = this.waves.indexOf(wave);
        this.waves.splice(index, 1);        
    }

    update(dt, currentStep) {
        // On fait avancer chaque vague ennemie, et on enregistre les vagues terminées pour les supprimer ensuite
        let wavesToKill = []
        this.waves.forEach(wave => {
            wave.update(dt, currentStep);
            if (wave.ended) {
                wavesToKill.push(wave);
            }
        });

        // Suppression des vagues terminées
        wavesToKill.forEach(wave => {
            this.deleteWave(wave);
        });

    }

    draw(context) {
        this.waves.forEach(wave => {
            wave.draw(context);
        });
    }
}