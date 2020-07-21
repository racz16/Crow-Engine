import { GltfElement } from './GltfElement';

export interface GltfSkin extends GltfElement {
    inverseBindMatrices?: number;
    skeleton?: number;
    joints: Array<number>;
    name?: string;
}