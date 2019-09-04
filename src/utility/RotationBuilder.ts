import { quat, vec3 } from 'gl-matrix';
import { Utility } from './Utility';

export class RotationBuilder {

    private rotation: quat;

    private constructor(axis: vec3, angle: number) {
        this.rotation = this.quaternionFromAxisAngle(axis, angle);
    }

    public thenRotate(axis: vec3, angle: number): RotationBuilder {
        const newRotation = this.quaternionFromAxisAngle(axis, angle);
        quat.mul(this.rotation, newRotation, this.rotation);
        return this;
    }

    private quaternionFromAxisAngle(axis: vec3, angle: number): quat {
        if (!axis || Utility.isNullVector(axis)) {
            throw new Error();
        }
        const normalizedAxis = vec3.normalize(vec3.create(), axis);
        return quat.setAxisAngle(quat.create(), normalizedAxis, Utility.toRadians(angle));
    }

    public static createRotation(axis: vec3, angle: number): RotationBuilder {
        return new RotationBuilder(axis, angle);
    }

    public getQuaternion(): quat {
        return this.rotation;
    }

}