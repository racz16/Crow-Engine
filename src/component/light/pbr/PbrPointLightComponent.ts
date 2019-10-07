import { Ubo } from '../../../webgl/buffer/Ubo';
import { PbrLightComponent } from './PbrLightComponent';

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

    protected refresh(ubo: Ubo, index: number) {
        ubo.store(new Float32Array(this.getColor()), this.computeOffset(PbrLightComponent.COLOR_OFFSET, index));
        ubo.store(new Float32Array(this.getGameObject().getTransform().getAbsolutePosition()), this.computeOffset(PbrLightComponent.POSITION_OFFSET, index));
        ubo.store(new Float32Array([this.getIntensity()]), this.computeOffset(PbrLightComponent.INTENSITY_OFFSET, index));
        ubo.store(new Float32Array([this.getRange()]), this.computeOffset(PbrLightComponent.RANGE_OFFSET, index));
        ubo.store(new Int32Array([PbrLightComponent.POINT_LIGHT_TYPE]), this.computeOffset(PbrLightComponent.TYPE_OFFSET, index));
        ubo.store(new Int32Array([this.isActive() ? 1 : 0]), this.computeOffset(PbrLightComponent.ACTIVE_OFFSET, index));
    }

}
