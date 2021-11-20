class Level1TitleImage {
    static createInstance() {
        let screen = Services.get("SCREEN");
        let canvas = ImageHandler.createCanvas(screen.width, screen.height);
        let context = canvas.getContext("2d");

        context.font = "bold 92pt neuropol";
        let width = context.measureText("GUDAÎTURN").width;
        let text = new TextUIElement("GUDAÎTURN", "white", "bold 92pt neuropol");
        text.position.x = (screen.width - width) / 2;
        text.position.y = 300;
        text.draw(context);
        
        let line = text.position;
        let lineWidth = width;

        context.font = "20pt neuropol";
        width = context.measureText("Bastion de Big Saucer").width;
        text = new TextUIElement("Bastion de Big Saucer", "white", "20pt neuropol");
        text.position.x = (screen.width - width) / 2;
        text.position.y = 450;
        text.draw(context);

        context.beginPath();
        context.strokeStyle = "white";
        context.moveTo(line.x, line.y + 130);
        context.lineTo(line.x + lineWidth, line.y + 130);
        context.stroke();

        return canvas;
    }
}
