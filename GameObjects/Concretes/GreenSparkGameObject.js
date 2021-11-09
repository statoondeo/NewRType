class GreenSparkGameObject extends SparkGameObject {
    constructor() {
        super(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("Images/greenspark.png"));
    }
                
    getClone() {
        return new GreenSparkGameObject();
    }
}
