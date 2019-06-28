import { Renderer } from "../Renderer";
import { ParameterKey } from "../../utility/parameter/ParameterKey";
import { BlinnPhongDirectionalLightComponent } from "../../component/light/blinnphong/BlinnPhongDirectionalLightComponent";
import { BlinnPhongShader } from "../../resource/shader/blinnphong/BlinnPhongShader";
import { RenderingPipeline } from "../RenderingPipeline";
import { Utility } from "../../utility/Utility";
import { CameraComponent } from "../../component/camera/CameraComponent";
import { Gl } from "../../webgl/Gl";
import { IRenderable } from "../../resource/IRenderable";
import { BlinnPhongLightContainer } from "../../component/light/blinnphong/BlinnPhongLightContainer";
import { vec2, vec3 } from "gl-matrix";
import { Log } from "../../utility/log/Log";
import { IRenderableComponent } from "../../component/renderable/IRenderableComponent";
import { Scene } from "../../core/Scene";
import { ICameraComponent } from "../../component/camera/ICameraComponent";

export class BlinnPhongRenderer extends Renderer {

    public static readonly MAIN_DIRECTIONAL_LIGHT = new ParameterKey<BlinnPhongDirectionalLightComponent>(BlinnPhongDirectionalLightComponent, "MAIN_DIRECTIONAL_LIGHT");
    private shader: BlinnPhongShader;

    public constructor() {
        super();
        this.shader = new BlinnPhongShader();
    }

    public render(): void {
        Log.renderingInfo('Blinn-Phong renderer started');
        const camera = Scene.getParameters().getValue(Scene.MAIN_CAMERA);
        BlinnPhongLightContainer.getInstance().useLights();
        this.beforeDrawShader();
        const renderables = RenderingPipeline.getRenderableContainer();
        for (const renderableComponent of renderables.getRenderableComponentIterator()) {
            if (renderableComponent.isActive() && this.isVisible(renderableComponent, camera) && this.isInsideFrustum(renderableComponent)) {
                this.beforeDrawInstance(renderableComponent);
                renderableComponent.draw();
            }
        }
        Log.renderingInfo('Blinn-Phong renderer finished');
    }

    private isInsideFrustum(renderableComponent: IRenderableComponent<IRenderable>): boolean {
        return renderableComponent.getBoundingShape().isInsideMainCameraFrustum();
    }

    private isVisible(renderableComponent: IRenderableComponent<IRenderable>, camera: ICameraComponent): boolean {
        const visibility = renderableComponent.getVisibilityInterval();
        if (visibility[0] <= 0 && visibility[1] >= 100) {
            return true;
        }
        const renderablePosition = renderableComponent.getGameObject().getTransform().getAbsolutePosition();
        const cameraPosition = camera.getGameObject().getTransform().getAbsolutePosition();
        const renderableDistanceFromCamera = vec3.distance(cameraPosition, renderablePosition);
        const positionInPercent = (renderableDistanceFromCamera - camera.getNearPlaneDistance()) / (camera.getFarPlaneDistance() - camera.getNearPlaneDistance()) * 100;
        return positionInPercent >= visibility[0] && positionInPercent < visibility[1];
    }

    private beforeDrawShader(): void {
        if (!Utility.isUsable(this.shader)) {
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
        if (shadowMap) {
            shadowMap.getValue().bindToTextureUnit(0);
        }*/
    }


    private beforeDrawInstance(rc: IRenderableComponent<IRenderable>): void {
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