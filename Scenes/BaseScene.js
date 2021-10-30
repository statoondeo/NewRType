class BaseScene {
    // Le scheduler est l'objet qui gère le déroulement du temps au sein de la scène
    constructor(scheduler) {
        this.scheduler = scheduler;

        // Collection de gameObjects à traiter
        this.gameObjectsCollection = [];

        // Partition entre les gameObjects du joueur et ceux du jeu pour faciliter les collisions
        this.gameObjectsPartitions = [];
        this.gameObjectsPartitions[BaseScene.PLAYER_PARTITION] = [];
        this.gameObjectsPartitions[BaseScene.GAME_PARTITION] = [];
    }

    static PLAYER_PARTITION = 1;
    static GAME_PARTITION = 2;

    // Tous les gameObjects sont gérés dans une liste triée
    // sur la couche sur laquelle il doivent apparaitre
    // afin de gérer les backgrounds et les foregrounds
    // La couche principale sur laquelle évoluent le joueur et 
    // les aliens est la couche 1.
    // Les backgrounds devront recevoir une valeur allant de 0 à 1 exclus
    // Les foregrounds devront recevoir une valeur supérieur à 1
    // Cette valeur représente aussi la vitesse de défilement du background/foreground
    addGameObject(gameObjet) {
        // TODO : On cherche la place du nouvel élément dans le tableau

        // On procède par dichotomie pour être plus efficace
        this.gameObjectsCollection.splice(this.searchNewItemIndex(this.gameObjectsCollection, 0, this.gameObjectsCollection.length, gameObjet.layer), 0, gameObjet);

        // On recherche l'index à partir duquel ajouter notre nouvel élément (TODO2 : Ne pas parcourir le tableau)
        // let index = 0;
        // while (index < this.gameObjectsCollection.length && gameObjet.layer >= this.gameObjectsCollection[index].layer) {
        //     index++;
        // }
        // this.gameObjectsCollection.splice(index, 0, gameObjet);

        // Tri du tableau à chaque insertion (TODO1 remplacer par une insertion dans un tableau trié)
        // this.gameObjectsCollection.push(gameObjet);
        // this.gameObjectsCollection.sort((a, b) => a.layer - b.layer);

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

    update(dt) {
        // On avance dans la scène
        this.scheduler.update(dt);

        // // Gestion des collisions
        // // Aménagement des boucles pour ne pas traiter les collisions en double
        // // On ne teste que les cases avec O 
        // // (les X représente le test d'un objet avec lui-même)
        // // (les N représente les tests à ne pas faire, parce que déjà fait du côté O)
        // //  i/j A   B   C   D   E   F
        // //  A   X   O   O   O   O   O
        // //  B   N   X   O   O   O   O
        // //  C   N   N   X   O   O   O
        // //  D   N   N   N   X   O   O
        // //  E   N   N   N   N   X   O
        // //  F   N   N   N   N   N   X

        // // Parcour de l'ensemble des éléments de la liste
        // for (let i = 0; i < this.gameObjectsCollection.length; i++) {
        //     const currentGameObject = this.gameObjectsCollection[i];
        //     currentGameObject.collideBox.isCollided = false;

        //     // Cet élément sera opposé aux éléments qui le suivent dans la liste
        //     for (let j = i + 1; j < this.gameObjectsCollection.length; j++) {
        //         const testedGameObject = this.gameObjectsCollection[j];

        //         // Si il y a collision, on le signale aux gameObjects concernés
        //         let collision = Collider.isCollision(currentGameObject.collideBox, testedGameObject.collideBox);
        //         currentGameObject.collideBox.isCollided ||= collision;
        //         testedGameObject.collideBox.isCollided ||= collision;            
        //     }                
        // }

        this.gameObjectsPartitions[BaseScene.GAME_PARTITION].forEach(gameGameObject => {
            gameGameObject.collideBox.isCollided = false;            
        });

        this.gameObjectsPartitions[BaseScene.PLAYER_PARTITION].forEach(playerGameObject => {
            playerGameObject.collideBox.isCollided = false;
            this.gameObjectsPartitions[BaseScene.GAME_PARTITION].forEach(gameGameObject => {
                if (gameGameObject.status == GameObject.ACTIVE && gameGameObject.collideBox.type != BaseCollideBox.NONE) {
                    let collision = Collider.isCollision(playerGameObject.collideBox, gameGameObject.collideBox);
                    playerGameObject.collideBox.isCollided ||= collision;
                    gameGameObject.collideBox.isCollided ||= collision;            
                }
            });
        });

        // TODO : Comment gérer ces 3 états sans devoir parcourir la liste complète à chaque fois!

        // On ne traite que les gameObjects en activité
        // et on supprime les gameObjects qui sont obsolètes
        let gameObjectsToKillCollection = [];
        this.gameObjectsCollection.forEach(gameObject => {
            if (gameObject.status == GameObject.ACTIVE) {

                // Update du gameObject
                gameObject.update(dt);

                // Si il est devenu obsolète, on le marque comme étant à supprimer
                if (gameObject.status == GameObject.OUTDATED) {
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
    }

    draw(context) {        
        // On ne dessine que les gameObjects en activité
        this.gameObjectsCollection.forEach(gameObject => {
            if (gameObject.status == GameObject.ACTIVE) {
                gameObject.draw(context);
            }
        });

        if (ServiceLocator.getService(ServiceLocator.PARAMETER).colliderDisplay) {
            // On affiche des informations de debug
            context.save();
            context.fillStyle = "White";
            context.font = "normal 10pt Arial";
            context.fillText("GameObjects       : " + this.gameObjectsCollection.length, 10, 50);
            context.fillText("PlayerPartition   : " + this.gameObjectsPartitions[BaseScene.PLAYER_PARTITION].length, 10, 80);
            context.fillText("GamePartition     : " + this.gameObjectsPartitions[BaseScene.GAME_PARTITION].length, 10, 110);
            context.restore();
        }
    }
}