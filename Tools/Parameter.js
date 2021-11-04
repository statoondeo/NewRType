class Parameter {
    constructor() {
        // Affichage en mode collideBox
        this.colliderDisplay = false;
    }
    
    setColliderDisplay(colliderDisplay) {
        if (this.colliderDisplay != colliderDisplay) {
            this.colliderDisplay = colliderDisplay;
        }
    }
}

