class SinWaveMoveStrategy extends BaseMoveStrategy {
    constructor(gameObject, initialVector, amplitude) {
        super(gameObject, initialVector);        
        this.amplitude = amplitude;
        this.totalDt = 0;
    }

    getClone(gameObject) {
        return new SinWaveMoveStrategy(gameObject, this.initialVector.getClone(), this.amplitude, this.frequency);
    }

    update(dt) {
        // Avancement dans le temps
        this.totalDt += dt;

        // Le déplacement en x est linéaire
        this.moveCommand.vector.x = this.initialVector.x * this.amplitude;

        // Le déplacement vertical est sinusoidal
        this.moveCommand.vector.y = this.initialVector.y + Math.sin(this.totalDt) * this.amplitude;
    }
}
