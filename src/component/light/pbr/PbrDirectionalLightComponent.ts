import { Ubo } from '../../../webgl/buffer/Ubo';
import { PbrLightComponent } from './PbrLightComponent';

export class PbrDirectionalLightComponent extends PbrLightComponent {

    protected refresh(ubo: Ubo, index: number) {
        ubo.store(this.getColor(), this.computeOffset(PbrLightComponent.COLOR_OFFSET, index));
        ubo.store(new Float32Array(this.getGameObject().getTransform().getForwardVector()), this.computeOffset(PbrLightComponent.DIRECTION_OFFSET, index));
        ubo.store(new Float32Array([this.getIntensity()]), this.computeOffset(PbrLightComponent.INTENSITY_OFFSET, index));
        ubo.store(new Int32Array([PbrLightComponent.DIRECTIONAL_LIGHT_TYPE]), this.computeOffset(PbrLightComponent.TYPE_OFFSET, index));
        ubo.store(new Int32Array([this.isActive() ? 1 : 0]), this.computeOffset(PbrLightComponent.ACTIVE_OFFSET, index));
    }

}
