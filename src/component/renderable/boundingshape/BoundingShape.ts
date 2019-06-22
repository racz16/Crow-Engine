import { IBoundingShape } from "./IBoundingShape";
import { RenderableComponent } from "../RenderableComponent";
import { IRenderable } from "../../../resource/IRenderable";
import { vec4, vec3 } from "gl-matrix";

export abstract class BoundingShape implements IBoundingShape {

    private renderableComponent: RenderableComponent<IRenderable>;
    private valid = false;

    public private_setRenderableComponent(renderableComponent: RenderableComponent<IRenderable>): void {
        if (this.renderableComponent) {
            this.renderableComponent.removeInvalidatable(this);
        }
        this.renderableComponent = renderableComponent;
        if (this.renderableComponent) {
            this.renderableComponent.addInvalidatable(this);
        }
        this.invalidate();
    }

    public getRenderableComponent(): RenderableComponent<IRenderable> {
        return this.renderableComponent;
    }

    protected isValid(): boolean {
        return this.valid;
    }

    protected setValid(valid: boolean): void {
        this.valid = valid;
    }

    protected computeObjectSpaceAabbCornerPoints(): Array<vec4> {
        const originalAabbMin = this.getObjectSpaceAabbMin();
        const originalAabbMax = this.getObjectSpaceAabbMax();
        const cornerPoints = new Array<vec4>(8);
        cornerPoints[0] = vec4.fromValues(originalAabbMax[0], originalAabbMax[1], originalAabbMax[2], 1);//right-top-front
        cornerPoints[1] = vec4.fromValues(originalAabbMax[0], originalAabbMin[1], originalAabbMax[2], 1);//right-bottom-front
        cornerPoints[2] = vec4.fromValues(originalAabbMax[0], originalAabbMax[1], originalAabbMin[2], 1);//right-top-back
        cornerPoints[3] = vec4.fromValues(originalAabbMax[0], originalAabbMin[1], originalAabbMin[2], 1);//right-bottom-back
        cornerPoints[4] = vec4.fromValues(originalAabbMin[0], originalAabbMax[1], originalAabbMax[2], 1);//left-top-front
        cornerPoints[5] = vec4.fromValues(originalAabbMin[0], originalAabbMin[1], originalAabbMax[2], 1);//left-bottom-front
        cornerPoints[6] = vec4.fromValues(originalAabbMin[0], originalAabbMax[1], originalAabbMin[2], 1);//left-top-back
        cornerPoints[7] = vec4.fromValues(originalAabbMin[0], originalAabbMin[1], originalAabbMin[2], 1);//left-bottom-back
        return cornerPoints;
    }

    protected getObjectSpaceAabbMin(): vec3 {
        return this.getRenderableComponent().getRenderable().getAabbMin();
    }

    protected getObjectSpaceAabbMax(): vec3 {
        return this.getRenderableComponent().getRenderable().getAabbMax();
    }

    public invalidate(): void {
        this.valid = false;
    }

    public isUsable(): boolean {
        return this.renderableComponent && this.renderableComponent.getGameObject() != null;
    }

    public abstract isInsideMainCameraFrustum(): boolean;
}