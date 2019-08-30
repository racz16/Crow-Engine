import { Component } from '../../Component';
import { vec3 } from 'gl-matrix';
import { GameObject } from '../../../core/GameObject';
import { Utility } from '../../../utility/Utility';
import { Ubo } from '../../../webgl/buffer/Ubo';
import { BlinnPhongLightsStruct } from './BlinnPhongLightsStrct';

export abstract class BlinnPhongLightComponent extends Component {

    protected static readonly AMBIENT_OFFSET = 0;
    protected static readonly DIFFUSE_OFFSET = 16;
    protected static readonly SPECULAR_OFFSET = 32;
    protected static readonly DIRECTION_OFFSET = 48;
    protected static readonly POSITION_OFFSET = 64;
    protected static readonly ATTENUATION_OFFSET = 80;
    protected static readonly CUTOFF_OFFSET = 96;
    protected static readonly TYPE_OFFSET = 104;
    protected static readonly ACTIVE_OFFSET = 108;
    protected static readonly LIGHT_DATASIZE = 112;

    private diffuseColor = vec3.fromValues(1, 1, 1);
    private specularColor = vec3.fromValues(1, 1, 1);
    private ambientColor = vec3.fromValues(0.1, 0.1, 0.1);

    public constructor() {
        super();
        BlinnPhongLightsStruct.getInstance().addLight(this);
    }

    protected computeOffset(offset: number, index: number): number {
        return index * BlinnPhongLightComponent.LIGHT_DATASIZE + offset;
    }

    public getDiffuseColor(): vec3 {
        return vec3.clone(this.diffuseColor);
    }

    public setDiffuseColor(diffuse: vec3): void {
        if (!Utility.isColor(diffuse)) {
            throw new Error();
        }
        this.diffuseColor.set(diffuse);
        this.invalidate();
    }

    public getSpecularColor(): vec3 {
        return vec3.clone(this.specularColor);
    }

    public setSpecularColor(specular: vec3): void {
        if (!Utility.isColor(specular)) {
            throw new Error();
        }
        this.specularColor.set(specular);
        this.invalidate();
    }

    public getAmbientColor(): vec3 {
        return vec3.clone(this.ambientColor);
    }

    public setAmbientColor(ambient: vec3): void {
        if (!Utility.isColor(ambient)) {
            throw new Error();
        }
        this.ambientColor.set(ambient);
        this.invalidate();
    }

    protected handleAttach(attached: GameObject): void {
        attached.getTransform().getInvalidatables().addInvalidatable(this);
    }

    protected handleDetach(detached: GameObject): void {
        detached.getTransform().getInvalidatables().removeInvalidatable(this);
    }

    protected abstract refresh(ubo: Ubo, index: number): void;

}
