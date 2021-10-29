class BaseGuiElement extends GameObject {
    constructor() {
        super();
        this.visibility = true;
    }

    update(dt) {
    }

    draw(context) {
    }
}
class GroupGuiElement extends BaseGuiElement {
    constructor(sprite) {
        super();
        this.elements = [];
        this.sprite = sprite;
        this.sprite.position = this.position;
    }

    addElement(newElement) {
        this.elements.push(newElement);
    }

    update(dt) {
        this.elements.forEach(element => {
            element.update(dt);
        });
    }

    draw(context) {
        if (this.visibility) {
            this.sprite.draw(context);
            this.elements.forEach(element => {
                element.draw(context);
            });
        }
    }
}
class TextGuiElement extends BaseGuiElement {
    constructor(label, font, color) {
        super();
        this.label = label;
        this.color = color;
        this.font = font;
        this.position = null;
    }

    draw(context) {
        context.save();
        context.fillStyle = this.color;
        context.font = this.font;
        context.textAlign = "center";
        if (null == this.position) {
            let mesure = context.measureText(this.label);
            let height = mesure.fontBoundingBoxAscent + mesure.fontBoundingBoxDescent;
            this.position = new Vec2(this.anchor.x - mesure.width / 2, this.anchor.y - height / 2);
        }
        context.fillText(this.label, Math.floor(this.position.x), Math.floor(this.position.y));
        context.restore();
    }
}
class ButtonGuiElement extends BaseGuiElement {
    constructor(sprite, command, position, textGuiElement) {
        super();
        this.command = command;
        this.position = position;
        this.sprite = sprite;
        this.sprite.position = this.position;
        this.size = this.sprite.size;
        this.sprite.alpha = 0.5;
        this.collideBox = new RectCollideBox(this.position, this.size);

        this.textGuiElement = textGuiElement;
        // this.textGuiElement.maxSize = new Vec2();
        // this.textGuiElement.maxSize.x = this.size.x * 0.6;
        // this.textGuiElement.maxSize.y = this.size.y * 0.8;

        this.textGuiElement.anchor = new Vec2(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2);
    }

    update(dt) {
        this.sprite.update(dt);
        let inputHandler = ServiceLocator.getService(ServiceLocator.KEYBOARD);

        // On vérifie si le bouton est survolé
        if (Collider.isPointInRectangle(inputHandler.mouse, this.collideBox)) {
            this.sprite.alpha = 1;

            // on vérifie si le bouton est clické
            if (inputHandler.isClicked()) {
                inputHandler.initCLick();
                this.command.execute();
            }
        }
        else {
            this.sprite.alpha = 0.5;
        }
    }

    draw(context) {
        if (ServiceLocator.getService(ServiceLocator.PARAMETER).colliderDisplay) {      
            this.collideBox.draw(context);
        }
        else {
            this.sprite.draw(context);
            this.textGuiElement.draw(context);
        } 
    }
}