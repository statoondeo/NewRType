class Collider {
    // Y a t'il collision entre nos 2 collideBox?
    static isCollision(baseCollideBox1, baseCollideBox2) {
        let collision;

        switch (baseCollideBox1.type) {
            case CollideBoxType.CIRCLE :
                collision = Collider.isCircleCollision(baseCollideBox1, baseCollideBox2) ;
                break;
            case CollideBoxType.RECT :
                collision = Collider.isRectCollision(baseCollideBox1, baseCollideBox2);
                break;
            case CollideBoxType.COMPOSITE :
                collision = Collider.isCompositeCollision(baseCollideBox1, baseCollideBox2);
                break;                            
        }

        baseCollideBox1.setCollided(collision || baseCollideBox1.getCollided());
        baseCollideBox2.setCollided(collision || baseCollideBox2.getCollided());

        return collision;
    }

    // Y a t'il collision entre notre composite et l'autre collideBox?
    static isCompositeCollision(compositeCollideBox, baseCollideBox) {
        for (let index = 0; index < compositeCollideBox.collideBoxesCollection.length; index++) {
            const collidexBox = compositeCollideBox.collideBoxesCollection[index];
            if (Collider.isCollision(collidexBox, baseCollideBox)) {
                compositeCollideBox.setCollided(true);
                baseCollideBox.setCollided(true);
                return true;
            }
        }
        return false;        
    }

    // Y a t'il collision entre notre rectangle et l'autre collideBox?
    static isRectCollision(rectCollideBox, baseCollideBox) {
        switch (baseCollideBox.type) {
            case CollideBoxType.RECT :
                return Collider.isRectangleInRectangle(rectCollideBox, baseCollideBox);
                break;
            case CollideBoxType.CIRCLE :
                return Collider.isCircleInRectangle(baseCollideBox, rectCollideBox);
                break;
            case CollideBoxType.COMPOSITE :
                return Collider.isCompositeCollision(baseCollideBox, rectCollideBox);
                break;
            }
        return false;
    }

    // Y a t'il collision entre notre cercle et l'autre collideBox?
    static isCircleCollision(circleCollideBox, baseCollideBox) {
        switch (baseCollideBox.type) {
            case CollideBoxType.CIRCLE :
                return Collider.isCircleInCircle(circleCollideBox, baseCollideBox);
                break;
            case CollideBoxType.RECT :
                return Collider.isCircleInRectangle(circleCollideBox, baseCollideBox);
                break;           
            case CollideBoxType.COMPOSITE :
                return Collider.isCompositeCollision(baseCollideBox, circleCollideBox);
                break;
        }
        return false;
    }

    // Y a t'il collision entre nos 2 cercles
    static isCircleInCircle(circleCollideBox1, circleCollideBox2) {
        let position1 = circleCollideBox1.getOffsetPosition();
        let position2 = circleCollideBox2.getOffsetPosition();
        return (
            Tools.distance(
                new Vec2(position1.x + circleCollideBox1.radius, position1.y + circleCollideBox1.radius), 
                new Vec2(position2.x + circleCollideBox2.radius, position2.y + circleCollideBox2.radius)) 
                < (circleCollideBox1.radius + circleCollideBox2.radius));
    }

    // Y a t'il collision entre nos 2 rectangles
    static isRectangleInRectangle(rectCollideBox1, rectCollideBox2) {
        let position1 = rectCollideBox1.getOffsetPosition();
        let position2 = rectCollideBox2.getOffsetPosition();
        return (
            position1.x < position2.x + rectCollideBox2.size.x &&
            position1.x + rectCollideBox1.size.x > position2.x &&
            position1.y < position2.y + rectCollideBox2.size.y &&
            rectCollideBox1.size.y + rectCollideBox1.position.y > position2.y)
    }

    // Y a t'il collision entre notre cerle et le rectangle
    static isCircleInRectangle(circleCollideBox, rectCollideBox) {
        let position1 = circleCollideBox.getOffsetPosition();
        let position2 = rectCollideBox.getOffsetPosition();

        let distX = Math.abs(position1.x + circleCollideBox.radius - position2.x - rectCollideBox.size.x / 2);
        let distY = Math.abs(position1.y + circleCollideBox.radius  - position2.y - rectCollideBox.size.y / 2);

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
        let position = rectangle.getOffsetPosition();
        return (position.x <= point.x && point.x <= position.x + rectangle.size.x &&
            position.y <= point.y && point.y <= position.y + rectangle.size.y);
    }
}
