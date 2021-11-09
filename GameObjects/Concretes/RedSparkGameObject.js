class RedSparkGameObject extends SparkGameObject {
    constructor() {
        super(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("Images/redspark.png"));
    }
        
    getClone() {
        return new RedSparkGameObject();
    }
}
