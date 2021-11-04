class BaseScene {
    // Le scheduler est l'objet qui gère le déroulement du temps au sein de la scène
    constructor(scheduler) {
        // métronome de la scène
        this.scheduler = scheduler;

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
    }

    addPlayerShip(playerShip) {
        this.playerShip = playerShip;
        this.addGameObject(this.playerShip);
    }

    addGameObject(gameObjet) {
        // TODO : On cherche la place du nouvel élément dans le tableau

        // On procède par dichotomie pour être plus efficace
        this.gameObjectsCollection.splice(this.searchNewItemIndex(this.gameObjectsCollection, 0, this.gameObjectsCollection.length, gameObjet.layer), 0, gameObjet);

        // Partition entre les gameObjects du joueur et ceux du jeu pour faciliter les collisions
        this.gameObjectsPartitions[gameObjet.partition].push(gameObjet);
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
        let screen = ServiceLocator.getService(ServiceLocator.SCREEN);
        this.quadTree = new QuadTree(new Vec2(), new Vec2(screen.width, screen.height));
        this.gameObjectsCollection.forEach(gameObject => {
            if (gameObject.status == GameObjectState.ACTIVE && gameObject.collideBox.type != BaseCollideBox.NONE) {
                this.quadTree.addItem(gameObject);
            }
        });

        let collision = false;
        this.gameObjectsCollection.forEach(gameObject => {
            gameObject.collideBox.isCollided = false;

            // On ne traite que les candidats à la collision avec notre gameObject
            this.quadTree.getCandidates(gameObject.collideBox).forEach(targetGameObject => {

                // Les éléments doivent être dans des partitions différentes, 
                // être active et avoir une collideBox
                // pour vérifier une collision
                if ((targetGameObject.partition != gameObject.partition) && 
                    (targetGameObject.status == GameObjectState.ACTIVE) && 
                    (targetGameObject.collideBox.type != BaseCollideBox.NONE) &&
                    (collision = Collider.isCollision(targetGameObject.collideBox, gameObject.collideBox))) {

                        gameObject.collideWith(targetGameObject);      
                }
            });
        });        
    }

    update(dt) {
        // On avance dans la scene
        this.scheduler.update(dt);

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

        if (ServiceLocator.getService(ServiceLocator.PARAMETER).colliderDisplay) {
            // Affichage du quadTree
            if (null != this.quadTree) {
                this.quadTree.draw(context);
            }
        }
    }
}