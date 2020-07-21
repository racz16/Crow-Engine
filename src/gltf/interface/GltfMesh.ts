import { GltfElement } from './GltfElement';
import { GltfPrimitive } from './GltfPrimitive';

export interface GltfMesh extends GltfElement {
    primitives: Array<GltfPrimitive>;
    weights?: Array<number>;
    name?: string;
}