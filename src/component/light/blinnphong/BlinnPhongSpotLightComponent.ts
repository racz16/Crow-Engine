import { BlinnPhongPositionalLightComponent } from "./BlinnPhongPositionalLightComponent";
import { Ubo } from "../../../webgl/buffer/Ubo";
import { BlinnPhongLightComponent } from "./BlinnPhongLightComponent";
import { Utility } from "../../../utility/Utility";

export class BlinnPhongSpotLightComponent extends BlinnPhongPositionalLightComponent {

    private static readonly SPOT_LIGHT_TYPE = 2;

    private cutoff = 12.5;
    private outerCutoff = 15.0;

    protected refresh(ubo: Ubo, index: number) {
        ubo.storewithOffset(new Float32Array(this.getAmbientColor()), this.computeOffset(BlinnPhongLightComponent.AMBIENT_OFFSET, index));
        ubo.storewithOffset(new Float32Array(this.getDiffuseColor()), this.computeOffset(BlinnPhongLightComponent.DIFFUSE_OFFSET, index));
        ubo.storewithOffset(new Float32Array(this.getSpecularColor()), this.computeOffset(BlinnPhongLightComponent.SPECULAR_OFFSET, index));
        ubo.storewithOffset(new Float32Array(this.getGameObject().getTransform().getForwardVector()), this.computeOffset(BlinnPhongLightComponent.DIRECTION_OFFSET, index));
        ubo.storewithOffset(new Float32Array(this.getGameObject().getTransform().getAbsolutePosition()), this.computeOffset(BlinnPhongLightComponent.POSITION_OFFSET, index));
        ubo.storewithOffset(new Float32Array([this.getConstant(), this.getLinear(), this.getQuadratic()]), this.computeOffset(BlinnPhongLightComponent.ATTENUATION_OFFSET, index));
        ubo.storewithOffset(new Float32Array([Math.cos(Utility.toRadians(this.getCutoff())), Math.cos(Utility.toRadians(this.getOuterCutoff()))]), this.computeOffset(BlinnPhongLightComponent.CUTOFF_OFFSET, index));
        ubo.storewithOffset(new Int32Array([BlinnPhongSpotLightComponent.SPOT_LIGHT_TYPE]), this.computeOffset(BlinnPhongLightComponent.TYPE_OFFSET, index));
        ubo.storewithOffset(new Int32Array([this.isActive() ? 1 : 0]), this.computeOffset(BlinnPhongLightComponent.ACTIVE_OFFSET, index));
    }

    public getCutoff(): number {
        return this.cutoff;
    }

    public setCutoff(cutoff: number): void {
        if (cutoff <= 0 || cutoff >= this.outerCutoff) {
            throw new Error();
        }
        this.cutoff = cutoff;
        this.invalidate();
    }

    public getOuterCutoff(): number {
        return this.outerCutoff;
    }

    public setOuterCutoff(outerCutoff: number): void {
        if (this.cutoff >= outerCutoff) {
            throw new Error();
        }
        this.outerCutoff = outerCutoff;
        this.invalidate();
    }

}
