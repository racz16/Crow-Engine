import { GltfElement } from './GltfElement';

export interface GltfOrthographicCamera extends GltfElement {
    xmag: number;
    ymag: number;
    zfar: number;
    znear: number;
}