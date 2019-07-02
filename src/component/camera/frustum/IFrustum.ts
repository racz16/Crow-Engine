import { vec3 } from "gl-matrix";
import { FrustumCornerPoint } from "./FrustumCornerPoint";
import { FrustumPlane } from "./FrustumPlane";
import { FrustumSide } from "./FrustumSide";

export interface IFrustum {
    
    getCenterPoint(): vec3;

    getCornerPointsIterator(): IterableIterator<vec3>;

    getCornerPoint(cornerPoint: FrustumCornerPoint): vec3;

    getPlanesIterator(): IterableIterator<FrustumPlane>;

    getPlane(side: FrustumSide): FrustumPlane;

}