import { BoundingShape } from './BoundingShape';
import { vec3, vec4 } from 'gl-matrix';
import { Scene } from '../../../core/Scene';
import { ICameraComponent } from '../../camera/ICameraComponent';

export class AabbBoundingShape extends BoundingShape {

    private readonly aabbMin = vec3.create();
    private readonly aabbMax = vec3.create();

    public isInsideMainCameraFrustum(): boolean {
        const camera = Scene.getParameters().get(Scene.MAIN_CAMERA);
        if (camera && camera.getGameObject() && this.isUsable()) {
            this.refresh();
            return this.isInsideMainCameraFrustumUnsafe(camera);
        }
        return true;
    }

    private isInsideMainCameraFrustumUnsafe(camera: ICameraComponent): boolean {
        for (const plane of camera.getFrustum().getPlanesIterator()) {
            const pVertex = this.computeNormalAlignedAabbVertexMax(this.aabbMin, this.aabbMax, plane.normalVector);
            let distance = plane.computeDistanceFrom(pVertex);
            if (distance < 0) {
                return false;
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
        const wsBoundingBoxCornerPoints = this.computeWorldSpaceBoundingBoxCornerPoints();
        this.aabbMin.set(vec3.fromValues(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY));
        this.aabbMax.set(vec3.fromValues(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY));
        for (const cornerPoint of wsBoundingBoxCornerPoints) {
            this.refreshAabbCornerPoint(cornerPoint);
        }
    }

    private computeWorldSpaceBoundingBoxCornerPoints(): Array<vec4> {
        const boundingBoxCornerPoints = this.computeObjectSpaceAabbCornerPoints();
        const modelMatrix = this.getRenderableComponent().getModelMatrix();
        for (const anAabb of boundingBoxCornerPoints) {
            vec4.transformMat4(anAabb, anAabb, modelMatrix);
        }
        return boundingBoxCornerPoints;
    }

    private refreshAabbCornerPoint(bbCornerPoint: vec4): void {
        for (let i = 0; i < 3; i++) {
            if (bbCornerPoint[i] < this.aabbMin[i]) {
                this.aabbMin[i] = bbCornerPoint[i];
            }
            if (bbCornerPoint[i] > this.aabbMax[i]) {
                this.aabbMax[i] = bbCornerPoint[i];
            }
        }
    }

    protected isUsable(): boolean {
        return super.isUsable() && !this.getRenderableComponent().getBillboard();
    }

    public getObjectSpaceAabbMin(): vec3 {
        return super.getObjectSpaceAabbMin();
    }

    public getWorldSpaceAabbMin(): vec3 {
        if (this.isUsable()) {
            this.refresh();
            return vec3.clone(this.aabbMin);
        } else {
            return null;
        }
    }

    public getObjectSpaceAabbMax(): vec3 {
        return super.getObjectSpaceAabbMax();
    }

    public getWorldSpaceAabbMax(): vec3 {
        if (this.isUsable()) {
            this.refresh();
            return vec3.clone(this.aabbMax);
        } else {
            return null;
        }
    }

}