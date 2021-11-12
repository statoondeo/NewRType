class StartableUIElementDecorator  extends BasePanelUIElementDecorator {
    constructor(panel, startingPoint, endPoint = 0) {
        super(panel);
        this.startingPoint = startingPoint;
        this.endPoint = endPoint;
        this.started = this.ended = false;
    }
    
    subjectChanged(scheduler) {
        if (!this.started && scheduler.currentStep >= this.startingPoint) {
            this.started = true;
            this.show();
        }
        if (this.endPoint != 0 && this.started && !this.ended && scheduler.currentStep >= this.endPoint) {
            this.ended = true;
            this.hide();
        }

    }
}
