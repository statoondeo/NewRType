class MainMenuRareoyArdeasImage {
    static createInstance() {
        let screen = ServiceLocator.getService(ServiceLocator.SCREEN);
        let canvas = ImageHandler.createCanvas(screen.width, screen.height);
        let context = canvas.getContext("2d");

        let sprite = new Sprite(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("Images/Gui/smallPanel.png"));
        sprite.draw(context);

        let text = new TextUIElement("Rareoy Ardeas", "white", "bold 18pt neuropol");
        text.position.x = 200;
        text.position.y = 100;
        text.draw(context);

        text = new TextUIElement("Puisqu'il le faut ...", "white", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 260;
        text.draw(context);

        return canvas;
    }

    static instance;

    static getInstance() {
        if (MainMenuRareoyArdeasImage.instance == null) {
            MainMenuRareoyArdeasImage.instance = MainMenuRareoyArdeasImage.createInstance();
        }

        return MainMenuRareoyArdeasImage.instance;
    }
}
