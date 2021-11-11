class UIElement extends GameObject {
    constructor(visibility = false) {
        super();
        this.visibility = visibility;
        this.globalAlpha = this.visibility ? 1 : 0;
        this.partition = GameObjectPartition.NEUTRAL_PARTITION;
    }

    setPosition(position) {
        this.position = position;
    }

    setAlpha(alpha) {
        this.globalAlpha = alpha;
    }

    getAlpha() {
        return this.globalAlpha;
    }
}