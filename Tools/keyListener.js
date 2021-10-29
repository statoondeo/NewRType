// Classe permettant de conserver l'état des touches d'une frame à l'autre
// dans un tableau associatif pour eviter de déclarer des variables en serie!
// TODO : Gérer un masque pour se limiter à certaines touches?
class KeyListener {
    constructor() {
        // On conserve les états des touches du clavier
        // Etat courant
        this.keyStates = [];

        // Etat précédent
        this.keyOldStates = [];

        // Coordonnées de la souris
        this.mouse = new Vec2();
        
        // Coordonnées du dernier click
        this.click = new Vec2();
    }

    // Si un contrôle d'interface intercepte le click, il peut se réinitialiser
    // pour éviter que d'autres contrôles ne l'intercepte également.
    initCLick() {
        this.click.x = this.click.y = -1;
    }

    // Mise à jour du contrôleur d'entrée
    update(dt) {
        this.initCLick();
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

    // Est-ce que la souris a été clickée? 'sans distinction du bouton)
    isClicked() {
        return(-1 != this.click.x && -1 != this.click.y);
    }
}

