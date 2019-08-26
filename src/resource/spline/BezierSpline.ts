import { CubicSpline } from './CubicSpline';
import { vec3, vec4, mat4 } from 'gl-matrix';

export class BezierSpline extends CubicSpline {

    public constructor() {
        super();
        this.computeBasisMatrix();
    }

    protected getValue(startIndex: number, t: number): vec3 {
        if (this.getNumberOfControlPoints() < this.getRequiredControlPoints()) {
            return super.getValue(startIndex, t);
        } else {
            const vec = vec4.transformMat4(vec4.create(), vec4.fromValues(t * t * t, t * t, t, 1), this.basisMatrix);
            const cps = new Array<vec3>(4);
            cps[0] = this.controlPoints[startIndex].getPoint();
            cps[1] = this.controlPoints[startIndex].getRight();
            if (startIndex + 1 == this.getNumberOfControlPoints() && this.isLoop()) {
                cps[2] = this.controlPoints[0].getLeft();
                cps[3] = this.controlPoints[0].getPoint();
            } else {
                cps[2] = this.controlPoints[startIndex + 1].getLeft();
                cps[3] = this.controlPoints[startIndex + 1].getPoint();
            }

            const v1 = vec4.fromValues(cps[0][0], cps[1][0], cps[2][0], cps[3][0]);
            const v2 = vec4.fromValues(cps[0][1], cps[1][1], cps[2][1], cps[3][1]);
            const v3 = vec4.fromValues(cps[0][2], cps[1][2], cps[2][2], cps[3][2]);

            return vec3.fromValues(vec4.dot(vec, v1), vec4.dot(vec, v2), vec4.dot(vec, v3));
        }
    }

    public getLeftHelperPoint(index: number): vec3 {
        return vec3.clone(this.controlPoints[index].getLeft());
    }

    public getRightHelperPoint(index: number): vec3 {
        return vec3.clone(this.controlPoints[index].getRight());
    }

    public setLeftHelperPoint(index: number, helperPoint: vec3): void {
        this.controlPoints[index].setLeft(vec3.clone(helperPoint));
        this.valid = false;
    }

    public setRightHelperPoint(index: number, helperPoint: vec3): void {
        this.controlPoints[index].setRight(vec3.clone(helperPoint));
        this.valid = false;
    }

    public normalizeHelperPoints(distance: number): void {
        if (this.getNumberOfControlPoints() < this.getRequiredControlPoints()) {
            return;
        }
        //first
        let direction: vec3;
        if (this.isLoop()) {
            direction = vec3.normalize(vec3.create(), vec3.sub(vec3.create(), this.getControlPoint(this.controlPoints.length - 1), this.getControlPoint(1)));
        } else {
            direction = vec3.normalize(vec3.create(), vec3.sub(vec3.create(), this.getControlPoint(0), this.getControlPoint(1)));
        }
        this.controlPoints[0].setLeft(vec3.add(vec3.create(), this.getControlPoint(0), vec3.scale(vec3.create(), direction, distance)));
        //normal control points
        for (let i = 1; i < this.controlPoints.length - 1; i++) {
            direction = vec3.normalize(vec3.create(), vec3.sub(vec3.create(), this.getControlPoint(i - 1), this.getControlPoint(i + 1)));
            this.controlPoints[i].setLeft(vec3.add(vec3.create(), this.getControlPoint(i), vec3.scale(vec3.create(), direction, distance)));
        }
        //last
        if (this.isLoop()) {
            direction = vec3.normalize(vec3.create(), vec3.sub(vec3.create(), this.getControlPoint(this.controlPoints.length - 2), this.getControlPoint(0)));
        } else {
            direction = vec3.normalize(vec3.create(), vec3.sub(vec3.create(), this.getControlPoint(this.controlPoints.length - 2), this.getControlPoint(this.controlPoints.length - 1)));
        }
        this.controlPoints[this.controlPoints.length - 1].setLeft(vec3.add(vec3.create(), this.getControlPoint(this.controlPoints.length - 1), vec3.scale(vec3.create(), direction, distance)));
        this.valid = false;
    }

    protected computeBasisMatrix(): void {
        this.basisMatrix = mat4.fromValues(
            -1, 3, -3, 1,
            3, -6, 3, 0,
            -3, 3, 0, 0,
            1, 0, 0, 0);
        this.valid = false;
    }

}
