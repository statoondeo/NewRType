class UIElement extends GameObject {
    constructor() {
        super();
    }
}

class PanelUIElement extends UIElement{
    constructor() {
        super();
        this.sprite = new Sprite(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("images/gui/bigPanel.png"));
    }

    draw(context) {
        this.sprite.draw(context);
    }
}

class TextUIElement extends UIElement{
    constructor(label, color, format) {
        super();
        this.label = label;
        this.color = color;
        this.format = format;
        this.size.x = ImageHandler.textLength(this.label, this.format);
    }
    
    draw(context) {
        context.save();
        context.textBaseline = "top";
        context.fillStyle = this.color;
        context.font = this.format;
        context.fillText(this.label, this.position.x, this.position.y);
        context.restore();
    } 
}

class ButtonUIElement extends UIElement {
    constructor(label) {
        super();
        this.sprite = new Sprite(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("images/gui/button.png"));
        this.position = this.sprite.position;
        this.size = this.sprite.size;
        this.textUIElement = new TextUIElement(label, "black", "bold 24pt neuropol");
    }

    update(dt) {
        this.textUIElement.position.x = this.position.x + (this.size.x - this.textUIElement.size.x) / 2;
        this.textUIElement.position.y = this.position.y + this.size.y * 0.3;
    }

    draw(context) {
        this.sprite.draw(context);
        this.textUIElement.draw(context);
    }    
}
