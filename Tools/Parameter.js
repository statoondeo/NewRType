class Parameter {
    constructor() {
        // Affichage en mode collideBox
        this.colliderDisplay = true;
        this.observers = []
    }
    
    setColliderDisplay(colliderDisplay) {
        if (this.colliderDisplay != colliderDisplay) {
            this.colliderDisplay = colliderDisplay;
            this.notify("colliderDisplay");
        }
    }

    register(observer) {
        this.observers.push(observer);
        this.notify("");
    }
    
    unregister(observer) {
        let index = this.observers.indexOf(observer);
        if (index != -1) {
            this.observers.splice(index, 1);
        }
    }

    notify(property) {
        this.observers.forEach(observer => {
            observer.subjectChanged(this, property);
        });
    }
}

