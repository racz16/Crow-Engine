import { Component } from '../../Component';
import { vec3, ReadonlyVec3 } from 'gl-matrix';
import { GameObject } from '../../../core/GameObject';
import { Utility } from '../../../utility/Utility';
import { GlUbo } from '../../../webgl/buffer/GlUbo';
import { BlinnPhongLightsStruct } from './BlinnPhongLightsStruct';
import { BlinnPhongLightStructConstants } from './BlinnPhongLightStructConstants';

export abstract class BlinnPhongLightComponent extends Component {

    private diffuseColor = vec3.fromValues(1, 1, 1);
    private specularColor = vec3.fromValues(1, 1, 1);
    private ambientColor = vec3.fromValues(0.1, 0.1, 0.1);

    protected computeOffset(offset: number, index: number): number {
        return index * BlinnPhongLightStructConstants.LIGHT_DATASIZE + offset;
    }

    public getDiffuseColor(): ReadonlyVec3 {
        return this.diffuseColor;
    }

    public setDiffuseColor(diffuse: ReadonlyVec3): void {
        if (!Utility.isColor(diffuse)) {
            throw new Error();
        }
        vec3.copy(this.diffuseColor, diffuse);
        this.invalidate();
    }

    public getSpecularColor(): ReadonlyVec3 {
        return this.specularColor;
    }

    public setSpecularColor(specular: ReadonlyVec3): void {
        if (!Utility.isColor(specular)) {
            throw new Error();
        }
        vec3.copy(this.specularColor, specular);
        this.invalidate();
    }

    public getAmbientColor(): ReadonlyVec3 {
        return this.ambientColor;
    }

    public setAmbientColor(ambient: ReadonlyVec3): void {
        if (!Utility.isColor(ambient)) {
            throw new Error();
        }
        vec3.copy(this.ambientColor, ambient);
        this.invalidate();
    }

    protected handleAttach(attached: GameObject): void {
        attached.getTransform().getInvalidatables().add(this);
        BlinnPhongLightsStruct.getInstance().addLight(this);
    }

    protected handleDetach(detached: GameObject): void {
        detached.getTransform().getInvalidatables().remove(this);
        BlinnPhongLightsStruct.getInstance().removeLight(this);
    }

    public abstract _refresh(ubo: GlUbo, index: number): void;

}
