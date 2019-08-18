import { IResource } from "./IResource";
import { vec3 } from "gl-matrix";

export interface IRenderable extends IResource {

    getVertexCount(): number;

    getObjectSpaceRadius(): number;

    getObjectSpaceAabbMin(): vec3;

    getObjectSpaceAabbMax(): vec3;

    draw(): void;

    update(): void;

}
