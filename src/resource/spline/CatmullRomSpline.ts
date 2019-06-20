import { CubicSpline } from "./CubicSpline";
import { vec3, mat4, vec4 } from "gl-matrix";

export class CatmullRomSpline extends CubicSpline {
    private tension: number;

    public constructor(tension: number = 0.5) {
        super();
        this.setTension(tension);
    }

    protected getValue(startIndex: number, t: number): vec3 {
        if (this.getNumberOfControlPoints() < this.getRequiredControlPoints()) {
            return super.getValue(startIndex, t);
        } else {
            const vec = vec4.transformMat4(vec4.create(), vec4.fromValues(t * t * t, t * t, t, 1), this.basisMatrix);
            const cps = new Array<vec3>(4);
            for (let i = -1; i < 3; i++) {
                if (this.isLoop()) {
                    if (startIndex + i == -1) {
                        cps[i + 1] = this.getControlPoint(this.getNumberOfControlPoints() - 1);
                    } else if (startIndex + i == this.getNumberOfControlPoints()) {
                        cps[i + 1] = this.getControlPoint(0);
                    } else if (startIndex + i == this.getNumberOfControlPoints() + 1) {
                        cps[i + 1] = this.getControlPoint(1);
                    } else {
                        cps[i + 1] = this.getControlPoint(startIndex + i);
                    }
                } else {
                    if (startIndex + i == -1) {
                        cps[i + 1] = vec3.add(vec3.create(), this.getControlPoint(0), vec3.sub(vec3.create(), this.getControlPoint(0), this.getControlPoint(1)));
                    } else if (startIndex + i == this.getNumberOfControlPoints()) {
                        cps[i + 1] = vec3.add(vec3.create(), this.getControlPoint(startIndex + i - 1), vec3.sub(vec3.create(), this.getControlPoint(startIndex + i - 1), this.getControlPoint(startIndex + i - 2)));
                    } else {
                        cps[i + 1] = this.getControlPoint(startIndex + i);
                    }
                }
            }

            const v1 = vec4.fromValues(cps[0][0], cps[1][0], cps[2][0], cps[3][0]);
            const v2 = vec4.fromValues(cps[0][1], cps[1][1], cps[2][1], cps[3][1]);
            const v3 = vec4.fromValues(cps[0][2], cps[1][2], cps[2][2], cps[3][2]);

            return vec3.fromValues(vec4.dot(vec, v1), vec4.dot(vec, v2), vec4.dot(vec, v3));
        }
    }

    protected computeBasisMatrix(): void {
        this.basisMatrix = mat4.fromValues(
            -this.tension, 2 - this.tension, this.tension - 2, this.tension,
            2 * this.tension, this.tension - 3, 3 - 2 * this.tension, -this.tension,
            -this.tension, 0, this.tension, 0,
            0, 1, 0, 0);
        this.valid = false;
    }

    public getTension(): number {
        return this.tension;
    }

    public setTension(newTension: number): void {
        this.tension = newTension;
        this.computeBasisMatrix();
    }

    public getRequiredControlPoints(): number {
        return 4;
    }

}
