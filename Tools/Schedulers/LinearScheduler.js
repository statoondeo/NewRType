class LinearScheduler extends BaseScheduler {
    constructor(speed, startingStep = 0) {
        super();
        this.speed = speed;
        this.currentStep = startingStep;
    }

    update(dt) {
        super.update(dt);
        
        // Avancement linéaire du currentStep
        this.currentStep += this.speed * this.getDeltaTime(); 
        this.notify();
    }
}
