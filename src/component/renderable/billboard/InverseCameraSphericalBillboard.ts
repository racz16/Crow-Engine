import { Billboard } from './Billboard';
import { vec3 } from 'gl-matrix';

export class InverseCameraSphericalBillboard extends Billboard {

    protected refreshUnsafe(): void {
        const cameraTransform = this.getMainCameraTransform();
        const forward = cameraTransform.getForwardVector();
        const up = cameraTransform.getUpVector();
        const right = vec3.negate(vec3.create(), cameraTransform.getRightVector());
        this.refreshDataFromDirections(forward, up, right);
    }

}