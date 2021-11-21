class PlayerEntranceMoveStrategy extends BezierApexMoveStrategy {
    constructor(gameObject) {
        let pt0 = new Vec2(-64, 0);
        let pt1 = new Vec2(1236, 0);
        let pt2 = new Vec2(1236, 736);
        let pt3 = new Vec2(640, 736);

        let pt5 = new Vec2(0, 736);
        let pt6 = new Vec2(0, 368);
        let pt7 = new Vec2(608, 368);

        let curve = new CompositeCurve(false);
        curve.addCurve(new TweenCurve(2, pt0, pt0, Easing.easeInOutCubic));
        curve.addCurve(new BezierCurve(2, [ pt0, pt1, pt2, pt3 ]));
        curve.addCurve(new BezierCurve(2, [ pt3, pt5, pt6, pt7 ]));

        super(gameObject, curve);   
        this.started = false;
    }

    getClone(gameObject) {
        return new PlayerEntranceMoveStrategy(gameObject);
    }

    update(dt) {
        this.curve.update(dt);

        if (!this.started && this.curve.curves[0].isEnded()) {
            this.started = true;
            Services.get("AUDIO")["Sounds/Stinger_v2_wav.wav"].play();
        }

        if (this.curve.isEnded()) {
            this.gameObject.flashLayer.show();
            this.gameObject.damageSound.play();
            this.gameObject.moveStrategy = new PlayerControlledMoveStrategy(this.gameObject);
        }
        else {
            let nextPoint = this.curve.getPoint();
            this.gameObject.position.x = nextPoint.x;
            this.gameObject.position.y = nextPoint.y;    
        }
    }
}
