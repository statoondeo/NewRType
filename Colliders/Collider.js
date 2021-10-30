class Collider {
    // Y a t'il collision entre nos 2 collideBox?
    static isCollision(baseCollideBox1, baseCollideBox2) {
        switch (baseCollideBox1.type) {
            case BaseCollideBox.CIRCLE :
                return Collider.isCircleCollision(baseCollideBox1, baseCollideBox2);
                break;
            case BaseCollideBox.RECT :
                return Collider.isRectCollision(baseCollideBox1, baseCollideBox2);
                break;
        }
        return false;
    }

    // Y a t'il collision entre notre rectangle et l'autre collideBox?
    static isRectCollision(rectCollideBox, baseCollideBox) {
        switch (baseCollideBox.type) {
            case BaseCollideBox.RECT :
                return Collider.isRectangleInRectangle(rectCollideBox, baseCollideBox);
                break;
            case BaseCollideBox.CIRCLE :
                return Collider.isCircleInRectangle(baseCollideBox, rectCollideBox);
                break;
        }
        return false;
    }

    // Y a t'il collision entre notre cercle et l'autre collideBox?
    static isCircleCollision(circleCollideBox, baseCollideBox) {
        switch (baseCollideBox.type) {
            case BaseCollideBox.CIRCLE :
                return Collider.isCircleInCircle(circleCollideBox, baseCollideBox);
                break;
            case BaseCollideBox.RECT :
                return Collider.isCircleInRectangle(circleCollideBox, baseCollideBox);
                break;
        }
        return false;
    }

    // Y a t'il collision entre nos 2 cercles
    static isCircleInCircle(circleCollideBox1, circleCollideBox2) {
        return (
            Tools.distance(
                new Vec2(circleCollideBox1.position.x + circleCollideBox1.radius, circleCollideBox1.position.y + circleCollideBox1.radius), 
                new Vec2(circleCollideBox2.position.x + circleCollideBox2.radius, circleCollideBox2.position.y + circleCollideBox2.radius)) 
                < (circleCollideBox1.radius + circleCollideBox2.radius));
    }

    // Y a t'il collision entre nos 2 rectangles
    static isRectangleInRectangle(rectCollideBox1, rectCollideBox2) {
        return (
            rectCollideBox1.position.x < rectCollideBox2.position.x + rectCollideBox2.size.x &&
            rectCollideBox1.position.x + rectCollideBox1.size.x > rectCollideBox2.position.x &&
            rectCollideBox1.position.y < rectCollideBox2.position.y + rectCollideBox2.size.y &&
            rectCollideBox1.size.y + rectCollideBox1.position.y > rectCollideBox2.position.y)
    }

    // Y a t'il collision entre notre cerle et le rectangle
    static isCircleInRectangle(circleCollideBox, rectCollideBox) {
        let distX = Math.abs(circleCollideBox.position.x + circleCollideBox.radius - rectCollideBox.position.x - rectCollideBox.size.x / 2);
        let distY = Math.abs(circleCollideBox.position.y + circleCollideBox.radius  - rectCollideBox.position.y - rectCollideBox.size.y / 2);

        if (distX > (rectCollideBox.size.x /2 + circleCollideBox.radius)) return false;
        if (distY > (rectCollideBox.size.y /2 + circleCollideBox.radius)) return false;

        if (distX <= (rectCollideBox.size.x / 2))  return true;
        if (distY <= (rectCollideBox.size.y / 2))  return true;

        let dx = distX - rectCollideBox.size.x / 2;
        let dy = distY - rectCollideBox.size.y / 2;
        return (dx * dx + dy * dy <= circleCollideBox.radius * circleCollideBox.radius);    
    }

    // Y a t'il collision entre notre point et le rectangle (utilisé pour les clics sur les boutons principalement)
    static isPointInRectangle(point, rectangle) {
        return (rectangle.position.x <= point.x && point.x <= rectangle.position.x + rectangle.size.x &&
                rectangle.position.y <= point.y && point.y <= rectangle.position.y + rectangle.size.y);
    }
}
