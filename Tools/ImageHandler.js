class ImageHandler {
    constructor(maxSize, drawingDirection = new Vec2(1)) {
        // Liste des images à assembler
        this.images = [];
        this.maxSize = maxSize;
        this.drawingDirection = drawingDirection;
        // this.drawingDirection.x /= Math.abs(this.drawingDirection.x);
        // this.drawingDirection.y /= Math.abs(this.drawingDirection.y);
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.maxSize.x;
        this.canvas.height = this.maxSize.y;
        this.canvasContext = this.canvas.getContext("2d");
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
        this.canvasContext.scale(this.drawingDirection.x, this.drawingDirection.y);
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

