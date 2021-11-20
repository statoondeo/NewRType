class BlueSparkGameObject extends SparkGameObject {
    constructor() {
        super(Services.get("ASSET").get("Images/bluespark.png"));
    }
    
    getClone() {
        return new BlueSparkGameObject();
    }
}
