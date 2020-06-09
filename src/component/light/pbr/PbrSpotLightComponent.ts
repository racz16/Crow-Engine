import { GlUbo } from '../../../webgl/buffer/GlUbo';
import { Utility } from '../../../utility/Utility';
import { PbrLightComponent } from './PbrLightComponent';

export class PbrSpotLightComponent extends PbrLightComponent {

    private cutoff = 12.5;
    private outerCutoff = 15.0;
    private range = 5.0;

    public getCutoff(): number {
        return this.cutoff;
    }

    public setCutoff(cutoff: number): void {
        if (cutoff < 0 || cutoff > this.outerCutoff) {
            throw new Error();
        }
        this.cutoff = cutoff;
        this.invalidate();
    }

    public getOuterCutoff(): number {
        return this.outerCutoff;
    }

    public setOuterCutoff(outerCutoff: number): void {
        if (this.cutoff > outerCutoff || outerCutoff > 90) {
            throw new Error();
        }
        this.outerCutoff = outerCutoff;
        this.invalidate();
    }

    public getRange(): number {
        return this.range;
    }

    public setRange(range: number): void {
        if (range <= 0) {
            throw new Error();
        }
        this.range = range;
    }

    protected refresh(ubo: GlUbo, index: number) {
        ubo.store(new Float32Array(this.getColor()), this.computeOffset(PbrLightComponent.COLOR_OFFSET, index));
        ubo.store(new Float32Array(this.getGameObject().getTransform().getForwardVector()), this.computeOffset(PbrLightComponent.DIRECTION_OFFSET, index));
        ubo.store(new Float32Array(this.getGameObject().getTransform().getAbsolutePosition()), this.computeOffset(PbrLightComponent.POSITION_OFFSET, index));
        ubo.store(new Float32Array([Math.cos(Utility.toRadians(this.getCutoff())), Math.cos(Utility.toRadians(this.getOuterCutoff()))]), this.computeOffset(PbrLightComponent.CUTOFF_OFFSET, index));
        ubo.store(new Float32Array([this.getIntensity()]), this.computeOffset(PbrLightComponent.INTENSITY_OFFSET, index));
        ubo.store(new Float32Array([this.getRange()]), this.computeOffset(PbrLightComponent.RANGE_OFFSET, index));
        ubo.store(new Int32Array([PbrLightComponent.SPOT_LIGHT_TYPE]), this.computeOffset(PbrLightComponent.TYPE_OFFSET, index));
        ubo.store(new Int32Array([this.isActive() ? 1 : 0]), this.computeOffset(PbrLightComponent.ACTIVE_OFFSET, index));
    }

}
