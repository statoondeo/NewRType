class BezierApexMoveStrategy extends BaseMoveStrategy {
    constructor(gameObject, curve) {
        super(gameObject, new Vec2(1));   
        this.curve = curve;
    }

    getClone(gameObject) {
        return new BezierApexMoveStrategy(gameObject, this.curve.getClone());
    }

    rotate(angle) {
        this.curve.rotate(angle);
    }

    update(dt) {
        this.curve.update(dt);
        if (this.gameObject.status == "ACTIVE" && this.curve.isEnded()) {
            this.gameObject.dieCommand.execute();
            // this.gameObject.status = GameObjectState.OUTDATED;
        }
        else {
            let nextPoint = this.curve.getPoint();
            this.gameObject.position.x = nextPoint.x;
            this.gameObject.position.y = nextPoint.y;
        }
    }
}

class RocketApexMoveStrategy extends BezierApexMoveStrategy {
    constructor(gameObject) {
        let screen = Services.get("SCREEN");

        // Le point de départ est le museau du vaisseau
        let departurePoint = new Vec2(gameObject.position.x + gameObject.size.x, gameObject.position.y + gameObject.size.y / 2);

        // Le point d'arrivée est toujours le bord de l'écran
        let arrivalPoint = new Vec2(screen.width + 100, gameObject.position.y + gameObject.size.y / 2);

        // On calcule 2 points aléatoires proches de la trajectoire rectiligne
        // le 1er dans les 10 premiers %, mais assez éloigné en hauteur
        // On choisit le sens en hauteur, pour l'inverser sur le second point
        let pt1 = new Vec2(Math.random() * (screen.width - gameObject.position.x) * 0.1 + gameObject.position.x, gameObject.position.y + gameObject.size.y / 2 + 10 * gameObject.size.y * (Math.random() - 0.5));

        // le second dans le 3eme quarts, mais assez proche en hauteur
        let distanceToBound = screen.width - gameObject.position.x;
        let pt2 = new Vec2(Math.random() * distanceToBound / 4 + gameObject.position.x + distanceToBound / 2, gameObject.position.y + gameObject.size.y / 2 + 10 * (Math.random() - 0.5) * gameObject.size.y);

        super(gameObject, new Curve(departurePoint, pt1, pt2, arrivalPoint, distanceToBound / gameObject.speed));
    }
    
    getClone(gameObject) {
        return new RocketApexMoveStrategy(gameObject);
    }
}