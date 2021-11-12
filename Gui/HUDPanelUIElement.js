class HUDPanelUIElement extends PanelUIElement {
    static size = new Vec2(598, 177);
    constructor(playerShip, position, visibility) {
        super(position, visibility);
        this.playerShip = playerShip;

        let background = new SpriteUIElement(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("Images/Gui/playerHud.png"));
        background.position.x = -10;
        background.position.y = 10;
        this.addElement(background);

        this.lifeBar = new LifeBarGameObject();
        this.lifeBarUIElement = new UIElementDecorator(this.lifeBar) 
        this.lifeBarUIElement.position.x = 150;
        this.lifeBarUIElement.position.y = 50;
        this.addElement(this.lifeBarUIElement);

        let text = new TextUIElement("Rareoy Ardeas", "white", "12pt neuropol");
        text.position.x = 200;
        text.position.y = 30;
        this.addElement(text);

        text = new TextUIElement(this.playerShip.fireCommand.weapon.getName(), "white", "12pt neuropol");
        text.position.x = 200;
        text.position.y = 150;
        this.addElement(text);
    }

    update(dt) {
        super.update(dt);
        this.lifeBar.setRatio(this.playerShip.life / this.playerShip.maxLife);
    }
}

// class ReHUDPanelUIElement extends PanelUIElement {
//     static size = new Vec2(598, 177);
//     constructor(playerShip, position, visibility) {
//         super(position, visibility);
//         this.playerShip = playerShip;

//         let background = new SpriteUIElement(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("Images/Gui/playerHud.png"));
//         background.position.x = -10;
//         background.position.y = 10;
//         this.addElement(background);

//         this.lifeBar = new LifeBarGameObject();
//         this.lifeBarUIElement = new UIElementDecorator(this.lifeBar) 
//         this.lifeBarUIElement.position.x = 150;
//         this.lifeBarUIElement.position.y = 50;
//         this.addElement(this.lifeBarUIElement);

//         let text = new TextUIElement("Rareoy Ardeas", "white", "12pt neuropol");
//         text.position.x = 200;
//         text.position.y = 30;
//         this.addElement(text);

//         text = new TextUIElement(this.playerShip.fireCommand.weapon.getName(), "white", "12pt neuropol");
//         text.position.x = 200;
//         text.position.y = 150;
//         this.addElement(text);
//     }

//     update(dt) {
//         super.update(dt);
//         this.lifeBar.setRatio(this.playerShip.life / this.playerShip.maxLife);
//     }
// }