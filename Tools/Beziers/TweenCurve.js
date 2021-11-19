class TweenCurve {
    constructor(duration, originPoint, destinationPoint, tweeningFunction) {
        this.duration = duration;
        this.originPoint = originPoint;
        this.destinationPoint = destinationPoint;
        this.tweeningFunction = tweeningFunction;
        this.elapse = 0;
        this.currentPoint = new Vec2(this.originPoint.x, this.originPoint.y);
    }

    reset() {
        this.elapse = 0;
    }

    isEnded() {
        return this.elapse >= this.duration;
    }

    getClone() {
        return new TweenCurve(this.duration, this.originPoint, this.destinationPoint, this.tweeningFunction);
    }

    rotatePoint(point, origin, angle) {
        let newAngle = Math.atan2(point.y - origin.y, point.x - origin.x) + angle;
        let longueur = Tools.distance(point, origin);
        return new Vec2(origin.x + longueur * Math.cos(newAngle), origin.y + longueur * Math.sin(newAngle));
    }

    rotate(angle, origine = null) {
        let point = new Vec2();
        if (origine == null) {
            point.x = originPoint.x;
            point.y = originPoint.y;
        }
        else {
            originPoint = this.rotatePoint(originPoint, origine, angle);
            point.x = origine.x;
            point.y = origine.y;
        }

        this.destinationPoint = this.rotatePoint(destinationPoint, point, angle);
    }

    update(dt) {
        // Ou en est-on dans l'avancement sur la trajectoire
        this.elapse += dt;
        let ratio = Tools.clamp(this.elapse / this.duration, 0, 1);

        // On démarre avec la liste complète

        // Le dernier point obtenu est la position courante sur la courbe
        this.currentPoint.x = this.tweeningFunction(ratio) * (this.destinationPoint.x - this.originPoint.x) + this.originPoint.x;
        this.currentPoint.y = this.tweeningFunction(ratio) * (this.destinationPoint.y - this.originPoint.y) + this.originPoint.y;
    }

    getPoint() {
        return this.currentPoint;
    }
    
    getPoints() {
        return [ this.originPoint, this.destinationPoint ];
    }
}