import { ISpline } from './ISpline';
import { ResourceManager } from '../ResourceManager';
import { vec3 } from 'gl-matrix';
import { Vao } from '../../webgl/Vao';
import { Utility } from '../../utility/Utility';
import { Gl } from '../../webgl/Gl';
import { Vbo } from '../../webgl/buffer/Vbo';
import { VertexAttribPointer } from '../../webgl/VertexAttribPointer';
import { BufferObjectUsage } from '../../webgl/enum/BufferObjectUsage';
import { SplinePoint } from './SplinePoint';

export class Spline implements ISpline {
    protected controlPoints: Array<SplinePoint> = [];
    protected valid = true;
    protected lengthValid = true;
    protected length: number;
    private distances: Array<number> = [];
    private loop: boolean;

    private vao: Vao;
    private numberOfPoints: number;

    protected aabbMin = vec3.create();
    protected aabbMax = vec3.create();
    protected furthestVertexDistance: number;

    public constructor() {
        ResourceManager.add(this);
    }

    protected refresh(): void {
        if (!this.valid) {
            if (this.getRequiredControlPoints() <= this.getNumberOfControlPoints()) {
                if (!Utility.isUsable(this.vao)) {
                    this.createVao();
                }
            } else {
                this.release();
                return;
            }
            this.refreshSpline();
        }
    }

    private createVao(): void {
        this.vao = new Vao();
        const vbo = new Vbo();
        this.vao.getVertexAttribArray(0).setVbo(vbo, new VertexAttribPointer(3));
        this.vao.getVertexAttribArray(0).setEnabled(true);
    }

    private refreshSpline(): void {
        const data = this.computeSplineData();
        this.numberOfPoints = data.length / 3;
        const vbo = this.vao.getVertexAttribArray(0).getVbo();
        vbo.allocateAndStore(new Float32Array(data), BufferObjectUsage.STATIC_DRAW);
        this.valid = true;
    }

    protected computeSplineData(): Array<number> {
        this.aabbMax = vec3.create();
        this.aabbMin = vec3.create();
        this.furthestVertexDistance = 0;
        const data = new Array<number>(this.getNumberOfControlPoints() * 3);
        let index = 0;
        for (let i = 0; i < this.getNumberOfControlPoints(); i++) {
            const pos = this.getControlPoint(i);
            this.refreshAabbAndRadius(pos);
            data[index++] = pos[0];
            data[index++] = pos[1];
            data[index++] = pos[2];
        }
        return data;
    }

    protected refreshAabbAndRadius(position: vec3): void {
        //furthest vertex distance
        if (this.furthestVertexDistance < vec3.length(position)) {
            this.furthestVertexDistance = vec3.length(position);
        }
        //aabb
        for (let i = 0; i < 3; i++) {
            if (position[i] < this.aabbMin[i]) {
                this.aabbMin[i] = position[i];
            }
            if (position[i] > this.aabbMax[i]) {
                this.aabbMax[i] = position[i];
            }
        }
    }

    public getForwardVector(t: number): vec3 {
        if (this.getNumberOfControlPoints() < 2) {
            return null;
        } else {
            if (t >= 0.9999) {
                const p1 = this.getApproximatedPosition(t - 0.0001);
                const p2 = this.getApproximatedPosition(t);
                return vec3.normalize(vec3.create(), vec3.subtract(vec3.create(), p2, p1));
            } else {
                const p1 = this.getApproximatedPosition(t);
                const p2 = this.getApproximatedPosition(t + 0.0001);
                return vec3.normalize(vec3.create(), vec3.subtract(vec3.create(), p2, p1));
            }
        }
    }

    public getApproximatedPosition(t: number): vec3 {
        t = t < 0 ? t % -1 : t % 1;
        if (this.getNumberOfControlPoints() < 1) {
            return null;
        } else if (this.getVertexCount() === 1) {
            return this.getControlPoint(0);
        } else {
            this.refreshLength();
            if (t === 0) {
                return this.getValue(0, 0);
            }
            return this.getApproximatedPositionInRealSpline(t);
        }
    }

    private getApproximatedPositionInRealSpline(t: number): vec3 {
        let index = 0;
        let dist = this.distances[0];
        const wantedDistance = this.length * t;
        while (dist < wantedDistance) {
            index++;
            dist += this.distances[index];
        }
        const localT = (wantedDistance - (dist - this.distances[index])) / this.distances[index];
        return this.getValue(index, localT);
    }

    protected getValue(startIndex: number, t: number): vec3 {
        if (this.getNumberOfControlPoints() < 1) {
            return null;
        } else if (this.getVertexCount() === 1) {
            return this.getControlPoint(0);
        } else {
            const first = vec3.scale(vec3.create(), vec3.clone(this.getControlPoint(startIndex)), 1 - t);
            const second = vec3.clone(this.getControlPoint(startIndex === this.getVertexCount() - 1 ? 0 : startIndex + 1));
            return vec3.add(vec3.create(), first, vec3.scale(vec3.create(), second, t));
        }
    }

    protected refreshLength(): void {
        if (!this.lengthValid) {
            this.distances = [];
            let sum = 0;
            for (let i = 0; i < this.controlPoints.length - 1; i++) {
                const dist = vec3.distance(this.getControlPoint(i), this.getControlPoint(i + 1));
                sum += dist;
                this.distances.push(dist);
            }
            if (this.isLoop()) {
                const dist = vec3.distance(this.getControlPoint(this.controlPoints.length - 1), this.getControlPoint(0));
                sum += dist;
                this.distances.push(dist);
            }

            this.length = sum;
            this.lengthValid = true;
        }
    }

    public getApproximatedLength(): number {
        this.refreshLength();
        return length;
    }

    public isLoop(): boolean {
        return this.loop;
    }

    public setLoop(loop: boolean): void {
        this.loop = loop;
        this.valid = false;
        this.lengthValid = false;
    }

    public getVertexCount(): number {
        return this.numberOfPoints;
    }

    //
    //control points------------------------------------------------------------
    //
    public getNumberOfControlPoints(): number {
        return this.controlPoints.length;
    }

    public addControlPointToTheEnd(point: vec3): void {
        this.controlPoints.push(new SplinePoint(vec3.clone(point)));
        this.valid = false;
        this.lengthValid = false;
    }

    public addControlPointToIndex(index: number, point: vec3): void {
        this.controlPoints[index] = new SplinePoint(vec3.clone(point));
        this.valid = false;
        this.lengthValid = false;
    }

    public getControlPoint(index: number): vec3 {
        return vec3.clone(this.controlPoints[index].getPoint());
    }

    public setControlPoint(index: number, point: vec3) {
        this.controlPoints[index] = new SplinePoint(vec3.clone(point));
        this.valid = false;
        this.lengthValid = false;
    }

    public removeControlPointFromTheEnd(): void {
        Utility.removeElement(this.controlPoints, this.controlPoints.length - 1);
        this.valid = false;
        this.lengthValid = false;
    }

    public removeControlPoint(index: number): void {
        Utility.removeElement(this.controlPoints, index);
        this.valid = false;
        this.lengthValid = false;
    }

    public removeAllControlPoints(): void {
        this.controlPoints = [];
        this.valid = false;
        this.lengthValid = false;
    }

    public getRequiredControlPoints(): number {
        return 2;
    }

    //
    //frustum culling-----------------------------------------------------------
    //
    public getObjectSpaceRadius(): number {
        this.refresh();
        return this.furthestVertexDistance;
    }

    public getObjectSpaceAabbMin() {
        this.refresh();
        return vec3.clone(this.aabbMin);
    }

    public getObjectSpaceAabbMax(): vec3 {
        this.refresh();
        return vec3.clone(this.aabbMax);
    }

    //
    //rendering
    //
    public draw(): void {
        this.refresh();
        this.vao.bind();
        Gl.gl.drawArrays(this.isLoop() ? Gl.gl.LINE_LOOP : Gl.gl.LINE_STRIP, 0, this.getVertexCount());
    }

    //
    //misc----------------------------------------------------------------------
    //
    public getDataSize(): number {
        return Utility.isUsable(this.vao) ? this.vao.getDataSize() : 0;
    }

    public release(): void {
        if (Utility.isUsable(this.vao)) {
            this.vao.release();
            this.vao = null;
            this.valid = false;
            this.lengthValid = false;
        }
    }

    public isUsable(): boolean {
        return true;
    }

    public update(): void { }

}
