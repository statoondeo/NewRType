class BackgroundManager {
    constructor() {
        this.layers = new Manager();
    }

    addLayer(layer) {
        this.layers.addItem(layer);
    }

    update(dt, currentStep) {
        // On fait avancer chaque couche du background
        this.layers.items.forEach(layers => {
            layers.update(dt, currentStep);
        });
    }

    draw(context) {
        this.layers.items.forEach(layers => {
            layers.draw(context);
        });
    }
}