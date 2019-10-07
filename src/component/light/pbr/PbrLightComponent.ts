import { Component } from '../../Component';
import { vec3 } from 'gl-matrix';
import { GameObject } from '../../../core/GameObject';
import { Utility } from '../../../utility/Utility';
import { Ubo } from '../../../webgl/buffer/Ubo';
import { PbrLightsStruct } from './PbrLightsStruct';

export abstract class PbrLightComponent extends Component {

    protected static readonly COLOR_OFFSET = 0;
    protected static readonly DIRECTION_OFFSET = 16;
    protected static readonly POSITION_OFFSET = 32;
    protected static readonly CUTOFF_OFFSET = 48;
    protected static readonly INTENSITY_OFFSET = 56;
    protected static readonly RANGE_OFFSET = 60;
    protected static readonly TYPE_OFFSET = 64;
    protected static readonly ACTIVE_OFFSET = 68;

    protected static readonly LIGHT_DATASIZE = 80;
    protected static readonly DIRECTIONAL_LIGHT_TYPE = 0;
    protected static readonly POINT_LIGHT_TYPE = 1;
    protected static readonly SPOT_LIGHT_TYPE = 2;

    private color = vec3.fromValues(1, 1, 1);
    private intensity = 1.0;

    public constructor() {
        super();
        PbrLightsStruct.getInstance().addLight(this);
    }

    protected computeOffset(offset: number, index: number): number {
        return index * PbrLightComponent.LIGHT_DATASIZE + offset;
    }

    public getColor(): vec3 {
        return vec3.clone(this.color);
    }

    public setColor(color: vec3): void {
        if (!Utility.isColor(color)) {
            throw new Error();
        }
        this.color.set(color);
        this.invalidate();
    }

    public getIntensity(): number {
        return this.intensity;
    }

    public setIntensity(intensity: number): void {
        if (intensity < 0) {
            throw new Error();
        }
        this.intensity = intensity;
    }

    protected handleAttach(attached: GameObject): void {
        attached.getTransform().getInvalidatables().addInvalidatable(this);
    }

    protected handleDetach(detached: GameObject): void {
        detached.getTransform().getInvalidatables().removeInvalidatable(this);
    }

    protected abstract refresh(ubo: Ubo, index: number): void;

}
