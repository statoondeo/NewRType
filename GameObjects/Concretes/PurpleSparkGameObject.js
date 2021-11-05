class PurpleSparkGameObject extends SparkGameObject {
    constructor() {
        super(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("images/purplespark.png"));
    }
}
