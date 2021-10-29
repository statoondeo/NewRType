class BaseFireCommand {
    constructor(entity, sprite, fireRate) {
        this.entity = entity;
        this.sprite = sprite;
        this.fireRate = fireRate;
        this.currentTtl = this.fireRate;
    }

    getClone() {
        return new BaseFireCommand(null, null, null);
    }

    update(dt) {
        if (this.currentTtl > 0) {
            this.currentTtl -= dt;
            if (this.currentTtl <= 0) {
                this.currentTtl = 0;
            }
        }
    }

    execute() {
        if (this.currentTtl == 0) {
            this.currentTtl = this.fireRate;
        }
    }
}