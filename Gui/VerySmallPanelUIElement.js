class BaseVerySmallPanelUIElement extends PanelUIElement {
    static size = new Vec2(619, 330);
    constructor(position, visibility, background) {
        super(position, visibility);
        this.addElement(new SpriteUIElement(background));
    }
}
class VerySmallPanelUIElement extends BaseVerySmallPanelUIElement {
    constructor(position, visibility) {
        super(position, visibility, Services.get(Services.ASSET).get("Images/Gui/verySmallPanel.png"));
    }
}
class RedVerySmallPanelUIElement extends BaseVerySmallPanelUIElement {
    constructor(position, visibility) {
        super(position, visibility, Services.get(Services.ASSET).get("Images/Gui/verySmallPanel2.png"));
    }
}