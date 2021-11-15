class GreenSparkGameObject extends SparkGameObject {
    constructor() {
        super(Services.get(Services.ASSET).get("Images/greenspark.png"));
    }
                
    getClone() {
        return new GreenSparkGameObject();
    }
}
