class Soil1DecorImage {
    constructor() {
        let resources = ServiceLocator.getService(ServiceLocator.RESOURCE);

        let soil1 = resources.getImage("images/soil1.png")
        let soil2 = resources.getImage("images/soil2.png")
        let soil3 = resources.getImage("images/soil3.png")
        let soil4 = resources.getImage("images/soil4.png")

        let tech_bottom_end_left = resources.getImage("images/tech_bottom_end_left.png")
        let tech_bottom_end_right = resources.getImage("images/tech_bottom_end_right.png")
        let tech_bottom_tile = resources.getImage("images/tech_bottom_tile.png")
        let tech_bottom_tile2 = resources.getImage("images/tech_bottom_tile2.png")
        
        let totalSize = new Vec2(tech_bottom_end_left.width + soil1.width + soil3.width + soil4.width + tech_bottom_end_right.width, 
            soil2.height + soil3.width + tech_bottom_tile.height);
        // Constitution d'une image intermédiaire pour une manipulation unique de l'ensemble
        let imageAssembler = new ImageHandler(totalSize, new Vec2(1, 1));

        let imageCoord = new Vec2(tech_bottom_end_left.width, soil1.height);

        // On pose les soils
        console.log("Start", new Vec2(imageCoord.x, totalSize.y - imageCoord.y));
        imageAssembler.addImage(soil1, new Vec2(imageCoord.x, totalSize.y - imageCoord.y));
        imageCoord.x += soil1.width;
        console.log("next", new Vec2(imageCoord.x, totalSize.y - imageCoord.y));
        imageAssembler.addImage(soil2, new Vec2(imageCoord.x, totalSize.y - imageCoord.y));
        imageCoord.y += soil1.height;
        console.log("next", new Vec2(imageCoord.x, totalSize.y - imageCoord.y));
        imageAssembler.addImage(soil3, new Vec2(imageCoord.x, totalSize.y - imageCoord.y));
        imageCoord.x += soil2.width;
        imageCoord.y = soil4.height;
        console.log("next", new Vec2(imageCoord.x, totalSize.y - imageCoord.y));
        imageAssembler.addImage(soil4, new Vec2(imageCoord.x, totalSize.y - imageCoord.y));

        // On pose les décorations
        imageAssembler.addImage(tech_bottom_end_left, new Vec2(0, totalSize.y - tech_bottom_end_left.height));
        imageAssembler.addImage(tech_bottom_end_left, new Vec2(tech_bottom_end_left.width, totalSize.y - tech_bottom_end_left.height - soil1.height));
        imageAssembler.addImage(tech_bottom_tile, new Vec2(2 * tech_bottom_end_left.width, totalSize.y - tech_bottom_tile.height - soil1.height));
        imageAssembler.addImage(tech_bottom_tile2, new Vec2(2 * tech_bottom_end_left.width + tech_bottom_tile.width, totalSize.y - tech_bottom_tile.height - soil1.height));
        imageAssembler.addImage(tech_bottom_tile, new Vec2(2 * tech_bottom_end_left.width + 2 * tech_bottom_tile.width, totalSize.y - tech_bottom_tile.height - soil1.height));
        imageAssembler.addImage(tech_bottom_tile2, new Vec2(2 * tech_bottom_end_left.width + 3 * tech_bottom_tile.width, totalSize.y - tech_bottom_tile.height - soil1.height));

        // On récupère le résultat
        imageAssembler.assemble();
        this.image = imageAssembler.getAssembledImage();
    }
}
