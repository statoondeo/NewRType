class RedSparkGameObject extends SparkGameObject {
    constructor() {
        super(Services.get("ASSET").get("Images/redspark.png"));
    }
        
    getClone() {
        return new RedSparkGameObject();
    }
}
