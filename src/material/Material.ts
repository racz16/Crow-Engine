import { ParameterKey } from '../utility/parameter/ParameterKey';
import { MaterialSlot } from './MaterialSlot';
import { ParameterContainer } from '../utility/parameter/ParameterContainer';
import { GeometryRenderer } from '../rendering/GeometryRenderer';

export class Material<T extends GeometryRenderer> {

    private readonly slots = new ParameterContainer();
    private readonly parameters = new ParameterContainer();
    private readonly rendererType: new (..._) => T;

    public constructor(rendererType: new (..._) => T) {
        this.rendererType = rendererType;
    }

    public getRenderer(): new (..._) => T {
        return this.rendererType;
    }

    public getSlot(key: ParameterKey<MaterialSlot>): MaterialSlot {
        return this.slots.get(key);
    }

    public setSlot(key: ParameterKey<MaterialSlot>, slot: MaterialSlot): void {
        if (!key) {
            throw new Error();
        }
        this.slots.set(key, slot);
    }

    public getParameters(): ParameterContainer {
        return this.parameters;
    }

}
