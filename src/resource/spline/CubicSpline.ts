import { mat4, vec3 } from 'gl-matrix';
import { Spline } from './Spline';

export abstract class CubicSpline extends Spline {

    protected basisMatrix = mat4.create();
    private step = 0.1;

    protected computeSplineDataUnsafe(): Array<number> {
        const data = new Array<number>();
        for (let i = 0; i < this.getNumberOfControlPoints() - 1; i++) {
            this.addCurveToData(data, i);
        }
        if (!this.isLoop()) {
            this.addPointToData(data, this.getNumberOfControlPoints() - 1, 0);
        } else {
            this.addCurveToData(data, this.getNumberOfControlPoints() - 1);
        }
        return data;
    }

    private addCurveToData(data: Array<number>, index: number): void {
        const steps = 1 / this.getStep();
        for (let i = 0; i < steps; i++) {
            this.addPointToData(data, index, i * this.getStep());
        }
    }

    private addPointToData(data: Array<number>, index: number, t: number): void {
        const position = this.getValue(index, t);
        this.addPositionToData(position, data);
        this.refreshRadius(position);
        this.refreshAabb(position);
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

    protected abstract refreshBasisMatrix(): void;

    public getBasisMatrix(): mat4 {
        return mat4.clone(this.basisMatrix);
    }

}
