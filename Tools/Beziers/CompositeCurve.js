class CompositeCurve {
    constructor(loop = false, number = 0) {
        this.curves = [];
        this.loop = loop;
        this.number = number;
        this.remainingLoop = this.number;
        this.currentCurveIndex = 0;
        this.currentCurve = null;
    }

    getClone() {
        let clone = new CompositeCurve(this.loop, this.number);
        this.curves.forEach(curve => {
            clone.addCurve(curve.getClone());
        });
        return clone;
    }

    addCurve(curve) {
        if (this.currentCurve == null) {
            this.currentCurve = curve;
        }
        this.curves.push(curve);
    }

    isEnded() {
        return this.currentCurveIndex >= this.curves.length;
    }

    reset() {
        this.currentCurveIndex = 0;
        this.currentCurve = this.curves[this.currentCurveIndex];
        this.curves.forEach(curve => {
            curve.reset();
        });
    }

    rotate(angle, origine = null) {
        this.curves.forEach(curve => {
            if (origine == null) {
                origine = curve.getPoints()[0];
            }
            curve.rotate(angle, origine);
        });
    }

    update(dt) {
        if (!this.isEnded()) {
            this.currentCurve.update(dt);
            if (this.currentCurve.isEnded()) {
                this.currentCurveIndex++;
                this.currentCurve = this.curves[this.currentCurveIndex];
                if (this.isEnded()) {
                    if (this.loop) {
                        this.remainingLoop--;
                        if (this.remainingLoop > 0 || this.number == 0) {
                            this.reset();
                            this.currentCurve.update(dt);
                        }
                    }
                }            
                else {
                    this.currentCurve.update(dt);
                }
            }
        }
    }

    getPoint() {
        return this.currentCurve.getPoint();
    }

    getPoints() {
        let points = [];
        this.curves.forEach(curve => {
            points.concat(curve.getPoints());
        });
        return points;
    }
}