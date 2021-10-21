class HorizontalLoopingMovePattern extends baseMovePattern {
    constructor(screen, ttl, horizontalAmplitude, verticalAmplitude, initialVector, spriteSize) {
        super(initialVector);
        this.screen = screen;
        this.ttl = ttl;
        this.horizontalAmplitude = horizontalAmplitude;
        this.verticalAmplitude = verticalAmplitude;
        this.spriteSize = spriteSize;
        this.previousVector = new Vec2();
        this.currentVector = new Vec2();

        // Timer générall
        this.timer = new Vec2();

        // Timer pour chaque étape
        this.nbstepH = 3
        this.step1HTimer = this.ttl / this.nbstepH;
        this.step2HTimer = this.ttl / this.nbstepH;
        this.step3HTimer = this.ttl / this.nbstepH;

        this.nbstepV = 2
        this.step1VTimer = this.ttl / this.nbstepV;
        this.step2VTimer = this.ttl / this.nbstepV;

        // Etape du déplacement
        this.step = new Vec2(0, 0);
    }

    getClone() {
        return (new HorizontalLoopingMovePattern(this.screen, this.ttl, this.horizontalAmplitude, this.verticalAmplitude, this.initialVector.getClone(), this.spriteSize.getClone()));
    }

    update(dt) {
        this.previousVector = this.currentVector;
        this.updateHorizontalMove(dt);
        this.updateVerticalMove(dt);
        this.vector = new Vec2(this.currentVector.x - this.previousVector.x, this.currentVector.y - this.previousVector.y)
    }

    updateHorizontalMove(dt) {
        this.timer.x += dt;
        switch (this.step.x) {
            // Etape 1 du déplacement horizontal
            case 0:
                if (this.timer.x < this.step1HTimer) {
                    // Déroulement de l'étape du mouvement
                    this.currentVector = new Vec2(this.initialVector.x * this.screen.width * this.horizontalAmplitude * easeOutCubic(this.timer.x / this.step1HTimer), this.currentVector.y);
                }
                else {
                    // On passe à l'étape suivante du mouvement (avec rotation des étapes)
                    this.step.x++;
                    this.step.x %= this.nbstepH;
                    this.timer.x = 0;
                    this.previousVector.x = this.currentVector.x = 0;
                    this.initialVector.x *= -1;
                }
                break;

            // Etape 2 du déplacement horizontal
            case 1:
                if (this.timer.x < this.step2HTimer) {
                    // Déroulement de l'étape du mouvement
                    this.currentVector = new Vec2(this.initialVector.x * (this.screen.width * this.horizontalAmplitude - this.spriteSize.x) * easeInOutCubic(this.timer.x / this.step2HTimer), this.currentVector.y);
                }
                else {
                    // On passe à l'étape suivante du mouvement (avec rotation des étapes)
                    this.step.x++;
                    this.step.x %= this.nbstepH;
                    this.timer.x = 0;
                    this.previousVector.x = this.currentVector.x = 0;
                    this.initialVector.x *= -1;
                }
                break;
                
            // Etape 3 du déplacement horizontal
            case 2:
                if (this.timer.x < this.step3HTimer) {
                    // Déroulement de l'étape du mouvement
                    this.currentVector = new Vec2(this.initialVector.x * (this.screen.width * this.horizontalAmplitude - this.spriteSize.x) * easeInCubic(this.timer.x / this.step3HTimer), this.currentVector.y);
                }
                else {
                    // On passe à l'étape suivante du mouvement (avec rotation des étapes)
                    this.step.x++;
                    this.step.x = 0;
                    this.timer.x = 0;
                    this.previousVector.x = this.currentVector.x = 0;
                    // this.initialVector.y *= -1;
                }
                break;
        }       
    }
    
    updateVerticalMove(dt) {
        this.timer.y += dt;
        switch (this.step.y) {
            // Etape 1 du déplacement horizontal
            case 0:
                if (this.timer.y < this.step1VTimer) {
                    // Déroulement de l'étape du mouvement
                    this.currentVector = new Vec2(this.currentVector.x, this.initialVector.y * (this.screen.height * this.verticalAmplitude - this.spriteSize.y) * easeInOutCubic(this.timer.y / this.step1VTimer));
                }
                else {
                    // On passe à l'étape suivante du mouvement (avec rotation des étapes)
                    this.step.y++;
                    this.step.y %= this.nbstepV;
                    this.timer.y = 0;
                    this.previousVector.y = this.currentVector.y = 0;
                    this.initialVector.y *= -1;
                }
                break;

            // Etape 2 du déplacement horizontal
            case 1:
                if (this.timer.y < this.step2VTimer) {
                    // Déroulement de l'étape du mouvement
                    this.currentVector = new Vec2(this.currentVector.x, this.initialVector.y * (this.screen.height * this.verticalAmplitude - this.spriteSize.y) * easeInOutCubic(this.timer.y / this.step2VTimer));
                }
                else {
                    // On passe à l'étape suivante du mouvement (avec rotation des étapes)
                    this.step.y++;
                    this.step.y %= this.nbstepV;
                    this.timer.y = 0;
                    this.previousVector.y = this.currentVector.y = 0;
                    this.initialVector.y *= -1;
                }
                break;
        }       
    }
}