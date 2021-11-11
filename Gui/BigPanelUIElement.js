class BigPanelUIElement extends PanelUIElement {
    static size = new Vec2(1280, 800);
    constructor(position, visibility) {
        super(position, BigPanelUIElement.size, visibility);
        this.addElement(new SpriteUIElement(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("Images/Gui/bigPanel.png")));
     }
}
