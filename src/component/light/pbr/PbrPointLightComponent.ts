import { GlUbo } from '../../../webgl/buffer/GlUbo';
import { PbrLightComponent } from './PbrLightComponent';
import { PbrLightStructConstants } from './PbrLightStructConstants';

export class PbrPointLightComponent extends PbrLightComponent {

    private range = 5.0;

    public getRange(): number {
        return this.range;
    }

    public setRange(range: number): void {
        if (range <= 0) {
            throw new Error();
        }
        this.range = range;
    }

    public _refresh(ubo: GlUbo, index: number) {
        ubo.store(new Float32Array(this.getColor()), this.computeOffset(PbrLightStructConstants.COLOR_OFFSET, index));
        ubo.store(new Float32Array(this.getGameObject().getTransform().getAbsolutePosition()), this.computeOffset(PbrLightStructConstants.POSITION_OFFSET, index));
        ubo.store(new Float32Array([this.getIntensity()]), this.computeOffset(PbrLightStructConstants.INTENSITY_OFFSET, index));
        ubo.store(new Float32Array([this.getRange()]), this.computeOffset(PbrLightStructConstants.RANGE_OFFSET, index));
        ubo.store(new Int32Array([PbrLightStructConstants.POINT_LIGHT_TYPE]), this.computeOffset(PbrLightStructConstants.TYPE_OFFSET, index));
        ubo.store(new Int32Array([this.isActive() ? 1 : 0]), this.computeOffset(PbrLightStructConstants.ACTIVE_OFFSET, index));
    }

}
