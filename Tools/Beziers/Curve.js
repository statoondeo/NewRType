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
class Curve {
    constructor(pt0, pt1, pt2, pt3, duration) {
        this.pt0 = pt0;
        this.pt1 = pt1;
        this.pt2 = pt2;
        this.pt3 = pt3;
        this.duration = duration;
        this.elapse = 0;

        this.pq1 = new Vec2();
        this.pq2 = new Vec2();
        this.pq3 = new Vec2();

        this.pr1 = new Vec2();
        this.pr2 = new Vec2();

        this.currentPoint = new Vec2(this.pt0.x, this.pt0.y);
    }

    isEnded() {
        return this.elapse >= this.duration;
    }

    getClone() {
        return new Curve(this.pt0.getClone(), this.pt1.getClone(), this.pt2.getClone(), this.pt3.getClone(), this.duration);
    }

    update(dt) {
        this.elapse += dt;
        let ratio = this.elapse / this.duration;

        this.pq1.x = Tools.lerp(this.pt0.x, this.pt1.x, ratio);
        this.pq1.y = Tools.lerp(this.pt0.y, this.pt1.y, ratio);        
        this.pq2.x = Tools.lerp(this.pt1.x, this.pt2.x, ratio);
        this.pq2.y = Tools.lerp(this.pt1.y, this.pt2.y, ratio);
        this.pq3.x = Tools.lerp(this.pt2.x, this.pt3.x, ratio);
        this.pq3.y = Tools.lerp(this.pt2.y, this.pt3.y, ratio);

        this.pr1.x = Tools.lerp(this.pq1.x, this.pq2.x, ratio);
        this.pr1.y = Tools.lerp(this.pq1.y, this.pq2.y, ratio);
        this.pr2.x = Tools.lerp(this.pq2.x, this.pq3.x, ratio);
        this.pr2.y = Tools.lerp(this.pq2.y, this.pq3.y, ratio);

        this.currentPoint.x = Tools.lerp(this.pr1.x, this.pr2.x, ratio);
        this.currentPoint.y = Tools.lerp(this.pr1.y, this.pr2.y, ratio);
    }

    getPoint() {
        return this.currentPoint;
    }
}