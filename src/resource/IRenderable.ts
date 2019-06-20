import { IResource } from "./IResource";
import { vec3 } from "gl-matrix";

export interface IRenderable extends IResource {

    getVertexCount(): number;

    getRadius(): number;

    getAabbMin(): vec3;

    getAabbMax(): vec3;

    draw(): void;

}
