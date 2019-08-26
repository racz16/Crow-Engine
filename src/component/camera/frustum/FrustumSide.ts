import { FrustumCornerPoint } from './FrustumCornerPoint';

export enum FrustumSide {
    RIGHT,
    LEFT,
    UP,
    DOWN,
    FRONT,
    BACK,
}

export class FrustumSideResolver {

    public static get(index: number): FrustumSide {
        switch (index) {
            case 0: return FrustumSide.RIGHT;
            case 1: return FrustumSide.LEFT;
            case 2: return FrustumSide.UP;
            case 3: return FrustumSide.DOWN;
            case 4: return FrustumSide.FRONT;
            case 5: return FrustumSide.BACK;
            default: throw new Error('Invalid FrustumSide index');
        }
    }

    public static getCornerPoints(frustumSide: FrustumSide): Array<FrustumCornerPoint> {
        switch (frustumSide) {
            case FrustumSide.RIGHT: return [
                FrustumCornerPoint.NEAR_BOTTOM_RIGHT,
                FrustumCornerPoint.NEAR_TOP_RIGHT,
                FrustumCornerPoint.FAR_BOTTOM_RIGHT,
                FrustumCornerPoint.FAR_TOP_RIGHT
            ];
            case FrustumSide.LEFT: return [
                FrustumCornerPoint.NEAR_BOTTOM_LEFT,
                FrustumCornerPoint.FAR_BOTTOM_LEFT,
                FrustumCornerPoint.NEAR_TOP_LEFT,
                FrustumCornerPoint.FAR_TOP_LEFT
            ];
            case FrustumSide.UP: return [
                FrustumCornerPoint.NEAR_TOP_LEFT,
                FrustumCornerPoint.FAR_TOP_LEFT,
                FrustumCornerPoint.NEAR_TOP_RIGHT,
                FrustumCornerPoint.FAR_TOP_RIGHT
            ];
            case FrustumSide.DOWN: return [
                FrustumCornerPoint.NEAR_BOTTOM_LEFT,
                FrustumCornerPoint.NEAR_BOTTOM_RIGHT,
                FrustumCornerPoint.FAR_BOTTOM_LEFT,
                FrustumCornerPoint.FAR_BOTTOM_RIGHT
            ];
            case FrustumSide.FRONT: return [
                FrustumCornerPoint.NEAR_BOTTOM_RIGHT,
                FrustumCornerPoint.NEAR_BOTTOM_LEFT,
                FrustumCornerPoint.NEAR_TOP_RIGHT,
                FrustumCornerPoint.NEAR_TOP_LEFT
            ];
            case FrustumSide.BACK: return [
                FrustumCornerPoint.FAR_BOTTOM_LEFT,
                FrustumCornerPoint.FAR_BOTTOM_RIGHT,
                FrustumCornerPoint.FAR_TOP_LEFT,
                FrustumCornerPoint.FAR_TOP_RIGHT
            ];
            default: throw new Error('Invalid enum FrustumSide');
        }
    }

}