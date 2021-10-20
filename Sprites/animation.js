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
        let newAnimation = new Animation(this.name, this.frameList, this.speed, this.loop);
        newAnimation.started = this.started;
        return newAnimation;
    }

    getCurrentFrame() {
        return this.frameList[this.currentFrame];
    }

    start() {
        this.started = true;
        this.frameTimer = 0;
        this.currentFrame = 0;
    }

    update(dt) {
        if (this.started) {
            this.frameTimer += dt;
            if (this.frameTimer >= (this.currentFrame + 1) * this.speed) {
                this.currentFrame++;
                if (this.currentFrame >= this.frameList.length) {
                    if (this.loop) {
                        this.start();
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