import { GltfLight } from "./GltfLight";

export interface GltfFileExtensions {
    KHR_lights_punctual?: { lights?: Array<GltfLight> };
}

export interface GltfNodeExtensions {
    KHR_lights_punctual?: { light?: number };
}