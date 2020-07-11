import { BlinnPhongPositionalLightComponent } from './BlinnPhongPositionalLightComponent';
import { GlUbo } from '../../../webgl/buffer/GlUbo';
import { Utility } from '../../../utility/Utility';
import { BlinnPhongLightStructConstants } from './BlinnPhongLightStructConstants';

export class BlinnPhongSpotLightComponent extends BlinnPhongPositionalLightComponent {

    private cutoff = 12.5;
    private outerCutoff = 15.0;

    public _refresh(ubo: GlUbo, index: number) {
        ubo.store(new Float32Array(this.getAmbientColor()), this.computeOffset(BlinnPhongLightStructConstants.AMBIENT_OFFSET, index));
        ubo.store(new Float32Array(this.getDiffuseColor()), this.computeOffset(BlinnPhongLightStructConstants.DIFFUSE_OFFSET, index));
        ubo.store(new Float32Array(this.getSpecularColor()), this.computeOffset(BlinnPhongLightStructConstants.SPECULAR_OFFSET, index));
        ubo.store(new Float32Array(this.getGameObject().getTransform().getForwardVector()), this.computeOffset(BlinnPhongLightStructConstants.DIRECTION_OFFSET, index));
        ubo.store(new Float32Array(this.getGameObject().getTransform().getAbsolutePosition()), this.computeOffset(BlinnPhongLightStructConstants.POSITION_OFFSET, index));
        ubo.store(new Float32Array([this.getConstant(), this.getLinear(), this.getQuadratic()]), this.computeOffset(BlinnPhongLightStructConstants.ATTENUATION_OFFSET, index));
        ubo.store(new Float32Array([Math.cos(Utility.toRadians(this.getCutoff())), Math.cos(Utility.toRadians(this.getOuterCutoff()))]), this.computeOffset(BlinnPhongLightStructConstants.CUTOFF_OFFSET, index));
        ubo.store(new Int32Array([BlinnPhongLightStructConstants.SPOT_LIGHT_TYPE]), this.computeOffset(BlinnPhongLightStructConstants.TYPE_OFFSET, index));
        ubo.store(new Int32Array([this.isActive() ? 1 : 0]), this.computeOffset(BlinnPhongLightStructConstants.ACTIVE_OFFSET, index));
    }

    public getCutoff(): number {
        return this.cutoff;
    }

    public setCutoff(cutoff: number): void {
        if (cutoff <= 0 || cutoff >= this.outerCutoff) {
            throw new Error();
        }
        this.cutoff = cutoff;
        this.invalidate();
    }

    public getOuterCutoff(): number {
        return this.outerCutoff;
    }

    public setOuterCutoff(outerCutoff: number): void {
        if (this.cutoff >= outerCutoff || outerCutoff > 90) {
            throw new Error();
        }
        this.outerCutoff = outerCutoff;
        this.invalidate();
    }

}
