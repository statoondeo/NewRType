class HorizontalLoopingMovePattern extends BaseMovePattern {
    constructor(ttl, initialVector, radius, nbLoop, spriteSize) {
        super(initialVector);
        this.ttl = ttl;
        this.radius = radius;   
        this.nbLoop = nbLoop; 
        this.spriteSize = spriteSize;   

        // Timer général
        this.timer = 0;

        // Timer pour chaque étape
        let screen = ServiceLocator.getService(ServiceLocator.SCREEN);
        let distanceTotale = 2 * Math.PI * this.radius * this.nbLoop + screen.width + this.spriteSize.x;
        let loopDistance = 2 * Math.PI * this.radius;
        this.advanceDistance = (screen.width + this.spriteSize.x) / (this.nbLoop + 1);

        this.loopTtl = loopDistance / distanceTotale * this.ttl;
        this.advanceTtl = this.advanceDistance / distanceTotale * this.ttl;

        // Etape du déplacement
        this.step = 0;

        // Sens du déplacement
        this.sensX = this.initialVector.x / Math.abs(this.initialVector.x);

        // Angle atteint
        this.Initialangle = Math.PI / 2;
        this.angle = this.Initialangle;

        this.currentVector = new Vec2();
    }

    getClone() {
        return (new HorizontalLoopingMovePattern(this.ttl, this.initialVector.getClone(), this.radius, this.nbLoop, this.spriteSize));
    }

    update(dt) {
        this.previousVector = this.currentVector;
        this.currentVector = new Vec2();
        this.updateHorizontalMove(dt);
        this.vector = new Vec2(this.currentVector.x - this.previousVector.x, this.currentVector.y - this.previousVector.y)
    }

    updateHorizontalMove(dt) {
        this.timer += dt;

        switch (this.step) {
            // Etape 1 du déplacement horizontal
            case 0:
                if (this.timer < this.advanceTtl) {
                    // Déroulement de l'étape du mouvement
                    this.currentVector.x = this.sensX * this.advanceDistance * (this.timer / this.advanceTtl);
                }
                else {
                    // On passe à l'étape suivante du mouvement (avec rotation des étapes)
                    this.step++;
                    this.timer = 0;
                    this.previousVector.x = this.currentVector.x = 0;
                } 
                break;

            // Etape 2 du déplacement horizontal
            case 1:
                if (this.timer < this.loopTtl) {
                    // Déroulement de l'étape du mouvement
                    this.currentVector.x = this.radius * Math.cos(this.angle);
                    this.currentVector.y = this.radius * (Math.sin(this.angle) - 1);
                    this.angle = this.Initialangle + 2 * Math.PI * (this.timer / this.loopTtl);
               }
                else {
                    // On passe à l'étape suivante du mouvement (avec rotation des étapes)
                    this.step = 0;
                    this.timer = 0;
                    this.previousVector.x = this.currentVector.x = 0;
                }
                break;
        }    

    }
}