import { GltfElement } from './GltfElement';
import { GltfIndicesComponentType } from '../enum/GltfIndicesComponentType';

export interface GltfIndices extends GltfElement {
    bufferView: number;
    byteOffset?: number;
    componentType: GltfIndicesComponentType;
}