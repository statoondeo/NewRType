class HorizontalLoopingMoveStrategy extends BaseMoveStrategy {
    constructor(gameObject, initialVector, radius, nbLoop) {
        super(gameObject, initialVector);
        this.radius = radius;   
        this.nbLoop = nbLoop;  

        // Timer général
        this.timer = 0;

        // Timer pour chaque étape
        let screen = ServiceLocator.getService(ServiceLocator.SCREEN);
        let distanceTotale = 2 * Math.PI * this.radius * this.nbLoop + screen.width + this.gameObject.size.x;
        let loopDistance = 2 * Math.PI * this.radius;
        this.advanceDistance = (screen.width + this.gameObject.size.x) / (this.nbLoop + 1);
        this.ttl = distanceTotale / this.gameObject.speed;
        this.loopTtl = loopDistance / distanceTotale * this.ttl;
        this.advanceTtl = this.advanceDistance / distanceTotale * this.ttl;

        // Etape du déplacement (advance ou loop)
        this.step = 0;

        // Sens du déplacement
        this.sens = new Vec2(this.initialVector.x / Math.abs(this.initialVector.x), this.initialVector.y / Math.abs(this.initialVector.y));

        // Angle atteint
        this.Initialangle = -this.sens.y * Math.PI / 2;
        this.angle = this.Initialangle;

        this.previousVector = new Vec2();
        this.currentVector = new Vec2();
    }

    getClone(gameObject){
        return new HorizontalLoopingMoveStrategy(gameObject, this.initialVector, this.radius, this.nbLoop);
    }

    update(dt) {
        this.previousVector.x = this.currentVector.x;
        this.previousVector.y = this.currentVector.y;
        this.currentVector.x = this.currentVector.y = 0;

        this.timer += dt;
        switch (this.step) {
            // Etape 1 : déplacement horizontal
            case 0:
                if (this.timer < this.advanceTtl) {
                    // Déroulement de l'étape du mouvement
                    this.currentVector.x = this.sens.x * this.advanceDistance * (this.timer / this.advanceTtl);
                }
                else {
                    this.step++;
                    this.timer = 0;
                    this.previousVector.x = this.currentVector.x = 0;
                } 
                break;

            // Etape 2 : déplacement en cercle
            case 1:
                if (this.timer < this.loopTtl) {
                    // Déroulement de l'étape du mouvement
                    this.currentVector.x = this.radius * Math.cos(this.angle);
                    this.currentVector.y = this.radius * (Math.sin(this.angle) - 1);
                    this.angle = this.Initialangle + this.sens.x * this.sens.y * 2 * Math.PI * (this.timer / this.loopTtl);
               }
                else {
                    // On passe à l'étape suivante du mouvement (avec rotation des étapes)
                    this.step = 0;
                    this.timer = 0;
                    this.previousVector.x = this.currentVector.x = 0;
                }
                break;
        }          

        this.vector.x = this.currentVector.x - this.previousVector.x;
        this.vector.y = this.currentVector.y - this.previousVector.y;
        this.vector = Tools.normalize(this.vector);
        this.vector.x *= dt;
        this.vector.y *= dt;
    }
}
