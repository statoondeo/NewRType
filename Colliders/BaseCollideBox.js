class BaseCollideBox {
    constructor() {
        this.type = BaseCollideBox.NONE;
        this.isCollided = false;
        this.color = BaseCollideBox.NOT_COLLIDED_COLOR;
    }

    static NONE = 0;
    static CIRCLE = 1;
    static RECT = 2;

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