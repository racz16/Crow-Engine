import { GltfElement } from "./GltfElement";
import { GltfPrimitiveMode } from "../enum/GltfPrimitiveMode";
import { GltfTarget } from "./GltfTarget";
import { GltfAttributes } from "./GltfAttributes";

export interface GltfPrimitive extends GltfElement {
    attributes: GltfAttributes;
    indices?: number;
    material?: number;
    mode?: GltfPrimitiveMode;
    targets?: Array<GltfTarget>;
}