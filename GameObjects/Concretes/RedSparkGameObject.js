class RedSparkGameObject extends SparkGameObject {
    constructor() {
        super(Services.get(Services.ASSET).get("Images/redspark.png"));
    }
        
    getClone() {
        return new RedSparkGameObject();
    }
}
