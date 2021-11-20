class GreenSparkGameObject extends SparkGameObject {
    constructor() {
        super(Services.get("ASSET").get("Images/greenspark.png"));
    }
                
    getClone() {
        return new GreenSparkGameObject();
    }
}
