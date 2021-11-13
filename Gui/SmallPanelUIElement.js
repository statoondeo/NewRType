class SmallPanelUIElement extends PanelUIElement {
    static size = new Vec2(619, 614);
    constructor(position, visibility) {
        super(position, visibility);
        this.addElement(new SpriteUIElement(Services.get(Services.ASSET).getImage("Images/Gui/smallPanel.png")));
    }
}