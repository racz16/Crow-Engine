import { Mesh } from '../../node_modules/webgl-obj-loader/src/index';
import { vec3 } from 'gl-matrix';
import { GlVao } from '../webgl/GlVao';
import { Conventions } from './Conventions';
import { GlEbo } from '../webgl/buffer/GlEbo';
import { GlBufferObjectUsage } from '../webgl/enum/GlBufferObjectUsage';
import { GlVbo } from '../webgl/buffer/GlVbo';
import { GlVertexAttribPointer } from '../webgl/GlVertexAttribPointer';
import { StaticMesh } from './mesh/StaticMesh';
import { RenderingMode } from './RenderingMode';
import { IndicesType } from './IndicesType';

export class ObjLoader {

    private obj: string;

    private constructor(obj: string) {
        this.obj = obj;
    }

    public static async createLoader(path: string): Promise<ObjLoader> {
        if (!path.toLocaleLowerCase().endsWith('.obj')) {
            throw new Error('Only .obj files are supported.');
        }
        const obj = await this.loadObj(path);
        return new ObjLoader(obj);
    }

    private static async loadObj(path: string): Promise<string> {
        const response = await fetch(path);
        return await response.text();
    }

    public loadMesh(): StaticMesh {
        const mesh = new Mesh(this.obj, { calcTangentsAndBitangents: true });
        const vertexCount = mesh.indices.length;
        const faceCount = vertexCount / 3;
        const vao = this.createVao(mesh);
        const [radius, aabbMin, aabbMax] = this.computeFrustumCullingData(mesh);
        return new StaticMesh(vao, vertexCount, faceCount, RenderingMode.TRIANGLES, IndicesType.UNSIGNED_INT, 0, aabbMin, aabbMax, radius);
    }

    private computeFrustumCullingData(mesh: Mesh): [number, vec3, vec3] {
        let radius = 0;
        const aabbMax = vec3.create();
        const aabbMin = vec3.create();
        const vertexPosition = vec3.create();
        for (let i = 0; i < mesh.vertices.length; i += 3) {
            vec3.copy(vertexPosition, vec3.fromValues(mesh.vertices[i], mesh.vertices[i + 1], mesh.vertices[i + 2]));
            radius = this.refreshRadius(radius, vertexPosition);
            this.refreshAabb(aabbMin, aabbMax, vertexPosition);
        }
        return [radius, aabbMin, aabbMax];
    }

    private refreshRadius(radius: number, position: vec3): number {
        const newRadius = vec3.length(position);
        if (radius < newRadius) {
            return newRadius;
        }
        return radius;
    }

    private refreshAabb(aabbMin: vec3, aabbMax: vec3, position: vec3): void {
        for (let j = 0; j < 3; j++) {
            if (position[j] < aabbMin[j]) {
                aabbMin[j] = position[j];
            }
            if (position[j] > aabbMax[j]) {
                aabbMax[j] = position[j];
            }
        }
    }

    private createVao(mesh: Mesh): GlVao {
        const vao = new GlVao();
        this.addEbo(vao, mesh.indices);
        this.addVbo(vao, mesh.vertices, Conventions.VI_POSITIONS, 3);
        this.addVbo(vao, mesh.textures, Conventions.VI_TEXTURE_COORDINATES_0, 2);
        this.addVbo(vao, mesh.vertexNormals, Conventions.VI_NORMALS, 3);
        this.addVbo(vao, mesh.tangents, Conventions.VI_TANGENTS, 3);
        return vao;
    }

    private addEbo(vao: GlVao, indices: Array<number>): void {
        const ebo = new GlEbo();
        vao.setEbo(ebo);
        ebo.allocateAndStore(new Uint32Array(indices), GlBufferObjectUsage.STATIC_DRAW);
    }

    private addVbo(vao: GlVao, data: Array<number>, vertexAttribArrayIndex: number, vertexSize: number): void {
        if (data) {
            const vbo = new GlVbo();
            vbo.allocateAndStore(new Float32Array(data), GlBufferObjectUsage.STATIC_DRAW);
            vao.getVertexAttribArray(vertexAttribArrayIndex).setVbo(vbo, new GlVertexAttribPointer(vertexSize));
            vao.getVertexAttribArray(vertexAttribArrayIndex).setEnabled(true);
        }
    }

}