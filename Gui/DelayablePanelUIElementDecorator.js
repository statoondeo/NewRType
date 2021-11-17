class DelayablePanelUIElementDecorator extends BasePanelUIElementDecorator {
    constructor(panel, delay, duration = 0) {
        super(panel)
        this.started = false;
        this.showned = false;
        this.duration = duration;
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
                this.showned = true;
                this.ttl = this.duration;
            }
        }
        if (this.showned && this.duration != 0) {
            this.ttl -= dt;
            if (this.ttl < 0) {
                super.hide();
                this.showned = false;
            }
        }
    }
}