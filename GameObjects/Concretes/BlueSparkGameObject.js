class BlueSparkGameObject extends SparkGameObject {
    constructor() {
        super(Services.get(Services.ASSET).getImage("Images/bluespark.png"));
    }
    
    getClone() {
        return new BlueSparkGameObject();
    }
}
