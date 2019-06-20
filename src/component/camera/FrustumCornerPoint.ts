import { vec3, vec4 } from "gl-matrix";

export enum FrustumCornerPoint {
    FAR_TOP_LEFT,
    FAR_TOP_RIGHT,
    FAR_BOTTOM_LEFT,
    FAR_BOTTOM_RIGHT,
    NEAR_TOP_LEFT,
    NEAR_TOP_RIGHT,
    NEAR_BOTTOM_LEFT,
    NEAR_BOTTOM_RIGHT
}

export class FrustumCornerPointResolver {

    public static getClipSpacePosition(cornerPoint: FrustumCornerPoint): vec4 {
        switch (cornerPoint) {
            case FrustumCornerPoint.FAR_TOP_LEFT: return vec4.fromValues(-1, 1, 1, 1);
            case FrustumCornerPoint.FAR_TOP_RIGHT: return vec4.fromValues(1, 1, 1, 1);
            case FrustumCornerPoint.FAR_BOTTOM_LEFT: return vec4.fromValues(-1, -1, 1, 1);
            case FrustumCornerPoint.FAR_BOTTOM_RIGHT: return vec4.fromValues(1, -1, 1, 1);
            case FrustumCornerPoint.NEAR_TOP_LEFT: return vec4.fromValues(-1, 1, -1, 1);
            case FrustumCornerPoint.NEAR_TOP_RIGHT: return vec4.fromValues(1, 1, -1, 1);
            case FrustumCornerPoint.NEAR_BOTTOM_LEFT: return vec4.fromValues(-1, -1, -1, 1);
            case FrustumCornerPoint.NEAR_BOTTOM_RIGHT: return vec4.fromValues(1, -1, -1, 1);
            default: throw new Error('Invalid enum FrustumCornerPoint');
        }
    }

}