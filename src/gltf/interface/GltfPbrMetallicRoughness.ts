import { GltfElement } from './GltfElement';
import { vec4 } from 'gl-matrix';
import { GltfTextureInfo } from './GltfTextureInfo';

export interface GltfPbrMetallicRoughness extends GltfElement {
    baseColorFactor?: vec4;
    baseColorTexture?: GltfTextureInfo;
    metallicFactor?: number;
    roughnessFactor?: number;
    metallicRoughnessTexture?: GltfTextureInfo;
}