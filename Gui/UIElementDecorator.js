class UIElementDecorator extends UIElement {
    constructor(gameObject) {
        super();
        this.gameObject = gameObject;
        this.size = this.gameObject.size;
    }

    setPosition(position) {
        this.position = position;
        this.gameObject.position.x = position.x;
        this.gameObject.position.y = position.y;
    }

    setAlpha(alpha) {
        this.gameObject.globalAlpha = alpha;
    }

    getAlpha() {
        return this.gameObject.globalAlpha;
    }   

    update(dt) {
        this.gameObject.update(dt);
    }

    draw(context) {
        this.gameObject.draw(context);
    }
}