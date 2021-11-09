class MainMenuPanelImage {
    static createInstance() {
        let screen = ServiceLocator.getService(ServiceLocator.SCREEN);
        let canvas = ImageHandler.createCanvas(screen.width, screen.height);
        let context = canvas.getContext("2d");

        let sprite = new Sprite(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("Images/Gui/bigPanel.png"));
        sprite.draw(context);

        let baseAxe = 200;
        let text = new TextUIElement("Raphael DUCHOSSOY (Gamecodeur.fr)", "white", "bold 26pt neuropol");
        text.position.x = baseAxe;
        text.position.y = screen.height * 0.25;
        text.draw(context);

        text = new TextUIElement("SPACE", "white", "bold 148pt neuropol");
        text.position.x = baseAxe;
        text.position.y = screen.height * 0.3;
        text.draw(context);

        text = new TextUIElement("Battle Ships", "white", "bold 84pt neuropol");
        text.position.x = baseAxe;
        text.position.y = screen.height * 0.5;
        text.draw(context);

        text = new TextUIElement("Pour la survie de la terre face aux envahisseurs Alienoïdes, qui veulent la conquérir depuis des années ...", "white", "9.5pt neuropol");
        text.position.x = baseAxe;
        text.position.y = screen.height * 0.65;
        text.draw(context);

        return canvas;
    }

    static instance;

    static getInstance() {
        if (MainMenuPanelImage.instance == null) {
            MainMenuPanelImage.instance = MainMenuPanelImage.createInstance();
        }

        return MainMenuPanelImage.instance;
    }
}
