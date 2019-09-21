import { Renderer } from './Renderer';
import { IRenderable } from '../resource/IRenderable';
import { IRenderableComponent } from '../component/renderable/IRenderableComponent';
import { Gl } from '../webgl/Gl';
import { vec3 } from 'gl-matrix';
import { ICameraComponent } from '../component/camera/ICameraComponent';
import { Engine } from '../core/Engine';

export abstract class GeometryRenderer extends Renderer {

    protected camera: ICameraComponent;

    protected renderUnsafe(): void {
        const renderableComponents = this.getRenderables();
        for (const renderable of renderableComponents.keys()) {
            this.renderRenderable(renderableComponents.get(renderable).values(), renderable);
        }
    }

    protected renderRenderable(renderableComponents: IterableIterator<IRenderableComponent<IRenderable>>, renderable: IRenderable): void {
        this.beforeDrawRenderables(renderable, renderableComponents);
        for (const renderableComponent of renderableComponents) {
            this.renderRenderableComponent(renderableComponent);
        }
        this.afterDrawRenderables(renderable, renderableComponents);
    }

    protected renderRenderableComponent(renderableComponent: IRenderableComponent<IRenderable>): void {
        if (this.drawPredicate(renderableComponent)) {
            this.beforeDraw(renderableComponent);
            this.draw(renderableComponent);
            this.afterDraw(renderableComponent);
        }
    }

    protected beforeRendering(): void {
        super.beforeRendering();
        this.camera = Engine.getMainCamera();
    }

    protected beforeDrawRenderables(renderable: IRenderable, renderableComponents: IterableIterator<IRenderableComponent<IRenderable>>): void { }

    protected afterDrawRenderables(renderable: IRenderable, renderableComponents: IterableIterator<IRenderableComponent<IRenderable>>): void { }

    protected beforeDraw(renderableComponent: IRenderableComponent<IRenderable>): void {
        Gl.setEnableCullFace(!renderableComponent.isTwoSided());
        this.incrementRenderedElementCountBy(1);
        this.incrementRenderedFaceCountBy(renderableComponent.getFaceCount());
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
            renderableComponent.getBoundingShape().isInsideMainCameraFrustum();
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

    private getRenderables(): Map<IRenderable, Array<IRenderableComponent<IRenderable>>> {
        const renderables = Engine.getRenderingPipeline().getRenderableContainer().getIterator();
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