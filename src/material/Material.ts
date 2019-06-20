import { ParameterKey } from "../utility/parameter/ParameterKey";
import { MaterialSlot } from "./MaterialSlot";
import { Parameter } from "../utility/parameter/Parameter";
import { ParameterContainer } from "../utility/parameter/ParameterContainer";

export class Material {

    public static readonly REFRACTION_INDEX = new ParameterKey<Number>(Number, "REFRACTION_INDEX");
    public static readonly DIFFUSE = new ParameterKey<MaterialSlot>(MaterialSlot, "DIFFUSE");
    public static readonly SPECULAR = new ParameterKey<MaterialSlot>(MaterialSlot, "SPECULAR");
    public static readonly NORMAL = new ParameterKey<MaterialSlot>(MaterialSlot, "NORMAL");
    public static readonly REFLECTION = new ParameterKey<MaterialSlot>(MaterialSlot, "REFLECTION");
    public static readonly REFRACTION = new ParameterKey<MaterialSlot>(MaterialSlot, "REFRACTION");
    public static readonly ENVIRONMENT_INTENSITY = new ParameterKey<MaterialSlot>(MaterialSlot, "ENVIRONMENT_INTENSITY");
    private readonly slots = new ParameterContainer();
    private readonly parameters = new ParameterContainer();
    //private Class<? extends GeometryRenderer> renderer;

    /*public constructor(renderer: Class<? extends GeometryRenderer> ){
        if(renderer == null){
            throw new Error();
        }
        this.renderer = renderer;
    }

    public Class<? extends GeometryRenderer> getRenderer(){
        return renderer;
    }*/

    public getSlot(key: ParameterKey<MaterialSlot>): MaterialSlot {
        return this.slots.getValue(key);
    }

    public setSlot(key: ParameterKey<MaterialSlot>, slot: MaterialSlot): void {
        this.slots.set(key, new Parameter<MaterialSlot>(slot));
    }

    public getParameters(): ParameterContainer {
        return this.parameters;
    }

}
