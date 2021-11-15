class BlueSparkGameObject extends SparkGameObject {
    constructor() {
        super(Services.get(Services.ASSET).get("Images/bluespark.png"));
    }
    
    getClone() {
        return new BlueSparkGameObject();
    }
}
