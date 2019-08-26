import { vec3 } from 'gl-matrix';

export class FrustumPlane {
    public readonly normalVector: vec3;
    public readonly point: vec3;

    public constructor(normalVector: vec3, point: vec3) {
        this.normalVector = normalVector;
        this.point = point;
    }

    public computeDistanceFrom(position: vec3): number {
        return vec3.dot(this.normalVector, vec3.sub(vec3.create(), position, this.point));
    }

}