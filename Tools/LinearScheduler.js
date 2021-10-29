class BaseScheduler {
    constructor() {
        this.observers = []
    }

    register(observer) {
        this.observers.push(observer);
    }
    
    unregister(observer) {
        let index = this.observers.indexOf(observer);
        if (index != -1) {
            this.observers.splice(index, 1);
        }
    }

    notify() {
        this.observers.forEach(observer => {
            observer.subjectChanged(this);
        });
    }
}

class LinearScheduler extends BaseScheduler {
    constructor(speed, startingStep) {
        super();
        this.speed = speed;
        this.currentStep = startingStep;
    }

    update(dt) {
        // Avancement linéaire du currentStep
        this.currentStep += this.speed * dt; 
        this.notify();
    }
}

// Métronome ne faisant rien pour les scènes sans avancement comme le menu principal par exemple.
class DummyScheduler extends BaseScheduler {
    constructor() {
        super();
    }

    register(observer) {
    }
    
    unregister(observer) {
    }

    notify() {
    }

    update(dt) {
    }
}