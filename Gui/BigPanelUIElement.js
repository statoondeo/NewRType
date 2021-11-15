class BigPanelUIElement extends PanelUIElement {
    static size = new Vec2(1280, 800);
    constructor(position, visibility) {
        super(position, BigPanelUIElement.size, visibility);
        this.addElement(new SpriteUIElement(Services.get(Services.ASSET).get("Images/Gui/bigPanel.png")));
     }
}
