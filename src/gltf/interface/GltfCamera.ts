import { GltfElement } from "./GltfElement";
import { GltfOrthographicCamera } from "./GltfOrthographicCamera";
import { GltfPerspectiveCamera } from "./GltfPerspectiveCamera";
import { GltfCameraMode } from "../enum/GltfCameraType";

export interface GltfCamera extends GltfElement {
    orthographic?: GltfOrthographicCamera;
    perspective?: GltfPerspectiveCamera;
    type: GltfCameraMode;
    name?: string;
}