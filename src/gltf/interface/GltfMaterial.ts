import { vec3 } from "gl-matrix";
import { GltfElement } from "./GltfElement";
import { GltfPbrMetallicRoughness } from "./GltfPbrMetallicRoughness";
import { GltfAlphaMode } from "../enum/GltfAlphaMode";
import { GltfNormalTextureInfo } from "./GltfNormalTextureInfo";
import { GltfOcclusionTextureInfo } from "./GltfOcclusionTextureInfo";
import { GltfTextureInfo } from "./GltfTextureInfo";

export interface GltfMaterial extends GltfElement {
    name?: string;
    pbrMetallicRoughness?: GltfPbrMetallicRoughness;
    normalTexture?: GltfNormalTextureInfo;
    occlusionTexture?: GltfOcclusionTextureInfo;
    emissiveTexture?: GltfTextureInfo;
    emissiveFactor?: vec3;
    alphaMode?: GltfAlphaMode;
    alphaCutoff?: number;
    doubleSided?: boolean;
}