class Level1BigSaucer1Image {
    static createInstance() {
        let screen = Services.get("SCREEN");
        let canvas = ImageHandler.createCanvas(screen.width, screen.height);
        let context = canvas.getContext("2d");

        let text = new TextUIElement("Big Saucer", "white", "bold 18pt neuropol");
        text.position.x = 200;
        text.position.y = 100;
        text.draw(context);

        text = new TextUIElement("Et c'est en venant jusqu'ici que tu", "white", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 200;
        text.draw(context);
        
        text = new TextUIElement("penses me faire peur? ... AH AH", "white", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 230;
        text.draw(context);

        return canvas;
    }
}