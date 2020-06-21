import { vec3, ReadonlyVec3 } from 'gl-matrix';

export class FrustumPlane {
    private readonly normalVector = vec3.create();
    private readonly point = vec3.create();

    public constructor(normalVector: ReadonlyVec3, point: ReadonlyVec3) {
        vec3.copy(this.normalVector, normalVector);
        vec3.copy(this.point, point);
    }

    public getNormalVector(): ReadonlyVec3 {
        return this.normalVector;
    }

    public getPoint(): ReadonlyVec3 {
        return this.point;
    }

    public computeDistanceFrom(position: ReadonlyVec3): number {
        return vec3.dot(this.normalVector, vec3.sub(vec3.create(), position, this.point));
    }

}