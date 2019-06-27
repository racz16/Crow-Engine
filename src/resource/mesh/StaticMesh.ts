import { IMesh } from "./../mesh/IMesh";
import { vec3 } from "gl-matrix";
import { Vao } from "../../webgl/Vao";
import { Gl } from "../../webgl/Gl";
import { ResourceManager } from "../ResourceManager";
import { Vbo } from "../../webgl/buffer/Vbo";
import { BufferObjectUsage } from "../../webgl/enum/BufferObjectUsage";
import { VertexAttribPointer } from "../../webgl/VertexAttribPointer";
import { Ebo } from "../../webgl/buffer/Ebo";
import { Mesh } from "../../../node_modules/webgl-obj-loader/src/index";
import { Utility } from "../../utility/Utility";

export class StaticMesh implements IMesh {

    private vertexCount: number;
    private faceCount: number;
    private aabbMin = vec3.create();
    private aabbMax = vec3.create();
    private vao: Vao;
    private furthestVertexDistance: number;

    public constructor(path: string) {
        Utility.loadResource(path, (result: string) => {
            const mesh = new Mesh(result, { calcTangentsAndBitangents: true });
            this.vertexCount = mesh.indices.length;
            this.faceCount = this.vertexCount / 3;
            this.computeFrustumCullingData(mesh);
            this.loadMesh(mesh);
        });
        ResourceManager.private_add(this);
    }

    //
    //loading-saving------------------------------------------------------------
    //
    private computeFrustumCullingData(mesh: Mesh): void {
        let max = 0;
        let aabbMax = vec3.create();
        let aabbMin = vec3.create();
        let currentVec = vec3.create();

        for (let i = 0; i < mesh.vertices.length; i += 3) {
            currentVec = vec3.fromValues(mesh.vertices[i], mesh.vertices[i + 1], mesh.vertices[i + 2]);
            //furthest vertex distance
            if (max < vec3.length(currentVec)) {
                max = vec3.length(currentVec);
            }
            //aabb
            for (let j = 0; j < 3; j++) {
                if (currentVec[j] < aabbMin[j]) {
                    aabbMin[j] = currentVec[j];
                }
                if (currentVec[j] > aabbMax[j]) {
                    aabbMax[j] = currentVec[j];
                }
            }
        }

        this.aabbMin.set(aabbMin);
        this.aabbMax.set(aabbMax);
        this.furthestVertexDistance = max;
    }

    private loadMesh(mesh: Mesh): void {
        this.vao = new Vao();

        this.createVbo(mesh.vertices, 0, 3);
        this.createVbo(mesh.textures, 1, 2);
        this.createVbo(mesh.vertexNormals, 2, 3);
        this.createVbo(mesh.tangents, 3, 3);

        const ebo = new Ebo();
        ebo.allocateAndStore(new Uint32Array(mesh.indices), BufferObjectUsage.STATIC_DRAW);
        this.vao.setEbo(ebo);
    }

    private createVbo(data: Array<number>, vertexAttribArrayIndex: number, vertexSize: number): void {
        if (data) {
            const vbo = new Vbo();
            vbo.allocateAndStore(new Float32Array(data), BufferObjectUsage.STATIC_DRAW);
            this.vao.getVertexAttribArray(vertexAttribArrayIndex).setVbo(vbo, new VertexAttribPointer(vertexSize));
            this.vao.getVertexAttribArray(vertexAttribArrayIndex).enable();
        }
    }

    //
    //webgl related------------------------------------------------------------
    //
    public draw(): void {
        this.vao.bind();
        Gl.gl.drawElements(Gl.gl.TRIANGLES, this.getVertexCount(), Gl.gl.UNSIGNED_INT, 0);
    }

    public isUsable(): boolean {
        return this.vao.isUsable();
    }

    public release(): void {
        this.vao.release();
    }

    //
    //misc----------------------------------------------------------------------
    //
    public getDataSize(): number {
        return this.isUsable() ? this.vao.getDataSize() : 0;
    }

    public getVertexCount(): number {
        return this.vertexCount;
    }

    public getFaceCount(): number {
        return this.faceCount;
    }

    public getObjectSpaceRadius(): number {
        return this.furthestVertexDistance;
    }

    public getObjectSpaceAabbMax(): vec3 {
        return vec3.clone(this.aabbMax);
    }

    public getObjectSpaceAabbMin(): vec3 {
        return vec3.clone(this.aabbMin);
    }

    public private_update(): void { }

}
