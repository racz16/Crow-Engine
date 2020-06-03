import { GltfElement } from "./GltfElement";
import { GltfChannel } from "./GltfChannel";
import { GltfAnimationSampler } from "./GltfAnimationSampler";

export interface GltfAnimation extends GltfElement {
    channels: Array<GltfChannel>;
    samplers: Array<GltfAnimationSampler>;
    name?: string;
}