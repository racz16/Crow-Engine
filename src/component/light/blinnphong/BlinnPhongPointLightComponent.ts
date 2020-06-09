import { BlinnPhongPositionalLightComponent } from './BlinnPhongPositionalLightComponent';
import { GlUbo } from '../../../webgl/buffer/GlUbo';
import { BlinnPhongLightComponent } from './BlinnPhongLightComponent';

export class BlinnPhongPointLightComponent extends BlinnPhongPositionalLightComponent {

    private static readonly POINT_LIGHT_TYPE = 1;

    protected refresh(ubo: GlUbo, index: number) {
        ubo.store(new Float32Array(this.getAmbientColor()), this.computeOffset(BlinnPhongLightComponent.DIFFUSE_OFFSET, index));
        ubo.store(new Float32Array(this.getDiffuseColor()), this.computeOffset(BlinnPhongLightComponent.DIFFUSE_OFFSET, index));
        ubo.store(new Float32Array(this.getSpecularColor()), this.computeOffset(BlinnPhongLightComponent.SPECULAR_OFFSET, index));
        ubo.store(new Float32Array(this.getGameObject().getTransform().getAbsolutePosition()), this.computeOffset(BlinnPhongLightComponent.POSITION_OFFSET, index));
        ubo.store(new Float32Array([this.getConstant(), this.getLinear(), this.getQuadratic()]), this.computeOffset(BlinnPhongLightComponent.ATTENUATION_OFFSET, index));
        ubo.store(new Int32Array([BlinnPhongPointLightComponent.POINT_LIGHT_TYPE]), this.computeOffset(BlinnPhongLightComponent.TYPE_OFFSET, index));
        ubo.store(new Int32Array([this.isActive() ? 1 : 0]), this.computeOffset(BlinnPhongLightComponent.ACTIVE_OFFSET, index));
    }

}
