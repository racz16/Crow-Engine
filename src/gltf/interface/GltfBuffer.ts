import { GltfElement } from "./GltfElement";

export interface GltfBuffer extends GltfElement {
    uri?: string;
    byteLength: number;
    name?: string;
}