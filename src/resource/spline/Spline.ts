import { ISpline } from './ISpline';
import { vec3 } from 'gl-matrix';
import { GlVao } from '../../webgl/GlVao';
import { Utility } from '../../utility/Utility';
import { Gl } from '../../webgl/Gl';
import { GlVbo } from '../../webgl/buffer/GlVbo';
import { GlVertexAttribPointer } from '../../webgl/GlVertexAttribPointer';
import { GlBufferObjectUsage } from '../../webgl/enum/GlBufferObjectUsage';
import { SplinePoint } from './SplinePoint';
import { Engine } from '../../core/Engine';
import { Conventions } from '../Conventions';
import { TagContainer } from '../../core/TagContainer';

export class Spline implements ISpline {
    protected controlPoints: Array<SplinePoint> = [];
    protected valid = true;
    protected lengthValid = true;
    protected length: number;
    private distances: Array<number> = [];
    private loop: boolean;

    private vao: GlVao;
    private numberOfPoints: number;

    protected aabbMin = vec3.create();
    protected aabbMax = vec3.create();
    protected radius: number;

    private tagContainer = new TagContainer();

    public constructor() {
        Engine.getResourceManager().add(this);
    }

    protected refresh(): void {
        if (!this.valid) {
            if (this.getRequiredControlPoints() <= this.getNumberOfControlPoints()) {
                this.createVao();
                this.refreshSpline();
            } else {
                this.release();
            }
        }
    }

    private createVao(): void {
        if (!Utility.isUsable(this.vao)) {
            this.vao = new GlVao();
            const vbo = new GlVbo();
            this.vao.getVertexAttribArray(Conventions.VI_POSITIONS).setVbo(vbo, new GlVertexAttribPointer(3));
            this.vao.getVertexAttribArray(Conventions.VI_POSITIONS).setEnabled(true);
        }
    }

    private refreshSpline(): void {
        const data = this.computeSplineData();
        this.numberOfPoints = data.length / 3;
        const vbo = this.vao.getVertexAttribArray(Conventions.VI_POSITIONS).getVbo();
        vbo.allocateAndStore(new Float32Array(data), GlBufferObjectUsage.STATIC_DRAW);
        this.valid = true;
    }

    private computeSplineData(): Array<number> {
        this.aabbMax = vec3.create();
        this.aabbMin = vec3.create();
        this.radius = 0;
        return this.computeSplineDataUnsafe();
    }

    protected computeSplineDataUnsafe(): Array<number> {
        const data = new Array<number>(this.getNumberOfControlPoints() * 3);
        for (let i = 0; i < this.getNumberOfControlPoints(); i++) {
            const position = this.getControlPoint(i);
            this.refreshRadius(position);
            this.refreshAabb(position);
            this.addPositionToData(position, data);
        }
        return data;
    }

    protected addPositionToData(position: vec3, data: Array<number>): void {
        for (let j = 0; j < 3; j++) {
            data.push(position[j]);
        }
    }

    protected refreshRadius(position: vec3): void {
        if (this.radius < vec3.length(position)) {
            this.radius = vec3.length(position);
        }
    }

    protected refreshAabb(position: vec3): void {
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
        t = this.normalizeT(t);
        if (this.getNumberOfControlPoints() < 2) {
            return null;
        } else {
            return this.getForwardVectorUnsafe(t);
        }
    }

    private getForwardVectorUnsafe(t: number): vec3 {
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

    public getApproximatedPosition(t: number): vec3 {
        t = this.normalizeT(t);
        if (this.getNumberOfControlPoints() < 1) {
            return null;
        } else if (this.getNumberOfControlPoints() === 1) {
            return this.getControlPoint(0);
        } else {
            this.refreshLength();
            return t === 0 ? this.getValue(0, 0) : this.getApproximatedPositionInRealSpline(t);
        }
    }

    private normalizeT(t: number): number {
        return t < 0 ? 1 - (t % -1) : t % 1;
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
        } else if (this.getNumberOfControlPoints() === 1) {
            return this.getControlPoint(0);
        } else {
            const first = vec3.scale(vec3.create(), this.getControlPoint(startIndex), 1 - t);
            const second = this.getControlPoint(startIndex === this.getNumberOfControlPoints() - 1 ? 0 : startIndex + 1);
            return vec3.add(vec3.create(), first, vec3.scale(vec3.create(), second, t));
        }
    }

    private refreshLength(): void {
        if (!this.lengthValid) {
            this.distances = [];
            this.length = 0;
            this.refreshLengthUnsafe();
            this.lengthValid = true;
        }
    }

    protected refreshLengthUnsafe(): void {
        for (let i = 0; i < this.controlPoints.length - 1; i++) {
            const dist = vec3.distance(this.getControlPoint(i), this.getControlPoint(i + 1));
            this.length += dist;
            this.distances.push(dist);
        }
        if (this.isLoop()) {
            const dist = vec3.distance(this.getControlPoint(this.controlPoints.length - 1), this.getControlPoint(0));
            this.length += dist;
            this.distances.push(dist);
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
        return this.radius;
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

    public getAllDataSize(): number {
        return this.getDataSize();
    }

    public release(): void {
        if (Utility.isUsable(this.vao)) {
            this.vao.releaseAll();
            this.vao = null;
            this.valid = false;
            this.lengthValid = false;
        }
    }

    public isUsable(): boolean {
        return true;
    }

    public update(): void { }

    public hasTextureCoordinates(): boolean {
        return false;
    }

    public hasNormals(): boolean {
        return false;
    }

    public hasTangents(): boolean {
        return false;
    }

    public hasVertexColors(): boolean {
        return false;
    }

}
