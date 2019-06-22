import { vec4 } from "gl-matrix";

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

    public static getNDCPosition(cornerPoint: FrustumCornerPoint): vec4 {
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

    public static get(index: number): FrustumCornerPoint {
        switch (index) {
            case 0: return FrustumCornerPoint.FAR_TOP_LEFT;
            case 1: return FrustumCornerPoint.FAR_TOP_RIGHT;
            case 2: return FrustumCornerPoint.FAR_BOTTOM_LEFT;
            case 3: return FrustumCornerPoint.FAR_BOTTOM_RIGHT;
            case 4: return FrustumCornerPoint.NEAR_TOP_LEFT;
            case 5: return FrustumCornerPoint.NEAR_TOP_RIGHT;
            case 6: return FrustumCornerPoint.NEAR_BOTTOM_LEFT;
            case 7: return FrustumCornerPoint.NEAR_BOTTOM_RIGHT;
            default: throw new Error('Invalid FrustumCornerPoint index');
        }
    }

}