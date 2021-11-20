class BaseBigPanelUIElement extends PanelUIElement {
    constructor(position, visibility, background) {
        super(position, new Vec2(1280, 800), visibility);
        this.addElement(new SpriteUIElement(background));
     }
}
class BigPanelUIElement extends BaseBigPanelUIElement {
    constructor(position, visibility) {
        super(position, visibility, Services.get("ASSET").get("Images/Gui/bigPanel.png"));
     }
}
class BlueBigPanelUIElement extends BaseBigPanelUIElement {
    constructor(position, visibility) {
        super(position, visibility, Services.get("ASSET").get("Images/Gui/bigPanel1.png"));
     }
}
class RedBigPanelUIElement extends BaseBigPanelUIElement {
    constructor(position, visibility) {
        super(position, visibility, Services.get("ASSET").get("Images/Gui/bigPanel2.png"));
     }
}

