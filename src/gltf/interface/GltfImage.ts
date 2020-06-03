import { GltfElement } from "./GltfElement";
import { GltfMimeType } from "../enum/GltfMimeType";

export interface GltfImage extends GltfElement {
    uri?: string;
    mimeType?: GltfMimeType;
    bufferView?: number;
    name?: string;
}