import { Renderer } from '../Renderer';
import { BlinnPhongShader } from '../../resource/shader/blinnphong/BlinnPhongShader';
import { RenderingPipeline } from '../RenderingPipeline';
import { Utility } from '../../utility/Utility';
import { Gl } from '../../webgl/Gl';
import { IRenderable } from '../../resource/IRenderable';
import { BlinnPhongLightsStruct } from '../../component/light/blinnphong/BlinnPhongLightsStruct';
import { vec2, vec3 } from 'gl-matrix';
import { Log } from '../../utility/log/Log';
import { IRenderableComponent } from '../../component/renderable/IRenderableComponent';
import { LogLevel } from '../../utility/log/LogLevel';
import { Engine } from '../../core/Engine';
import { ICameraComponent } from '../../component/camera/ICameraComponent';

export class BlinnPhongRenderer extends Renderer {

    private shader: BlinnPhongShader;

    public constructor() {
        super('Blinn-Phong Renderer');
        this.shader = new BlinnPhongShader();
    }

    protected renderUnsafe(): void {
        if (!Utility.isUsable(this.shader)) {
            Log.logString(LogLevel.WARNING, 'The Blinn-Phong shader is not usable');
            return;
        }
        const camera = Engine.getMainCamera();
        this.beforeDrawShader();
        const renderables = RenderingPipeline.getRenderableContainer();
        for (const renderableComponent of renderables.getIterator()) {
            if (renderableComponent.getRenderable().isUsable() && renderableComponent.isActive() && this.isVisible(renderableComponent, camera) && this.isInsideFrustum(renderableComponent)) {
                this.beforeDrawInstance(renderableComponent);
                renderableComponent.draw();
            }
        }
    }

    private isInsideFrustum(renderableComponent: IRenderableComponent<IRenderable>): boolean {
        return renderableComponent.getBoundingShape().isInsideMainCameraFrustum();
    }

    private isVisible(renderableComponent: IRenderableComponent<IRenderable>, camera: ICameraComponent): boolean {
        const visibility = renderableComponent.getVisibilityInterval();
        if (visibility[0] === Number.NEGATIVE_INFINITY && visibility[1] === Number.POSITIVE_INFINITY) {
            return true;
        }
        const renderablePosition = renderableComponent.getGameObject().getTransform().getAbsolutePosition();
        const cameraPosition = camera.getGameObject().getTransform().getAbsolutePosition();
        const renderableDistanceFromCamera = vec3.distance(cameraPosition, renderablePosition);
        const positionInPercent = (renderableDistanceFromCamera - camera.getNearPlaneDistance()) / (camera.getFarPlaneDistance() - camera.getNearPlaneDistance()) * 100;
        return positionInPercent >= visibility[0] && positionInPercent < visibility[1];
    }

    private beforeDrawShader(): void {
        /*if (!Utility.isUsable(this.shader)) {
            this.shader = new BlinnPhongShader();
        }*/

        BlinnPhongLightsStruct.getInstance().refreshUbo();
        BlinnPhongLightsStruct.getInstance().useUbo();
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
        //TODO: ezt az ősosztályba ki kéne szervezni
        Gl.setEnableCullFace(!rc.isTwoSided());

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