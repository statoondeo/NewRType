class BasePanelUIElement extends PanelUIElement {
    static size = new Vec2(619, 614);
    constructor(position, visibility, background, sound) {
        super(position, BasePanelUIElement.size, visibility, sound);
        this.addElement(new SpriteUIElement(background));
    }
}
class SmallPanelUIElement extends BasePanelUIElement {
    constructor(position, visibility) {
        super(position, visibility, Services.get(Services.ASSET).get("Images/Gui/smallPanel.png"), Services.get(Services.ASSET).get("Sounds/Digital_panel_v1_variation_01_wav.wav"));
    }
}
class RedSmallPanelUIElement extends BasePanelUIElement {
    constructor(position, visibility) {
        super(position, visibility, Services.get(Services.ASSET).get("Images/Gui/smallPanel2.png"), Services.get(Services.ASSET).get("Sounds/Digital_panel_v1_variation_02_wav.wav"));
    }
}