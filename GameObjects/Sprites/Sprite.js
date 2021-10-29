class Sprite extends GameObject {
    constructor(image) {
        super();
        this.image = image;
        this.size = new Vec2(this.image.width, this.image.height);
        this.alpha = 1;
    }

    getClone() {
        let clone = new Sprite(this.image);
        clone.position = this.position.getClone();
        clone.originalSize = this.originalSize.getClone();
        clone.scale = this.scale.getClone();
        clone.size = this.size.getClone();
        clone.moveCommand = this.moveCommand.getClone();
        clone.fireCommand = this.fireCommand.getClone();
        clone.speed = this.speed;
        clone.collideBox = this.collideBox.getClone();
        clone.image = this.image;
        return clone;
    }

    update(dt) {
        super.update(dt);
    }

    draw(context) {
        if (ServiceLocator.getService(ServiceLocator.PARAMETER).colliderDisplay) {
            this.collideBox.draw(context);
        }
        else {
            context.save();
            context.globalAlpha = this.alpha;
            context.drawImage(
                this.image, 
                Math.floor(this.position.x), 
                Math.floor(this.position.y), 
                this.size.x, 
                this.size.y);
            context.restore();
        }
    }
}