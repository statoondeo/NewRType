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

}