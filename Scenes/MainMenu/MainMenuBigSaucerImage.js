class MainMenuBigSaucerImage {
    static createInstance() {
        let screen = Services.get(Services.SCREEN);
        let canvas = ImageHandler.createCanvas(screen.width, screen.height);
        let context = canvas.getContext("2d");

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

        text = new TextUIElement("Je serais bientôt en route avec mes", "white", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 340;
        text.draw(context);

        text = new TextUIElement("fidèles Aliénoïdes pour te montrer,", "white", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 360;
        text.draw(context);

        text = new TextUIElement("répugnant terrien, notre manière de", "white", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 380;
        text.draw(context);

        text = new TextUIElement("traiter les avortons de ton espèce!", "white", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 400;
        text.draw(context);
        
        text = new TextUIElement("AH AH AH AH", "white", "bold 18pt neuropol");
        text.position.x = 100;
        text.position.y = 460;
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
