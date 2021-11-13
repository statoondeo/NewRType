class Level1RareoyArdeas1Image {
    static createInstance() {
        let screen = Services.get(Services.SCREEN);
        let canvas = ImageHandler.createCanvas(screen.width, screen.height);
        let context = canvas.getContext("2d");

        let text = new TextUIElement("Rareoy Ardeas", "white", "bold 18pt neuropol");
        text.position.x = 200;
        text.position.y = 100;
        text.draw(context);

        text = new TextUIElement("Alors comment ça marche ... ?", "white", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 230;
        text.draw(context);

        text = new TextUIElement("On dirait que les flèches permettent", "white", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 310;
        text.draw(context);

        text = new TextUIElement("de diriger le vaisseau ...", "white", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 340;
        text.draw(context);
        
        text = new TextUIElement("Et \"W\" active le tir!", "white", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 400;
        text.draw(context);

        text = new TextUIElement("Voilà, j'ai tout ce qu'il faut!", "white", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 480;
        text.draw(context);

        return canvas;
    }

    static instance;

    static getInstance() {
        if (Level1RareoyArdeas1Image.instance == null) {
            Level1RareoyArdeas1Image.instance = Level1RareoyArdeas1Image.createInstance();
        }

        return Level1RareoyArdeas1Image.instance;
    }
}
