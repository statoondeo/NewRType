class ImageHandler {
    constructor(maxSize, drawingDirection = new Vec2(1)) {
        // Liste des images à assembler
        this.images = [];
        this.maxSize = maxSize;
        this.drawingZoom = drawingDirection;
        this.drawingDirection = drawingDirection.getClone();
        this.drawingDirection.x /= Math.abs(this.drawingDirection.x);
        this.drawingDirection.y /= Math.abs(this.drawingDirection.y);
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.maxSize.x;
        this.canvas.height = this.maxSize.y;
        this.canvasContext = this.canvas.getContext("2d");
    }
    
    static createCanvas(width, height) {
        let newCanvas = document.createElement('canvas');
        newCanvas.width = width;
        newCanvas.height = height;
        return newCanvas;
    }

    static zoomImage(image, zoom = new Vec2(1)) {
        let newCanvas = ImageHandler.createCanvas(image.width * zoom.x, image.height * zoom.y);
        let context = newCanvas.getContext("2d");

        context.save();
        context.scale(zoom.x, zoom.y);
        context.drawImage(image, 0, 0);
        context.restore();

        return newCanvas;
    }
    static textLength(text, format) {
        let newCanvas = ImageHandler.createCanvas(1280, 800);
        let context = newCanvas.getContext("2d");
        context.save();
        context.font = format;
        let length = context.measureText(text).width;
        context.restore();
        return length;
    }

    static flipImage(image, flip = new Vec2(1)) {
        let newCanvas = ImageHandler.createCanvas(image.width, image.height);
        let context = newCanvas.getContext("2d");

        flip.x = flip.x / Math.abs(flip.x);
        flip.y = flip.y / Math.abs(flip.y);

        context.save();
        context.translate(flip.x == -1 ? image.width : 0, flip.y == -1 ? image.height : 0);
        context.scale(flip.x, flip.y);
        context.drawImage(image, 0, 0);
        context.restore();

        return newCanvas;
    }

    // On ajoute des images à dessiner
    addImage(image, position = new Vec2()) {
        this.images.push({ imageSource : image, imagePosition : position });
    }

    getAssembledImage() {
        return this.canvas;
    }

    // On assemble les images et on retourne le canvas produit
    // celui-ci pourra être utilisé en lieu et place de chacune des images
    assemble() {
        // On y dessine toutes les images à la position demandée
        this.canvasContext.save();
        this.canvasContext.translate(
            this.drawingDirection.x <= 0 ? this.canvas.width : 0,
            this.drawingDirection.y <= 0 ? this.canvas.height : 0);
        this.canvasContext.scale(this.drawingZoom.x, this.drawingZoom.y);
        this.images.forEach(imageItem => {
            this.canvasContext.drawImage(
                imageItem.imageSource, 
                imageItem.imagePosition.x, 
                imageItem.imagePosition.y, 
                imageItem.imageSource.width * this.drawingDirection.x, 
                imageItem.imageSource.height * this.drawingDirection.y);
        });
        this.canvasContext.restore();
    }
}

