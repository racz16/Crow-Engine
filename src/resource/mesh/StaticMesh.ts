import { IMesh } from './../mesh/IMesh';
import { vec3 } from 'gl-matrix';
import { Vao } from '../../webgl/Vao';
import { Gl } from '../../webgl/Gl';
import { Vbo } from '../../webgl/buffer/Vbo';
import { BufferObjectUsage } from '../../webgl/enum/BufferObjectUsage';
import { VertexAttribPointer } from '../../webgl/VertexAttribPointer';
import { Ebo } from '../../webgl/buffer/Ebo';
import { Mesh } from '../../../node_modules/webgl-obj-loader/src/index';
import { Utility } from '../../utility/Utility';
import { Engine } from '../../core/Engine';
import { Conventions } from '../Conventions';

export class StaticMesh implements IMesh {

    private vertexCount: number;
    private faceCount: number;
    private aabbMin = vec3.create();
    private aabbMax = vec3.create();
    private vao: Vao;
    private radius: number;
    private textureCoordinates = false;
    private normals = false;
    private tangents = false;

    public constructor(path: string) {
        this.loadMesh(path);
        Engine.getResourceManager().add(this);
    }

    private async loadMesh(path: string): Promise<void> {
        const response = await fetch(path);
        const text = await response.text();
        const mesh = new Mesh(text, { calcTangentsAndBitangents: true });
        this.vertexCount = mesh.indices.length;
        this.faceCount = this.vertexCount / 3;
        this.computeFrustumCullingData(mesh);
        this.createVao(mesh);
    }

    //
    //loading-saving------------------------------------------------------------
    //
    private computeFrustumCullingData(mesh: Mesh): void {
        this.radius = 0;
        this.aabbMax = vec3.create();
        this.aabbMin = vec3.create();
        this.computeFrustumCullingDataUnsafe(mesh);
    }

    private computeFrustumCullingDataUnsafe(mesh: Mesh): void {
        const vertexPosition = vec3.create();
        for (let i = 0; i < mesh.vertices.length; i += 3) {
            vertexPosition.set(vec3.fromValues(mesh.vertices[i], mesh.vertices[i + 1], mesh.vertices[i + 2]));
            this.refreshRadius(vertexPosition);
            this.refreshAabb(vertexPosition);
        }
    }

    private refreshRadius(position: vec3): void {
        if (this.radius < vec3.length(position)) {
            this.radius = vec3.length(position);
        }
    }

    private refreshAabb(position: vec3): void {
        for (let j = 0; j < 3; j++) {
            if (position[j] < this.aabbMin[j]) {
                this.aabbMin[j] = position[j];
            }
            if (position[j] > this.aabbMax[j]) {
                this.aabbMax[j] = position[j];
            }
        }
    }

    private createVao(mesh: Mesh): void {
        this.vao = new Vao();
        this.addEbo(mesh.indices);
        this.addVbo(mesh.vertices, Conventions.POSITIONS_VBO_INDEX, 3);
        this.addVbo(mesh.textures, Conventions.TEXTURE_COORDINATES_VBO_INDEX, 2);
        this.addVbo(mesh.vertexNormals, Conventions.NORMALS_VBO_INDEX, 3);
        this.addVbo(mesh.tangents, Conventions.TANGENTS_VBO_INDEX, 3);
    }

    private addEbo(indices: Array<number>): void {
        const ebo = new Ebo();
        this.vao.setEbo(ebo);
        ebo.allocateAndStore(new Uint32Array(indices), BufferObjectUsage.STATIC_DRAW); this.vao.bind();
    }

    private addVbo(data: Array<number>, vertexAttribArrayIndex: number, vertexSize: number): void {
        this.setFlag(vertexAttribArrayIndex, !!data);
        if (data) {
            const vbo = new Vbo();
            vbo.allocateAndStore(new Float32Array(data), BufferObjectUsage.STATIC_DRAW);
            this.vao.getVertexAttribArray(vertexAttribArrayIndex).setVbo(vbo, new VertexAttribPointer(vertexSize));
            this.vao.getVertexAttribArray(vertexAttribArrayIndex).setEnabled(true);
        }
    }

    private setFlag(index: number, hasData: boolean): void {
        switch (index) {
            case Conventions.TEXTURE_COORDINATES_VBO_INDEX: this.textureCoordinates = hasData; break;
            case Conventions.NORMALS_VBO_INDEX: this.normals = hasData; break;
            case Conventions.TANGENTS_VBO_INDEX: this.tangents = hasData; break;
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
        return Utility.isUsable(this.vao);
    }

    public release(): void {
        if (this.isUsable()) {
            this.vao.release();
            this.vao = null;
        }
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
        return this.radius;
    }

    public getObjectSpaceAabbMax(): vec3 {
        return vec3.clone(this.aabbMax);
    }

    public getObjectSpaceAabbMin(): vec3 {
        return vec3.clone(this.aabbMin);
    }

    public update(): void { }

    public hasTextureCoordinates(): boolean {
        return this.textureCoordinates;
    }

    public hasNormals(): boolean {
        return this.normals;
    }

    public hasTangents(): boolean {
        return this.tangents;
    }

}
