// Classe de base de définition des missiles
// Par défaut un missile qui sort de l'écran est détruit
class BaseBullet extends GameObject {
    constructor() {
        super();
    }

    getClone() {
        return new BaseBullet();
    }

    update(dt) {
        if (Tools.isOutOfScreen(this.position, this.size)) {
            this.status = GameObject.OUTDATED;
        }
    }
}