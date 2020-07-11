import { Component } from '../../Component';
import { vec3, ReadonlyVec3 } from 'gl-matrix';
import { GameObject } from '../../../core/GameObject';
import { Utility } from '../../../utility/Utility';
import { GlUbo } from '../../../webgl/buffer/GlUbo';
import { PbrLightsStruct } from './PbrLightsStruct';
import { PbrLightStructConstants } from './PbrLightStructConstants';

export abstract class PbrLightComponent extends Component {

    private color = vec3.fromValues(1, 1, 1);
    private intensity = 1.0;

    protected computeOffset(offset: number, index: number): number {
        return index * PbrLightStructConstants.LIGHT_DATASIZE + offset;
    }

    public getColor(): ReadonlyVec3 {
        return this.color;
    }

    public setColor(color: ReadonlyVec3): void {
        if (!Utility.isColor(color)) {
            throw new Error();
        }
        vec3.copy(this.color, color);
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
        attached.getTransform().getInvalidatables().add(this);
        PbrLightsStruct.getInstance().addLight(this);
    }

    protected handleDetach(detached: GameObject): void {
        detached.getTransform().getInvalidatables().remove(this);
        PbrLightsStruct.getInstance().removeLight(this);
    }

    public abstract _refresh(ubo: GlUbo, index: number): void;

}
