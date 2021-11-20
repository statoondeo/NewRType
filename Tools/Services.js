class ServicesLocator {
    // static SCREEN = 0;
    // static ASSET = 1;
    // static INPUT = 2;
    // static SCENE = 3;
    // static PARAMETER = 4;
    // static AUDIO = 5;

    constructor() {
        this.services = [];
    }

    register(serviceType, service) {
        this.services[serviceType] = service;
    }

    get(serviceType) {
        return this.services[serviceType];
    }   
}