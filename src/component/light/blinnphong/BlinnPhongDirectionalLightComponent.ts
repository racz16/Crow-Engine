import { BlinnPhongLightComponent } from './BlinnPhongLightComponent';
import { GlUbo } from '../../../webgl/buffer/GlUbo';
import { BlinnPhongLightStructConstants } from './BlinnPhongLightStructConstants';

export class BlinnPhongDirectionalLightComponent extends BlinnPhongLightComponent {

    public _refresh(ubo: GlUbo, index: number) {
        ubo.store(new Float32Array(this.getAmbientColor()), this.computeOffset(BlinnPhongLightStructConstants.AMBIENT_OFFSET, index));
        ubo.store(new Float32Array(this.getDiffuseColor()), this.computeOffset(BlinnPhongLightStructConstants.DIFFUSE_OFFSET, index));
        ubo.store(new Float32Array(this.getSpecularColor()), this.computeOffset(BlinnPhongLightStructConstants.SPECULAR_OFFSET, index));
        ubo.store(new Float32Array(this.getGameObject().getTransform().getForwardVector()), this.computeOffset(BlinnPhongLightStructConstants.DIRECTION_OFFSET, index));
        ubo.store(new Int32Array([BlinnPhongLightStructConstants.DIRECTIONAL_LIGHT_TYPE]), this.computeOffset(BlinnPhongLightStructConstants.TYPE_OFFSET, index));
        ubo.store(new Int32Array([this.isActive() ? 1 : 0]), this.computeOffset(BlinnPhongLightStructConstants.ACTIVE_OFFSET, index));
    }

}
