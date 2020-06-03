import { vec3 } from "gl-matrix"
import { GltfLightType } from "../enum/GltfLightType";
import { GltfSpotLightParameters } from "./GltfSpotLightParameters";

export interface GltfLight {
    name?: string;
    color?: vec3;
    intensity?: number;
    type: GltfLightType;
    range?: number;
    spot?: GltfSpotLightParameters;
}