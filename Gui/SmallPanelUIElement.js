class BasePanelUIElement extends PanelUIElement {
    static size = new Vec2(619, 614);
    constructor(position, visibility, background) {
        super(position, visibility);
        this.addElement(new SpriteUIElement(background));
    }
}
class SmallPanelUIElement extends BasePanelUIElement {
    constructor(position, visibility) {
        super(position, visibility, Services.get(Services.ASSET).get("Images/Gui/smallPanel.png"));
    }
}
class RedSmallPanelUIElement extends BasePanelUIElement {
    constructor(position, visibility) {
        super(position, visibility, Services.get(Services.ASSET).get("Images/Gui/smallPanel2.png"));
    }
}