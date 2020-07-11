import { GlUbo } from '../../../webgl/buffer/GlUbo';
import { PbrLightComponent } from './PbrLightComponent';
import { PbrLightStructConstants } from './PbrLightStructConstants';

export class PbrDirectionalLightComponent extends PbrLightComponent {

    public _refresh(ubo: GlUbo, index: number) {
        ubo.store(new Float32Array(this.getColor()), this.computeOffset(PbrLightStructConstants.COLOR_OFFSET, index));
        ubo.store(new Float32Array(this.getGameObject().getTransform().getForwardVector()), this.computeOffset(PbrLightStructConstants.DIRECTION_OFFSET, index));
        ubo.store(new Float32Array([this.getIntensity()]), this.computeOffset(PbrLightStructConstants.INTENSITY_OFFSET, index));
        ubo.store(new Int32Array([PbrLightStructConstants.DIRECTIONAL_LIGHT_TYPE]), this.computeOffset(PbrLightStructConstants.TYPE_OFFSET, index));
        ubo.store(new Int32Array([this.isActive() ? 1 : 0]), this.computeOffset(PbrLightStructConstants.ACTIVE_OFFSET, index));
    }

}
