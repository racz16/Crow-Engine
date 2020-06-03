import { GltfElement } from "./GltfElement";
import { GltfAccessorComponentType } from "../enum/GltfAccessorComponentType";
import { GltfAccessorType } from "../enum/GltfAccessorType";
import { GltfSparse } from "./GltfSparse";

export interface GltfAccessor extends GltfElement {
    bufferView?: number;
    byteOffset?: number;
    componentType: GltfAccessorComponentType
    normalized?: boolean;
    count: number;
    type: GltfAccessorType;
    max?: Array<number>;
    min?: Array<number>;
    sparse?: GltfSparse;
    name?: string;
}