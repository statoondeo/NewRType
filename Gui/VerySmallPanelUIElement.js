class BaseVerySmallPanelUIElement extends PanelUIElement {
    constructor(position, visibility, background, sound) {
        super(position, new Vec2(619, 330), visibility, sound);
        this.addElement(new SpriteUIElement(background));
    }
}
class VerySmallPanelUIElement extends BaseVerySmallPanelUIElement {
    constructor(position, visibility) {
        super(position, visibility, Services.get("ASSET").get("Images/Gui/verySmallPanel.png"), Services.get("AUDIO")["Sounds/Digital_panel_v1_variation_01_wav.wav"]);
    }
}
class RedVerySmallPanelUIElement extends BaseVerySmallPanelUIElement {
    constructor(position, visibility) {
        super(position, visibility, Services.get("ASSET").get("Images/Gui/verySmallPanel2.png"), Services.get("AUDIO")["Sounds/Digital_panel_v1_variation_02_wav.wav"]);
    }
}