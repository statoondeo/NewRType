class AssetLoader {
    static IMAGE = "IMAGE";
    static SOUND = "SOUND";

    constructor() {
        this.assetPathes = [];
        this.assetSources = [];
        this.callBack = null;
        this.loadedAssetsCount = 0;
    }

    getLoadedRatio() {
        return this.getLoadedAssetsCount() / this.getTotalAssetsCount();
    }

    getTotalAssetsCount() {
        return this.assetPathes.length;
    }

    getLoadedAssetsCount() {
        return this.loadedAssetsCount;
    }

    add(type, assetPath) {
        this.assetPathes.push({ type : type, path : assetPath });
    }

    get(path) {
        return this.assetSources[path];
    }

    loadImage(path) {
        return new Promise((success, error) => {
            // Chargement de l'image
            let image = new Image();
            image.onload = () => {
                // Lorsque c'est terminé on resout la promesse
                success(image);
            };
            image.src = path;
        }).then((image) => {
            // Lorsque le chargement est terminé, on stocke l'asset 
            // et on met à jour le compteur d'avancement
            this.assetSources[path] = image;
            this.assetLoaded();
        });
    }
     
    loadSound(path) {
        return new Promise((success, error) => {
            // Chargement de l'image
            let audio = new Audio();
            audio.oncanplaythrough = () => {
                // Lorsque c'est terminé on resout la promesse
                success(audio);
            };
            audio.src = path;
        }).then((audio) => {
            // Lorsque le chargement est terminé, on stocke l'asset 
            // et on met à jour le compteur d'avancement
            this.assetSources[path] = audio;
            this.assetLoaded();
        });
    }

    start(callBack) {
        this.callBack = callBack;

        // Liste des promesses (une par ressource à charger)
        // (Une promesse permet d'effectuer une tâche asynchrone)
        let assetPromises = []

        // Démarrage de la récupération des assets
        this.assetPathes.forEach(asset => {
            if (asset.type == AssetLoader.IMAGE) {
                assetPromises.push(this.loadImage(asset.path));
            }
            else if (asset.type == AssetLoader.SOUND) {
                assetPromises.push(this.loadSound(asset.path));
            }
        });
        
        // On attend que toutes les promesses soient honorées
        Promise.all(assetPromises).then(() => {
            // On démarre le jeu
            this.callBack();
        });
    }

    assetLoaded() {
        this.loadedAssetsCount++;
    }
}
