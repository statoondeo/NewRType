class BaseLayer {
    constructor(speedRatio) {
        this.speedRatio = speedRatio;
        this.currentGlobalStep = this.currentStep = 0;
    }

    update(dt) {
        this.currentStep = this.currentGlobalStep * this.speedRatio;
    }
 
    draw(context) {
    }

    getSpeedRatio() {
        return this.speedRatio;
    }
}