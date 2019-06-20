import { Renderer } from "../Renderer";
import { ParameterKey } from "../../utility/parameter/ParameterKey";
import { BlinnPhongDirectionalLightComponent } from "../../component/light/blinnphong/BlinnPhongDirectionalLightComponent";
import { BlinnPhongShader } from "../../resource/shader/blinnphong/BlinnPhongShader";
import { RenderingPipeline } from "../RenderingPipeline";
import { RenderableComponent } from "../../component/renderable/RenderableComponent";
import { Utility } from "../../utility/Utility";
import { CameraComponent } from "../../component/camera/CameraComponent";
import { Gl } from "../../webgl/Gl";
import { IRenderable } from "../../resource/IRenderable";
import { BlinnPhongLightContainer } from "../../component/light/blinnphong/BlinnPhongLightContainer";
import { vec2 } from "gl-matrix";
import { Log } from "../../utility/log/Log";

export class BlinnPhongRenderer extends Renderer {

    public static readonly MAIN_DIRECTIONAL_LIGHT = new ParameterKey<BlinnPhongDirectionalLightComponent>(BlinnPhongDirectionalLightComponent, "MAIN_DIRECTIONAL_LIGHT");
    private shader: BlinnPhongShader;

    public constructor() {
        super();
        this.shader = new BlinnPhongShader();
    }

    public render(): void {
        Log.renderingInfo('Blinn-Phong renderer started');
        this.beforeDrawShader();
        const renderables = RenderingPipeline.getRenderableContainer();
        for (const renderableComponent of renderables.getRenderableComponentIterator()) {
            if (renderableComponent.isActive() && renderableComponent.isRenderableActive()) {
                this.beforeDrawInstance(renderableComponent);
                renderableComponent.draw();
            }
        }
        Gl.setEnableCullFace(true);
        Log.renderingInfo('Blinn-Phong renderer finished');
    }

    private beforeDrawShader(): void {
        if (Utility.isReleased(this.shader)) {
            this.shader = new BlinnPhongShader();
        }
        CameraComponent.refreshMatricesUbo();
        BlinnPhongLightContainer.getInstance().refreshUbo();
        this.shader.start();
        //RenderingPipeline.bindFbo();
        Gl.setViewport(RenderingPipeline.getRenderingSize(), vec2.create());
        this.setNumberOfRenderedElements(0);
        this.setNumberOfRenderedFaces(0);
        //shadow map
        /*Parameter < Texture2D > shadowMap = RenderingPipeline.getParameters().get(RenderingPipeline.SHADOWMAP);
        if (shadowMap != null) {
            shadowMap.getValue().bindToTextureUnit(0);
        }*/
    }


    private beforeDrawInstance(rc: RenderableComponent<IRenderable>): void {
        this.setNumberOfRenderedElements(this.getNumberOfRenderedElements() + 1);
        this.setNumberOfRenderedFaces(this.getNumberOfRenderedFaces() + rc.getFaceCount());
        this.shader.setUniforms(rc);
    }

    public release(): void {
        this.shader.release();
    }

    public removeFromRenderingPipeline(): void {

    }

    public isUsable(): boolean {
        return true;
    }

}