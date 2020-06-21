import { vec3 } from 'gl-matrix';

export class Axis {

    private constructor() { }

    public static get X(): vec3 {
        return vec3.fromValues(1, 0, 0);
    }

    public static get Y(): vec3 {
        return vec3.fromValues(0, 1, 0);
    }

    public static get Z(): vec3 {
        return vec3.fromValues(0, 0, 1);
    }

    public static get X_NEGATE(): vec3 {
        return vec3.fromValues(-1, 0, 0);
    }

    public static get Y_NEGATE(): vec3 {
        return vec3.fromValues(0, -1, 0);
    }

    public static get Z_NEGATE(): vec3 {
        return vec3.fromValues(0, 0, -1);
    }

}