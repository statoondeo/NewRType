class BaseMiniaturePanelUIElementDecorator extends BasePanelUIElementDecorator {
    constructor(panel, miniature, offset) {
        super(panel);
        this.offset = offset;
        this.miniature = miniature;
        this.miniature.position.x = this.offset.x - this.miniature.size.x / 2;
        this.miniature.position.y = this.offset.y - this.miniature.size.y / 2;
        this.addElement(this.miniature);
    }
}
class MiniaturePanelUIElementDecorator extends BaseMiniaturePanelUIElementDecorator {
    static miniatureOffset = new Vec2(92, 96)
    constructor(panel, miniature) {
        super(panel, miniature, MiniaturePanelUIElementDecorator.miniatureOffset);
    }
}
class RedMiniaturePanelUIElementDecorator extends BaseMiniaturePanelUIElementDecorator {
    static miniatureOffset = new Vec2(527, 96)
    constructor(panel, miniature) {
        super(panel, miniature, RedMiniaturePanelUIElementDecorator.miniatureOffset);
    }
}