// Background static, c'est à dire qui ne bouge pas avec le scrolling.
// Utilisé pour faire la couleur de fond des niveaux,
// ou pour afficher une image dans les scènes qui ne bougent pas (menu ou autre)
class StaticLayer extends GameObject {
    constructor(layer, visual) {
        super();
        this.layer = layer;
        this.visual = visual;
    }

    update(dt) {
        super.update(dt);
    }

    draw(context) {
        this.visual.draw(context);
    }
}