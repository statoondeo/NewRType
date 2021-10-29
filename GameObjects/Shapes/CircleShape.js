class CircleShape extends BaseShape {
    constructor(color) {
        super(color);
        this.radius = 0;
    }

    draw(context) {
        context.save();
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        if (ServiceLocator.getService(ServiceLocator.PARAMETER).colliderDisplay) {      
            context.stroke();
        }
        else {
            context.fill();
        } 
        context.restore();
    }
}