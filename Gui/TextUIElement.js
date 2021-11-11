class TextUIElement extends UIElement{
    constructor(label, color, format) {
        super(true);
        this.label = label;
        this.color = color;
        this.format = format;
        this.size.x = ImageHandler.textLength(this.label, this.format);
    }
    
    draw(context) {
        if (this.visibility) {
            context.save();
            context.globalAlpha = this.getAlpha();;
            context.textBaseline = "top";
            context.fillStyle = this.color;
            context.font = this.format;
            context.fillText(this.label, this.position.x, this.position.y);
            context.restore();
        }
    } 
}
