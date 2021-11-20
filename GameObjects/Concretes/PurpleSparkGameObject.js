class PurpleSparkGameObject extends SparkGameObject {
    constructor() {
        super(Services.get("ASSET").get("Images/purplespark.png"));
    }
                            
    getClone() {
        return new PurpleSparkGameObject();
    }
}
