class PurpleSparkGameObject extends SparkGameObject {
    constructor() {
        super(Services.get(Services.ASSET).get("Images/purplespark.png"));
    }
                            
    getClone() {
        return new PurpleSparkGameObject();
    }
}
