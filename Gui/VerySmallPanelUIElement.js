class VerySmallPanelUIElement extends PanelUIElement {
    static size = new Vec2(619, 330);
    constructor(position, visibility) {
        super(position, visibility);
        this.addElement(new SpriteUIElement(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("Images/Gui/verySmallPanel.png")));
    }
}