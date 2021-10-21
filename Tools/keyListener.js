class KeyListener {
    constructor(document) {
        this.keyStates = [];
    }

    getKeyStatus(key) {
        return this.keyStates[key] == null ? false : this.keyStates[key];
    }

    switchOn(key) {
        this.keyStates[key] = true;
    }
    
    switchOff(key) {
        this.keyStates[key] = false;
    }
}

