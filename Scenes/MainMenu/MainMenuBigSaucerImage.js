class MainMenuBigSaucerImage {
    static createInstance() {
        let screen = ServiceLocator.getService(ServiceLocator.SCREEN);
        let canvas = ImageHandler.createCanvas(screen.width, screen.height);
        let context = canvas.getContext("2d");

        let sprite = new Sprite(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("Images/Gui/smallPanel.png"));
        sprite.draw(context);

        let text = new TextUIElement("Big Saucer", "white", "bold 18pt neuropol");
        text.position.x = 200;
        text.position.y = 100;
        text.draw(context);

        text = new TextUIElement("Pauvre petite crotte terrestre!", "white", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 200;
        text.draw(context);

        text = new TextUIElement("Comment penses-tu défendre la terre", "white", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 260;
        text.draw(context);

        text = new TextUIElement("contre MOI et mes légions ???!!!", "white", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 280;
        text.draw(context);

        text = new TextUIElement("Allez mes fidèles Aliénoïdes, montrez", "white", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 340;
        text.draw(context);

        text = new TextUIElement("à ce répugnant terrien notre manière", "white", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 360;
        text.draw(context);

        text = new TextUIElement("de traiter les avortons de son espèce!", "white", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 380;
        text.draw(context);

        text = new TextUIElement("A L'ASSAULT!!!!!", "white", "bold 18pt neuropol");
        text.position.x = 100;
        text.position.y = 440;
        text.draw(context);

        return canvas;
    }

    static instance;

    static getInstance() {
        if (MainMenuBigSaucerImage.instance == null) {
            MainMenuBigSaucerImage.instance = MainMenuBigSaucerImage.createInstance();
        }

        return MainMenuBigSaucerImage.instance;
    }
}
