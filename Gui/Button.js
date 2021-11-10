class UIElement extends GameObject {
    constructor(visibility = true) {
        super();
        this.visibility = visibility;
        this.globalAlpha = this.visibility ? 1 : 0;
        this.partition = GameObjectPartition.NEUTRAL_PARTITION;
    }

    setPosition(position) {
        this.position = position;
    }

    setAlpha(alpha) {
        this.globalAlpha = alpha;
    }

    getAlpha() {
        return this.globalAlpha;
    }
}
class UIElementDecorator extends UIElement {
    constructor(gameObject, visibility = true) {
        super(visibility);
        this.gameObject = gameObject;
        this.size = this.gameObject.size;
    }

    setPosition(position) {
        this.position = position;
        this.gameObject.position.x = position.x;
        this.gameObject.position.y = position.y;
    }

    setAlpha(alpha) {
        this.gameObject.globalAlpha = alpha;
    }

    getAlpha() {
        return this.gameObject.globalAlpha;
    }   

    update(dt) {
        this.gameObject.update(dt);
    }

    draw(context) {
        this.gameObject.draw(context);
    }
}
class SpriteUIElement extends UIElement {
    constructor(image) {
        super();
        this.sprite = new Sprite(image);
    }

    setPosition(position) {
        this.sprite.position = position;
    }

    setAlpha(alpha) {
        super.setAlpha(alpha);
        this.sprite.globalAlpha = alpha;
    }

    update(dt) {
        this.sprite.update(dt);
    }

    draw(context) {
        this.sprite.draw(context);
    }
}
class PanelUIElement  extends UIElement {
    constructor(position, size, visibility) {
        super(visibility);
        this.position = position;
        this.size = size;
        this.internalUIElement = [];
        this.pendingVisibility = false;
        this.alphaDirection = 0;
        this.visibilityMaxTtl = 1;
        this.visibilityTtl = this.visibilityMaxTtl;
    }

    addElement(element) {
        element.setAlpha(this.getAlpha());        
        element.setPosition(new Vec2(element.position.x + this.position.x, element.position.y + this.position.y));
        this.internalUIElement.push(element);
    }

    setAlpha(alpha) {
        super.setAlpha(alpha);
        this.globalAlpha = alpha;
        this.internalUIElement.forEach(element => {
            element.setAlpha(alpha);
        });
    }

    getAlpha() {
        return this.globalAlpha;
    }

    hide() {
        this.setAlpha(1);
        this.pendingVisibility = true;
        this.alphaDirection = -1;
        this.visibilityTtl = this.visibilityMaxTtl;
    }

    show() {
        this.setAlpha(0);
        this.visibility = true;
        this.pendingVisibility = true;
        this.alphaDirection = 1;
        this.visibilityTtl = this.visibilityMaxTtl;
    }

    update(dt) {
        super.update(dt);
        if (this.pendingVisibility) {
            this.visibilityTtl -= dt;
            if (this.visibilityTtl <= 0) {
                this.pendingVisibility = false;
                this.visibility = this.alphaDirection < 0 ? false : this.alphaDirection;
            }
            else {
                this.setAlpha(this.alphaDirection > 0 ? (this.visibilityMaxTtl - this.visibilityTtl) / this.visibilityMaxTtl : this.visibilityTtl / this.visibilityMaxTtl);
            }
        }
        this.internalUIElement.forEach(element => {
            element.update(dt);
        });
    }

    draw(context) {
        if (this.visibility) {
            this.internalUIElement.forEach(element => {
                element.draw(context);
            });
        }
    }    
}
class BigPanelUIElement extends PanelUIElement {
    static size = new Vec2(1280, 800);
    constructor(position, visibility) {
        super(position, BigPanelUIElement.size, visibility);
        this.addElement(new SpriteUIElement(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("Images/Gui/bigPanel.png")));
     }
}
class MiniaturePanelUIElement extends PanelUIElement {
    static miniatureOffset = new Vec2(92, 96)
    constructor(panel, miniature, visibility) {
        super(panel.position, panel.size, visibility);
        this.panel = panel;
        this.miniature = miniature;
        this.miniature.position.x = MiniaturePanelUIElement.miniatureOffset.x - this.miniature.size.x / 2;
        this.miniature.position.y = MiniaturePanelUIElement.miniatureOffset.y - this.miniature.size.y / 2;
        this.addElement(this.miniature);
    }
    addElement(element) {
        this.panel.addElement(element);
    }
    show() {
        this.panel.show();
    }
    hide() {
        this.panel.hide();
    }
    update(dt) {
        this.panel.update(dt);
    }
    draw(context) {
        this.panel.draw(context);
    }
}
class SmallPanelUIElement extends PanelUIElement {
    static size = new Vec2(619, 614);
    constructor(position, visibility) {
        super(position, visibility);
        this.addElement(new SpriteUIElement(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("Images/Gui/smallPanel.png")));
    }
}
class VerySmallPanelUIElement extends PanelUIElement {
    static size = new Vec2(619, 330);
    constructor(position, visibility) {
        super(position, visibility);
        this.addElement(new SpriteUIElement(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("Images/Gui/verySmallPanel.png")));
    }
}
class DelayableSmallPanelUIElement extends SmallPanelUIElement {
    constructor(miniature, position, visibility, delay) {
        super(miniature, position, visibility);
        this.started = false;
        this.ttl = delay;
    }

    show() {
        this.started = true;
    }

    update(dt) {
        super.update(dt);
        if (this.started) {
            this.ttl -= dt;
            if (this.ttl < 0) {
                super.show();
                this.started = false;
            }
        }
    }
}
class StartableUIElement extends UIElement {
    constructor(uiElement, startingPoint, endPoint) {
        super();
        this.uiElement = uiElement;
        this.startingPoint = startingPoint;
        this.endPoint = endPoint;
        this.started = false;
        this.ended = false;
        this.status = GameObjectState.IDLE;
    }

    subjectChanged(subject) {
        if (subject.currentStep >= this.startingPoint && !this.started) {
            this.started = true;
            this.status = GameObjectState.ACTIVE;
            this.uiElement.show();
        } 
        if (subject.currentStep >= this.endPoint) {
            subject.unregister(this);
            this.ended = true;
            this.uiElement.hide();
        }
    }

    update(dt) {
        if (this.started && this.ended && !this.visibility) {
            this.status = GameObjectState.OUTDATED;
        }
        else {
            this.uiElement.update(dt);
        }
    }

    draw(context) {
        this.uiElement.draw(context);
    }
}
class StartableSmallPanelUIElement extends SmallPanelUIElement {
    constructor(miniature, position, visibility, startingPoint, endPoint) {
        super(miniature, position, visibility);
        this.startingPoint = startingPoint;
        this.endPoint = endPoint;
        this.started = false;
        this.ended = false;
        this.status = GameObjectState.IDLE;
    }

    subjectChanged(subject) {
        if (subject.currentStep >= this.startingPoint && !this.started) {
            this.started = true;
            this.status = GameObjectState.ACTIVE;
            this.show();
        } 
        if (subject.currentStep >= this.endPoint) {
            subject.unregister(this);
            this.ended = true;
            this.hide();
        }
    }

    update(dt) {
        super.update(dt);
        if (this.started && this.ended && !this.visibility) {
            this.status = GameObjectState.OUTDATED;
        }
    }
}
class StartableVerySmallPanelUIElement extends VerySmallPanelUIElement {
    constructor(miniature, position, visibility, startingPoint, endPoint) {
        super(miniature, position, visibility);
        this.startingPoint = startingPoint;
        this.endPoint = endPoint;
        this.started = false;
        this.ended = false;
        this.status = GameObjectState.IDLE;
    }

    subjectChanged(subject) {
        if (subject.currentStep >= this.startingPoint && !this.started) {
            this.started = true;
            this.status = GameObjectState.ACTIVE;
            this.show();
        } 
        if (subject.currentStep >= this.endPoint) {
            subject.unregister(this);
            this.ended = true;
            this.hide();
        }
    }

    update(dt) {
        super.update(dt);
        if (this.started && this.ended && !this.visibility) {
            this.status = GameObjectState.OUTDATED;
        }
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
        if (inputHandler.isClicked() && this.visibility && Collider.isPointInRectangle(inputHandler.click, this.collideBox)) {
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
