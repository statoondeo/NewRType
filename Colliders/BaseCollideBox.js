class Collider {
    static isPointInRectangle(point, rectangle) {
        return (rectangle.position.x <= point.x && point.x <= rectangle.position.x + rectangle.size.x &&
                rectangle.position.y <= point.y && point.y <= rectangle.position.y + rectangle.size.y);
    }
}

class BaseCollideBox {
    constructor() {
        this.type = BaseCollideBox.NONE;
    }

    static NONE = 0;
    static CIRCLE = 1;
    static RECT = 2;

    getClone() {
        return new BaseCollideBox();
    }

    draw(context) {
    }
}

class CircleCollideBox extends BaseCollideBox {
    constructor(position, radius) {
        super();
        this.type = BaseCollideBox.CIRCLE;
        this.position = position;
        this.radius = radius;
    }
    
    getClone() {
        return new CircleCollideBox(this.position, this.radius);
    }

    draw(context) {
        console.log("CircleCollideBox", this.position, this.radius);
        context.save();
        context.strokeStyle = "white";
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        context.stroke();
        context.restore();
    }
}

class RectCollideBox extends BaseCollideBox {
    constructor(position, size) {
        super();
        this.type = BaseCollideBox.RECT;
        this.position = position;
        this.size = size;
    }
        
    getClone() {
        return new RectCollideBox(this.position, this.width, this.height);
    }
    
    draw(context) {
        context.save();
        context.strokeStyle = "white";
        context.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y);
        context.restore();
    }
}