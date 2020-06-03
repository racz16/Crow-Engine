import { GltfElement } from "./GltfElement";
import { GltfIndices } from "./GltfIndices";
import { GltfValues } from "./GltfValues";

export interface GltfSparse extends GltfElement {
    count: number;
    indices: GltfIndices;
    values: GltfValues;
}