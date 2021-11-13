class PurpleSparkGameObject extends SparkGameObject {
    constructor() {
        super(Services.get(Services.ASSET).getImage("Images/purplespark.png"));
    }
                            
    getClone() {
        return new PurpleSparkGameObject();
    }
}
