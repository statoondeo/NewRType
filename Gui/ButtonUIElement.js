class ButtonUIElement extends UIElement {
    static size = new Vec2(321, 109);
    constructor(label, command) {
        super();
        this.command = command;
        this.sprite = new Sprite(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("Images/Gui/button.png"));
        this.position = this.sprite.position;
        this.size = this.sprite.size;
        this.collideBox = new RectCollideBox(this.position, this.size);
        this.textUIElement = new TextUIElement(label, "black", "bold 24pt neuropol");
    }

    setPosition(position) {
        super.setPosition(position);
        this.sprite.position = position;
        this.collideBox.position = this.position;
    }

    setAlpha(alpha) {
        this.sprite.globalAlpha = alpha;
        this.textUIElement.setAlpha(alpha);
    }

    getAlpha() {
        return this.sprite.globalAlpha;
    }

    update(dt) {
        super.update(dt);
        this.textUIElement.position.x = this.position.x + (this.size.x - this.textUIElement.size.x) / 2;
        this.textUIElement.position.y = this.position.y + this.size.y * 0.3;

        let inputHandler = ServiceLocator.getService(ServiceLocator.KEYBOARD);
        if (inputHandler.isClicked() && this.visibility && Collider.isPointInRectangle(inputHandler.mouse, this.collideBox)) {
            this.command.execute();
        }
    }

    draw(context) {
        super.draw(context);
        if (this.visibility) {
            this.sprite.draw(context);
            this.textUIElement.draw(context);
        }
    }    
}
