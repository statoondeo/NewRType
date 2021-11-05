class RockyDecorImage {
    constructor() {
        let resources = ServiceLocator.getService(ServiceLocator.RESOURCE);

        let image1 = resources.getImage("images/rock7.png")
        let image2 = resources.getImage("images/rock11.png")
        let image3 = resources.getImage("images/rock8.png")
        let image4 = resources.getImage("images/rock9.png")
        let image5 = resources.getImage("images/rock10.png")

        let totalWidth = image1.width + image2.width + image3.width + image4.width + image5.width;
        let maxHeight = Math.max(image1.height, image2.height, image3.height, image4.height, image5.height)
        let imageX = 0;

        // Constitution d'une image intermédiaire pour une manipulation unique de l'ensemble
        let imageAssembler = new ImageHandler(new Vec2(totalWidth, maxHeight), new Vec2(1, 1));
        imageAssembler.addImage(image1, new Vec2(imageX, maxHeight - image1.height));
        imageX += image1.width;
        imageAssembler.addImage(image2, new Vec2(imageX, maxHeight - image2.height));
        imageX += image2.width;
        imageAssembler.addImage(image3, new Vec2(imageX, maxHeight - image3.height));
        imageX += image3.width;
        imageAssembler.addImage(image4, new Vec2(imageX, maxHeight - image4.height));
        imageX += image4.width;
        imageAssembler.addImage(image5, new Vec2(imageX, maxHeight - image5.height));

        // On récupère le résultat
        imageAssembler.assemble();
        this.image = imageAssembler.getAssembledImage();
    }
}
