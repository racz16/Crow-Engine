import { GltfElement } from './GltfElement';
import { GltfBufferViewTarget } from '../enum/GltfBufferViewTarget';

export interface GltfBufferView extends GltfElement {
    buffer: number;
    byteOffset?: number;
    byteLength: number;
    byteStride?: number;
    target?: GltfBufferViewTarget;
    name?: string;
}