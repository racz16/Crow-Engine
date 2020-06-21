import { vec3, ReadonlyVec3 } from 'gl-matrix';

export class SplinePoint {

    private point = vec3.create();
    private left = vec3.create();
    private right = vec3.create();

    public constructor(point: ReadonlyVec3) {
        this.setPoint(point);
    }

    public getPoint(): ReadonlyVec3 {
        return this.point;
    }

    public setPoint(point: ReadonlyVec3): void {
        vec3.copy(this.point, point);
    }

    public getLeft(): ReadonlyVec3 {
        return this.left;
    }

    public setLeft(left: ReadonlyVec3): void {
        vec3.copy(this.left, left);
        const direction = vec3.subtract(vec3.create(), this.point, left);
        this.right = vec3.add(vec3.create(), this.point, direction);
    }

    public getRight(): ReadonlyVec3 {
        return this.right;
    }

    public setRight(right: ReadonlyVec3): void {
        vec3.copy(this.right, right);
        const direction = vec3.subtract(vec3.create(), this.point, right);
        this.left = vec3.add(vec3.create(), this.point, direction);
    }

}
