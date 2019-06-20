import { vec3 } from "gl-matrix";

export class SplinePoint {

    private point = vec3.create();
    private left = vec3.create();
    private right = vec3.create();

    public constructor(point: vec3) {
        this.setPoint(point);
    }

    public getPoint(): vec3 {
        return this.point;
    }

    public setPoint(point: vec3): void {
        this.point.set(point);
    }

    public getLeft(): vec3 {
        return this.left;
    }

    public setLeft(left: vec3): void {
        this.left.set(left);
        const direction = vec3.subtract(vec3.create(), this.point, left);
        this.right = vec3.add(vec3.create(), this.point, direction);
    }

    public getRight(): vec3 {
        return this.right;
    }

    public setRight(right: vec3): void {
        this.right.set(right);
        const direction = vec3.subtract(vec3.create(), this.point, right);
        this.left = vec3.add(vec3.create(), this.point, direction);
    }

}
