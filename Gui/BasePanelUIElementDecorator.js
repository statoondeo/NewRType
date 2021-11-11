class BasePanelUIElementDecorator  extends PanelUIElement {
    constructor(panel) {
        super(panel.visibility);
        this.panel = panel;
    }

    addElement(element) {
        this.panel.addElement(element);
    }

    setVisibility(visibility) {
        this.panel.setVisibility(visibility);
    }

    setAlpha(alpha) {
        this.panel.setAlpha(alpha);
    }

    getAlpha() {
        this.panel.getAlpha();
    }

    hide() {
        this.panel.hide();
    }

    show() {
        this.panel.show();
    }

    update(dt) {
        this.panel.update(dt);
    }

    draw(context) {
        this.panel.draw(context);
    }    
}