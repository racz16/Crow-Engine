import { GltfElement } from "./GltfElement";

export interface GltfTexture extends GltfElement {
    sampler?: number;
    source?: number;
    name?: string;
}