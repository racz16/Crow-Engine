import { BlinnPhongPositionalLightComponent } from './BlinnPhongPositionalLightComponent';
import { GlUbo } from '../../../webgl/buffer/GlUbo';
import { BlinnPhongLightStructConstants } from './BlinnPhongLightStructConstants';

export class BlinnPhongPointLightComponent extends BlinnPhongPositionalLightComponent {

    public _refresh(ubo: GlUbo, index: number) {
        ubo.store(new Float32Array(this.getAmbientColor()), this.computeOffset(BlinnPhongLightStructConstants.DIFFUSE_OFFSET, index));
        ubo.store(new Float32Array(this.getDiffuseColor()), this.computeOffset(BlinnPhongLightStructConstants.DIFFUSE_OFFSET, index));
        ubo.store(new Float32Array(this.getSpecularColor()), this.computeOffset(BlinnPhongLightStructConstants.SPECULAR_OFFSET, index));
        ubo.store(new Float32Array(this.getGameObject().getTransform().getAbsolutePosition()), this.computeOffset(BlinnPhongLightStructConstants.POSITION_OFFSET, index));
        ubo.store(new Float32Array([this.getConstant(), this.getLinear(), this.getQuadratic()]), this.computeOffset(BlinnPhongLightStructConstants.ATTENUATION_OFFSET, index));
        ubo.store(new Int32Array([BlinnPhongLightStructConstants.POINT_LIGHT_TYPE]), this.computeOffset(BlinnPhongLightStructConstants.TYPE_OFFSET, index));
        ubo.store(new Int32Array([this.isActive() ? 1 : 0]), this.computeOffset(BlinnPhongLightStructConstants.ACTIVE_OFFSET, index));
    }

}
