import { BlinnPhongLightComponent } from './BlinnPhongLightComponent';
import { Ubo } from '../../../webgl/buffer/Ubo';

export class BlinnPhongDirectionalLightComponent extends BlinnPhongLightComponent {

    private static readonly DIRECTIONAL_LIGHT_TYPE = 0;

    protected refresh(ubo: Ubo, index: number) {
        ubo.store(new Float32Array(this.getAmbientColor()), this.computeOffset(BlinnPhongLightComponent.AMBIENT_OFFSET, index));
        ubo.store(new Float32Array(this.getDiffuseColor()), this.computeOffset(BlinnPhongLightComponent.DIFFUSE_OFFSET, index));
        ubo.store(new Float32Array(this.getSpecularColor()), this.computeOffset(BlinnPhongLightComponent.SPECULAR_OFFSET, index));
        ubo.store(new Float32Array(this.getGameObject().getTransform().getForwardVector()), this.computeOffset(BlinnPhongLightComponent.DIRECTION_OFFSET, index));
        ubo.store(new Int32Array([BlinnPhongDirectionalLightComponent.DIRECTIONAL_LIGHT_TYPE]), this.computeOffset(BlinnPhongLightComponent.TYPE_OFFSET, index));
        ubo.store(new Int32Array([this.isActive() ? 1 : 0]), this.computeOffset(BlinnPhongLightComponent.ACTIVE_OFFSET, index));
    }

}
