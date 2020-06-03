import { IMesh } from './IMesh';
import { Vao } from '../../webgl/Vao';
import { vec3 } from 'gl-matrix';
import { Gl } from '../../webgl/Gl';
import { Vbo } from '../../webgl/buffer/Vbo';
import { BufferObjectUsage } from '../../webgl/enum/BufferObjectUsage';
import { VertexAttribPointer } from '../../webgl/VertexAttribPointer';
import { Utility } from '../../utility/Utility';
import { Engine } from '../../core/Engine';
import { Conventions } from '../Conventions';

export class CubeMesh implements IMesh {

    private static instance: CubeMesh;
    private vao: Vao;
    private positions = [
        -1, 1, -1,
        -1, -1, -1,
        1, -1, -1,
        1, -1, -1,
        1, 1, -1,
        -1, 1, -1,
        -1, -1, 1,
        -1, -1, -1,
        -1, 1, -1,
        -1, 1, -1,
        -1, 1, 1,
        -1, -1, 1,
        1, -1, -1,
        1, -1, 1,
        1, 1, 1,
        1, 1, 1,
        1, 1, -1,
        1, -1, -1,
        -1, -1, 1,
        -1, 1, 1,
        1, 1, 1,
        1, 1, 1,
        1, -1, 1,
        -1, -1, 1,
        -1, 1, -1,
        1, 1, -1,
        1, 1, 1,
        1, 1, 1,
        -1, 1, 1,
        -1, 1, -1,
        -1, -1, -1,
        -1, -1, 1,
        1, -1, -1,
        1, -1, -1,
        -1, -1, 1,
        1, -1, 1
    ];

    private constructor() {
        this.create();
        Engine.getResourceManager().add(this);
    }

    public static getInstance(): CubeMesh {
        if (!CubeMesh.instance) {
            CubeMesh.instance = new CubeMesh();
        }
        return CubeMesh.instance;
    }

    public create(): void {
        if (!this.isUsable()) {
            this.vao = new Vao();
            const pos = new Vbo();
            pos.allocateAndStore(new Float32Array(this.positions), BufferObjectUsage.STATIC_DRAW);
            this.vao.getVertexAttribArray(Conventions.POSITIONS_VBO_INDEX).setVbo(pos, new VertexAttribPointer(3));
            this.vao.getVertexAttribArray(Conventions.POSITIONS_VBO_INDEX).setEnabled(true);
        }
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
        this.vao.bind();
        Gl.gl.drawArrays(Gl.gl.TRIANGLES, 0, this.getVertexCount());
    }

    public getDataSize() {
        return this.isUsable() ? this.positions.length * 4 : 0;
    }

    public getAllDataSize(): number {
        return this.getDataSize();
    }

    public release(): void {
        if (this.isUsable()) {
            this.vao.releaseAll();
            this.vao = null;
        }
    }

    public isUsable(): boolean {
        return Utility.isUsable(this.vao);
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
