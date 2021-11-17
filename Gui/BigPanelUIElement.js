class BaseBigPanelUIElement extends PanelUIElement {
    static size = new Vec2(1280, 800);
    constructor(position, visibility, background) {
        super(position, BaseBigPanelUIElement.size, visibility);
        this.addElement(new SpriteUIElement(background));
     }
}
class BigPanelUIElement extends BaseBigPanelUIElement {
    constructor(position, visibility) {
        super(position, visibility, Services.get(Services.ASSET).get("Images/Gui/bigPanel.png"));
     }
}
class BlueBigPanelUIElement extends BaseBigPanelUIElement {
    constructor(position, visibility) {
        super(position, visibility, Services.get(Services.ASSET).get("Images/Gui/bigPanel1.png"));
     }
}
class RedBigPanelUIElement extends BaseBigPanelUIElement {
    constructor(position, visibility) {
        super(position, visibility, Services.get(Services.ASSET).get("Images/Gui/bigPanel2.png"));
     }
}

