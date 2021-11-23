class SoundPool {
    constructor(sound, number) {
        this.sounds = [];
        this.index = 0;
        this.number = number;
        for (let index = 0; index < this.number; index++) {
            this.sounds.push(sound.cloneNode());
        }
    }

    play() {
        this.sounds[this.index].play();
        this.index = (this.index + 1) % this.number; 
    }    
}
class GameObjectPool {
    constructor(prototype, maxObject) {
        this.prototype = prototype;
        this.currentIndex = 0;
        this.maxObject = maxObject;

        // Initialisation du tableau d'objet
        this.objects = [];
        for (let index = 0; index < this.maxObject; index++) {
            this.objects.push(this.prototype.getClone());           
        }
    }

    getNew() {
        let nbSearch = 0;
        let roundUp = false;
        while(!roundUp && this.objects[this.currentIndex].status != "OUTDATED") {
            this.currentIndex++;
            this.currentIndex %= this.maxObject;
            nbSearch++;
            roundUp = nbSearch >= this.maxObject;
        }
        if (roundUp) {
            // Aucun slot disponible, on ajoute un nouvel item et on signale le dépassement
            throw new Error("Dépassement du pool");
        }
        // On retourne l'objet trouvé pour recyclage
        return this.objects[this.currentIndex]
    }
}