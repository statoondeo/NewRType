class MainMenuRareoyArdeasImage {
    static createInstance() {
        let screen = Services.get(Services.SCREEN);
        let canvas = ImageHandler.createCanvas(screen.width, screen.height);
        let context = canvas.getContext("2d");

        let text = new TextUIElement("Rareoy Ardeas", "white", "bold 18pt neuropol");
        text.position.x = 200;
        text.position.y = 100;
        text.draw(context);

        text = new TextUIElement("Puisque tu le prends comme ça, c'est", "silver", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 230;
        text.draw(context);

        text = new TextUIElement("moi qui viens!", "silver", "14pt neuropol");
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
