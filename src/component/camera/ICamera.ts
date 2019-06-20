import { IComponent } from "../IComponent";
import { mat4, vec3 } from "gl-matrix";
import { FrustumCornerPoint } from "./FrustumCornerPoint";

export interface ICamera extends IComponent {

    getViewMatrix(): mat4;

    getProjectionMatrix(): mat4;

    //getFrustumCenter(): vec3;

    //getFrustumCornerPoint(cornerPoint: FrustumCornerPoint): vec3;

    //getFrustumCornerPoints(): Map<FrustumCornerPoint, vec3>;

    //isFrustumCulling(): boolean;

    //setFrustumCulling(frustumCulling: boolean): void;

    //isInsideFrustum(position: vec3, radius: number): void;

    //isInsideFrustum(aabbMin: vec3, aabbMax: vec3): void;

}
