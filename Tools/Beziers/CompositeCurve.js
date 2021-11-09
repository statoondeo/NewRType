class CompositeCurve {
    constructor() {
        this.curves = [];
        this.elapse = 0;
        this.currentCurveIndex = 0;
        this.currentCurve = null;
    }

    getClone() {
        let clone = new CompositeCurve();
        this.curves.forEach(curve => {
            clone.addCurve(curve.getClone());
        });
        return clone;
    }

    addCurve(curve) {
        this.curves.push(curve);
    }

    isEnded() {
        return this.currentCurveIndex >= this.curves.length;
    }

    update(dt) {
        if (this.currentCurveIndex < this.curves.length) {
            this.currentCurve = this.curves[this.currentCurveIndex];
            this.elapse += dt;
            if (this.currentCurve.isEnded()) {
                this.currentCurveIndex++;
                this.elapse = 0;
            }
            this.currentCurve.update(dt);
        }
    }

    getPoint() {
        return this.currentCurve.getPoint();
    }
}