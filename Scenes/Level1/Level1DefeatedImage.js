class Level1DefeatedImage {
    static createInstance() {
        let screen = ServiceLocator.getService(ServiceLocator.SCREEN);
        let canvas = ImageHandler.createCanvas(screen.width, screen.height);
        let context = canvas.getContext("2d");

        let label = "Big Saucer"
        let style = "bold 42pt neuropol"
        context.font = style;
        let width = context.measureText(label).width;
        let text = new TextUIElement(label, "white", style);
        text.position.x = (screen.width - width) / 2;
        text.position.y = screen.height * 0.35;
        text.draw(context);

        label = "AH AH AH AH AH !!!"
        style = "bold 26pt neuropol"
        context.font = style;
        width = context.measureText(label).width;
        text = new TextUIElement(label, "white", style);
        text.position.x = (screen.width - width) / 2;
        text.position.y = screen.height * 0.65;
        text.draw(context);

        label = "Et c'est sur \"ça\" que reposait la"
        style = "22pt neuropol"
        context.font = style;
        width = context.measureText(label).width;
        text = new TextUIElement(label, "white", style);
        text.position.x = (screen.width - width) / 2;
        text.position.y = screen.height * 0.5;
        text.draw(context);
        
        label = "défense de la Terre ?"
        width = context.measureText(label).width;
        text = new TextUIElement(label, "white", style);
        text.position.x = (screen.width - width) / 2;
        text.position.y = screen.height * 0.55;
        text.draw(context);

        return canvas;
    }

    static instance;

    static getInstance() {
        if (Level1DefeatedImage.instance == null) {
            Level1DefeatedImage.instance = Level1DefeatedImage.createInstance();
        }

        return Level1DefeatedImage.instance;
    }
}
