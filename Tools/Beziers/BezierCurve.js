class BezierCurve {
    constructor(duration, pointsList) {
        this.duration = duration;
        this.pointsList = pointsList;
        this.elapse = 0;

        this.currentPoint = new Vec2(this.pointsList[0].x, this.pointsList[0].y);
    }

    isEnded() {
        return this.elapse >= this.duration;
    }

    getClone() {
        let cloneArray = []
        this.pointsList.forEach(point => {
            cloneArray.push(point.getClone());
        });
        return new BezierCurve(this.duration, cloneArray);
    }

    update(dt) {
        // Ou en est-on dans l'avancement sur la trajectoire
        this.elapse += dt;
        let ratio = this.elapse / this.duration;

        // On démarre avec la liste complète
        let table = this.pointsList

        // Tant qu'il reste des points à "lerper" on continue
        while(table.length > 1) {
            let newtable = [];

            // On "lerpe" chaque point avec le suivant
            for (let index = 0; index < table.length - 1; index++) {
                const item = table[index];
                const siblingItem = table[index + 1];

                // On conserve le résultat
                newtable.push(new Vec2(Tools.lerp(item.x, siblingItem.x, ratio), Tools.lerp(item.y, siblingItem.y, ratio)));   
            }

            // On switche les tables pour traiter celles avec les résultats les plus récents
            table = newtable;
        }

        // Le dernier point obtenu est la position courante sur la courbe
        this.currentPoint.x = table[0].x;
        this.currentPoint.y = table[0].y;
    }

    getPoint() {
        return this.currentPoint;
    }
}