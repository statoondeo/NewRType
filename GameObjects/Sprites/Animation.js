class Animation {
    constructor(name, frameList, speed, loop = false) {
        this.name = name;
        this.frameList = frameList;
        this.speed = speed;
        this.loop = loop;
        this.started = false
        this.frameTimer = 0;
        this.currentFrame = 0;
    }

    getClone() {
        let clone = new Animation(this.name, this.frameList, this.speed, this.loop);
        clone.started = this.started;
        return clone;
    }

    getCurrentFrame() {
        return this.frameList[this.currentFrame];
    }

    start(frame) {
        this.started = true;
        this.frameTimer = 0;
        this.currentFrame = frame;
    }

    update(dt) {
        if (this.started) {
            this.frameTimer += dt;
            if (this.frameTimer >= (this.currentFrame + 1) * this.speed) {
                this.currentFrame++;
                if (this.currentFrame >= this.frameList.length) {
                    if (this.loop) {
                        this.start(0);
                    }
                    else {
                        this.started = false;
                        this.currentFrame = this.frameList.length - 1;
                    }
                }
            }
        }
    }
}