class PurpleSparkGameObject extends SparkGameObject {
    constructor() {
        super(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("Images/purplespark.png"));
    }
                            
    getClone() {
        return new PurpleSparkGameObject();
    }
}
