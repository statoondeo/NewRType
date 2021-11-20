// Background static, c'est à dire qui ne bouge pas avec le scrolling.
// Utilisé pour faire la couleur de fond des niveaux,
// ou pour afficher une image dans les scènes qui ne bougent pas (menu ou autre)
class StaticLayer extends GameObject {
    constructor(layer, visual) {
        super();
        this.partition = "NEUTRAL_PARTITION";
        this.layer = layer;
        this.visual = visual;
    }

    draw(context) {
        this.visual.draw(context);
    }
}