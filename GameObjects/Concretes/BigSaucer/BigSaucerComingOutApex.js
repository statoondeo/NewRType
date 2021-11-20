class BigSaucerComingOutApex extends CompositeCurve {
    constructor(size) {
        super();
        this.size = size;
        let screen = Services.get("SCREEN");
        
        // Points caractéristiques de la courbe
        let pt1 = new Vec2(screen.width, 0);
        let pt2 = new Vec2();
        let pt3 = new Vec2(0, (screen.height - this.size.y) / 2);
        let pt4 = new Vec2((screen.width - this.size.x) / 2, (screen.height - this.size.y) / 2);
        let pt5 = new Vec2(screen.width - this.size.x, (screen.height - this.size.y) / 2);
        let pt6 = new Vec2(screen.width - this.size.x, screen.height - this.size.y);
        let pt7 = new Vec2((screen.width - this.size.x) / 2, screen.height - this.size.y);
        let pt8 = new Vec2(0, screen.height - this.size.y);
        let pt9 = new Vec2(screen.width - this.size.x, 0);
        let pt10 = new Vec2(-this.size.x, 0);

        // Trajectoire en huit
        this.addCurve(new BezierCurve(8, [ pt1, pt2, pt3, pt4 ]));
        this.addCurve(new BezierCurve(8, [ pt4, pt5, pt6, pt7 ]));
        this.addCurve(new BezierCurve(8, [ pt7, pt8, pt3, pt4 ]));
        this.addCurve(new BezierCurve(8, [ pt4, pt5, pt9, pt10 ]));        
    }

    getClone() {
        return new BigSaucerComingOutApex(this.size);
    }
}