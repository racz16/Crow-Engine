
import { IMesh } from "./mesh/IMesh";
import { Mesh } from "../../node_modules/webgl-obj-loader/src/index";
import { vec3 } from "gl-matrix";
import { Vao } from "../webgl/Vao";
import { Conventions } from "./Conventions";
import { Ebo } from "../webgl/buffer/Ebo";
import { BufferObjectUsage } from "../webgl/enum/BufferObjectUsage";
import { Vbo } from "../webgl/buffer/Vbo";
import { VertexAttribPointer } from "../webgl/VertexAttribPointer";
import { StaticMesh } from "./mesh/StaticMesh";
import { RenderingMode } from "./RenderingMode";
import { IndicesType } from "./IndicesType";

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
        return new StaticMesh(vao, vertexCount, faceCount, RenderingMode.TRIANGLES, IndicesType.UNSIGNED_INT, aabbMin, aabbMax, radius);
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
        if (radius < vec3.length(position)) {
            return vec3.length(position);
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

    private createVao(mesh: Mesh): Vao {
        const vao = new Vao();
        this.addEbo(vao, mesh.indices);
        this.addVbo(vao, mesh.vertices, Conventions.POSITIONS_VBO_INDEX, 3);
        this.addVbo(vao, mesh.textures, Conventions.TEXTURE_COORDINATES_0_VBO_INDEX, 2);
        this.addVbo(vao, mesh.vertexNormals, Conventions.NORMALS_VBO_INDEX, 3);
        this.addVbo(vao, mesh.tangents, Conventions.TANGENTS_VBO_INDEX, 3);
        return vao;
    }

    private addEbo(vao: Vao, indices: Array<number>): void {
        const ebo = new Ebo();
        vao.setEbo(ebo);
        ebo.allocateAndStore(new Uint32Array(indices), BufferObjectUsage.STATIC_DRAW);
    }

    private addVbo(vao: Vao, data: Array<number>, vertexAttribArrayIndex: number, vertexSize: number): void {
        if (data) {
            const vbo = new Vbo();
            vbo.allocateAndStore(new Float32Array(data), BufferObjectUsage.STATIC_DRAW);
            vao.getVertexAttribArray(vertexAttribArrayIndex).setVbo(vbo, new VertexAttribPointer(vertexSize));
            vao.getVertexAttribArray(vertexAttribArrayIndex).setEnabled(true);
        }
    }

}