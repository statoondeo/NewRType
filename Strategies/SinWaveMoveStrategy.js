class SinWaveMoveStrategy extends BaseMoveStrategy {
    constructor(gameObject, initialVector, amplitude, initialDt = 0) {
        super(gameObject, initialVector);        
        this.amplitude = amplitude;
        this.totalDt = initialDt;
    }

    getClone(gameObject) {
        return new SinWaveMoveStrategy(gameObject, this.initialVector.getClone(), this.totalDt);
    }

    update(dt) {
        // Avancement dans le temps
        this.totalDt += dt;

        // Le déplacement en x est linéaire
        this.vector.x = this.initialVector.x * this.amplitude;

        // Le déplacement vertical est sinusoidal
        this.vector.y = this.initialVector.y + Math.sin(this.totalDt) * this.amplitude;

        // Application du mouvement
        super.update(dt);

        if (this.gameObject.status == "ACTIVE" && Tools.isOutOfScreen(this.gameObject.position, this.gameObject.size)) {
            this.gameObject.status = "OUTDATED";
        }
    }
}
