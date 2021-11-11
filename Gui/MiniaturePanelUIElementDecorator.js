class MiniaturePanelUIElementDecorator extends BasePanelUIElementDecorator {
    static miniatureOffset = new Vec2(92, 96)
    constructor(panel, miniature) {
        super(panel);
        this.miniature = miniature;
        this.miniature.position.x = MiniaturePanelUIElementDecorator.miniatureOffset.x - this.miniature.size.x / 2;
        this.miniature.position.y = MiniaturePanelUIElementDecorator.miniatureOffset.y - this.miniature.size.y / 2;
        this.addElement(this.miniature);
    }
}