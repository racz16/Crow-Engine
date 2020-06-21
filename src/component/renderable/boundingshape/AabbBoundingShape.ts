import { BoundingShape } from './BoundingShape';
import { vec3, vec4, ReadonlyVec3 } from 'gl-matrix';
import { Engine } from '../../../core/Engine';
import { ICameraComponent } from '../../camera/ICameraComponent';

export class AabbBoundingShape extends BoundingShape {

    protected readonly aabbMin = vec3.create();
    protected readonly aabbMax = vec3.create();

    public isInsideMainCameraFrustum(): boolean {
        const camera = Engine.getMainCamera();
        if (camera && camera.getGameObject() && this.isUsable()) {
            this.refresh();
            return this.isInsideMainCameraFrustumUnsafe(camera);
        }
        return true;
    }

    protected isInsideMainCameraFrustumUnsafe(camera: ICameraComponent): boolean {
        for (const plane of camera.getFrustum().getPlanesIterator()) {
            const pVertex = this.computeNormalAlignedAabbVertexMax(this.aabbMin, this.aabbMax, plane.getNormalVector());
            const distance = plane.computeDistanceFrom(pVertex);
            if (distance < 0) {
                return false;
            }
        }
        return true;
    }

    protected computeNormalAlignedAabbVertexMax(aabbMin: ReadonlyVec3, aabbMax: ReadonlyVec3, normalVector: ReadonlyVec3): vec3 {
        const result = vec3.create();
        result[0] = normalVector[0] >= 0 ? aabbMax[0] : aabbMin[0];
        result[1] = normalVector[1] >= 0 ? aabbMax[1] : aabbMin[1];
        result[2] = normalVector[2] >= 0 ? aabbMax[2] : aabbMin[2];
        return result;
    }

    protected refreshUnsafe(): void {
        const wsBoundingBoxCornerPoints = this.computeWorldSpaceBoundingBoxCornerPoints();
        vec3.copy(this.aabbMin, vec3.fromValues(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY));
        vec3.copy(this.aabbMax, vec3.fromValues(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY));
        for (const cornerPoint of wsBoundingBoxCornerPoints) {
            this.refreshAabbCornerPoint(cornerPoint);
        }
    }

    protected computeWorldSpaceBoundingBoxCornerPoints(): Array<vec4> {
        const boundingBoxCornerPoints = this.computeObjectSpaceAabbCornerPoints();
        const modelMatrix = this.renderableComponent.getModelMatrix();
        for (const anAabb of boundingBoxCornerPoints) {
            vec4.transformMat4(anAabb, anAabb, modelMatrix);
        }
        return boundingBoxCornerPoints;
    }

    protected refreshAabbCornerPoint(bbCornerPoint: vec4): void {
        for (let i = 0; i < 3; i++) {
            if (bbCornerPoint[i] < this.aabbMin[i]) {
                this.aabbMin[i] = bbCornerPoint[i];
            }
            if (bbCornerPoint[i] > this.aabbMax[i]) {
                this.aabbMax[i] = bbCornerPoint[i];
            }
        }
    }

    public getObjectSpaceAabbMin(): ReadonlyVec3 {
        return super.getObjectSpaceAabbMin();
    }

    public getWorldSpaceAabbMin(): ReadonlyVec3 {
        if (this.isUsable()) {
            this.refresh();
            return this.aabbMin;
        } else {
            return null;
        }
    }

    public getObjectSpaceAabbMax(): ReadonlyVec3 {
        return super.getObjectSpaceAabbMax();
    }

    public getWorldSpaceAabbMax(): ReadonlyVec3 {
        if (this.isUsable()) {
            this.refresh();
            return this.aabbMax;
        } else {
            return null;
        }
    }

    protected isValid(): boolean {
        return super.isValid() && !this.renderableComponent.getBillboard();
    }

}