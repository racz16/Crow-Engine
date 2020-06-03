import { GltfElement } from "./GltfElement";

export interface GltfValues extends GltfElement {
    bufferView: number;
    byteOffset?: number;
}