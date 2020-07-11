import { GlUbo } from '../../../webgl/buffer/GlUbo';
import { Utility } from '../../../utility/Utility';
import { PbrLightComponent } from './PbrLightComponent';
import { PbrLightStructConstants } from './PbrLightStructConstants';

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

    public _refresh(ubo: GlUbo, index: number) {
        ubo.store(new Float32Array(this.getColor()), this.computeOffset(PbrLightStructConstants.COLOR_OFFSET, index));
        ubo.store(new Float32Array(this.getGameObject().getTransform().getForwardVector()), this.computeOffset(PbrLightStructConstants.DIRECTION_OFFSET, index));
        ubo.store(new Float32Array(this.getGameObject().getTransform().getAbsolutePosition()), this.computeOffset(PbrLightStructConstants.POSITION_OFFSET, index));
        ubo.store(new Float32Array([Math.cos(Utility.toRadians(this.getCutoff())), Math.cos(Utility.toRadians(this.getOuterCutoff()))]), this.computeOffset(PbrLightStructConstants.CUTOFF_OFFSET, index));
        ubo.store(new Float32Array([this.getIntensity()]), this.computeOffset(PbrLightStructConstants.INTENSITY_OFFSET, index));
        ubo.store(new Float32Array([this.getRange()]), this.computeOffset(PbrLightStructConstants.RANGE_OFFSET, index));
        ubo.store(new Int32Array([PbrLightStructConstants.SPOT_LIGHT_TYPE]), this.computeOffset(PbrLightStructConstants.TYPE_OFFSET, index));
        ubo.store(new Int32Array([this.isActive() ? 1 : 0]), this.computeOffset(PbrLightStructConstants.ACTIVE_OFFSET, index));
    }

}
