import { IMesh } from './IMesh';
import { Vao } from '../../webgl/Vao';
import { vec3 } from 'gl-matrix';
import { Ebo } from '../../webgl/buffer/Ebo';
import { Vbo } from '../../webgl/buffer/Vbo';
import { BufferObjectUsage } from '../../webgl/enum/BufferObjectUsage';
import { VertexAttribPointer } from '../../webgl/VertexAttribPointer';
import { Gl } from '../../webgl/Gl';
import { Utility } from '../../utility/Utility';
import { Engine } from '../../core/Engine';

export class QuadMesh implements IMesh {

    private static instace: QuadMesh;
    private vao: Vao;

    private constructor() {
        this.loadData();
        Engine.getResourceManager().add(this);
    }

    public static getInstance(): QuadMesh {
        if (!QuadMesh.instace) {
            QuadMesh.instace = new QuadMesh();
        }
        return QuadMesh.instace;
    }

    private loadData(): void {
        const positions = new Array<number>();
        //top left
        positions.push(-1);
        positions.push(1);
        positions.push(0);
        //top right
        positions.push(1);
        positions.push(1);
        positions.push(0);
        //bottom left
        positions.push(-1);
        positions.push(-1);
        positions.push(0);
        //bottom right
        positions.push(1);
        positions.push(-1);
        positions.push(0);

        this.vao = new Vao();

        const indices = [0, 2, 3, 1, 0, 3];
        const ebo = new Ebo();
        ebo.allocateAndStore(new Uint32Array(indices), BufferObjectUsage.STATIC_DRAW);
        this.vao.setEbo(ebo);

        const positionVbo = new Vbo();
        positionVbo.allocateAndStore(new Float32Array(positions), BufferObjectUsage.STATIC_DRAW);
        this.vao.getVertexAttribArray(0).setVbo(positionVbo, new VertexAttribPointer(3));
        this.vao.getVertexAttribArray(0).setEnabled(true);
        //positionVbo.allocateAndStoreImmutable(positions, false);
        //this.vao.connectVbo(positionVbo, new VertexAttribPointer(0, 3));

        const uv = [0, 1, 1, 1, 0, 0, 1, 0];
        const uvVbo = new Vbo();
        uvVbo.allocateAndStore(new Float32Array(uv), BufferObjectUsage.STATIC_DRAW);
        this.vao.getVertexAttribArray(1).setVbo(uvVbo, new VertexAttribPointer(2));
        this.vao.getVertexAttribArray(1).setEnabled(true);
        //uvVbo.allocateAndStoreImmutable(uv, false);
        //this.vao.connectVbo(uvVbo, new VertexAttribPointer(1, 2));

        //uvVbo.release();
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

    public getObjectSpaceAabbMin(): vec3 {
        return vec3.fromValues(-1, -1, 0);
    }

    public getObjectSpaceAabbMax(): vec3 {
        return vec3.fromValues(1, 1, 0);
    }

    public draw(): void {
        if (!Utility.isUsable(this.vao)) {
            this.loadData();
        }
        this.vao.bind();
        Gl.gl.drawElements(Gl.gl.TRIANGLES, this.getVertexCount(), Gl.gl.UNSIGNED_INT, 0);
    }

    public getDataSize(): number {
        return Utility.isUsable(this.vao) ? 104 : 0;
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
