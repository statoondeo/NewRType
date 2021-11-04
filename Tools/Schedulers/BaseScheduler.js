class BaseScheduler {
    constructor() {
        this.observers = []
        this.lastDt = 0;
        this.baseSpeed = 1;
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

    update(dt) {
        this.lastDt = dt;
    }

    getDeltaTime() {
        return this.lastDt * this.baseSpeed;
    }
}
