import { ParameterKey } from '../utility/parameter/ParameterKey';
import { MaterialSlot } from './MaterialSlot';
import { ParameterContainer } from '../utility/parameter/ParameterContainer';
import { Renderer } from '../rendering/Renderer';

export class Material<T extends Renderer> {

    public static readonly REFRACTION_INDEX = new ParameterKey<Number>(Number, 'REFRACTION_INDEX');
    public static readonly DIFFUSE = new ParameterKey<MaterialSlot>(MaterialSlot, 'DIFFUSE');
    public static readonly SPECULAR = new ParameterKey<MaterialSlot>(MaterialSlot, 'SPECULAR');
    public static readonly NORMAL = new ParameterKey<MaterialSlot>(MaterialSlot, 'NORMAL');
    public static readonly REFLECTION = new ParameterKey<MaterialSlot>(MaterialSlot, 'REFLECTION');
    public static readonly REFRACTION = new ParameterKey<MaterialSlot>(MaterialSlot, 'REFRACTION');
    public static readonly ENVIRONMENT_INTENSITY = new ParameterKey<MaterialSlot>(MaterialSlot, 'ENVIRONMENT_INTENSITY');

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
