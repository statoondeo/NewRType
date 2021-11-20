class MainMenuPanelImage {
    static createInstance() {
        let screen = Services.get("SCREEN");
        let canvas = ImageHandler.createCanvas(screen.width, screen.height);
        let context = canvas.getContext("2d");
        let color = "silver";

        let style = "bold 26pt neuropol";
        let label = "Raphael DUCHOSSOY (Gamecodeur.fr)";
        context.font = style;
        let width = context.measureText(label).width;
        let text = new TextUIElement(label, color, style);
        text.position.x = (screen.width - width) / 2;
        text.position.y = screen.height * 0.25;
        text.draw(context);

        style = "bold 148pt neuropol";
        label = "SPACE";
        context.font = style;
        width = context.measureText(label).width;
        text = new TextUIElement(label, "white", style);
        text.position.x = (screen.width - width) / 2;
        text.position.y = screen.height * 0.3;
        text.draw(context);

        style = "bold 84pt neuropol";
        label = "Battle Ships";
        context.font = style;
        width = context.measureText(label).width;
        text = new TextUIElement(label, "white", style);
        text.position.x = (screen.width - width) / 2;
        text.position.y = screen.height * 0.5;
        text.draw(context);

        style = "9.5pt neuropol";
        label = "Pour la survie de la terre face aux envahisseurs Alienoïdes, qui veulent la conquérir depuis des années ...";
        context.font = style;
        width = context.measureText(label).width;
        text = new TextUIElement(label, color, style);
        text.position.x = (screen.width - width) / 2;        
        text.position.y = screen.height * 0.65;
        text.draw(context);

        return canvas;
    }
}
