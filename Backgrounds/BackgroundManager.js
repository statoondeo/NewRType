class BackgroundManager {
    constructor() {
        this.layers = [];
    }

    addLayer(layer) {
        this.layers.push(layer);
    }

    update(dt, currentStep) {
        // On fait avancer chaque couche du background
        this.layers.forEach(layers => {
            layers.update(dt, currentStep);
        });
    }

    draw(context) {
        this.layers.forEach(layers => {
            layers.draw(context);
        });
    }
}