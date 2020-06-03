import { GltfElement } from "./GltfElement";

export interface GltfScene extends GltfElement {
    nodes?: Array<number>;
    name?: string;
}