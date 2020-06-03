import { GltfElement } from "./GltfElement";

export interface GltfAsset extends GltfElement {
    copyright?: string;
    generator?: string;
    version: string;
    minVersion?: string;
}