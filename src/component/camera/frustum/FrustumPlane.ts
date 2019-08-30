import { vec3 } from 'gl-matrix';

export class FrustumPlane {
    private readonly normalVector = vec3.create();
    private readonly point = vec3.create();

    public constructor(normalVector: vec3, point: vec3) {
        this.normalVector.set(normalVector);
        this.point.set(point);
    }

    public getNormalVector(): vec3 {
        return vec3.clone(this.normalVector);
    }

    public getPoint(): vec3 {
        return vec3.clone(this.point);
    }

    public computeDistanceFrom(position: vec3): number {
        return vec3.dot(this.normalVector, vec3.sub(vec3.create(), position, this.point));
    }

}