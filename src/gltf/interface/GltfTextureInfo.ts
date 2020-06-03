import { GltfElement } from "./GltfElement";

export interface GltfTextureInfo extends GltfElement {
    index: number
    texCoord?: number;
}