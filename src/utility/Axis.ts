import { vec3 } from 'gl-matrix';

export class Axis {

    private constructor() { }

    public static get X() {
        return vec3.fromValues(1, 0, 0);
    }

    public static get Y() {
        return vec3.fromValues(0, 1, 0);
    }

    public static get Z() {
        return vec3.fromValues(0, 0, 1);
    }

    public static get X_NEGATE() {
        return vec3.fromValues(-1, 0, 0);
    }

    public static get Y_NEGATE() {
        return vec3.fromValues(0, -1, 0);
    }

    public static get Z_NEGATE() {
        return vec3.fromValues(0, 0, -1);
    }

}