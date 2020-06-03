import { mat4, quat, vec3 } from "gl-matrix"
import { GltfElement } from "./GltfElement";
import { GltfNodeExtensions } from "./GltfExtensions";

export interface GltfNode extends GltfElement{
    camera?: number;
    children?: Array<number>;
    skin?: number;
    matrix?: mat4;
    mesh?: number;
    rotation?: quat;
    scale?: vec3;
    translation?: vec3;
    weights?: Array<number>;
    name?: string;
    extensions?: GltfNodeExtensions;
}