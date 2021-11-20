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
    constructor(panel, miniature) {
        super(panel, miniature, new Vec2(92, 96));
    }
}
class RedMiniaturePanelUIElementDecorator extends BaseMiniaturePanelUIElementDecorator {
    constructor(panel, miniature) {
        super(panel, miniature, new Vec2(527, 96));
    }
}