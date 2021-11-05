class Parameter {
    constructor() {
        // Affichage en mode collideBox
        this.colliderDisplay = true;
    }
    
    setColliderDisplay(colliderDisplay) {
        if (this.colliderDisplay != colliderDisplay) {
            this.colliderDisplay = colliderDisplay;
        }
    }
}

