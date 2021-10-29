class RectShape extends BaseShape {
    constructor(color) {
        super(color);
    }

    draw(context) {
        context.save();
        context.fillStyle = this.color;
        // if (ServiceLocator.getService(ServiceLocator.PARAMETER).colliderDisplay) {      
        //     context.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y);
        // }
        // else {
            context.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
        // } 
        context.restore();
    }
}