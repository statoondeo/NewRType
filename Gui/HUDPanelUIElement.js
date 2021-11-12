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
        this.lifeBarUIElement.position.x = 140;
        this.lifeBarUIElement.position.y = 50;
        this.addElement(this.lifeBarUIElement);

        let text = new TextUIElement(playerShip.getName(), "white", "12pt neuropol");
        text.position.x = 200;
        text.position.y = 30;
        this.addElement(text);

        this.weaponText = null;
        if (this.playerShip.fireCommand.weapon != null) {
            this.weaponText = new TextUIElement(this.playerShip.fireCommand.weapon.getName(), "white", "12pt neuropol");
            this.weaponText.position.x = 200;
            this.weaponText.position.y = 150;
            this.addElement(this.weaponText);
        }
    }

    update(dt) {
        super.update(dt);
        this.lifeBar.setRatio(this.playerShip.life / this.playerShip.maxLife);
        if (null != this.weaponText) {
            this.weaponText.label = this.playerShip.fireCommand.weapon.getName();
        }
    }
}
