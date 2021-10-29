class ServiceLocator {
    static SCREEN = 0;
    static RESOURCE = 1;
    static KEYBOARD = 2;
    static SCENE = 3;
    static PARAMETER = 4;

    static services = [];

    static registerService(serviceType, service) {
        this.services[serviceType] = service;
    }
    static getService(serviceType) {
        return this.services[serviceType];
    }   
}