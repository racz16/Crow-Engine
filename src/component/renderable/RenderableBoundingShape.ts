import { IInvalidatable } from "../../utility/invalidatable/IInvalidatable";
import { vec3, vec4 } from "gl-matrix";
import { RenderableComponent } from "./RenderableComponent";
import { IRenderable } from "../../resource/IRenderable";

export class RenderableBoundingShape implements IInvalidatable {

    private readonly aabbMin = vec3.create();
    private readonly aabbMax = vec3.create();
    private radius: number;
    private valid = false;
    private renderableComponent: RenderableComponent<IRenderable>;

    public constructor(renderableComponent: RenderableComponent<IRenderable>) {
        if (renderableComponent == null) {
            throw new Error();
        }
        this.renderableComponent = renderableComponent;
    }

    private refresh(): void {
        if (!this.valid) {
            this.refreshAabb();
            this.refreshRadius();
            this.valid = true;
        }
    }

    private refreshAabb(): void {
        const bb = this.computeBoundingBox();
        this.aabbMin.set(vec3.fromValues(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY));
        this.aabbMax.set(vec3.fromValues(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY));
        for (const bbCornerPoint of bb) {
            this.refreshAabbCornerPoint(bbCornerPoint);
        }
    }

    private computeBoundingBox(): Array<vec4> {
        const aabb = this.computeOriginalAabb();
        const modelMatrix = this.renderableComponent.getGameObject().getTransform().getModelMatrix();
        for (const anAabb of aabb) {
            vec4.transformMat4(anAabb, anAabb, modelMatrix);
        }
        return aabb;
    }

    private computeOriginalAabb(): Array<vec4> {
        const originalAabbMin = this.getOriginalAabbMin();
        const originalAabbMax = this.getOriginalAabbMax();
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

    private refreshAabbCornerPoint(bbCornerPoint: vec4): void {
        for (let j = 0; j < 3; j++) {
            this.refreshAabbMinAndMax(bbCornerPoint, j);
        }
    }

    private refreshAabbMinAndMax(bbCornerPoint: vec4, index: number): void {
        if (bbCornerPoint[index] < this.aabbMin[index]) {
            this.aabbMin[index] = bbCornerPoint[index];
        }
        if (bbCornerPoint[index] > this.aabbMax[index]) {
            this.aabbMax[index] = bbCornerPoint[index];
        }
    }

    private refreshRadius(): void {
        const originalRadius = this.renderableComponent.getRenderable().getRadius();
        const absoluteScale = this.renderableComponent.getGameObject().getTransform().getAbsoluteScale();
        this.radius = originalRadius * absoluteScale[Math.max(...absoluteScale)];
    }

    public getOriginalRadius(): number {
        return this.renderableComponent.getRenderable().getRadius();
    }

    public getRealRadius(): number {
        if (this.renderableComponent.getGameObject() == null) {
            return this.getOriginalRadius();
        } else {
            this.refresh();
            return this.radius;
        }
    }

    public getOriginalAabbMin(): vec3 {
        return this.renderableComponent.getRenderable().getAabbMin();
    }

    public getRealAabbMin(): vec3 {
        if (this.renderableComponent.getGameObject() == null) {
            return this.getOriginalAabbMin();
        } else {
            this.refresh();
            return vec3.clone(this.aabbMin);
        }
    }

    public getOriginalAabbMax(): vec3 {
        return this.renderableComponent.getRenderable().getAabbMax();
    }

    public getRealAabbMax(): vec3 {
        if (this.renderableComponent.getGameObject() == null) {
            return this.getOriginalAabbMax();
        } else {
            this.refresh();
            return vec3.clone(this.aabbMax);
        }
    }

    public invalidate(): void {
        this.valid = false;
    }

}