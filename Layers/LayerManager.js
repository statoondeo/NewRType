class LayerManager extends Manager {
    constructor() {
        super();
        this.currentStep = 0;
    }

    static BASE_LAYER_SPEED = 60;

    compareMethod(layer1, layer2) {
        return layer1.getSpeedRatio() - layer2.getSpeedRatio();
    }

    addLayer(layer) {
        this.addItem(layer);
        this.items.sort(this.compareMethod);
    }

    update(dt) {
        console.log("LayerManager", this.currentStep);
        this.currentStep += LayerManager.BASE_LAYER_SPEED * dt;
        // On fait avancer chaque couche du background
        this.items.forEach(layer => {
            layer.currentGlobalStep = this.currentStep;
            layer.update(dt);
        });
    }

    draw(context) {
        this.items.forEach(layer => {
            layer.draw(context);
        });
    }
}