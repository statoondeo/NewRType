class Level1VictoryImage {
    static createInstance() {
        let screen = ServiceLocator.getService(ServiceLocator.SCREEN);
        let canvas = ImageHandler.createCanvas(screen.width, screen.height);
        let context = canvas.getContext("2d");

        let label = "Klaw"
        let style = "bold 42pt neuropol"
        context.font = style;
        let width = context.measureText(label).width;
        let text = new TextUIElement(label, "white", style);
        text.position.x = (screen.width - width) / 2;
        text.position.y = screen.height * 0.4;
        text.draw(context);

        label = "Big Saucer n'était qu'un moins que rien!"
        style = "bold 26pt neuropol"
        context.font = style;
        width = context.measureText(label).width;
        text = new TextUIElement(label, "white", style);
        text.position.x = (screen.width - width) / 2;
        text.position.y = screen.height * 0.5;
        text.draw(context);

        label = "Il t'a cependant bien sous-estimé."
        style = "22pt neuropol"
        context.font = style;
        width = context.measureText(label).width;
        text = new TextUIElement(label, "white", style);
        text.position.x = (screen.width - width) / 2;
        text.position.y = screen.height * 0.6;
        text.draw(context);
        
        label = "Ce qui ne sera plus mon cas maintenant!!"
        width = context.measureText(label).width;
        text = new TextUIElement(label, "white", style);
        text.position.x = (screen.width - width) / 2;
        text.position.y = screen.height * 0.65;
        text.draw(context);

        return canvas;
    }

    static instance;

    static getInstance() {
        if (Level1VictoryImage.instance == null) {
            Level1VictoryImage.instance = Level1VictoryImage.createInstance();
        }

        return Level1VictoryImage.instance;
    }
}
