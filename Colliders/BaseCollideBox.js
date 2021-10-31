class BaseCollideBox {
    constructor() {
        this.type = BaseCollideBox.NONE;
        this.isCollided = false;
        this.color = BaseCollideBox.NOT_COLLIDED_COLOR;
    }

    static NONE = "NONE";
    static CIRCLE = "CIRCLE";
    static RECT = "RECT";

    static NEUTRAL_COLOR = "gray";
    static COLLIDED_COLOR = "red";
    static NOT_COLLIDED_COLOR = "green";

    getClone() {
        return new BaseCollideBox();
    }

    update(dt) {
        this.color = this.isCollided ? BaseCollideBox.COLLIDED_COLOR : BaseCollideBox.NOT_COLLIDED_COLOR;
    }

    draw(context) {
    }
}