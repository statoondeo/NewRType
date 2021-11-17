class BaseVerySmallPanelUIElement extends PanelUIElement {
    static size = new Vec2(619, 330);
    constructor(position, visibility, background, sound) {
        super(position, BaseVerySmallPanelUIElement.size, visibility, sound);
        this.addElement(new SpriteUIElement(background));
    }
}
class VerySmallPanelUIElement extends BaseVerySmallPanelUIElement {
    constructor(position, visibility) {
        super(position, visibility, Services.get(Services.ASSET).get("Images/Gui/verySmallPanel.png"), Services.get(Services.ASSET).get("Sounds/Digital_panel_v1_variation_01_wav.wav"));
    }
}
class RedVerySmallPanelUIElement extends BaseVerySmallPanelUIElement {
    constructor(position, visibility) {
        super(position, visibility, Services.get(Services.ASSET).get("Images/Gui/verySmallPanel2.png"), Services.get(Services.ASSET).get("Sounds/Digital_panel_v1_variation_02_wav.wav"));
    }
}