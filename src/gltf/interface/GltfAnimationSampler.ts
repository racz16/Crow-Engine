import { GltfElement } from './GltfElement';
import { GltfAnimationSamplerInterpolation } from '../enum/GltfAnimationSamplerInterpolation';

export interface GltfAnimationSampler extends GltfElement {
    input: number;
    interpolation?: GltfAnimationSamplerInterpolation;
    output: number;
}