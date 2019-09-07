import { IMesh } from './IMesh';
import { Vao } from '../../webgl/Vao';
import { vec3 } from 'gl-matrix';
import { Gl } from '../../webgl/Gl';
import { Vbo } from '../../webgl/buffer/Vbo';
import { BufferObjectUsage } from '../../webgl/enum/BufferObjectUsage';
import { VertexAttribPointer } from '../../webgl/VertexAttribPointer';
import { Utility } from '../../utility/Utility';
import { Engine } from '../../core/Engine';

export class CubeMesh implements IMesh {

    private static instance: CubeMesh;
    private vao: Vao;
    private positions = [-1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, 1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, 1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, 1, -1, -1, 1, -1, 1, -1, 1, 1, -1, 1, 1, 1, 1, 1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, 1, -1, 1];

    private constructor() {
        this.loadData();
        Engine.getResourceManager().add(this);
    }

    public static getInstance(): CubeMesh {
        if (!CubeMesh.instance) {
            CubeMesh.instance = new CubeMesh();
        }
        return CubeMesh.instance;
    }

    private loadData(): void {
        this.vao = new Vao();
        const pos = new Vbo();
        pos.allocateAndStore(new Float32Array(this.positions), BufferObjectUsage.STATIC_DRAW);
        this.vao.getVertexAttribArray(0).setVbo(pos, new VertexAttribPointer(3));
        this.vao.getVertexAttribArray(0).setEnabled(true);
    }

    public getVertexCount(): number {
        return 36;
    }

    public getFaceCount(): number {
        return 12;
    }

    public getObjectSpaceRadius(): number {
        return Math.sqrt(3);
    }

    public getObjectSpaceAabbMin(): vec3 {
        return vec3.fromValues(-1, -1, -1);
    }

    public getObjectSpaceAabbMax(): vec3 {
        return vec3.fromValues(1, 1, 1);
    }

    public draw(): void {
        if (!Utility.isUsable(this.vao)) {
            this.loadData();
        }
        this.vao.bind();
        Gl.gl.drawArrays(Gl.gl.TRIANGLES, 0, this.getVertexCount());
    }

    public getDataSize() {
        return Utility.isUsable(this.vao) ? this.positions.length * 4 : 0;
    }

    public release(): void {
        this.vao.release();
        this.vao = null;
    }

    public isUsable(): boolean {
        return true;
    }

    public update(): void { }

}
