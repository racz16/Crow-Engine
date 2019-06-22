import { BoundingShape } from "./BoundingShape";
import { vec3, vec4 } from "gl-matrix";
import { Scene } from "../../../core/Scene";

export class AabbBoundingShape extends BoundingShape {

    private readonly aabbMin = vec3.create();
    private readonly aabbMax = vec3.create();

    public isInsideMainCameraFrustum(): boolean {
        const camera = Scene.getParameters().getValue(Scene.MAIN_CAMERA);
        if (camera.isUsable() && this.isUsable()) {
            this.refresh();
            for (const plane of camera.getFrustum().getPlanesIterator()) {
                const pVertex = this.computeNormalAlignedAabbVertexMax(this.aabbMin, this.aabbMax, plane.normalVector);
                let distance = plane.computeDistanceFromPlane(pVertex);
                if (distance < 0) {
                    return false;
                }
            }
        }
        return true;
    }

    private computeNormalAlignedAabbVertexMax(aabbMin: vec3, aabbMax: vec3, normalVector: vec3): vec3 {
        const result = vec3.create();
        result[0] = normalVector[0] >= 0 ? aabbMax[0] : aabbMin[0];
        result[1] = normalVector[1] >= 0 ? aabbMax[1] : aabbMin[1];
        result[2] = normalVector[2] >= 0 ? aabbMax[2] : aabbMin[2];
        return result;
    }

    private refresh(): void {
        if (!this.isValid()) {
            this.refreshUnsafe();
            this.setValid(true);
        }
    }

    private refreshUnsafe(): void {
        const bb = this.computeBoundingBox();
        this.aabbMin.set(vec3.fromValues(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY));
        this.aabbMax.set(vec3.fromValues(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY));
        for (const bbCornerPoint of bb) {
            this.refreshAabbCornerPoint(bbCornerPoint);
        }
    }

    private computeBoundingBox(): Array<vec4> {
        const aabb = this.computeObjectSpaceAabbCornerPoints();
        const modelMatrix = this.getRenderableComponent().getGameObject().getTransform().getModelMatrix();
        for (const anAabb of aabb) {
            vec4.transformMat4(anAabb, anAabb, modelMatrix);
        }
        return aabb;
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

    public getObjectSpaceAabbMin(): vec3 {
        return super.getObjectSpaceAabbMin();
    }

    public getRealAabbMin(): vec3 {
        if (!this.isUsable()) {
            return this.getObjectSpaceAabbMin();
        } else {
            this.refresh();
            return vec3.clone(this.aabbMin);
        }
    }

    public getObjectSpaceAabbMax(): vec3 {
        return super.getObjectSpaceAabbMax();
    }

    public getRealAabbMax(): vec3 {
        if (!this.isUsable()) {
            return this.getObjectSpaceAabbMax();
        } else {
            this.refresh();
            return vec3.clone(this.aabbMax);
        }
    }

}