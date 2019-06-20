import { Parameter } from "./Parameter";
import { IComponent } from "../../component/IComponent";

export class ComponentParameter<T extends IComponent> extends Parameter<T>{

    public constructor(value: T) {
        super(value);
    }

    public getValue(): T {
        const ret = super.getValue();
        if (ret.getGameObject() == null) {
            throw new Error();
        }
        return ret;
    }

    public private_addedToParameters(removed: Parameter<T>): void {
        if (this.getValue().getGameObject() == null) {
            throw new Error();
        }
        this.getValue().invalidate();
    }

    protected refresh(old: T): void {
        this.getValue().invalidate();
    }

}
