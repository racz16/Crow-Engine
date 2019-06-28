import { BlinnPhongLightComponent } from "./BlinnPhongLightComponent";
import { vec3 } from "gl-matrix";
import { Ubo } from "../../../webgl/buffer/Ubo";
import { BlinnPhongLightContainer } from "./BlinnPhongLightContainer";
import { Scene } from "../../../core/Scene";
import { BlinnPhongRenderer } from "../../../rendering/renderer/BlinnPhongRenderer";

export class BlinnPhongDirectionalLightComponent extends BlinnPhongLightComponent {

    private static readonly DIRECTIONAL_LIGHT_TYPE = 0;

    public invalidate(sender?: any): void {
        super.invalidate(event);
        if (this.isTheMainDirectionalLight()) {
            if (BlinnPhongLightContainer.getInstance().getDirectionalLight() !== this) {
                BlinnPhongLightContainer.getInstance().setDirectionalLight(this);
            } else {
                BlinnPhongLightContainer.getInstance().refreshDirectionalLight();
            }

        }
    }

    public private_refresh(ubo: Ubo) {
        ubo.storewithOffset(new Float32Array(this.getAmbientColor()), BlinnPhongLightComponent.AMBIENT_OFFSET);
        ubo.storewithOffset(new Float32Array(this.getDiffuseColor()), BlinnPhongLightComponent.DIFFUSE_OFFSET);
        ubo.storewithOffset(new Float32Array(this.getSpecularColor()), BlinnPhongLightComponent.SPECULAR_OFFSET);
        ubo.storewithOffset(new Float32Array(this.getGameObject().getTransform().getForwardVector()), BlinnPhongLightComponent.DIRECTION_OFFSET);
        ubo.storewithOffset(new Int32Array([BlinnPhongDirectionalLightComponent.DIRECTIONAL_LIGHT_TYPE]), BlinnPhongLightComponent.TYPE_OFFSET);
        ubo.storewithOffset(new Int32Array([this.isActive() ? 1 : 0]), BlinnPhongLightComponent.ACTIVE_OFFSET);
    }

    public isTheMainDirectionalLight(): boolean {
        return Scene.getParameters().getValue(BlinnPhongRenderer.MAIN_DIRECTIONAL_LIGHT) === this;
    }

}
