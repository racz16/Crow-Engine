import { IMesh } from "./IMesh";
import { Vao } from "../../webgl/Vao";
import { ResourceManager } from "../ResourceManager";
import { vec3 } from "gl-matrix";
import { Gl } from "../../webgl/Gl";
import { Vbo } from "../../webgl/buffer/Vbo";
import { BufferObjectUsage } from "../../webgl/enum/BufferObjectUsage";
import { VertexAttribPointer } from "../../webgl/VertexAttribPointer";
import { Utility } from "../../utility/Utility";

export class CubeMesh implements IMesh {

    private static instance: CubeMesh;
    private vao: Vao;
    private positions = [-1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, 1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, 1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, 1, -1, -1, 1, -1, 1, -1, 1, 1, -1, 1, 1, 1, 1, 1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, 1, -1, 1];

    private constructor() {
        this.loadData();
        ResourceManager.private_add(this);
    }

    public static getInstance(): CubeMesh {
        if (CubeMesh.instance == null) {
            CubeMesh.instance = new CubeMesh();
        }
        return CubeMesh.instance;
    }

    private loadData(): void {
        this.vao = new Vao();
        const pos = new Vbo();
        pos.allocateAndStore(new Float32Array(this.positions), BufferObjectUsage.STATIC_DRAW);
        this.vao.getVertexAttribArray(0).setVbo(pos, new VertexAttribPointer(3));
        this.vao.getVertexAttribArray(0).enable();
    }

    public getVertexCount(): number {
        return 36;
    }

    public getFaceCount(): number {
        return 12;
    }

    public getRadius(): number {
        return Math.sqrt(3);
    }

    public getAabbMin(): vec3 {
        return vec3.fromValues(-1, -1, -1);
    }

    public getAabbMax(): vec3 {
        return vec3.fromValues(1, 1, 1);
    }

    public draw(): void {
        if (Utility.isReleased(this.vao)) {
            this.loadData();
        }
        this.vao.bind();
        Gl.gl.drawArrays(Gl.gl.TRIANGLES, 0, this.getVertexCount());
    }

    public getDataSize() {
        return Utility.isReleased(this.vao) ? 0 : this.positions.length * 4;
    }

    public release(): void {
        this.vao.release();
        this.vao = null;
    }

    public isReleased(): boolean {
        return false;
    }

}
