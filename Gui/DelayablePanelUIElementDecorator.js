class DelayablePanelUIElementDecorator extends BasePanelUIElementDecorator {
    constructor(panel, delay) {
        super(panel)
        this.started = false;
        this.ttl = delay;
    }

    show() {
        this.started = true;
    }

    update(dt) {
        this.panel.update(dt);
        if (this.started) {
            this.ttl -= dt;
            if (this.ttl < 0) {
                super.show();
                this.started = false;
            }
        }
    }
}