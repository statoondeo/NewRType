// Classe permettant de conserver l'état des touches d'une frame à l'autre
// dans un tableau associatif pour eviter de déclarer des variables en serie!
// TODO : Gérer un masque pour se limiter à certaines touches?
class InputListener {
    constructor() {
        // On conserve les états des touches du clavier
        // Etat courant
        this.keyStates = [];

        // Etat précédent
        this.keyOldStates = [];

        // Commandes du joueur
        this.boundedCommands = [];

        // Coordonnées de la souris
        this.mouse = new Vec2();

        // Coordonnées du click
        this.click = false;
    }

    registerCommand(control, command) {
        this.boundedCommands[control] = command;
    }

    unregisterCommand(command) {
        let index = this.boundedCommands.indexOf(command);
        if (index >= 0) {
            this.boundedCommands.splice(index, 1);
        }
    }

    clearCommands() {
        this.boundedCommands = [];
    }

    mouseMove(mouseX, mouseY) {
        this.mouse.x = mouseX;
        this.mouse.y = mouseY;
    }

    mouseDown() {
        this.click = true;
    }
    
    mouseUp() {
        this.click = false;
    }

    // Gestion des contrôles utilisés par le joueur pour cette frame
    handleInput() {
        let commandsList = [];

        for (let item in this.boundedCommands) {
            if (this.isDown(item)) {
                commandsList.push(this.boundedCommands[item]);
            }
        }
        
        return commandsList;
    }

    // Est-ce que la touche était enfoncée lors de la frame précédente
    isPreviouslyDown(key) {
        return this.keyOldStates[key] == null ? false : this.keyOldStates[key];
    }

    // Une touche est enfoncée, on bascule son switch
    switchOn(key) {
        this.keyOldStates[key] = this.keyStates[key];
        this.keyStates[key] = true;
    }
    
    // Une touche est relachée on bascule son switch dans l'autre sens
    switchOff(key) {
        this.keyOldStates[key] = this.keyStates[key];
        this.keyStates[key] = false;
    }

    // Fonctions à utiliser pour connaitre l'état du clavier
    // pour se rapprocher  de ce que propose love2D
    // Est-ce que la touche est enfoncée?
    isDown(key) {
        return this.keyStates[key] == null ? false : this.keyStates[key];
    }
    
    // Est-ce que la touche vient d'être enfoncée?
    isPressed(key) {
        return this.isDown(key) && !this.isPreviouslyDown(key);
    }

    // Est-ce que la souris a été clickée
    isClicked() {
        return this.click;
    }
}

