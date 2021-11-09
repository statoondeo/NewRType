class BlueSparkGameObject extends SparkGameObject {
    constructor() {
        super(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("Images/bluespark.png"));
    }
    
    getClone() {
        return new BlueSparkGameObject();
    }
}
