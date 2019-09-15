import { Renderer } from './Renderer';
import { IRenderable } from '../resource/IRenderable';
import { RenderingPipeline } from './RenderingPipeline';
import { IRenderableComponent } from '../component/renderable/IRenderableComponent';
import { Utility } from '../utility/Utility';
import { Log } from '../utility/log/Log';
import { LogLevel } from '../utility/log/LogLevel';
import { Gl } from '../webgl/Gl';
import { vec2, vec3 } from 'gl-matrix';
import { ICameraComponent } from '../component/camera/ICameraComponent';
import { Engine } from '../core/Engine';

export abstract class GeometryRenderer extends Renderer {

    protected camera: ICameraComponent;

    protected renderUnsafe(): void {
        if (!Utility.isUsable(this.getShader())) {
            Log.logString(LogLevel.WARNING, `The ${this.getName()} is not usable`);
            return;
        }
        this.beforeRendering();
        const mapOfRenderableComponents = this.getRenderables();
        for (const renderable of mapOfRenderableComponents.keys()) {
            const renderableComponents = mapOfRenderableComponents.get(renderable);
            this.beforeDrawRenderables(renderable, renderableComponents);
            for (const renderableComponent of renderableComponents.values()) {
                if (this.drawPredicate(renderableComponent)) {
                    this.beforeDraw(renderableComponent);
                    this.draw(renderableComponent);
                    this.afterDraw(renderableComponent);
                }
            }
            this.afterDrawRenderables(renderable, renderableComponents);
        }
        this.afterRendering();
    }

    protected beforeRendering(): void {
        this.getShader().start();
        RenderingPipeline.bindFbo();
        Gl.setViewport(RenderingPipeline.getRenderingSize(), vec2.create());
        this.setNumberOfRenderedElements(0);
        this.setNumberOfRenderedFaces(0);
        this.camera = Engine.getMainCamera();
    }

    protected afterRendering(): void { }

    protected beforeDrawRenderables(renderable: IRenderable, renderableComponents: Array<IRenderableComponent<IRenderable>>): void { }

    protected afterDrawRenderables(renderable: IRenderable, renderableComponents: Array<IRenderableComponent<IRenderable>>): void { }

    protected beforeDraw(renderableComponent: IRenderableComponent<IRenderable>): void {
        Gl.setEnableCullFace(!renderableComponent.isTwoSided());
        this.setNumberOfRenderedElements(this.getNumberOfRenderedElements() + 1);
        this.setNumberOfRenderedFaces(this.getNumberOfRenderedFaces() + renderableComponent.getFaceCount());
        this.getShader().setUniforms(renderableComponent);
    }

    protected afterDraw(renderableComponent: IRenderableComponent<IRenderable>): void { }

    protected draw(renderableComponent: IRenderableComponent<IRenderable>): void {
        renderableComponent.draw();
    }

    protected drawPredicate(renderableComponent: IRenderableComponent<IRenderable>): boolean {
        return renderableComponent.getRenderable().isUsable() &&
            renderableComponent.isActive() &&
            this.isVisible(renderableComponent, this.camera) &&
            this.isInsideFrustum(renderableComponent);
    }

    protected isVisible(renderableComponent: IRenderableComponent<IRenderable>, camera: ICameraComponent): boolean {
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

    protected isInsideFrustum(renderableComponent: IRenderableComponent<IRenderable>): boolean {
        return renderableComponent.getBoundingShape().isInsideMainCameraFrustum();
    }

    private getRenderables(): Map<IRenderable, Array<IRenderableComponent<IRenderable>>> {
        const renderables = RenderingPipeline.getRenderableContainer().getIterator();
        const filteredRenderables = this.filter(renderables);
        return this.order(filteredRenderables);
    }

    protected filter(renderableComponents: IterableIterator<IRenderableComponent<IRenderable>>): Array<IRenderableComponent<IRenderable>> {
        const renderableComponentsArray = new Array<IRenderableComponent<IRenderable>>();
        for (const renderableComponent of renderableComponents) {
            if (this.filterPredicate(renderableComponent)) {
                renderableComponentsArray.push(renderableComponent);
            }
        }
        return renderableComponentsArray;
    }

    protected filterPredicate(renderableComponent: IRenderableComponent<IRenderable>): boolean {
        return this instanceof renderableComponent.getMaterial().getRenderer();
    }

    protected order(renderableComponents: Array<IRenderableComponent<IRenderable>>): Map<IRenderable, Array<IRenderableComponent<IRenderable>>> {
        const renderableComponentsMap = new Map<IRenderable, Array<IRenderableComponent<IRenderable>>>();
        for (const renderableComponent of renderableComponents) {
            this.orderRenderableComponent(renderableComponentsMap, renderableComponent);
        }
        return renderableComponentsMap;
    }

    protected orderRenderableComponent(renderableComponentsMap: Map<IRenderable, Array<IRenderableComponent<IRenderable>>>, renderableComponent: IRenderableComponent<IRenderable>): void {
        let array = renderableComponentsMap.get(renderableComponent.getRenderable());
        if (!array) {
            array = new Array<IRenderableComponent<IRenderable>>();
            renderableComponentsMap.set(renderableComponent.getRenderable(), array);
        }
        array.push(renderableComponent);
    }

}