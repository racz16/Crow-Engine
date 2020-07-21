import { GltfElement } from './GltfElement';

export interface GltfPerspectiveCamera extends GltfElement {
    aspectRatio?: number;
    yfov: number;
    zfar?: number;
    znear: number;
}