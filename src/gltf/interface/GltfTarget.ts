import { GltfElement } from "./GltfElement";
import { GltfTargetPath } from "../enum/GltfTargetPath";

export interface GltfTarget extends GltfElement {
    node?: number;
    path: GltfTargetPath;
}