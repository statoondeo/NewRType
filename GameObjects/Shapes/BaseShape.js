class BaseShape extends GameObject {
    constructor(color) {
        super();
        this.color = color;
    }

    getClone() {
        let clone = super.getClone();
        clone.partition = this.partition;
        clone.color = this.color;
        return clone;
    }

    update(dt) {
        super.update(dt);
    }
}
