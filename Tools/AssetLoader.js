class AssetLoader {
    // static IMAGE = "IMAGE";
    // static SOUND = "SOUND";

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
    
    loadSoundFailure() {

    }

    loadSound(path) {
        return new Promise((success, loadSoundFailure) => {
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
            if (asset.type == "IMAGE") {
                assetPromises.push(this.loadImage(asset.path));
            }
            else if (asset.type == "SOUND") {
                assetPromises.push(this.loadSound(asset.path));
            }
        });
        
        // On attend que toutes les promesses soient honorées
        Promise.all(assetPromises).then(() => {
            // On constitue les pool de sons, pour ne pas dépasse la limite des 75 sons ouverts en simultané
            let audioList = [];

            audioList["Sounds/Correct_06_wav.wav"] = new SoundPool(Services.get("ASSET").get("Sounds/Correct_06_wav.wav"), 3);
            audioList["Sounds/Correct_08_wav.wav"] = new SoundPool(Services.get("ASSET").get("Sounds/Correct_08_wav.wav"), 3);
            audioList["Sounds/Explosion_Sci_Fi_03_wav.wav"] = new SoundPool(Services.get("ASSET").get("Sounds/Explosion_Sci_Fi_03_wav.wav"), 3);
            audioList["Sounds/Explosion_Sci_Fi_03_variation_02_wav.wav"] = new SoundPool(Services.get("ASSET").get("Sounds/Explosion_Sci_Fi_03_variation_02_wav.wav"), 5);
            audioList["Sounds/Explosion_Sci_Fi_03_variation_01_wav.wav"] = new SoundPool(Services.get("ASSET").get("Sounds/Explosion_Sci_Fi_03_variation_01_wav.wav"), 10);
            audioList["Sounds/Rifle_v1_variation_02_wav.wav"] = new SoundPool(Services.get("ASSET").get("Sounds/Rifle_v1_variation_02_wav.wav"), 15);
            audioList["Sounds/laser1.mp3"] = new SoundPool(Services.get("ASSET").get("Sounds/laser1.mp3"), 10);
            audioList["Sounds/laser6.mp3"] = new SoundPool(Services.get("ASSET").get("Sounds/laser6.mp3"), 5);
            audioList["Sounds/laser5.mp3"] = new SoundPool(Services.get("ASSET").get("Sounds/laser5.mp3"), 10);
            audioList["Sounds/laser4.mp3"] = new SoundPool(Services.get("ASSET").get("Sounds/laser4.mp3"), 3);
            audioList["Sounds/Hover_Digital_06_wav.wav"] = new SoundPool(Services.get("ASSET").get("Sounds/Hover_Digital_06_wav.wav"), 3);
            audioList["Sounds/Click_Digital_06_wav.wav"] = new SoundPool(Services.get("ASSET").get("Sounds/Click_Digital_06_wav.wav"), 1);
            audioList["Sounds/Digital_panel_v1_variation_01_wav.wav"] = new SoundPool(Services.get("ASSET").get("Sounds/Digital_panel_v1_variation_01_wav.wav"), 2);
            audioList["Sounds/Digital_panel_v1_variation_02_wav.wav"] = new SoundPool(Services.get("ASSET").get("Sounds/Digital_panel_v1_variation_02_wav.wav"), 1);
            audioList["Sounds/Tense_01_wav.wav"] = new SoundPool(Services.get("ASSET").get("Sounds/Tense_01_wav.wav"), 1);
            audioList["Sounds/Stinger_v2_wav.wav"] = new SoundPool(Services.get("ASSET").get("Sounds/Stinger_v2_wav.wav"), 1);
            audioList["Sounds/Suspicious_01_wav.wav"] = new SoundPool(Services.get("ASSET").get("Sounds/Suspicious_01_wav.wav"), 1);

            Services.register("AUDIO", audioList);

            // On démarre le jeu
            this.callBack();
        });
    }

    assetLoaded() {
        this.loadedAssetsCount++;
    }
}
