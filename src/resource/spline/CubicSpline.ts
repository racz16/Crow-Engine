import { mat4, vec3 } from "gl-matrix";
import { Spline } from "./Spline";

export abstract class CubicSpline extends Spline {

    protected basisMatrix = mat4.create();
    private step = 0.1;

    protected computeSplineData(): Array<number> {
        this.aabbMax = vec3.create();
        this.aabbMin = vec3.create();
        this.furthestVertexDistance = 0;
        const data = new Array<number>();
        for (let i = 0; i < this.getNumberOfControlPoints() - 1; i++) {
            this.addSplineSegmentToData(data, i);
        }
        if (!this.isLoop()) {
            this.addPointToData(data, this.getNumberOfControlPoints() - 1, 0);
        } else {
            this.addSplineSegmentToData(data, this.getNumberOfControlPoints() - 1);
        }
        return data;
    }

    private addSplineSegmentToData(data: Array<number>, index: number): void {
        const steps = 1 / this.getStep();
        for (let i = 0; i < steps; i++) {
            this.addPointToData(data, index, i * this.getStep());
        }
    }

    private addPointToData(data: Array<number>, index: number, t: number): void {
        const pos = this.getValue(index, t);
        data.push(pos[0]);
        data.push(pos[1]);
        data.push(pos[2]);
        this.refreshAabbAndRadius(pos);
    }

    public getStep(): number {
        return this.step;
    }

    public setStep(step: number): void {
        if (step <= 0 || step > 1) {
            throw new Error();
        }
        this.step = step;
        this.valid = false;
    }

    protected abstract computeBasisMatrix(): void;

    public getBasisMatrix(): mat4 {
        return mat4.clone(this.basisMatrix);
    }

}
