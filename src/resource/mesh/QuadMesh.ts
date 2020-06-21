import { IMesh } from './IMesh';
import { GlVao } from '../../webgl/GlVao';
import { vec3, ReadonlyVec3 } from 'gl-matrix';
import { GlEbo } from '../../webgl/buffer/GlEbo';
import { GlVbo } from '../../webgl/buffer/GlVbo';
import { GlBufferObjectUsage } from '../../webgl/enum/GlBufferObjectUsage';
import { GlVertexAttribPointer } from '../../webgl/GlVertexAttribPointer';
import { Gl } from '../../webgl/Gl';
import { Utility } from '../../utility/Utility';
import { Engine } from '../../core/Engine';
import { Conventions } from '../Conventions';

export class QuadMesh implements IMesh {

    private static instace: QuadMesh;
    private vao: GlVao;
    private positions = [
        -1, 1, 0,       //top left
        1, 1, 0,        //top right
        -1, -1, 0,      //bottom left
        1, -1, 0,       //bottom right
    ];
    private normals = [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
    ]
    private indices = [0, 2, 3, 1, 0, 3];
    private uv = [0, 1, 1, 1, 0, 0, 1, 0];

    private constructor() {
        this.create();
        Engine.getResourceManager().add(this);
    }

    public static getInstance(): QuadMesh {
        if (!QuadMesh.instace) {
            QuadMesh.instace = new QuadMesh();
        }
        return QuadMesh.instace;
    }

    public create(): void {
        if (!this.isUsable()) {
            this.vao = new GlVao();
            this.addEbo();
            this.addVbo(this.positions, Conventions.VI_POSITIONS, 3);
            this.addVbo(this.normals, Conventions.VI_NORMALS, 3);
            this.addVbo(this.uv, Conventions.VI_TEXTURE_COORDINATES_0, 2);
        }
    }

    private addEbo(): void {
        const ebo = new GlEbo();
        this.vao.setEbo(ebo);
        ebo.allocateAndStore(new Uint32Array(this.indices), GlBufferObjectUsage.STATIC_DRAW);
    }

    private addVbo(data: Array<number>, vertexAttribArrayIndex: number, vertexSize: number): void {
        const vbo = new GlVbo();
        vbo.allocateAndStore(new Float32Array(data), GlBufferObjectUsage.STATIC_DRAW);
        this.vao.getVertexAttribArray(vertexAttribArrayIndex).setVbo(vbo, new GlVertexAttribPointer(vertexSize));
        this.vao.getVertexAttribArray(vertexAttribArrayIndex).setEnabled(true);
    }

    public getVertexCount(): number {
        return 6;
    }

    public getFaceCount(): number {
        return 2;
    }

    public getObjectSpaceRadius(): number {
        return Math.sqrt(2);
    }

    public getObjectSpaceAabbMin(): ReadonlyVec3 {
        return vec3.fromValues(-1, -1, 0);
    }

    public getObjectSpaceAabbMax(): ReadonlyVec3 {
        return vec3.fromValues(1, 1, 0);
    }

    public draw(): void {
        this.vao.bind();
        Gl.gl.drawElements(Gl.gl.TRIANGLES, this.getVertexCount(), Gl.gl.UNSIGNED_INT, 0);
    }

    public getDataSize(): number {
        return this.isUsable() ? (this.positions.length + this.normals.length + this.uv.length + this.indices.length) * 4 : 0;
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
        return true;
    }

    public hasNormals(): boolean {
        return true;
    }

    public hasTangents(): boolean {
        return false;
    }

    public hasVertexColors(): boolean {
        return false;
    }

}
