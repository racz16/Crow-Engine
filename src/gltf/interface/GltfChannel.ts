import { GltfElement } from './GltfElement';
import { GltfTarget } from './GltfTarget';

export interface GltfChannel extends GltfElement {
    sampler: number;
    target: GltfTarget;
}