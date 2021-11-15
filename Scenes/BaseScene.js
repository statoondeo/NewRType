class BaseScene {
    // Le scheduler est l'objet qui gère le déroulement du temps au sein de la scène
    constructor() {
        // métronome de la scène
        this.scheduler = null;

          // Partition spatiale recréée à chaque update
        this.quadTree = null;

        // Collection de gameObjects à traiter
        this.gameObjectsCollection = [];

        // Partition entre les gameObjects du joueur et ceux du jeu pour faciliter les collisions
        this.gameObjectsPartitions = [];
        this.gameObjectsPartitions[GameObjectPartition.PLAYER_PARTITION] = [];
        this.gameObjectsPartitions[GameObjectPartition.GAME_PARTITION] = [];
        this.gameObjectsPartitions[GameObjectPartition.NEUTRAL_PARTITION] = [];

        // Vaisseau du joueur
        this.playerShip = null;

        this.fadingLayer = null;

        this.music = null;
    }

    addPlayerShip(playerShip) {
        this.playerShip = playerShip;
        this.addGameObject(this.playerShip);
    }

    addSynchronizedGameObject(gameObjet) {
        this.scheduler.register(gameObjet);
        this.addGameObject(gameObjet);
    }

    addGameObject(gameObjet) {
        // On cherche la place du nouvel élément dans le tableau
        this.gameObjectsCollection.splice(this.searchNewItemIndex(this.gameObjectsCollection, 0, this.gameObjectsCollection.length, gameObjet.layer), 0, gameObjet);

        // Partition entre les gameObjects du joueur, du décor et ceux du jeu pour faciliter les collisions
        this.gameObjectsPartitions[gameObjet.partition].push(gameObjet);
    }

    // Chargement de la scène
    load() {
        // Initialisation de la scène
        this.gameObjectsCollection = [];

        // On ajoute de suite la couche permettant les transitions de début et fin
        // Par défaut ce sera un ecran noir
        let screen = Services.get(Services.SCREEN);
        let canvas = ImageHandler.createCanvas(screen.width, screen.height);
        let context = canvas.getContext("2d");
        context.fillStyle = "black";
        context.fillRect(0, 0, screen.width, screen.height);
        this.fadingLayer = new FadingLayer(canvas, true);
        this.addGameObject(this.fadingLayer);
    }

    // Gestion des début et fin de la scène
    show(command) {
        this.fadingLayer.hide(command);
        this.music.currentTime = 0;
        this.music.volume = 0.25;
        // this.music.play();
    }

    hide(command) {
        this.fadingLayer.show(command);
        // setTimeout(() => {
        //     this.music.pause();
        // }, 1000);
    }

    // Le tableau étant trié, on peut rechercher par dichotomie pour être plus performant
    searchNewItemIndex(array, indexMin, indexMax, value) {
        // Le placement du nouvel item est trouvé
        if (indexMin == indexMax) return indexMin;

        // On coupe l'intervale restant en 2
        let index = Math.floor((indexMin + indexMax) / 2);

        // On détermine dans quelle partie de tableau rechercher
        if (value >= array[index].layer) {

            // On recherche le position dans la partie droite du tableau
            return this.searchNewItemIndex(array, index + 1, indexMax, value);
        }
        else {

            // On recherche le position dans la partie gauche
            return this.searchNewItemIndex(array, indexMin, index, value);
        }
    }

    manageCollision() {
        // On remplit notre quadTree pour la partition spatiale des gameObjects
        // (Seuls les gameObjects intervenants dans les collisions sont retenus)
        let screen = Services.get(Services.SCREEN);
        this.quadTree = new QuadTree(new Vec2(), new Vec2(screen.width, screen.height));
        this.gameObjectsCollection.forEach(gameObject => {
            if (gameObject.status == GameObjectState.ACTIVE && gameObject.collideBox.type != CollideBoxType.NONE) {
                this.quadTree.addItem(gameObject);
            }
        });

        let collision = false;
        this.gameObjectsCollection.forEach(gameObject => {
            gameObject.collideBox.setCollided(false);

            // On ne traite que les objets qui ont une collideBox et qui sont actifs
            if (gameObject.collideBox.type != CollideBoxType.NONE && gameObject.status == GameObjectState.ACTIVE) {

                // On cherche les candidats à la collision avec notre gameObject
                this.quadTree.getCandidates(gameObject.collideBox).forEach(targetGameObject => {

                    // Les éléments doivent être dans des partitions différentes, 
                    // être active et avoir une collideBox
                    // pour vérifier une collision
                    if ((targetGameObject.partition != gameObject.partition) && 
                        (targetGameObject.status == GameObjectState.ACTIVE) && 
                        (targetGameObject.collideBox.type != CollideBoxType.NONE) &&
                        (collision = gameObject.collideBox.collide(targetGameObject.collideBox))) {

                            // Si une collision est détectée, on exécute le comportement associé du gameObject
                            // matérialisé dans une commande
                            gameObject.collideCommand.execute(targetGameObject);      
                    }
                });
            }
        });        
    }

    update(dt) {
        // On avance dans la scene
        this.scheduler.update(dt);

        // On synchronise les fondu de l'écran et de la musique
        this.music.volume = 1 - this.fadingLayer.getRatio();

        // On ne traite que les gameObjects en activité
        // et on supprime les gameObjects qui sont obsolètes
        let gameObjectsToKillCollection = [];
        this.gameObjectsCollection.forEach(gameObject => {

            if (gameObject.status == GameObjectState.ACTIVE) {

                // Update du gameObject
                gameObject.update(this.scheduler.getDeltaTime());

                // Si il est devenu obsolète, on le marque comme étant à supprimer
                if (gameObject.status == GameObjectState.OUTDATED) {
                    gameObjectsToKillCollection.push(gameObject);
                }
            }
            else if (gameObject.status == GameObjectState.OUTDATED) {
                gameObjectsToKillCollection.push(gameObject);
            }
        });
        
        // On supprime tous les gameObjects obsolètes
        gameObjectsToKillCollection.forEach(gameObject => {
            let index = this.gameObjectsCollection.indexOf(gameObject);
            if (index >= 0) {
                this.gameObjectsCollection.splice(index, 1);

                // On le supprime aussi de sa partition
                index = this.gameObjectsPartitions[gameObject.partition].indexOf(gameObject);
                if (index >= 0) {
                    this.gameObjectsPartitions[gameObject.partition].splice(index, 1);
                }    
            }            
        });       

        this.manageCollision();
    }

    draw(context) {        
        // On ne dessine que les gameObjects en activité
        this.gameObjectsCollection.forEach(gameObject => {
            if (gameObject.status == GameObjectState.ACTIVE) {
                gameObject.draw(context);
            }
        });

        if (Services.get(Services.PARAMETER).colliderDisplay) {
            context.fillStyle = "White";
            context.font = "normal 10pt neuropol";
            context.fillText("Game objects : " + this.gameObjectsCollection.length, 5, 775);
            context.fillText("Fps : " + Math.floor(fpsList.reduce((a, b) => a + b) / fpsList.length), 5, 795);

            // Affichage du quadTree
            if (null != this.quadTree) {
                this.quadTree.draw(context);
            }
        }
    }
}